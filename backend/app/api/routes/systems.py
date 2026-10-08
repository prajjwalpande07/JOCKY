from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.system import SystemHost
from app.schemas.system import SystemHostResponse, SystemHostCreate, SystemHostUpdate
from app.services.audit_service import AuditService

router = APIRouter(prefix="/systems", tags=["Systems"])

@router.get("", response_model=List[SystemHostResponse], summary="List Connected Systems")
def get_systems(
    platform: Optional[str] = Query(None, description="Filter by platform (windows/ubuntu)"),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(SystemHost)
    if platform and platform.lower() != "all":
        query = query.filter(SystemHost.platform == platform.lower())
    if status_filter and status_filter.lower() != "all":
        query = query.filter(SystemHost.status == status_filter.lower())

    systems = query.all()
    return [
        {
            "id": s.id,
            "hostname": s.hostname,
            "ip": s.ip,
            "os": s.os,
            "platform": s.platform,
            "version": s.version,
            "status": s.status,
            "lastSeen": s.last_seen,
            "agentVersion": s.agent_version,
            "cpuUsage": s.cpu_usage,
            "memoryUsage": s.memory_usage,
            "activeCaseId": s.active_case_id,
            "evidenceCollected": s.evidence_collected
        }
        for s in systems
    ]

@router.get("/{system_id}", response_model=SystemHostResponse, summary="Get Single System Details")
def get_system(system_id: str, db: Session = Depends(get_db)):
    s = db.query(SystemHost).filter(SystemHost.id == system_id).first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="System host not found")
    return {
        "id": s.id,
        "hostname": s.hostname,
        "ip": s.ip,
        "os": s.os,
        "platform": s.platform,
        "version": s.version,
        "status": s.status,
        "lastSeen": s.last_seen,
        "agentVersion": s.agent_version,
        "cpuUsage": s.cpu_usage,
        "memoryUsage": s.memory_usage,
        "activeCaseId": s.active_case_id,
        "evidenceCollected": s.evidence_collected
    }

@router.post("", response_model=SystemHostResponse, status_code=status.HTTP_201_CREATED, summary="Register System")
def create_system(data: SystemHostCreate, db: Session = Depends(get_db)):
    sys_id = data.id or f"SYS-{data.hostname[:4].upper()}-{str(db.query(SystemHost).count() + 1).zfill(2)}"
    new_sys = SystemHost(
        id=sys_id,
        hostname=data.hostname,
        ip=data.ip,
        os=data.os,
        platform=data.platform,
        version=data.version or "JOCKY-Collector-v2.4.0",
        status=data.status or "online",
        last_seen="Just now",
        agent_version=data.agentVersion or "2.4.0",
        cpu_usage=data.cpuUsage or 0.0,
        memory_usage=data.memoryUsage or 0.0,
        active_case_id=data.activeCaseId,
        evidence_collected=0
    )
    db.add(new_sys)
    db.commit()
    db.refresh(new_sys)

    AuditService.create_log(
        db,
        action="System Registered",
        object_name=f"Host {new_sys.hostname}",
        result="SUCCESS",
        details=f"Connected agent {new_sys.agent_version} on {new_sys.ip}"
    )

    return {
        "id": new_sys.id,
        "hostname": new_sys.hostname,
        "ip": new_sys.ip,
        "os": new_sys.os,
        "platform": new_sys.platform,
        "version": new_sys.version,
        "status": new_sys.status,
        "lastSeen": new_sys.last_seen,
        "agentVersion": new_sys.agent_version,
        "cpuUsage": new_sys.cpu_usage,
        "memoryUsage": new_sys.memory_usage,
        "activeCaseId": new_sys.active_case_id,
        "evidenceCollected": new_sys.evidence_collected
    }

@router.put("/{system_id}", response_model=SystemHostResponse, summary="Update System Host")
def update_system(system_id: str, data: SystemHostUpdate, db: Session = Depends(get_db)):
    s = db.query(SystemHost).filter(SystemHost.id == system_id).first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="System host not found")

    if data.hostname is not None:
        s.hostname = data.hostname
    if data.ip is not None:
        s.ip = data.ip
    if data.os is not None:
        s.os = data.os
    if data.status is not None:
        s.status = data.status
    if data.cpuUsage is not None:
        s.cpu_usage = data.cpuUsage
    if data.memoryUsage is not None:
        s.memory_usage = data.memoryUsage
    if data.activeCaseId is not None:
        s.active_case_id = data.activeCaseId
    if data.evidenceCollected is not None:
        s.evidence_collected = data.evidenceCollected

    db.commit()
    db.refresh(s)
    return {
        "id": s.id,
        "hostname": s.hostname,
        "ip": s.ip,
        "os": s.os,
        "platform": s.platform,
        "version": s.version,
        "status": s.status,
        "lastSeen": s.last_seen,
        "agentVersion": s.agent_version,
        "cpuUsage": s.cpu_usage,
        "memoryUsage": s.memory_usage,
        "activeCaseId": s.active_case_id,
        "evidenceCollected": s.evidence_collected
    }
