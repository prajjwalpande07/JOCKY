from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.log_event import LogEvent
from app.schemas.log import LogEntryResponse

router = APIRouter(prefix="/logs", tags=["Log Analysis"])

@router.get("", response_model=List[LogEntryResponse], summary="List Security & System Logs")
def get_logs(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    source: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(LogEvent)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(LogEvent.case_id == target_case).all()
        logs = case_items if case_items else query.all()
    else:
        logs = query.all()

    if source and source.lower() != "all":
        logs = [l for l in logs if l.source == source]
    if severity and severity.lower() != "all":
        logs = [l for l in logs if l.severity == severity.lower()]
    if search:
        q = search.lower()
        logs = [l for l in logs if q in l.message.lower() or q in l.user.lower() or q in l.event_id.lower()]

    return [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "source": l.source,
            "eventId": l.event_id,
            "message": l.message,
            "severity": l.severity,
            "relatedProcess": l.related_process,
            "user": l.user,
            "raw": l.raw
        }
        for l in logs
    ]

@router.get("/{log_id}", response_model=LogEntryResponse, summary="Get Single Log Entry")
def get_log(log_id: str, db: Session = Depends(get_db)):
    l = db.query(LogEvent).filter(LogEvent.id == log_id).first()
    if not l:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Log entry not found")
    return {
        "id": l.id,
        "timestamp": l.timestamp,
        "source": l.source,
        "eventId": l.event_id,
        "message": l.message,
        "severity": l.severity,
        "relatedProcess": l.related_process,
        "user": l.user,
        "raw": l.raw
    }
