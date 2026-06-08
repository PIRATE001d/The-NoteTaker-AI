from fastapi import APIRouter

router = APIRouter()

@router.post("/generate-notes")
def generate_notes():
    pass