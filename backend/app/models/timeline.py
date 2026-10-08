from datetime import datetime, timezone
from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    timestamp: Mapped[str] = mapped_column(String(64), nullable=False)
    time_only: Mapped[str] = mapped_column(String(32), default="")
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(32), default="system") # process, file, network, log, finding, system
    severity: Mapped[str] = mapped_column(String(32), default="info")
    user: Mapped[str] = mapped_column(String(128), nullable=True)
    details: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
