from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

PlatformType = Literal["windows", "ubuntu", "cross_platform"]
RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
InvestigationStatus = Literal["open", "collecting", "analyzing", "review", "completed", "archived"]

class InvestigationCreate(BaseModel):
    title: str
    targetSystem: Optional[str] = Field(default="WIN-FORENSIC-01", alias="target_system")
    platform: Optional[PlatformType] = "windows"
    investigator: Optional[str] = "Dr. Sarah Chen, CISSP"
    risk: Optional[RiskLevel] = "medium"
    status: Optional[InvestigationStatus] = "open"
    description: Optional[str] = "Forensic investigation triage initiated via JOCKY Command Center."

    model_config = ConfigDict(populate_by_name=True)

class InvestigationUpdate(BaseModel):
    title: Optional[str] = None
    targetSystem: Optional[str] = Field(default=None, alias="target_system")
    platform: Optional[PlatformType] = None
    investigator: Optional[str] = None
    risk: Optional[RiskLevel] = None
    status: Optional[InvestigationStatus] = None
    description: Optional[str] = None
    riskScore: Optional[int] = Field(default=None, alias="risk_score")
    collectionProgress: Optional[int] = Field(default=None, alias="collection_progress")

    model_config = ConfigDict(populate_by_name=True)

class InvestigationResponse(BaseModel):
    id: str
    title: str
    targetSystem: str
    platform: PlatformType
    createdDate: str
    investigator: str
    risk: RiskLevel
    status: InvestigationStatus
    evidenceCount: int
    eventsCount: int
    findingsCount: int
    description: str
    riskScore: int
    collectionProgress: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
