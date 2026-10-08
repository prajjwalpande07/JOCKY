from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.jocky import CompileRequest, CompilerResultResponse
from app.services.jocky_service import JockyService
from app.core.security import get_current_user_optional

router = APIRouter(prefix="/compiler", tags=["Compiler Pipeline"])

@router.post("/compile", response_model=CompilerResultResponse, summary="Compile JOCKY DSL Script")
def compile_dsl(
    req: CompileRequest,
    current_user: dict = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    user_name = current_user.get("name", "Dr. Sarah Chen, CISSP")
    return JockyService.compile_script(
        db,
        code=req.code,
        target_platform=req.targetPlatform or "cross_platform",
        user=user_name
    )
