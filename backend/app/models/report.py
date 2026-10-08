from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    created: Mapped[str] = mapped_column(String(64), default="")
    investigator: Mapped[str] = mapped_column(String(128), default="Dr. Sarah Chen, CISSP")
    format: Mapped[str] = mapped_column(String(32), default="PDF") # PDF, JSON, CSV
    status: Mapped[str] = mapped_column(String(32), default="ready") # ready, generating, archived
    summary: Mapped[str] = mapped_column(Text, default="")
    pages_count: Mapped[int] = mapped_column(Integer, default=1)
    size_mb: Mapped[str] = mapped_column(String(32), default="0.5 MB")
    report_type: Mapped[str] = mapped_column(String(64), default="Investigation")
    file_path: Mapped[str] = mapped_column(String(512), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
