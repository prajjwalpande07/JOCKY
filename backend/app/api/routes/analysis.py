from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.jocky import CorrelationGraphResponse, ContinuousLearningResponse
from app.services.analysis_service import AnalysisService
from app.services.collection_service import CollectionService
from app.core.security import get_current_user_optional

router = APIRouter(tags=["Analysis & Continuous Learning"])

# Frontend /api/correlation
@router.get("/correlation", response_model=CorrelationGraphResponse, summary="Get Correlation Graph Data")
def get_correlation(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    db: Session = Depends(get_db)
):
    target = caseId or investigation_id or "JCK-2026-001"
    return AnalysisService.get_case_graph(db, target)

# Standard /api/analysis/graph/{investigation_id}
@router.get("/analysis/graph/{investigation_id}", response_model=CorrelationGraphResponse, summary="Get Investigation Graph")
def get_analysis_graph(investigation_id: str, db: Session = Depends(get_db)):
    return AnalysisService.get_case_graph(db, investigation_id)

@router.get("/analysis/graph", response_model=CorrelationGraphResponse, summary="Get General Correlation Graph")
def get_analysis_graph_general(db: Session = Depends(get_db)):
    return AnalysisService.get_case_graph(db, "JCK-2026-001")

# Frontend /api/learning
@router.get("/learning", response_model=ContinuousLearningResponse, summary="Continuous Learning & Feedback Loop")
def get_learning():
    return AnalysisService.get_continuous_learning()

@router.get("/analysis/learning", response_model=ContinuousLearningResponse, summary="Continuous Learning Metrics")
def get_analysis_learning():
    return AnalysisService.get_continuous_learning()

@router.get("/analysis/anomaly/{investigation_id}", summary="Run Anomaly Detection on Case")
def get_case_anomalies(investigation_id: str, db: Session = Depends(get_db)):
    return AnalysisService.detect_anomalies(db, investigation_id)

@router.post("/analysis/collect/{case_id}", summary="Trigger Live Forensic Acquisition")
def run_collection(
    case_id: str,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    return CollectionService.run_live_collection(db, case_id, user=user_name)
