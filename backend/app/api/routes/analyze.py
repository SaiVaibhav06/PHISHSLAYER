from fastapi import APIRouter
from app.models.analyze_model import AnalyzeRequest, AnalyzeResponse
from app.services.content_analyzer import analyze_text

router = APIRouter()

@router.post("/", response_model=AnalyzeResponse)
async def analyze_content(request: AnalyzeRequest):
    result = analyze_text(request.content, request.filename)
    return AnalyzeResponse(**result)
