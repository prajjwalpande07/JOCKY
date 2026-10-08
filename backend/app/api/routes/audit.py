from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse, AuditLogCreate
from app.services.audit_service import AuditService
from app.core.security import get_current_user_optional

router = APIRouter(tags=["Audit Logs"])

def _get_audit_logs_list(db: Session, limit: int, case_id: Optional[str] = None):
    query = db.query(AuditLog)
    if case_id:
        query = query.filter((AuditLog.case_id == case_id) | (AuditLog.case_id == "GLOBAL"))
    logs = query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "user": l.user,
            "action": l.action,
            "caseId": l.case_id,
            "object": l.object,
            "result": l.result,
            "details": l.details,
            "hash": l.hash
        }
        for l in logs
    ]

@router.get("/audit", response_model=List[AuditLogResponse], summary="List Audit Logs")
def get_audit_logs(
    limit: int = Query(100, ge=1, le=500),
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    db: Session = Depends(get_db)
):
    target_case = caseId or investigation_id
    return _get_audit_logs_list(db, limit, target_case)

@router.get("/audit-logs", response_model=List[AuditLogResponse], summary="List Audit Logs (Alias)")
def get_audit_logs_alias(
    limit: int = Query(100, ge=1, le=500),
    case_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return _get_audit_logs_list(db, limit, case_id)

@router.post("/audit", response_model=AuditLogResponse, status_code=status.HTTP_201_CREATED, summary="Create Audit Log Entry")
def create_audit_log(
    data: AuditLogCreate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = data.user or current_user.get("name", "Dr. Sarah Chen, CISSP")
    entry = AuditService.create_log(
        db,
        action=data.action,
        object_name=data.object,
        case_id=data.caseId or "GLOBAL",
        user=user_name,
        result=data.result or "SUCCESS",
        details=data.details or ""
    )
    return {
        "id": entry.id,
        "timestamp": entry.timestamp,
        "user": entry.user,
        "action": entry.action,
        "caseId": entry.case_id,
        "object": entry.object,
        "result": entry.result,
        "details": entry.details,
        "hash": entry.hash
    }
