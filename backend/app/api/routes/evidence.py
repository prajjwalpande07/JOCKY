from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.evidence import Evidence
from app.schemas.evidence import EvidenceItemResponse, EvidenceCreate, EvidenceVerifyResponse
from app.services.evidence_service import EvidenceService
from app.services.audit_service import AuditService
from app.core.security import get_current_user_optional
from app.websocket.events import ws_manager

router = APIRouter(prefix="/evidence", tags=["Evidence Management"])

@router.get("", response_model=List[EvidenceItemResponse], summary="List Evidence Items")
def get_evidence(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    source: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Evidence)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(Evidence.case_id == target_case).all()
        items = case_items if case_items else query.all()
    else:
        items = query.all()

    if source and source.lower() != "all":
        items = [e for e in items if e.source == source]
    if status_filter and status_filter.lower() != "all":
        items = [e for e in items if e.integrity_status == status_filter.lower()]

    return [
        {
            "id": e.id,
            "caseId": e.case_id,
            "title": e.title,
            "source": e.source,
            "timestamp": e.timestamp,
            "sha256": e.sha256,
            "collectionStatus": e.collection_status,
            "integrityStatus": e.integrity_status,
            "collectorAgent": e.collector_agent,
            "sizeBytes": e.size_bytes,
            "chainOfCustody": e.chain_of_custody or []
        }
        for e in items
    ]

@router.get("/{evidence_id}", response_model=EvidenceItemResponse, summary="Get Evidence Details & Chain of Custody")
def get_single_evidence(evidence_id: str, db: Session = Depends(get_db)):
    e = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evidence item not found")
    return {
        "id": e.id,
        "caseId": e.case_id,
        "title": e.title,
        "source": e.source,
        "timestamp": e.timestamp,
        "sha256": e.sha256,
        "collectionStatus": e.collection_status,
        "integrityStatus": e.integrity_status,
        "collectorAgent": e.collector_agent,
        "sizeBytes": e.size_bytes,
        "chainOfCustody": e.chain_of_custody or []
    }

@router.post("", response_model=EvidenceItemResponse, status_code=status.HTTP_201_CREATED, summary="Catalog Evidence Item")
async def create_evidence(
    data: EvidenceCreate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    ev_id = data.id or f"EVD-{str(db.query(Evidence).count() + 1).zfill(3)}"
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")

    ev = Evidence(
        id=ev_id,
        case_id=data.caseId,
        system_id=data.systemId,
        title=data.title,
        source=data.source or "File",
        timestamp=data.timestamp or "Just now",
        sha256=data.sha256 or "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        collection_status=data.collectionStatus or "collected",
        integrity_status=data.integrityStatus or "verified",
        collector_agent=data.collectorAgent or "JOCKY-Collector-v2.4",
        size_bytes=data.sizeBytes or "0 B",
        chain_of_custody=[]
    )
    EvidenceService.add_custody_step(ev, action="COLLECTED", actor=user_name, notes="Acquired via JOCKY agent.")
    db.add(ev)
    db.commit()
    db.refresh(ev)

    AuditService.create_log(
        db,
        action="Evidence Cataloged",
        object_name=f"Evidence {ev.id}",
        case_id=ev.case_id,
        user=user_name,
        result="SUCCESS",
        details=f"Cataloged {ev.title} (SHA-256: {ev.sha256[:16]}...)"
    )

    await ws_manager.broadcast_event("evidence.collected", {"id": ev.id, "case_id": ev.case_id, "title": ev.title})

    return {
        "id": ev.id,
        "caseId": ev.case_id,
        "title": ev.title,
        "source": ev.source,
        "timestamp": ev.timestamp,
        "sha256": ev.sha256,
        "collectionStatus": ev.collection_status,
        "integrityStatus": ev.integrity_status,
        "collectorAgent": ev.collector_agent,
        "sizeBytes": ev.size_bytes,
        "chainOfCustody": ev.chain_of_custody or []
    }

@router.post("/{evidence_id}/verify", response_model=EvidenceVerifyResponse, summary="Verify Cryptographic Chain of Custody")
def verify_evidence(
    evidence_id: str,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    res = EvidenceService.verify_evidence(db, evidence_id, actor=user_name)
    if not res.get("verified"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=res.get("message"))
    return res
