from datetime import datetime, timezone
from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class SecurityTest(Base):
    __tablename__ = "security_tests"
    __table_args__ = {'extend_existing': True}

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    test_environment: Mapped[str] = mapped_column(String(128), default="Windows Sandbox")
    scenario_type: Mapped[str] = mapped_column(String(128), default="Process Lineage")
    expected_result: Mapped[str] = mapped_column(Text, default="")
    observed_result: Mapped[str] = mapped_column(Text, default="")
    telemetry: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(32), default="PASSED") # PASSED, WARNING, FAILED
    execution_time_ms: Mapped[int] = mapped_column(Integer, default=0)
    timestamp: Mapped[str] = mapped_column(String(64), default="")
    evidence_items_collected: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
