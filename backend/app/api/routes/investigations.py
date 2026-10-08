from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.investigation import InvestigationResponse, InvestigationCreate, InvestigationUpdate
from app.services.investigation_service import InvestigationService
from app.core.security import get_current_user_optional
from app.websocket.events import ws_manager

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.get("", response_model=List[InvestigationResponse], summary="List Investigations")
def get_investigations(
    status: Optional[str] = Query(None, description="Filter by investigation status"),
    platform: Optional[str] = Query(None, description="Filter by platform (windows/ubuntu)"),
    search: Optional[str] = Query(None, description="Search term for case title/ID"),
    db: Session = Depends(get_db)
):
    cases = InvestigationService.get_all(db, status=status, platform=platform, search=search)
    return [
        {
            "id": c.id,
            "title": c.title,
            "targetSystem": c.target_system,
            "platform": c.platform,
            "createdDate": c.created_date,
            "investigator": c.investigator,
            "risk": c.risk,
            "status": c.status,
            "evidenceCount": c.evidence_count,
            "eventsCount": c.events_count,
            "findingsCount": c.findings_count,
            "description": c.description,
            "riskScore": c.risk_score,
            "collectionProgress": c.collection_progress
        }
        for c in cases
    ]

@router.get("/{case_id}", response_model=InvestigationResponse, summary="Get Single Investigation Details")
def get_investigation(case_id: str, db: Session = Depends(get_db)):
    c = InvestigationService.get_by_id(db, case_id)
    if not c:
        # Fallback to first case if not found, or 404
        all_cases = InvestigationService.get_all(db)
        if all_cases:
            c = all_cases[0]
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation case not found")
    
    return {
        "id": c.id,
        "title": c.title,
        "targetSystem": c.target_system,
        "platform": c.platform,
        "createdDate": c.created_date,
        "investigator": c.investigator,
        "risk": c.risk,
        "status": c.status,
        "evidenceCount": c.evidence_count,
        "eventsCount": c.events_count,
        "findingsCount": c.findings_count,
        "description": c.description,
        "riskScore": c.risk_score,
        "collectionProgress": c.collection_progress
    }

@router.post("", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED, summary="Create Investigation")
async def create_investigation(
    data: InvestigationCreate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    created = InvestigationService.create(db, data.model_dump(), user=user_name)
    
    # Broadcast websocket event
    await ws_manager.broadcast_event("investigation.created", {"case_id": created.id, "title": created.title})

    return {
        "id": created.id,
        "title": created.title,
        "targetSystem": created.target_system,
        "platform": created.platform,
        "createdDate": created.created_date,
        "investigator": created.investigator,
        "risk": created.risk,
        "status": created.status,
        "evidenceCount": created.evidence_count,
        "eventsCount": created.events_count,
        "findingsCount": created.findings_count,
        "description": created.description,
        "riskScore": created.risk_score,
        "collectionProgress": created.collection_progress
    }

@router.put("/{case_id}", response_model=InvestigationResponse, summary="Update Investigation")
async def update_investigation(
    case_id: str,
    data: InvestigationUpdate,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    updated = InvestigationService.update(db, case_id, data.model_dump(exclude_unset=True), user=user_name)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation case not found")

    await ws_manager.broadcast_event("investigation.updated", {"case_id": updated.id, "status": updated.status})

    return {
        "id": updated.id,
        "title": updated.title,
        "targetSystem": updated.target_system,
        "platform": updated.platform,
        "createdDate": updated.created_date,
        "investigator": updated.investigator,
        "risk": updated.risk,
        "status": updated.status,
        "evidenceCount": updated.evidence_count,
        "eventsCount": updated.events_count,
        "findingsCount": updated.findings_count,
        "description": updated.description,
        "riskScore": updated.risk_score,
        "collectionProgress": updated.collection_progress
    }

@router.delete("/{case_id}", summary="Delete Investigation")
def delete_investigation(
    case_id: str,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    deleted = InvestigationService.delete(db, case_id, user=user_name)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation case not found")
    return {"status": "SUCCESS", "message": f"Investigation {case_id} removed."}
