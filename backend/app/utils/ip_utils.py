import random

def get_random_ip() -> str:
    """Produce a random IPv4 address, excluding some local subnets"""
    return f"{random.randint(11,254)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"

def is_local_ip(ip: str) -> bool:
    return ip.startswith("10.") or ip.startswith("192.168.") or ip.startswith("127.")
