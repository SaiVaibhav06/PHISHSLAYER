from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class Alert(BaseModel):
    id: str
    type: str # e.g., 'SQL Injection Attempt', 'Port Scan', 'High Traffic'
    categories: List[str] = [] # 'Phishing', 'Malware', 'Social Engineering', 'Financial Fraud', 'Suspicious Traffic'
    ip: str
    geo_location: Optional[Dict[str, str]] = None # {'country': 'US', 'isp': 'MockISP'}
    severity: str # 'low', 'medium', 'high', 'critical'
    timestamp: datetime
    message: str
    timeline: List[Dict[str, Any]] = [] # [{'step': 'Detection', 'time': timestamp}]
    status: str = 'active' # 'active', 'blocked', 'terminated'
