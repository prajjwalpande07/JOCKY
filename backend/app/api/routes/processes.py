from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.process import Process
from app.schemas.process import ProcessItemResponse

router = APIRouter(prefix="/processes", tags=["Process Forensics"])

@router.get("", response_model=List[ProcessItemResponse], summary="List Running Processes")
def get_processes(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    system_id: Optional[str] = Query(None, alias="system_id"),
    risk: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Process)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(Process.case_id == target_case).all()
        processes = case_items if case_items else query.all()
    else:
        processes = query.all()

    if system_id:
        processes = [p for p in processes if p.system_id == system_id]
    if risk and risk.lower() != "all":
        processes = [p for p in processes if p.risk == risk.lower()]
    if search:
        q = search.lower()
        processes = [p for p in processes if q in p.name.lower() or q in p.path.lower() or q in p.user.lower()]

    return [
        {
            "pid": p.pid,
            "name": p.name,
            "ppid": p.ppid,
            "parentName": p.parent_name,
            "user": p.user,
            "cpu": p.cpu,
            "memory": p.memory,
            "startTime": p.start_time,
            "path": p.path,
            "sha256": p.sha256,
            "risk": p.risk,
            "status": p.status,
            "commandLine": p.command_line,
            "connectionsCount": p.connections_count,
            "relatedEventsCount": p.related_events_count,
            "matchedRules": p.matched_rules
        }
        for p in processes
    ]

@router.get("/{pid}", response_model=ProcessItemResponse, summary="Get Process Details by PID")
def get_process(pid: int, db: Session = Depends(get_db)):
    p = db.query(Process).filter(Process.pid == pid).first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Process not found")
    return {
        "pid": p.pid,
        "name": p.name,
        "ppid": p.ppid,
        "parentName": p.parent_name,
        "user": p.user,
        "cpu": p.cpu,
        "memory": p.memory,
        "startTime": p.start_time,
        "path": p.path,
        "sha256": p.sha256,
        "risk": p.risk,
        "status": p.status,
        "commandLine": p.command_line,
        "connectionsCount": p.connections_count,
        "relatedEventsCount": p.related_events_count,
        "matchedRules": p.matched_rules
    }
