from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class SystemHost(Base):
    __tablename__ = "systems"

    id: Mapped[str] = mapped_column(String(64), primary_key=True) # e.g. SYS-WIN-01
    hostname: Mapped[str] = mapped_column(String(128), nullable=False)
    ip: Mapped[str] = mapped_column(String(64), nullable=False)
    os: Mapped[str] = mapped_column(String(128), nullable=False)
    platform: Mapped[str] = mapped_column(String(32), nullable=False) # windows, ubuntu
    version: Mapped[str] = mapped_column(String(64), default="JOCKY-Collector-v2.4.0")
    status: Mapped[str] = mapped_column(String(32), default="online") # online, offline, collecting, warning
    last_seen: Mapped[str] = mapped_column(String(64), default="Just now")
    agent_version: Mapped[str] = mapped_column(String(64), default="2.4.0")
    cpu_usage: Mapped[float] = mapped_column(Float, default=0.0)
    memory_usage: Mapped[float] = mapped_column(Float, default=0.0)
    active_case_id: Mapped[str] = mapped_column(String(64), nullable=True)
    evidence_collected: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
