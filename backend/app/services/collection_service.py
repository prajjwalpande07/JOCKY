from typing import Dict, Any
from sqlalchemy.orm import Session
from app.collectors.system_collector import SystemCollector
from app.collectors.process_collector import ProcessCollector
from app.collectors.network_collector import NetworkCollector
from app.collectors.log_collector import LogCollector
from app.services.audit_service import AuditService

class CollectionService:
    @staticmethod
    def run_live_collection(db: Session, case_id: str, user: str = "Dr. Sarah Chen, CISSP") -> Dict[str, Any]:
        sys_info = SystemCollector.collect()
        procs = ProcessCollector.collect()
        nets = NetworkCollector.collect()
        logs = LogCollector.collect("Security")

        AuditService.create_log(
            db,
            action="Forensic Acquisition",
            object_name=f"Case {case_id}",
            case_id=case_id,
            user=user,
            result="SUCCESS",
            details=f"Acquired {len(procs)} processes, {len(nets)} sockets, and system telemetry."
        )

        return {
            "case_id": case_id,
            "system_info": sys_info,
            "processes_acquired": len(procs),
            "network_connections_acquired": len(nets),
            "logs_acquired": len(logs),
            "status": "COMPLETED"
        }
