from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

PlatformType = Literal["windows", "ubuntu"]
SystemStatus = Literal["online", "offline", "collecting", "warning"]

class SystemHostCreate(BaseModel):
    id: Optional[str] = None
    hostname: str
    ip: str
    os: str
    platform: PlatformType = "windows"
    version: Optional[str] = "JOCKY-Collector-v2.4.0"
    status: Optional[SystemStatus] = "online"
    agentVersion: Optional[str] = Field(default="2.4.0", alias="agent_version")
    cpuUsage: Optional[float] = Field(default=0.0, alias="cpu_usage")
    memoryUsage: Optional[float] = Field(default=0.0, alias="memory_usage")
    activeCaseId: Optional[str] = Field(default=None, alias="active_case_id")

    model_config = ConfigDict(populate_by_name=True)

class SystemHostUpdate(BaseModel):
    hostname: Optional[str] = None
    ip: Optional[str] = None
    os: Optional[str] = None
    status: Optional[SystemStatus] = None
    cpuUsage: Optional[float] = Field(default=None, alias="cpu_usage")
    memoryUsage: Optional[float] = Field(default=None, alias="memory_usage")
    activeCaseId: Optional[str] = Field(default=None, alias="active_case_id")
    evidenceCollected: Optional[int] = Field(default=None, alias="evidence_collected")

    model_config = ConfigDict(populate_by_name=True)

class SystemHostResponse(BaseModel):
    id: str
    hostname: str
    ip: str
    os: str
    platform: PlatformType
    version: str
    status: SystemStatus
    lastSeen: str
    agentVersion: str
    cpuUsage: float
    memoryUsage: float
    activeCaseId: Optional[str] = None
    evidenceCollected: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
