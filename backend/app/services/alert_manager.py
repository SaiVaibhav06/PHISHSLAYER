import uuid
import asyncio
import logging
from app.core.websocket_manager import manager
from app.data.store import add_alert, stats_store
from app.models.alert_model import Alert
from app.utils.time_utils import get_current_utc_time

logger = logging.getLogger("alert_manager")
logging.basicConfig(level=logging.INFO)

async def publish_alert(alert_type: str, ip: str, severity: str, message: str):
    alert_id = str(uuid.uuid4())
    alert_obj = Alert(
        id=alert_id,
        type=alert_type,
        ip=ip,
        severity=severity,
        timestamp=get_current_utc_time(),
        message=message
    )
    
    alert_dict = alert_obj.model_dump()
    alert_dict["timestamp"] = alert_dict["timestamp"].isoformat()
    add_alert(alert_dict)
    stats_store["threats_blocked"] += 1
    
    logger.info(f"Generated new alert: {alert_type} [{severity}]")
    
    await manager.broadcast({
        "event": "new_alert",
        "data": alert_dict
    })
