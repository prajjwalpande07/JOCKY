from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.timeline import TimelineEvent
from app.schemas.timeline import TimelineEventResponse

router = APIRouter(prefix="/timeline", tags=["Timeline"])

def _query_timeline(db: Session, case_id: Optional[str], category: Optional[str], severity: Optional[str]):
    query = db.query(TimelineEvent)
    if case_id:
        case_items = query.filter(TimelineEvent.case_id == case_id).all()
        events = case_items if case_items else query.all()
    else:
        events = query.order_by(TimelineEvent.created_at.asc()).all()

    if category and category.lower() != "all":
        events = [t for t in events if t.category == category.lower()]
    if severity and severity.lower() != "all":
        events = [t for t in events if t.severity == severity.lower()]

    return [
        {
            "id": t.id,
            "timestamp": t.timestamp,
            "timeOnly": t.time_only,
            "title": t.title,
            "description": t.description,
            "category": t.category,
            "severity": t.severity,
            "user": t.user,
            "details": t.details or {}
        }
        for t in events
    ]

@router.get("", response_model=List[TimelineEventResponse], summary="List Chronological Timeline Events")
def get_timeline(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    category: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    target_case = caseId or investigation_id
    return _query_timeline(db, target_case, category, severity)

@router.get("/{case_id}", response_model=List[TimelineEventResponse], summary="Get Timeline for Case")
def get_case_timeline(
    case_id: str,
    category: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    return _query_timeline(db, case_id, category, severity)
