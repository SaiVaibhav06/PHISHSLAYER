from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    content: str

class AnalyzeResponse(BaseModel):
    risk_score: int # 0-100
    risk_level: str # 'safe', 'low', 'medium', 'high', 'critical'
    explanation: str
    detected_keywords: list[str]
