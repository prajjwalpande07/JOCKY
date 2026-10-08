from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.investigation import Investigation
from app.services.audit_service import AuditService

class InvestigationService:
    @staticmethod
    def get_all(
        db: Session,
        status: Optional[str] = None,
        platform: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Investigation]:
        query = db.query(Investigation)

        if status and status.lower() != "all":
            query = query.filter(Investigation.status == status.lower())
        if platform and platform.lower() != "all":
            query = query.filter(Investigation.platform == platform.lower())
        if search:
            q = f"%{search.lower()}%"
            query = query.filter(
                (Investigation.id.ilike(q)) |
                (Investigation.title.ilike(q)) |
                (Investigation.target_system.ilike(q)) |
                (Investigation.investigator.ilike(q))
            )

        return query.order_by(Investigation.created_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, case_id: str) -> Optional[Investigation]:
        return db.query(Investigation).filter(Investigation.id == case_id).first()

    @staticmethod
    def create(
        db: Session,
        data: Dict[str, Any],
        user: str = "Dr. Sarah Chen, CISSP"
    ) -> Investigation:
        total_cases = db.query(Investigation).count()
        new_id = f"JCK-2026-{str(total_cases + 1).zfill(3)}"
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        inv = Investigation(
            id=data.get("id") or new_id,
            title=data.get("title", "Untitled Forensic Investigation"),
            target_system=data.get("targetSystem") or data.get("target_system") or "WIN-FORENSIC-01",
            platform=data.get("platform", "windows"),
            created_date=now_str,
            investigator=data.get("investigator") or user,
            risk=data.get("risk", "medium"),
            status=data.get("status", "open"),
            evidence_count=0,
            events_count=0,
            findings_count=0,
            description=data.get("description", "Forensic investigation triage initiated via JOCKY Command Center."),
            risk_score=data.get("riskScore") or data.get("risk_score") or 45,
            collection_progress=data.get("collectionProgress") or data.get("collection_progress") or 10
        )
        db.add(inv)
        db.commit()
        db.refresh(inv)

        AuditService.create_log(
            db,
            action="Investigation Created",
            object_name=f"Case {inv.id}",
            case_id=inv.id,
            user=user,
            result="SUCCESS",
            details=f"New triage workspace initialized for target {inv.target_system}"
        )

        return inv

    @staticmethod
    def update(
        db: Session,
        case_id: str,
        data: Dict[str, Any],
        user: str = "Dr. Sarah Chen, CISSP"
    ) -> Optional[Investigation]:
        inv = db.query(Investigation).filter(Investigation.id == case_id).first()
        if not inv:
            return None

        if "title" in data and data["title"] is not None:
            inv.title = data["title"]
        if "targetSystem" in data and data["targetSystem"] is not None:
            inv.target_system = data["targetSystem"]
        elif "target_system" in data and data["target_system"] is not None:
            inv.target_system = data["target_system"]
        if "platform" in data and data["platform"] is not None:
            inv.platform = data["platform"]
        if "status" in data and data["status"] is not None:
            inv.status = data["status"]
        if "risk" in data and data["risk"] is not None:
            inv.risk = data["risk"]
        if "description" in data and data["description"] is not None:
            inv.description = data["description"]
        if "riskScore" in data and data["riskScore"] is not None:
            inv.risk_score = data["riskScore"]
        elif "risk_score" in data and data["risk_score"] is not None:
            inv.risk_score = data["risk_score"]
        if "collectionProgress" in data and data["collectionProgress"] is not None:
            inv.collection_progress = data["collectionProgress"]
        elif "collection_progress" in data and data["collection_progress"] is not None:
            inv.collection_progress = data["collection_progress"]

        db.commit()
        db.refresh(inv)

        AuditService.create_log(
            db,
            action="Investigation Updated",
            object_name=f"Case {inv.id}",
            case_id=inv.id,
            user=user,
            result="SUCCESS",
            details=f"Investigation {inv.id} parameters modified."
        )

        return inv

    @staticmethod
    def delete(
        db: Session,
        case_id: str,
        user: str = "Dr. Sarah Chen, CISSP"
    ) -> bool:
        inv = db.query(Investigation).filter(Investigation.id == case_id).first()
        if not inv:
            return False

        db.delete(inv)
        db.commit()

        AuditService.create_log(
            db,
            action="Investigation Deleted",
            object_name=f"Case {case_id}",
            case_id=case_id,
            user=user,
            result="SUCCESS",
            details=f"Investigation {case_id} archived and purged from active triage."
        )
        return True
