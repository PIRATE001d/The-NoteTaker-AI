from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Session as DBSession, Transcript, Note, ActionItem, Decision
import uuid

router = APIRouter()

@router.get("/")
def list_sessions(db: Session = Depends(get_db)):
    sessions = db.query(DBSession).order_by(DBSession.created_at.desc()).all()
    return [{"id": s.id, "title": s.title, "created_at": s.created_at, "status": s.status} for s in sessions]

@router.get("/{session_id}")
def get_session(session_id: uuid.UUID, db: Session = Depends(get_db)):
    db_session = db.query(DBSession).filter(DBSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    transcript = db.query(Transcript).filter(Transcript.session_id == session_id).first()
    note = db.query(Note).filter(Note.session_id == session_id).first()
    tasks = db.query(ActionItem).filter(ActionItem.session_id == session_id).all()
    decisions = db.query(Decision).filter(Decision.session_id == session_id).all()
    
    return {
        "id": db_session.id,
        "title": db_session.title,
        "created_at": db_session.created_at,
        "transcript": transcript.text if transcript else None,
        "summary": note.summary if note else None,
        "tasks": [{"task": t.task, "owner": t.owner, "status": t.status} for t in tasks],
        "decisions": [d.decision for d in decisions]
    }
