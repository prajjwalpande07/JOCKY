from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardSummaryResponse, summary="Get Dashboard Summary Analytics")
def get_dashboard(db: Session = Depends(get_db)):
    """Returns aggregated forensic dashboard summary matching the frontend schema."""
    return DashboardService.get_summary(db)
