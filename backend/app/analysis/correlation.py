from typing import List, Dict, Any

class CorrelationService:
    """Correlates forensic artifacts across disparate data channels."""

    @staticmethod
    def correlate_case_events(
        case_id: str,
        processes: List[Dict[str, Any]],
        files: List[Dict[str, Any]],
        networks: List[Dict[str, Any]],
        logs: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        correlated = []

        # Find processes that have network connections
        proc_pids = {p.get("pid"): p for p in processes}
        for net in networks:
            pid = net.get("pid")
            if pid in proc_pids:
                proc = proc_pids[pid]
                correlated.append({
                    "type": "Process-Network Correlation",
                    "case_id": case_id,
                    "title": f"Process {proc.get('name')} connected to {net.get('dest_ip')}:{net.get('dest_port')}",
                    "severity": net.get("risk", "medium"),
                    "process": proc.get("name"),
                    "pid": pid,
                    "remote_ip": net.get("dest_ip"),
                    "timestamp": net.get("timestamp", "")
                })

        # Correlate files written in suspicious paths with high entropy
        for f in files:
            entropy = f.get("entropy", 0.0)
            if entropy > 7.0:
                correlated.append({
                    "type": "High Entropy Artifact",
                    "case_id": case_id,
                    "title": f"Suspicious encrypted/packed artifact: {f.get('name')} (Entropy: {entropy})",
                    "severity": "critical",
                    "file_path": f.get("path"),
                    "sha256": f.get("sha256")
                })

        return correlated
