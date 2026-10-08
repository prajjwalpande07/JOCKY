from typing import Optional, Literal, Dict
from pydantic import BaseModel, Field, ConfigDict

RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
ProtocolType = Literal["TCP", "UDP", "TLS", "HTTP", "DNS"]
ConnectionStatus = Literal["ESTABLISHED", "CLOSE_WAIT", "SYN_SENT", "LISTENING"]

class NetworkConnectionCreate(BaseModel):
    id: Optional[str] = None
    sourceIp: str = Field(alias="source_ip")
    sourcePort: int = Field(alias="source_port")
    destIp: str = Field(alias="dest_ip")
    destPort: int = Field(alias="dest_port")
    protocol: Optional[ProtocolType] = "TCP"
    processName: Optional[str] = Field(default="System", alias="process_name")
    pid: Optional[int] = 0
    timestamp: Optional[str] = ""
    status: Optional[ConnectionStatus] = "ESTABLISHED"
    risk: Optional[RiskLevel] = "normal"
    destinationGeo: Optional[str] = Field(default="Internal / LAN", alias="destination_geo")
    bytesTransferred: Optional[str] = Field(default="0 B", alias="bytes_transferred")
    suspiciousIndicator: Optional[str] = Field(default=None, alias="suspicious_indicator")
    caseId: Optional[str] = Field(default=None, alias="case_id")
    systemId: Optional[str] = Field(default=None, alias="system_id")

    model_config = ConfigDict(populate_by_name=True)

class NetworkConnectionResponse(BaseModel):
    id: str
    sourceIp: str
    sourcePort: int
    destIp: str
    destPort: int
    protocol: ProtocolType
    processName: str
    pid: int
    timestamp: str
    status: ConnectionStatus
    risk: RiskLevel
    destinationGeo: str
    bytesTransferred: str
    suspiciousIndicator: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class NetworkStatsResponse(BaseModel):
    totalConnections: int
    protocols: Dict[str, int]
    statuses: Dict[str, int]
    risks: Dict[str, int]
