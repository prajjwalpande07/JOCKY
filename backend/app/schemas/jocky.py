from typing import Optional, List, Dict, Any, Union, Literal
from pydantic import BaseModel, Field, ConfigDict

PlatformType = Literal["windows", "ubuntu", "cross_platform"]
RiskLevel = Literal["critical", "high", "medium", "low", "normal", "clean", "info"]

class AstNode(BaseModel):
    type: str
    name: Optional[str] = None
    value: Optional[Union[str, int, float, bool]] = None
    children: Optional[List["AstNode"]] = None
    line: Optional[int] = None
    attributes: Optional[Dict[str, Any]] = None

class CompileRequest(BaseModel):
    code: str
    targetPlatform: Optional[PlatformType] = Field(default="cross_platform", alias="target_platform")

    model_config = ConfigDict(populate_by_name=True)

class CompilerResultResponse(BaseModel):
    isValid: bool
    syntaxStatus: str
    compilerStatus: str
    operationsCount: int
    estimatedEvidenceItems: int
    tokensCount: int
    targetPlatform: PlatformType
    ast: AstNode
    irCode: str
    bytecodeInstructions: List[str]
    compilationTimeMs: int
    errors: Optional[List[str]] = None

    model_config = ConfigDict(populate_by_name=True)

class ValidateRequest(BaseModel):
    code: str

class ValidateResponse(BaseModel):
    valid: bool
    errors: List[str]
    warnings: List[str]

class JockyScriptResponse(BaseModel):
    id: str
    name: str
    description: str
    targetPlatform: PlatformType
    code: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class JockyScriptCreate(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = ""
    targetPlatform: Optional[PlatformType] = Field(default="cross_platform", alias="target_platform")
    code: str

    model_config = ConfigDict(populate_by_name=True)

class CorrelationNode(BaseModel):
    id: str
    label: str
    type: Literal["process", "file", "network", "log", "finding"]
    risk: RiskLevel
    details: str
    subtext: str

class CorrelationEdge(BaseModel):
    from_node: str = Field(alias="from")
    to: str
    relationship: str

    model_config = ConfigDict(populate_by_name=True)

class CorrelationGraphResponse(BaseModel):
    nodes: List[CorrelationNode]
    edges: List[CorrelationEdge]

    model_config = ConfigDict(populate_by_name=True)

class FeedbackHistoryItem(BaseModel):
    id: str
    caseId: str
    ruleName: str
    previousVerdict: str
    updatedVerdict: str
    analyst: str
    date: str
    impact: str

class ModuleUpdateItem(BaseModel):
    module: str
    version: str
    releaseDate: str
    changes: str

class ContinuousLearningResponse(BaseModel):
    detectionAccuracy: float
    falsePositiveRate: float
    ruleImprovementsCount: int
    updatedModulesCount: int
    feedbackHistory: List[FeedbackHistoryItem]
    moduleUpdates: List[ModuleUpdateItem]
