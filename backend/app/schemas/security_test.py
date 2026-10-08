from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

TestEnv = Literal["Windows Sandbox", "Ubuntu Test VM", "Isolated Forensics Lab"]
TestStatus = Literal["PASSED", "WARNING", "FAILED"]

class SecurityTestCreate(BaseModel):
    id: Optional[str] = None
    name: str
    testEnvironment: Optional[TestEnv] = Field(default="Windows Sandbox", alias="test_environment")
    scenarioType: Optional[str] = Field(default="Process Lineage", alias="scenario_type")
    expectedResult: Optional[str] = Field(default="", alias="expected_result")
    observedResult: Optional[str] = Field(default="", alias="observed_result")
    telemetry: Optional[str] = ""
    status: Optional[TestStatus] = "PASSED"
    executionTimeMs: Optional[int] = Field(default=120, alias="execution_time_ms")
    timestamp: Optional[str] = ""
    evidenceItemsCollected: Optional[int] = Field(default=0, alias="evidence_items_collected")

    model_config = ConfigDict(populate_by_name=True)

class ValidationScenarioResponse(BaseModel):
    id: str
    name: str
    testEnvironment: TestEnv
    scenarioType: str
    expectedResult: str
    observedResult: str
    telemetry: str
    status: TestStatus
    executionTimeMs: int
    timestamp: str
    evidenceItemsCollected: int

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
