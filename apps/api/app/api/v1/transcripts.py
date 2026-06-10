from fastapi import APIRouter, UploadFile, File, Depends
import subprocess
import os
import uuid
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Session as DBSession, Transcript, Note, ActionItem, Decision, Risk, KeyTakeaway, Question
from app.services.gemini import GeminiService

router = APIRouter()

WHISPER_CMD = os.getenv("WHISPER_CMD")
WHISPER_MODEL = os.getenv("WHISPER_MODEL")

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...), db: Session = Depends(get_db)):
    temp_filename = f"/tmp/{uuid.uuid4()}_{file.filename}"
    with open(temp_filename, "wb") as f:
        f.write(await file.read())
    
    try:
        result = subprocess.run(
            [WHISPER_CMD, "-m", WHISPER_MODEL, "-f", temp_filename, "-nt"],
            capture_output=True,
            text=True,
            check=True
        )
        transcript_text = result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return {"error": "Whisper failed", "details": e.stderr}
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

    # 1. Create a session
    session_id = uuid.uuid4()
    db_session = DBSession(id=session_id, title=file.filename, status="processed")
    db.add(db_session)
    
    # 2. Store transcript
    db_transcript = Transcript(session_id=session_id, text=transcript_text)
    db.add(db_transcript)
    db.commit()

    # 3. Run Gemini
    gemini = GeminiService()
    notes_data = gemini.generate_notes(transcript_text)

    # 4. Store notes & tasks
    if notes_data.get("summary"):
        db_note = Note(session_id=session_id, summary=notes_data["summary"])
        db.add(db_note)

    for task in notes_data.get("action_items", []):
        db_task = ActionItem(
            session_id=session_id, 
            task=task.get("task"), 
            owner=task.get("owner"),
            due_date=task.get("due_date"),
            deadline_confidence=task.get("deadline_confidence"),
            confidence=task.get("confidence"),
            evidence=task.get("evidence", []),
            status="pending"
        )
        db.add(db_task)
        
    for dec in notes_data.get("decisions", []):
        db_dec = Decision(
            session_id=session_id,
            decision=dec.get("decision", str(dec)),
            status=dec.get("status", "proposed")
        )
        db.add(db_dec)
        
    for risk in notes_data.get("risks", []):
        db.add(Risk(session_id=session_id, risk=risk))

    for takeaway in notes_data.get("key_takeaways", []):
        db.add(KeyTakeaway(session_id=session_id, takeaway=takeaway))
        
    for q in notes_data.get("open_questions", []):
        db.add(Question(session_id=session_id, question=q))
        
    db.commit()

    return {
        "session_id": session_id,
        "transcript": transcript_text,
        "notes": notes_data
    }
