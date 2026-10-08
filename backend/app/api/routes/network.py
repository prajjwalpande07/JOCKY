from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.network import NetworkConnection
from app.schemas.network import NetworkConnectionResponse, NetworkStatsResponse

router = APIRouter(prefix="/network", tags=["Network Forensics"])

@router.get("", response_model=List[NetworkConnectionResponse], summary="List Network Sockets & Connections")
def get_network_connections(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    system_id: Optional[str] = Query(None, alias="system_id"),
    protocol: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(NetworkConnection)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(NetworkConnection.case_id == target_case).all()
        connections = case_items if case_items else query.all()
    else:
        connections = query.all()

    if system_id:
        connections = [n for n in connections if n.system_id == system_id]
    if protocol and protocol.lower() != "all":
        connections = [n for n in connections if n.protocol == protocol.upper()]
    if status_filter and status_filter.lower() != "all":
        connections = [n for n in connections if n.status == status_filter.upper()]

    return [
        {
            "id": n.id,
            "sourceIp": n.source_ip,
            "sourcePort": n.source_port,
            "destIp": n.dest_ip,
            "destPort": n.dest_port,
            "protocol": n.protocol,
            "processName": n.process_name,
            "pid": n.pid,
            "timestamp": n.timestamp,
            "status": n.status,
            "risk": n.risk,
            "destinationGeo": n.destination_geo,
            "bytesTransferred": n.bytes_transferred,
            "suspiciousIndicator": n.suspicious_indicator
        }
        for n in connections
    ]

@router.get("/stats", response_model=NetworkStatsResponse, summary="Network Connections Statistics")
def get_network_stats(db: Session = Depends(get_db)):
    connections = db.query(NetworkConnection).all()
    proto_map = {}
    stat_map = {}
    risk_map = {}
    for c in connections:
        proto_map[c.protocol] = proto_map.get(c.protocol, 0) + 1
        stat_map[c.status] = stat_map.get(c.status, 0) + 1
        risk_map[c.risk] = risk_map.get(c.risk, 0) + 1

    return {
        "totalConnections": len(connections),
        "protocols": proto_map,
        "statuses": stat_map,
        "risks": risk_map
    }

@router.get("/{connection_id}", response_model=NetworkConnectionResponse, summary="Get Single Network Connection")
def get_network_connection(connection_id: str, db: Session = Depends(get_db)):
    n = db.query(NetworkConnection).filter(NetworkConnection.id == connection_id).first()
    if not n:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Network connection not found")
    return {
        "id": n.id,
        "sourceIp": n.source_ip,
        "sourcePort": n.source_port,
        "destIp": n.dest_ip,
        "destPort": n.dest_port,
        "protocol": n.protocol,
        "processName": n.process_name,
        "pid": n.pid,
        "timestamp": n.timestamp,
        "status": n.status,
        "risk": n.risk,
        "destinationGeo": n.destination_geo,
        "bytesTransferred": n.bytes_transferred,
        "suspiciousIndicator": n.suspicious_indicator
    }
