from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]
EvidenceStatus = Literal["cataloged", "analyzed", "flagged", "quarantined", "verified"]

class FileItemCreate(BaseModel):
    id: Optional[str] = None
    name: str
    path: str
    size: Optional[str] = "0 B"
    modified: Optional[str] = ""
    sha256: Optional[str] = ""
    type: Optional[str] = "Binary"
    risk: Optional[RiskLevel] = "clean"
    relatedProcess: Optional[str] = Field(default=None, alias="related_process")
    permissions: Optional[str] = "rw-r--r--"
    entropy: Optional[float] = 0.0
    evidenceStatus: Optional[EvidenceStatus] = Field(default="cataloged", alias="evidence_status")
    matchedYaraRule: Optional[str] = Field(default=None, alias="matched_yara_rule")
    caseId: Optional[str] = Field(default=None, alias="case_id")
    systemId: Optional[str] = Field(default=None, alias="system_id")

    model_config = ConfigDict(populate_by_name=True)

class FileItemResponse(BaseModel):
    id: str
    name: str
    path: str
    size: str
    modified: str
    sha256: str
    type: str
    risk: RiskLevel
    relatedProcess: Optional[str] = None
    permissions: str
    entropy: float
    evidenceStatus: EvidenceStatus
    matchedYaraRule: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
