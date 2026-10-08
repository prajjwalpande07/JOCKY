from typing import List
from pydantic import BaseModel, ConfigDict
from app.schemas.investigation import InvestigationResponse

class InvestigationActivityItem(BaseModel):
    date: str
    open: int
    resolved: int
    events: int

class FindingSeverityItem(BaseModel):
    severity: str
    count: int
    color: str

class EvidenceDistributionItem(BaseModel):
    name: str
    count: int
    percentage: float
    color: str

class PlatformDistributionItem(BaseModel):
    platform: str
    count: int
    percentage: float

class DashboardSummaryResponse(BaseModel):
    activeInvestigations: int
    connectedSystems: int
    evidenceItems: int
    findings: int
    networkEvents: int
    criticalAlerts: int
    investigationActivity: List[InvestigationActivityItem]
    findingsBySeverity: List[FindingSeverityItem]
    evidenceDistribution: List[EvidenceDistributionItem]
    platformDistribution: List[PlatformDistributionItem]
    recentInvestigations: List[InvestigationResponse]

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
