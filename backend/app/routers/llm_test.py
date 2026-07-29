from fastapi import APIRouter

from app.services.llm import generate_test_response

router = APIRouter(prefix="/llm", tags=["llm"])


@router.get("/test")
def test_llm():
    return {"response": generate_test_response("Say hello in one short, travel-themed sentence.")}