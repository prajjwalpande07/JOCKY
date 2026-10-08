from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.jocky_script import JockyScript
from app.schemas.jocky import (
    JockyScriptResponse,
    JockyScriptCreate,
    CompileRequest,
    CompilerResultResponse,
    ValidateRequest,
    ValidateResponse
)
from app.services.jocky_service import JockyService
from app.core.security import get_current_user_optional

router = APIRouter(prefix="/jocky", tags=["JOCKY DSL & Compiler"])

@router.get("/scripts", response_model=List[JockyScriptResponse], summary="List JOCKY Script Files")
def get_scripts(db: Session = Depends(get_db)):
    scripts = JockyService.get_scripts(db)
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "targetPlatform": s.target_platform,
            "code": s.code
        }
        for s in scripts
    ]

@router.get("/scripts/{script_id}", response_model=JockyScriptResponse, summary="Get Single JOCKY Script")
def get_script(script_id: str, db: Session = Depends(get_db)):
    s = JockyService.get_script_by_id(db, script_id)
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="JOCKY script not found")
    return {
        "id": s.id,
        "name": s.name,
        "description": s.description,
        "targetPlatform": s.target_platform,
        "code": s.code
    }

@router.post("/scripts", response_model=JockyScriptResponse, status_code=status.HTTP_201_CREATED, summary="Create / Save JOCKY Script")
def save_script(data: JockyScriptCreate, db: Session = Depends(get_db)):
    script_id = data.id or f"SCR-{str(db.query(JockyScript).count() + 1).zfill(3)}"
    existing = db.query(JockyScript).filter(JockyScript.id == script_id).first()
    if existing:
        existing.name = data.name
        existing.description = data.description
        existing.target_platform = data.targetPlatform or "cross_platform"
        existing.code = data.code
        db.commit()
        db.refresh(existing)
        s = existing
    else:
        s = JockyScript(
            id=script_id,
            name=data.name,
            description=data.description or "",
            target_platform=data.targetPlatform or "cross_platform",
            code=data.code
        )
        db.add(s)
        db.commit()
        db.refresh(s)

    return {
        "id": s.id,
        "name": s.name,
        "description": s.description,
        "targetPlatform": s.target_platform,
        "code": s.code
    }

@router.post("/compile", response_model=CompilerResultResponse, summary="Compile JOCKY DSL Script")
def compile_script(
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

@router.post("/validate", response_model=ValidateResponse, summary="Validate JOCKY DSL Script Syntax & Safety")
def validate_script(req: ValidateRequest):
    return JockyService.validate_script(req.code)
