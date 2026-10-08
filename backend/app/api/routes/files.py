from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.file_artifact import FileArtifact
from app.schemas.file import FileItemResponse

router = APIRouter(prefix="/files", tags=["File Forensics"])

@router.get("", response_model=List[FileItemResponse], summary="List File Artifacts")
def get_files(
    caseId: Optional[str] = Query(None, alias="caseId"),
    investigation_id: Optional[str] = Query(None, alias="investigation_id"),
    system_id: Optional[str] = Query(None, alias="system_id"),
    risk: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(FileArtifact)
    target_case = caseId or investigation_id
    if target_case:
        case_items = query.filter(FileArtifact.case_id == target_case).all()
        files = case_items if case_items else query.all()
    else:
        files = query.all()

    if system_id:
        files = [f for f in files if f.system_id == system_id]
    if risk and risk.lower() != "all":
        files = [f for f in files if f.risk == risk.lower()]
    if search:
        q = search.lower()
        files = [f for f in files if q in f.name.lower() or q in f.path.lower() or q in f.sha256.lower()]

    return [
        {
            "id": f.id,
            "name": f.name,
            "path": f.path,
            "size": f.size,
            "modified": f.modified,
            "sha256": f.sha256,
            "type": f.type,
            "risk": f.risk,
            "relatedProcess": f.related_process,
            "permissions": f.permissions,
            "entropy": f.entropy,
            "evidenceStatus": f.evidence_status,
            "matchedYaraRule": f.matched_yara_rule
        }
        for f in files
    ]

@router.get("/{file_id}", response_model=FileItemResponse, summary="Get Single File Artifact")
def get_file(file_id: str, db: Session = Depends(get_db)):
    f = db.query(FileArtifact).filter(FileArtifact.id == file_id).first()
    if not f:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File artifact not found")
    return {
        "id": f.id,
        "name": f.name,
        "path": f.path,
        "size": f.size,
        "modified": f.modified,
        "sha256": f.sha256,
        "type": f.type,
        "risk": f.risk,
        "relatedProcess": f.related_process,
        "permissions": f.permissions,
        "entropy": f.entropy,
        "evidenceStatus": f.evidence_status,
        "matchedYaraRule": f.matched_yara_rule
    }
