from datetime import datetime, timezone
from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    timestamp: Mapped[str] = mapped_column(String(64), nullable=False)
    user: Mapped[str] = mapped_column(String(128), default="Dr. Sarah Chen, CISSP")
    action: Mapped[str] = mapped_column(String(128), nullable=False)
    case_id: Mapped[str] = mapped_column(String(64), index=True, default="GLOBAL")
    object: Mapped[str] = mapped_column(String(255), nullable=False)
    result: Mapped[str] = mapped_column(String(32), default="SUCCESS") # SUCCESS, FAILED, VERIFIED, WARNING
    details: Mapped[str] = mapped_column(Text, default="")
    hash: Mapped[str] = mapped_column(String(128), default="")
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
