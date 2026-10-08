from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict

EvidenceSource = Literal["Process", "File", "Network", "Log", "System Metadata"]
CollectionStatus = Literal["collected", "verified", "exported"]
IntegrityStatus = Literal["verified", "requires_review", "failed"]

class CustodyStep(BaseModel):
    step: int
    action: str
    timestamp: str
    actor: str
    hash: str
    notes: str

class EvidenceCreate(BaseModel):
    id: Optional[str] = None
    caseId: str = Field(alias="case_id")
    systemId: Optional[str] = Field(default=None, alias="system_id")
    title: str
    source: Optional[EvidenceSource] = "File"
    timestamp: Optional[str] = ""
    sha256: Optional[str] = ""
    collectionStatus: Optional[CollectionStatus] = Field(default="collected", alias="collection_status")
    integrityStatus: Optional[IntegrityStatus] = Field(default="verified", alias="integrity_status")
    collectorAgent: Optional[str] = Field(default="JOCKY-Collector-v2.4", alias="collector_agent")
    sizeBytes: Optional[str] = Field(default="0 B", alias="size_bytes")
    chainOfCustody: Optional[List[CustodyStep]] = Field(default_factory=list, alias="chain_of_custody")

    model_config = ConfigDict(populate_by_name=True)

class EvidenceItemResponse(BaseModel):
    id: str
    caseId: str
    title: str
    source: EvidenceSource
    timestamp: str
    sha256: str
    collectionStatus: CollectionStatus
    integrityStatus: IntegrityStatus
    collectorAgent: str
    sizeBytes: str
    chainOfCustody: List[CustodyStep]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class EvidenceVerifyResponse(BaseModel):
    id: str
    verified: bool
    sha256: str
    integrityStatus: IntegrityStatus
    message: str
