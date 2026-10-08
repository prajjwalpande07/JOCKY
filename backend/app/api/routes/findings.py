from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.finding import Finding
from app.schemas.finding import FindingResponse, FindingCreate, FindingUpdate
from app.services.audit_service import AuditService
from app.core.security import get_current_user_optional
from app.websocket.events import ws_manager

router = APIRouter(prefix="/findings", tags=["Findings"])

@router.get("", response_model=List[FindingResponse], summary="List Threat Hunting Findings")
def get_findings(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    severity: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Finding)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(Finding.case_id == target_case).all()
        items = case_items if case_items else query.all()
    else:
        items = query.all()

    if severity and severity.lower() != "all":
        items = [f for f in items if f.severity == severity.lower()]
    if status_filter and status_filter.lower() != "all":
        items = [f for f in items if f.status == status_filter.lower()]

    return [
        {
            "id": f.id,
            "caseId": f.case_id,
            "title": f.title,
            "severity": f.severity,
            "confidence": f.confidence,
            "relatedEvidenceCount": f.related_evidence_count,
            "relatedEventsCount": f.related_events_count,
            "status": f.status,
            "detectedAt": f.detected_at,
            "ruleId": f.rule_id,
            "ruleName": f.rule_name,
            "description": f.description,
            "recommendation": f.recommendation,
            "investigatorNotes": f.investigator_notes or []
        }
        for f in items
    ]

@router.get("/{finding_id}", response_model=FindingResponse, summary="Get Single Finding Details")
def get_finding(finding_id: str, db: Session = Depends(get_db)):
    f = db.query(Finding).filter(Finding.id == finding_id).first()
    if not f:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Finding not found")
    return {
        "id": f.id,
        "caseId": f.case_id,
        "title": f.title,
        "severity": f.severity,
        "confidence": f.confidence,
        "relatedEvidenceCount": f.related_evidence_count,
        "relatedEventsCount": f.related_events_count,
        "status": f.status,
        "detectedAt": f.detected_at,
        "ruleId": f.rule_id,
        "ruleName": f.rule_name,
        "description": f.description,
        "recommendation": f.recommendation,
        "investigatorNotes": f.investigator_notes or []
    }

@router.post("", response_model=FindingResponse, status_code=status.HTTP_201_CREATED, summary="Create Finding")
async def create_finding(
    data: FindingCreate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    f_id = data.id or f"FND-{str(db.query(Finding).count() + 1).zfill(3)}"
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")

    f = Finding(
        id=f_id,
        case_id=data.caseId,
        title=data.title,
        severity=data.severity or "medium",
        confidence=data.confidence or 80,
        related_evidence_count=data.relatedEvidenceCount or 0,
        related_events_count=data.relatedEventsCount or 0,
        status=data.status or "under_review",
        detected_at=data.detectedAt or now_str,
        rule_id=data.ruleId or "JOCKY-RULE-GEN-001",
        rule_name=data.ruleName or "General Forensic Anomaly",
        description=data.description or "",
        recommendation=data.recommendation or "",
        investigator_notes=data.investigatorNotes or []
    )
    db.add(f)
    db.commit()
    db.refresh(f)

    AuditService.create_log(
        db,
        action="Finding Created",
        object_name=f"Finding {f.id}",
        case_id=f.case_id,
        user=user_name,
        result="SUCCESS",
        details=f"Identified {f.title} with {f.confidence}% confidence."
    )

    await ws_manager.broadcast_event("finding.created", {"id": f.id, "case_id": f.case_id, "title": f.title})

    return {
        "id": f.id,
        "caseId": f.case_id,
        "title": f.title,
        "severity": f.severity,
        "confidence": f.confidence,
        "relatedEvidenceCount": f.related_evidence_count,
        "relatedEventsCount": f.related_events_count,
        "status": f.status,
        "detectedAt": f.detected_at,
        "ruleId": f.rule_id,
        "ruleName": f.rule_name,
        "description": f.description,
        "recommendation": f.recommendation,
        "investigatorNotes": f.investigator_notes or []
    }

def _update_finding_record(finding_id: str, data: FindingUpdate, user_name: str, db: Session):
    f = db.query(Finding).filter(Finding.id == finding_id).first()
    if not f:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Finding not found")

    old_status = f.status
    if data.title is not None:
        f.title = data.title
    if data.severity is not None:
        f.severity = data.severity
    if data.confidence is not None:
        f.confidence = data.confidence
    if data.status is not None:
        f.status = data.status
    if data.description is not None:
        f.description = data.description
    if data.recommendation is not None:
        f.recommendation = data.recommendation

    notes = list(f.investigator_notes or [])
    if data.note:
        notes.append(data.note)
    if data.investigatorNotes:
        notes.extend(data.investigatorNotes)
    f.investigator_notes = notes

    db.commit()
    db.refresh(f)

    AuditService.create_log(
        db,
        action=f"Finding Status Change ({old_status} -> {f.status})" if data.status else "Finding Updated",
        object_name=f"Finding {f.id}",
        case_id=f.case_id,
        user=user_name,
        result="SUCCESS",
        details=f"Finding {f.id} updated. Current status: {f.status}. Notes added: {bool(data.note)}"
    )

    return {
        "id": f.id,
        "caseId": f.case_id,
        "title": f.title,
        "severity": f.severity,
        "confidence": f.confidence,
        "relatedEvidenceCount": f.related_evidence_count,
        "relatedEventsCount": f.related_events_count,
        "status": f.status,
        "detectedAt": f.detected_at,
        "ruleId": f.rule_id,
        "ruleName": f.rule_name,
        "description": f.description,
        "recommendation": f.recommendation,
        "investigatorNotes": f.investigator_notes or []
    }

@router.put("/{finding_id}", response_model=FindingResponse, summary="Update Finding (PUT)")
def update_finding_put(
    finding_id: str,
    data: FindingUpdate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    return _update_finding_record(finding_id, data, user_name, db)

@router.patch("/{finding_id}", response_model=FindingResponse, summary="Update Finding Status (PATCH)")
def update_finding_patch(
    finding_id: str,
    data: FindingUpdate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    return _update_finding_record(finding_id, data, user_name, db)
