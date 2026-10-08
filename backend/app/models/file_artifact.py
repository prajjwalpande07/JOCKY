from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class FileArtifact(Base):
    __tablename__ = "file_artifacts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True) # e.g. FILE-001
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    system_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    path: Mapped[str] = mapped_column(String(1024), nullable=False)
    size: Mapped[str] = mapped_column(String(64), default="0 B")
    modified: Mapped[str] = mapped_column(String(64), default="")
    sha256: Mapped[str] = mapped_column(String(128), default="")
    type: Mapped[str] = mapped_column(String(64), default="Binary")
    risk: Mapped[str] = mapped_column(String(32), default="clean")
    related_process: Mapped[str] = mapped_column(String(255), nullable=True)
    permissions: Mapped[str] = mapped_column(String(64), default="rw-r--r--")
    entropy: Mapped[float] = mapped_column(Float, default=0.0)
    evidence_status: Mapped[str] = mapped_column(String(64), default="cataloged") # cataloged, analyzed, flagged, quarantined
    matched_yara_rule: Mapped[str] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
