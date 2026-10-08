from typing import Optional, Union, Literal
from pydantic import BaseModel, Field, ConfigDict

RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
LogSource = Literal["System", "Application", "Security", "Network", "Auditd"]

class LogEntryCreate(BaseModel):
    id: Optional[str] = None
    timestamp: Optional[str] = ""
    source: Optional[LogSource] = "System"
    eventId: Optional[Union[int, str]] = Field(default="0", alias="event_id")
    message: str
    severity: Optional[RiskLevel] = "info"
    relatedProcess: Optional[str] = Field(default=None, alias="related_process")
    user: Optional[str] = "SYSTEM"
    raw: Optional[str] = None
    caseId: Optional[str] = Field(default=None, alias="case_id")
    systemId: Optional[str] = Field(default=None, alias="system_id")

    model_config = ConfigDict(populate_by_name=True)

class LogEntryResponse(BaseModel):
    id: str
    timestamp: str
    source: LogSource
    eventId: Union[int, str]
    message: str
    severity: RiskLevel
    relatedProcess: Optional[str] = None
    user: str
    raw: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
