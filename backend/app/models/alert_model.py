from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Alert(BaseModel):
    id: str
    type: str # e.g., 'SQL Injection Attempt', 'Port Scan', 'High Traffic'
    ip: str
    severity: str # 'low', 'medium', 'high', 'critical'
    timestamp: datetime
    message: str
