from datetime import datetime, timezone
from sqlalchemy import String, Integer, Boolean, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class CompilerRun(Base):
    __tablename__ = "compiler_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    target_platform: Mapped[str] = mapped_column(String(32), default="cross_platform")
    is_valid: Mapped[bool] = mapped_column(Boolean, default=True)
    syntax_status: Mapped[str] = mapped_column(String(64), default="Valid")
    compiler_status: Mapped[str] = mapped_column(String(64), default="Ready")
    operations_count: Mapped[int] = mapped_column(Integer, default=0)
    tokens_count: Mapped[int] = mapped_column(Integer, default=0)
    estimated_evidence_items: Mapped[int] = mapped_column(Integer, default=0)
    ast_json: Mapped[dict] = mapped_column(JSON, default=dict)
    ir_code: Mapped[str] = mapped_column(Text, default="")
    compilation_time_ms: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
