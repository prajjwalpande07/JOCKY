from datetime import datetime, timezone
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class LogEvent(Base):
    __tablename__ = "log_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    system_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    timestamp: Mapped[str] = mapped_column(String(64), nullable=False)
    source: Mapped[str] = mapped_column(String(64), default="System") # System, Application, Security, Network, Auditd
    event_id: Mapped[str] = mapped_column(String(64), default="0")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="info")
    related_process: Mapped[str] = mapped_column(String(255), nullable=True)
    user: Mapped[str] = mapped_column(String(128), default="SYSTEM")
    raw: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
