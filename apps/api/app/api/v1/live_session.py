from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import (
    Session as DBSession,
    Transcript,
    Note,
    ActionItem,
    Decision,
    Risk,
    KeyTakeaway,
    Question
)
from app.services.gemini import GeminiService
from app.services.audio_processor import AudioProcessor
import uuid
import base64
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

audio_processor = AudioProcessor()


class LiveSessionManager:
    def __init__(self):
        self.active_sessions: dict[str, dict] = {}

    def create_session(self, session_id: str):
        self.active_sessions[session_id] = {
            "transcript": "",
            "audio_buffer": bytearray(),
            "status": "recording"
        }

    def append_transcript(self, session_id: str, text: str):
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["transcript"] += " " + text

    def get_full_transcript(self, session_id: str) -> str:
        if session_id in self.active_sessions:
            return self.active_sessions[session_id]["transcript"].strip()
        return ""

    def get_status(self, session_id: str) -> str:
        if session_id in self.active_sessions:
            return self.active_sessions[session_id]["status"]
        return "unknown"

    def set_status(self, session_id: str, status: str):
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["status"] = status

    def cleanup(self, session_id: str):
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]


live_manager = LiveSessionManager()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    session_id = str(uuid.uuid4())
    
    db = next(get_db())
    
    try:
        db_session = DBSession(
            id=uuid.UUID(session_id),
            title=f"Live Session {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}",
            status="recording",
            started_at=datetime.utcnow()
        )
        db.add(db_session)
        db.commit()
        
        live_manager.create_session(session_id)
        
        await websocket.send_json({
            "type": "session_started",
            "session_id": session_id,
            "status": "recording"
        })
        
        logger.info(f"Live session {session_id} started via WebSocket")
        
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "audio_chunk":
                audio_b64 = data.get("data", "")
                
                if not audio_b64:
                    continue
                
                logger.info(f"Received audio chunk, size: {len(audio_b64)} bytes")
                
                try:
                    audio_bytes = base64.b64decode(audio_b64)
                    logger.info(f"Decoded audio bytes: {len(audio_bytes)} bytes")
                    
                    transcript_text = audio_processor.transcribe_chunk(audio_bytes)
                    logger.info(f"Transcript from chunk: '{transcript_text}'")
                    
                    if transcript_text:
                        live_manager.append_transcript(session_id, transcript_text)
                        
                        await websocket.send_json({
                            "type": "transcript",
                            "text": transcript_text,
                            "source": "tab"
                        })
                    
                    await websocket.send_json({
                        "type": "status",
                        "state": "recording"
                    })
                    
                except Exception as e:
                    logger.error(f"Error processing audio chunk: {e}")
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Audio processing failed: {str(e)}"
                    })
            
            elif data.get("type") == "stop":
                logger.info(f"Stop requested for session {session_id}")
                
                live_manager.set_status(session_id, "processing")
                
                db_session = db.query(DBSession).filter(DBSession.id == uuid.UUID(session_id)).first()
                if db_session:
                    db_session.status = "processing"
                    db.commit()
                
                full_transcript = live_manager.get_full_transcript(session_id)
                logger.info(f"Full transcript length: {len(full_transcript)} chars")
                logger.info(f"Full transcript: '{full_transcript[:500]}...'")
                
                if not full_transcript:
                    logger.warning(f"No transcript for session {session_id}")
                    
                    if db_session:
                        db_session.status = "completed"
                        db_session.ended_at = datetime.utcnow()
                        db.commit()
                    
                    live_manager.cleanup(session_id)
                    
                    await websocket.send_json({
                        "type": "completed",
                        "session_id": session_id,
                        "message": "No audio was captured"
                    })
                    break
                
                db_transcript = Transcript(
                    session_id=uuid.UUID(session_id),
                    text=full_transcript
                )
                db.add(db_transcript)
                db.commit()
                logger.info(f"Transcript saved for session {session_id}")
                
                await websocket.send_json({
                    "type": "status",
                    "state": "processing"
                })
                
                try:
                    logger.info(f"Starting Gemini processing for session {session_id}")
                    gemini = GeminiService()
                    notes_data = gemini.generate_notes(full_transcript)
                    logger.info(f"Gemini processing completed for session {session_id}")
                    
                    if notes_data.get("summary"):
                        db.add(Note(
                            session_id=uuid.UUID(session_id),
                            summary=notes_data["summary"]
                        ))
                    
                    for task in notes_data.get("action_items", []):
                        db.add(ActionItem(
                            session_id=uuid.UUID(session_id),
                            task=task.get("task"),
                            owner=task.get("owner"),
                            due_date=task.get("due_date"),
                            deadline_confidence=task.get("deadline_confidence"),
                            confidence=task.get("confidence"),
                            evidence=task.get("evidence", []),
                            status="pending"
                        ))
                    
                    for dec in notes_data.get("decisions", []):
                        db.add(Decision(
                            session_id=uuid.UUID(session_id),
                            decision=dec.get("decision", str(dec)),
                            status=dec.get("status", "proposed")
                        ))
                    
                    for risk in notes_data.get("risks", []):
                        db.add(Risk(
                            session_id=uuid.UUID(session_id),
                            risk=risk
                        ))
                    
                    for takeaway in notes_data.get("key_takeaways", []):
                        db.add(KeyTakeaway(
                            session_id=uuid.UUID(session_id),
                            takeaway=takeaway
                        ))
                    
                    for q in notes_data.get("open_questions", []):
                        db.add(Question(
                            session_id=uuid.UUID(session_id),
                            question=q
                        ))
                    
                    db.commit()
                    logger.info(f"All data saved for session {session_id}")
                    
                except Exception as e:
                    logger.error(f"Gemini processing failed: {e}")
                    db.rollback()
                
                if db_session:
                    db_session.status = "completed"
                    db_session.ended_at = datetime.utcnow()
                    db.commit()
                
                live_manager.cleanup(session_id)
                logger.info(f"Session {session_id} completed")
                
                await websocket.send_json({
                    "type": "completed",
                    "session_id": session_id,
                    "transcript": full_transcript
                })
                break
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session {session_id}")
        if session_id in live_manager.active_sessions:
            live_manager.cleanup(session_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
    finally:
        db.close()
