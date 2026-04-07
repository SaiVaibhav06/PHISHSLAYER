from datetime import datetime, timezone

def get_current_utc_time() -> datetime:
    return datetime.now(timezone.utc)

def format_iso_time() -> str:
    return get_current_utc_time().isoformat()
