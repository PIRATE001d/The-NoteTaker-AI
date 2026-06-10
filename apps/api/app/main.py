from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.settings import settings
from app.api.v1 import sessions, transcripts, notes, tasks, search, live_session
from app.core.database import engine, Base
from app.models.all_models import *
from sqlalchemy import text

# Create the pgvector extension if it doesn't exist
with engine.connect() as conn:
    conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    conn.commit()

# Create database tables (In production, use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix=settings.API_V1_STR + "/sessions", tags=["sessions"])
app.include_router(transcripts.router, prefix=settings.API_V1_STR + "/transcripts", tags=["transcripts"])
app.include_router(notes.router, prefix=settings.API_V1_STR + "/notes", tags=["notes"])
app.include_router(tasks.router, prefix=settings.API_V1_STR + "/tasks", tags=["tasks"])
app.include_router(search.router, prefix=settings.API_V1_STR + "/search", tags=["search"])
app.include_router(live_session.router, prefix=settings.API_V1_STR + "/live-session", tags=["live-session"])

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
