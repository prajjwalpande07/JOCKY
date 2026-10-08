from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.jocky_script import JockyScript
from app.models.compiler_run import CompilerRun
from app.jocky.compiler import JockyCompiler
from app.jocky.validator import JockyValidator
from app.services.audit_service import AuditService

class JockyService:
    @staticmethod
    def get_scripts(db: Session) -> List[JockyScript]:
        return db.query(JockyScript).all()

    @staticmethod
    def get_script_by_id(db: Session, script_id: str) -> Optional[JockyScript]:
        return db.query(JockyScript).filter(JockyScript.id == script_id).first()

    @staticmethod
    def compile_script(
        db: Session,
        code: str,
        target_platform: str = "cross_platform",
        user: str = "Dr. Sarah Chen, CISSP"
    ) -> Dict[str, Any]:
        result = JockyCompiler.compile(code, target_platform=target_platform)

        # Record compiler run in database
        run = CompilerRun(
            target_platform=target_platform,
            is_valid=result["isValid"],
            syntax_status=result["syntaxStatus"],
            compiler_status=result["compilerStatus"],
            operations_count=result["operationsCount"],
            tokens_count=result["tokensCount"],
            estimated_evidence_items=result["estimatedEvidenceItems"],
            ast_json=result["ast"],
            ir_code=result["irCode"],
            compilation_time_ms=result["compilationTimeMs"]
        )
        db.add(run)
        db.commit()

        AuditService.create_log(
            db,
            action="JOCKY DSL Compilation",
            object_name="Compiler Pipeline",
            user=user,
            result="SUCCESS" if result["isValid"] else "FAILED",
            details=f"Compiled {result['operationsCount']} operations targetting {target_platform} in {result['compilationTimeMs']}ms"
        )

        return result

    @staticmethod
    def validate_script(code: str) -> Dict[str, Any]:
        return JockyValidator.validate(code)
