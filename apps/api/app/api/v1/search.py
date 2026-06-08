from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.models.all_models import Transcript, Note, Embedding
from app.services.gemini import GeminiService

router = APIRouter()

@router.post("/")
def search(query: str = Body(..., embed=True), db: Session = Depends(get_db)):
    # 1. Get embedding for the query
    # gemini = GeminiService()
    # query_embedding = gemini.get_embedding(query)
    
    # 2. Perform vector search using pgvector
    # Since we are mocking embeddings for now to simplify the setup,
    # we will just do a simple text search instead of vector search to ensure it works.
    # In a real app, we would use:
    # results = db.query(Embedding).order_by(Embedding.embedding.cosine_distance(query_embedding)).limit(5).all()
    
    # Simple mock fallback:
    transcripts = db.query(Transcript).filter(Transcript.text.ilike(f"%{query}%")).limit(5).all()
    
    return {
        "results": [
            {
                "session_id": t.session_id,
                "text": t.text
            } for t in transcripts
        ]
    }
