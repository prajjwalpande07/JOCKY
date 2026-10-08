from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

ReportFormat = Literal["PDF", "JSON", "CSV"]
ReportStatus = Literal["ready", "generating", "archived"]
ReportType = Literal["Investigation", "Evidence", "Timeline", "System", "Network", "Analysis"]

class ReportGenerateRequest(BaseModel):
    caseId: str = Field(alias="case_id")
    title: Optional[str] = "Forensic Investigation Report"
    format: Optional[ReportFormat] = "PDF"
    reportType: Optional[ReportType] = Field(default="Investigation", alias="report_type")
    investigator: Optional[str] = "Dr. Sarah Chen, CISSP"

    model_config = ConfigDict(populate_by_name=True)

class ReportItemResponse(BaseModel):
    id: str
    caseId: str
    title: str
    created: str
    investigator: str
    format: ReportFormat
    status: ReportStatus
    summary: str
    pagesCount: int
    sizeMb: str
    reportType: ReportType

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
