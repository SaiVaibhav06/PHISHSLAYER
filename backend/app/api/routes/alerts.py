from fastapi import APIRouter
from app.data.store import get_alerts, stats_store
from app.services.alert_manager import publish_alert
import random

router = APIRouter()

@router.get("/")
async def get_recent_alerts(limit: int = 50):
    return {
        "status": "success",
        "alerts": get_alerts(limit)
    }

@router.get("/stats")
async def get_stats():
    return {
        "status": "success",
        "stats": stats_store
    }

@router.post("/simulate")
async def simulate_attack():
    await publish_alert(
        alert_type="Manual Simulated Attack",
        ip=f"192.168.1.{random.randint(10,250)}",
        severity="critical",
        message="User executed simulated high-severity packet attack sequence."
    )
    return {"status": "success", "message": "Simulated attack triggered"}
