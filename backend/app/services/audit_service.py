import hashlib
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.audit import AuditLog
from app.core.logging import logger

class AuditService:
    @staticmethod
    def create_log(
        db: Session,
        action: str,
        object_name: str,
        case_id: str = "GLOBAL",
        user: str = "Dr. Sarah Chen, CISSP",
        result: str = "SUCCESS",
        details: str = "",
        metadata_json: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        raw_hash_input = f"{now_str}:{user}:{action}:{object_name}:{result}:{details}"
        entry_hash = hashlib.sha256(raw_hash_input.encode()).hexdigest()[:16]
        entry_id = f"AUD-{int(datetime.now(timezone.utc).timestamp() * 1000)}"

        audit_entry = AuditLog(
            id=entry_id,
            timestamp=now_str,
            user=user,
            action=action,
            case_id=case_id,
            object=object_name,
            result=result,
            details=details,
            hash=entry_hash,
            metadata_json=metadata_json or {}
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)

        logger.info(f"Audit log recorded: {action} on {object_name} by {user} [{result}]")
        return audit_entry

    @staticmethod
    def get_logs(db: Session, limit: int = 100) -> List[AuditLog]:
        return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
