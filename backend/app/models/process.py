from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Process(Base):
    __tablename__ = "processes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    system_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    pid: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    ppid: Mapped[int] = mapped_column(Integer, default=0)
    parent_name: Mapped[str] = mapped_column(String(128), default="System")
    user: Mapped[str] = mapped_column(String(128), default="SYSTEM")
    cpu: Mapped[str] = mapped_column(String(32), default="0.0%")
    memory: Mapped[str] = mapped_column(String(32), default="0.0 MB")
    start_time: Mapped[str] = mapped_column(String(64), default="N/A")
    path: Mapped[str] = mapped_column(String(512), default="")
    sha256: Mapped[str] = mapped_column(String(128), default="")
    risk: Mapped[str] = mapped_column(String(32), default="normal") # critical, high, medium, low, normal, clean, info
    status: Mapped[str] = mapped_column(String(32), default="running") # running, terminated, suspended
    command_line: Mapped[str] = mapped_column(Text, default="")
    connections_count: Mapped[int] = mapped_column(Integer, default=0)
    related_events_count: Mapped[int] = mapped_column(Integer, default=0)
    matched_rules: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
