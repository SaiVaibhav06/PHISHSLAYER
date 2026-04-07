import uuid
import asyncio
import logging
from app.core.websocket_manager import manager
from app.data.store import add_alert, stats_store
from app.models.alert_model import Alert
from app.utils.time_utils import get_current_utc_time
from app.utils.ip_utils import get_geo_info

logger = logging.getLogger("alert_manager")
logging.basicConfig(level=logging.INFO)

async def publish_alert(alert_type: str, ip: str, severity: str, message: str, categories: list = None):
    if categories is None:
        categories = ["Suspicious Traffic"]
        
    alert_id = str(uuid.uuid4())
    current_time = get_current_utc_time()
    
    alert_obj = Alert(
        id=alert_id,
        type=alert_type,
        categories=categories,
        ip=ip,
        geo_location=get_geo_info(ip),
        severity=severity,
        timestamp=current_time,
        message=message,
        timeline=[
            {"step": "Detection", "time": current_time.isoformat()},
            {"step": "Classification", "time": current_time.isoformat()}
        ],
        status="active"
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
