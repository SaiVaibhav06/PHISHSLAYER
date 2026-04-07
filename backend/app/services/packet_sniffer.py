import asyncio
import random
import logging
from app.data.store import stats_store
from app.utils.ip_utils import get_random_ip
from app.services.threat_detector import analyze_packet

logger = logging.getLogger("sniffer")
logging.basicConfig(level=logging.INFO)

class PacketSniffer:
    def __init__(self):
        self.is_running = False
        self.task = None

    async def _sniff_loop(self):
        logger.info("Background thread: Packet Sniffer Started")
        empty_cycles = 0
        
        while self.is_running:
            await asyncio.sleep(random.uniform(0.5, 3.0))
            
            # Simulate chance of no packets
            if random.random() < 0.2:
                empty_cycles += 1
                if empty_cycles > 3:
                     logger.warning("No packets received for a while... falling back to artificial generation.")
                continue
                
            empty_cycles = 0
            stats_store["total_packets_analyzed"] += 1
            
            packet_info = {
                "src_ip": get_random_ip(),
                "dst_ip": "192.168.1.100",
                "size": random.randint(40, 1500),
                "protocol": random.choice(["TCP", "UDP", "ICMP", "HTTP", "HTTPS"])
            }
            
            logger.info(f"Captured packet: {packet_info}")
            
            # Artificial malicious injection
            if random.random() < 0.15:
                packet_info["size"] = random.randint(2000, 5000)
                packet_info["protocol"] = "ICMP"
                
            await analyze_packet(packet_info)

    def start(self):
        if not self.is_running:
            self.is_running = True
            self.task = asyncio.create_task(self._sniff_loop())

    def stop(self):
        logger.info("Stopping Packet Sniffer...")
        self.is_running = False
        if self.task:
            self.task.cancel()

sniffer = PacketSniffer()
