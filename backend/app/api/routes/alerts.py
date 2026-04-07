from fastapi import APIRouter
from app.data.store import get_alerts, stats_store
from app.services.alert_manager import publish_alert
from app.utils.time_utils import get_current_utc_time
from pydantic import BaseModel
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
        message="User executed simulated high-severity packet attack sequence.",
        categories=["Malware", "Suspicious Traffic"]
    )
    return {"status": "success", "message": "Simulated attack triggered"}

class ActionRequest(BaseModel):
    alert_id: str
    action_type: str # 'block_ip', 'terminate'

@router.post("/action")
async def take_action(req: ActionRequest):
    # In a real system, this would modify the firewall or connection tables.
    # Here, we will just update the store or simulate success.
    # We broadcast an event so frontend can update the timeline
    from app.core.websocket_manager import manager
    await manager.broadcast({
        "event": "action_taken",
        "data": {
            "alert_id": req.alert_id,
            "action": req.action_type,
            "timestamp": get_current_utc_time().isoformat(),
            "status": "success"
        }
    })
    return {"status": "success", "message": f"Action {req.action_type} executed successfully."}
