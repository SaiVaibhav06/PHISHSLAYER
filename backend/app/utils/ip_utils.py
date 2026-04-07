import random
import hashlib

def get_random_ip() -> str:
    """Produce a random IPv4 address, excluding some local subnets"""
    return f"{random.randint(11,254)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"

def is_local_ip(ip: str) -> bool:
    return ip.startswith("10.") or ip.startswith("192.168.") or ip.startswith("127.")

def get_geo_info(ip: str) -> dict:
    """Mock geo-location service"""
    if is_local_ip(ip):
        return {"country": "Local", "isp": "Private Network"}
    
    countries = ["US", "RU", "CN", "BR", "IN", "DE", "GB", "NL", "FR"]
    isps = ["Comcast", "Telecom", "NetWorks", "CloudHost", "Unknown ISP"]
    
    # deterministic randomness based on IP string
    ip_hash = int(hashlib.md5(ip.encode()).hexdigest(), 16)
    
    return {
        "country": countries[ip_hash % len(countries)],
        "isp": isps[(ip_hash // 10) % len(isps)]
    }
