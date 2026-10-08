from datetime import datetime, timezone
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class NetworkConnection(Base):
    __tablename__ = "network_connections"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    system_id: Mapped[str] = mapped_column(String(64), index=True, nullable=True)
    source_ip: Mapped[str] = mapped_column(String(64), nullable=False)
    source_port: Mapped[int] = mapped_column(Integer, nullable=False)
    dest_ip: Mapped[str] = mapped_column(String(64), nullable=False)
    dest_port: Mapped[int] = mapped_column(Integer, nullable=False)
    protocol: Mapped[str] = mapped_column(String(32), default="TCP") # TCP, UDP, TLS, HTTP, DNS
    process_name: Mapped[str] = mapped_column(String(128), default="System")
    pid: Mapped[int] = mapped_column(Integer, default=0)
    timestamp: Mapped[str] = mapped_column(String(64), default="")
    status: Mapped[str] = mapped_column(String(32), default="ESTABLISHED") # ESTABLISHED, CLOSE_WAIT, SYN_SENT, LISTENING
    risk: Mapped[str] = mapped_column(String(32), default="normal")
    destination_geo: Mapped[str] = mapped_column(String(128), default="Internal / LAN")
    bytes_transferred: Mapped[str] = mapped_column(String(64), default="0 B")
    suspicious_indicator: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
