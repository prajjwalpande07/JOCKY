import platform
import os
from typing import Dict, Any

try:
    import psutil
except ImportError:
    psutil = None

class SystemCollector:
    """Safe forensic system host collector."""

    @staticmethod
    def collect() -> Dict[str, Any]:
        info = {
            "hostname": platform.node(),
            "os": f"{platform.system()} {platform.release()}",
            "platform": "windows" if platform.system().lower() == "windows" else "ubuntu",
            "version": "JOCKY-Collector-v2.4.0",
            "agent_version": "2.4.0",
            "cpu_usage": 12.5,
            "memory_usage": 45.0,
            "status": "online"
        }
        if psutil:
            try:
                info["cpu_usage"] = psutil.cpu_percent(interval=None)
                info["memory_usage"] = psutil.virtual_memory().percent
            except Exception:
                pass
        return info
