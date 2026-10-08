from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Investigation(Base):
    __tablename__ = "investigations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True) # e.g. JCK-2026-001
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    target_system: Mapped[str] = mapped_column(String(128), default="WIN-FORENSIC-01")
    platform: Mapped[str] = mapped_column(String(32), default="windows") # windows, ubuntu, cross_platform
    created_date: Mapped[str] = mapped_column(String(32), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"))
    investigator: Mapped[str] = mapped_column(String(128), default="Dr. Sarah Chen, CISSP")
    risk: Mapped[str] = mapped_column(String(32), default="medium") # critical, high, medium, low, normal, clean, info
    status: Mapped[str] = mapped_column(String(32), default="open") # open, collecting, analyzing, review, completed, archived
    evidence_count: Mapped[int] = mapped_column(Integer, default=0)
    events_count: Mapped[int] = mapped_column(Integer, default=0)
    findings_count: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str] = mapped_column(Text, default="")
    risk_score: Mapped[int] = mapped_column(Integer, default=50)
    collection_progress: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
