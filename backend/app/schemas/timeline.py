from typing import Optional, Dict, Literal
from pydantic import BaseModel, Field, ConfigDict

RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
TimelineCategory = Literal["process", "file", "network", "log", "finding", "system"]

class TimelineEventCreate(BaseModel):
    id: Optional[str] = None
    caseId: str = Field(alias="case_id")
    timestamp: str
    timeOnly: Optional[str] = Field(default="", alias="time_only")
    title: str
    description: Optional[str] = ""
    category: Optional[TimelineCategory] = "system"
    severity: Optional[RiskLevel] = "info"
    user: Optional[str] = None
    details: Optional[Dict[str, str]] = Field(default_factory=dict)

    model_config = ConfigDict(populate_by_name=True)

class TimelineEventResponse(BaseModel):
    id: str
    timestamp: str
    timeOnly: str
    title: str
    description: str
    category: TimelineCategory
    severity: RiskLevel
    user: Optional[str] = None
    details: Dict[str, str]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
