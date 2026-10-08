from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

AuditResult = Literal["SUCCESS", "FAILED", "VERIFIED", "WARNING"]

class AuditLogCreate(BaseModel):
    id: Optional[str] = None
    user: Optional[str] = "Dr. Sarah Chen, CISSP"
    action: str
    caseId: Optional[str] = Field(default="GLOBAL", alias="case_id")
    object: str
    result: Optional[AuditResult] = "SUCCESS"
    details: Optional[str] = ""
    hash: Optional[str] = ""

    model_config = ConfigDict(populate_by_name=True)

class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    user: str
    action: str
    caseId: str
    object: str
    result: AuditResult
    details: str
    hash: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
