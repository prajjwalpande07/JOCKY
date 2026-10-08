from typing import List, Dict, Any

try:
    import psutil
except ImportError:
    psutil = None

class ProcessCollector:
    """Safe forensic process enumerator."""

    @staticmethod
    def collect() -> List[Dict[str, Any]]:
        results = []
        if not psutil:
            return results

        for proc in psutil.process_iter(['pid', 'name', 'ppid', 'username', 'cpu_percent', 'memory_info', 'exe', 'cmdline', 'create_time']):
            try:
                pinfo = proc.info
                mem_mb = round(pinfo['memory_info'].rss / (1024 * 1024), 2) if pinfo.get('memory_info') else 0.0
                results.append({
                    "pid": pinfo['pid'],
                    "name": pinfo.get('name') or "Unknown",
                    "ppid": pinfo.get('ppid') or 0,
                    "parent_name": "System",
                    "user": pinfo.get('username') or "SYSTEM",
                    "cpu": f"{pinfo.get('cpu_percent', 0.0):.1f}%",
                    "memory": f"{mem_mb:.1f} MB",
                    "start_time": "Running",
                    "path": pinfo.get('exe') or "",
                    "command_line": " ".join(pinfo['cmdline']) if pinfo.get('cmdline') else "",
                    "status": "running",
                    "risk": "normal",
                    "connections_count": 0,
                    "related_events_count": 0
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return results
