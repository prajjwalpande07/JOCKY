from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.report import Report
from app.schemas.report import ReportItemResponse, ReportGenerateRequest
from app.services.report_service import ReportService
from app.core.security import get_current_user_optional
from app.websocket.events import ws_manager

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportItemResponse], summary="List Forensic Reports")
def get_reports(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    report_type: Optional[str] = Query(None, alias="reportType"),
    db: Session = Depends(get_db)
):
    query = db.query(Report)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(Report.case_id == target_case).all()
        reports = case_items if case_items else query.all()
    else:
        reports = query.order_by(Report.created_at.desc()).all()

    if report_type and report_type.lower() != "all":
        reports = [r for r in reports if r.report_type == report_type]

    return [
        {
            "id": r.id,
            "caseId": r.case_id,
            "title": r.title,
            "created": r.created,
            "investigator": r.investigator,
            "format": r.format,
            "status": r.status,
            "summary": r.summary,
            "pagesCount": r.pages_count,
            "sizeMb": r.size_mb,
            "reportType": r.report_type
        }
        for r in reports
    ]

@router.get("/{report_id}", response_model=ReportItemResponse, summary="Get Single Report Details")
def get_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return {
        "id": r.id,
        "caseId": r.case_id,
        "title": r.title,
        "created": r.created,
        "investigator": r.investigator,
        "format": r.format,
        "status": r.status,
        "summary": r.summary,
        "pagesCount": r.pages_count,
        "sizeMb": r.size_mb,
        "reportType": r.report_type
    }

@router.post("/generate", response_model=ReportItemResponse, status_code=status.HTTP_201_CREATED, summary="Generate Forensic Report")
async def generate_report(
    req: ReportGenerateRequest,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = req.investigator or current_user.get("name", "Dr. Sarah Chen, CISSP")
    r = ReportService.generate_report(
        db,
        case_id=req.caseId,
        title=req.title or "Forensic Investigation Report",
        fmt=req.format or "PDF",
        report_type=req.reportType or "Investigation",
        investigator=user_name
    )

    await ws_manager.broadcast_event("report.generated", {"id": r.id, "case_id": r.case_id, "format": r.format})

    return {
        "id": r.id,
        "caseId": r.case_id,
        "title": r.title,
        "created": r.created,
        "investigator": r.investigator,
        "format": r.format,
        "status": r.status,
        "summary": r.summary,
        "pagesCount": r.pages_count,
        "sizeMb": r.size_mb,
        "reportType": r.report_type
    }

@router.post("", response_model=ReportItemResponse, status_code=status.HTTP_201_CREATED, summary="Create / Trigger Report")
async def create_report(
    req: ReportGenerateRequest,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    return await generate_report(req, current_user, db)

@router.get("/{report_id}/download", summary="Download Report File")
def download_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r or not r.file_path or not Path(r.file_path).exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found on disk")

    media_type = "application/pdf" if r.format == "PDF" else ("application/json" if r.format == "JSON" else "text/csv")
    return FileResponse(r.file_path, media_type=media_type, filename=Path(r.file_path).name)
