from app.services.alert_manager import publish_alert
from app.utils.ip_utils import is_local_ip

# Very basic heuristic rules
# 1. Reject packets with malformed signatures (mock)
# 2. Alert on external IP heavy traffic
# 3. Specific patterns

async def analyze_packet(packet_info: dict):
    src_ip = packet_info.get("src_ip", "")
    dst_ip = packet_info.get("dst_ip", "")
    payload_size = packet_info.get("size", 0)
    protocol = packet_info.get("protocol", "TCP")
    
    # Example Rule 1: Ping of Death or Large ICMP
    if protocol == "ICMP" and payload_size > 1000:
        await publish_alert(
            alert_type="Large ICMP Packet (Ping of Death Attempt)",
            ip=src_ip,
            severity="critical",
            message=f"Detected massive ICMP packet of size {payload_size} bytes."
        )
        return
        
    # Example Rule 2: Suspicious external source targeting local
    if not is_local_ip(src_ip) and is_local_ip(dst_ip) and payload_size > 500:
        await publish_alert(
            alert_type="Suspicious External Payload",
            ip=src_ip,
            severity="medium",
            message=f"External IP sending large {protocol} payload ({payload_size} bytes)."
        )
        return
        
    # Example Rule 3: Known malicous IP ranges (mock)
    if src_ip.startswith("185.") or src_ip.startswith("45."):
        await publish_alert(
            alert_type="High Risk IP Connection",
            ip=src_ip,
            severity="high",
            message=f"Connection attempt from known high-risk subnet ({src_ip})."
        )
        return
