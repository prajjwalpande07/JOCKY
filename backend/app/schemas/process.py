from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict

RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
ProcessStatus = Literal["running", "terminated", "suspended"]

class ProcessItemCreate(BaseModel):
    pid: int
    name: str
    ppid: Optional[int] = 0
    parentName: Optional[str] = Field(default="System", alias="parent_name")
    user: Optional[str] = "SYSTEM"
    cpu: Optional[str] = "0.0%"
    memory: Optional[str] = "0.0 MB"
    startTime: Optional[str] = Field(default="N/A", alias="start_time")
    path: Optional[str] = ""
    sha256: Optional[str] = ""
    risk: Optional[RiskLevel] = "normal"
    status: Optional[ProcessStatus] = "running"
    commandLine: Optional[str] = Field(default="", alias="command_line")
    connectionsCount: Optional[int] = Field(default=0, alias="connections_count")
    relatedEventsCount: Optional[int] = Field(default=0, alias="related_events_count")
    matchedRules: Optional[List[str]] = Field(default_factory=list, alias="matched_rules")
    caseId: Optional[str] = Field(default=None, alias="case_id")
    systemId: Optional[str] = Field(default=None, alias="system_id")

    model_config = ConfigDict(populate_by_name=True)

class ProcessItemResponse(BaseModel):
    pid: int
    name: str
    ppid: int
    parentName: str
    user: str
    cpu: str
    memory: str
    startTime: str
    path: str
    sha256: str
    risk: RiskLevel
    status: ProcessStatus
    commandLine: str
    connectionsCount: int
    relatedEventsCount: int
    matchedRules: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
