from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_tasks():
    pass

@router.patch("/{task_id}")
def update_task(task_id: str):
    pass