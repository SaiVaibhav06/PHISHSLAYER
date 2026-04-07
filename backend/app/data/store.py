from collections import deque

# In-memory storage of alerts, using deque to keep max 1000 items
alert_store = deque(maxlen=1000)

def add_alert(alert_dict: dict):
    alert_store.appendleft(alert_dict)

def get_alerts(limit: int = 50) -> list:
    return list(alert_store)[:limit]

stats_store = {
    "total_packets_analyzed": 0,
    "threats_blocked": 0,
    "active_connections": 0
}
