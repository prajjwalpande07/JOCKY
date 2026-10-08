from typing import List, Dict, Any

try:
    import psutil
except ImportError:
    psutil = None

class NetworkCollector:
    """Safe forensic network connection enumerator."""

    @staticmethod
    def collect() -> List[Dict[str, Any]]:
        results = []
        if not psutil:
            return results

        try:
            for conn in psutil.net_connections(kind='inet'):
                results.append({
                    "source_ip": conn.laddr.ip if conn.laddr else "0.0.0.0",
                    "source_port": conn.laddr.port if conn.laddr else 0,
                    "dest_ip": conn.raddr.ip if conn.raddr else "0.0.0.0",
                    "dest_port": conn.raddr.port if conn.raddr else 0,
                    "protocol": "TCP" if conn.type == 1 else "UDP",
                    "pid": conn.pid or 0,
                    "status": conn.status,
                    "risk": "normal",
                    "destination_geo": "Local / Internal",
                    "bytes_transferred": "0 B"
                })
        except Exception:
            pass
        return results
