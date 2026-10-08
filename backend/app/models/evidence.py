from datetime import datetime, timezone
from sqlalchemy import String, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[str] = mapped_column(String(64), primary_key=True) # e.g. EVD-001
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    system_id: Mapped[str] = mapped_column(String(64), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    source: Mapped[str] = mapped_column(String(64), default="File") # Process, File, Network, Log, System Metadata
    timestamp: Mapped[str] = mapped_column(String(64), default="")
    sha256: Mapped[str] = mapped_column(String(128), default="")
    collection_status: Mapped[str] = mapped_column(String(32), default="collected") # collected, verified, exported
    integrity_status: Mapped[str] = mapped_column(String(32), default="verified") # verified, requires_review, failed
    collector_agent: Mapped[str] = mapped_column(String(128), default="JOCKY-Collector-v2.4")
    size_bytes: Mapped[str] = mapped_column(String(64), default="0 B")
    chain_of_custody: Mapped[list] = mapped_column(JSON, default=list)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
