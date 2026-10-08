from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict

RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
FindingStatus = Literal["under_review", "confirmed", "false_positive", "closed"]

class FindingCreate(BaseModel):
    id: Optional[str] = None
    caseId: str = Field(alias="case_id")
    title: str
    severity: Optional[RiskLevel] = "medium"
    confidence: Optional[int] = 80
    relatedEvidenceCount: Optional[int] = Field(default=0, alias="related_evidence_count")
    relatedEventsCount: Optional[int] = Field(default=0, alias="related_events_count")
    status: Optional[FindingStatus] = "under_review"
    detectedAt: Optional[str] = Field(default="", alias="detected_at")
    ruleId: Optional[str] = Field(default="JOCKY-RULE-GEN-001", alias="rule_id")
    ruleName: Optional[str] = Field(default="General Forensic Anomaly", alias="rule_name")
    description: Optional[str] = ""
    recommendation: Optional[str] = ""
    investigatorNotes: Optional[List[str]] = Field(default_factory=list, alias="investigator_notes")

    model_config = ConfigDict(populate_by_name=True)

class FindingUpdate(BaseModel):
    title: Optional[str] = None
    severity: Optional[RiskLevel] = None
    confidence: Optional[int] = None
    status: Optional[FindingStatus] = None
    note: Optional[str] = None
    investigatorNotes: Optional[List[str]] = Field(default=None, alias="investigator_notes")
    description: Optional[str] = None
    recommendation: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)

class FindingResponse(BaseModel):
    id: str
    caseId: str
    title: str
    severity: RiskLevel
    confidence: int
    relatedEvidenceCount: int
    relatedEventsCount: int
    status: FindingStatus
    detectedAt: str
    ruleId: str
    ruleName: str
    description: str
    recommendation: str
    investigatorNotes: List[str]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
