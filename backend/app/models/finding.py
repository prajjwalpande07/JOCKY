from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Finding(Base):
    __tablename__ = "findings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True) # e.g. FND-001
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="medium")
    confidence: Mapped[int] = mapped_column(Integer, default=80)
    related_evidence_count: Mapped[int] = mapped_column(Integer, default=0)
    related_events_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), default="under_review") # under_review, confirmed, false_positive, closed
    detected_at: Mapped[str] = mapped_column(String(64), default="")
    rule_id: Mapped[str] = mapped_column(String(64), default="JOCKY-RULE-GEN-001")
    rule_name: Mapped[str] = mapped_column(String(255), default="General Forensic Anomaly")
    description: Mapped[str] = mapped_column(Text, default="")
    recommendation: Mapped[str] = mapped_column(Text, default="")
    investigator_notes: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
