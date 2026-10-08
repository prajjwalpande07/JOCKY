// JOCKY Forensic Analysis & Threat Hunting Framework — TypeScript Type Definitions

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'normal' | 'clean' | 'info';

export type InvestigationStatus = 'open' | 'collecting' | 'analyzing' | 'review' | 'completed' | 'archived';

export type PlatformType = 'windows' | 'ubuntu' | 'cross_platform';

export type IntegrityStatus = 'verified' | 'requires_review' | 'failed';

export interface Investigation {
  id: string;
  title: string;
  targetSystem: string;
  platform: PlatformType;
  createdDate: string;
  investigator: string;
  risk: RiskLevel;
  status: InvestigationStatus;
  evidenceCount: number;
  eventsCount: number;
  findingsCount: number;
  description: string;
  riskScore: number;
  collectionProgress: number;
}

export interface SystemHost {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  platform: 'windows' | 'ubuntu';
  version: string;
  status: 'online' | 'offline' | 'collecting' | 'warning';
  lastSeen: string;
  agentVersion: string;
  cpuUsage: number;
  memoryUsage: number;
  activeCaseId?: string;
  evidenceCollected: number;
}

export interface ProcessItem {
  pid: number;
  name: string;
  ppid: number;
  parentName: string;
  user: string;
  cpu: string;
  memory: string;
  startTime: string;
  path: string;
  sha256: string;
  risk: RiskLevel;
  status: 'running' | 'terminated' | 'suspended';
  commandLine: string;
  connectionsCount: number;
  relatedEventsCount: number;
  matchedRules?: string[];
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: string;
  modified: string;
  sha256: string;
  type: string;
  risk: RiskLevel;
  relatedProcess?: string;
  permissions: string;
  entropy: number;
  evidenceStatus: 'cataloged' | 'analyzed' | 'flagged' | 'quarantined';
  matchedYaraRule?: string;
}

export interface NetworkConnection {
  id: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  protocol: 'TCP' | 'UDP' | 'TLS' | 'HTTP' | 'DNS';
  processName: string;
  pid: number;
  timestamp: string;
  status: 'ESTABLISHED' | 'CLOSE_WAIT' | 'SYN_SENT' | 'LISTENING';
  risk: RiskLevel;
  destinationGeo: string;
  bytesTransferred: string;
  suspiciousIndicator?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'System' | 'Application' | 'Security' | 'Network' | 'Auditd';
  eventId: number | string;
  message: string;
  severity: RiskLevel;
  relatedProcess?: string;
  user: string;
  raw?: string;
}

export interface CustodyStep {
  step: number;
  action: string;
  timestamp: string;
  actor: string;
  hash: string;
  notes: string;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  source: 'Process' | 'File' | 'Network' | 'Log' | 'System Metadata';
  timestamp: string;
  sha256: string;
  collectionStatus: 'collected' | 'verified' | 'exported';
  integrityStatus: IntegrityStatus;
  collectorAgent: string;
  sizeBytes: string;
  chainOfCustody: CustodyStep[];
}

export interface Finding {
  id: string;
  caseId: string;
  title: string;
  severity: RiskLevel;
  confidence: number;
  relatedEvidenceCount: number;
  relatedEventsCount: number;
  status: 'under_review' | 'confirmed' | 'false_positive';
  detectedAt: string;
  ruleId: string;
  ruleName: string;
  description: string;
  recommendation: string;
  investigatorNotes: string[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeOnly: string;
  title: string;
  description: string;
  category: 'process' | 'file' | 'network' | 'log' | 'finding' | 'system';
  severity: RiskLevel;
  user?: string;
  details: Record<string, string>;
}

export interface ReportItem {
  id: string;
  caseId: string;
  title: string;
  created: string;
  investigator: string;
  format: 'PDF' | 'JSON' | 'CSV';
  status: 'ready' | 'generating' | 'archived';
  summary: string;
  pagesCount: number;
  sizeMb: string;
  reportType: 'Investigation' | 'Evidence' | 'Timeline' | 'System' | 'Network' | 'Analysis';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  caseId: string;
  object: string;
  result: 'SUCCESS' | 'FAILED' | 'VERIFIED' | 'WARNING';
  details: string;
  hash: string;
}

export interface ValidationScenario {
  id: string;
  name: string;
  testEnvironment: 'Windows Sandbox' | 'Ubuntu Test VM' | 'Isolated Forensics Lab';
  scenarioType: string;
  expectedResult: string;
  observedResult: string;
  telemetry: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  executionTimeMs: number;
  timestamp: string;
  evidenceItemsCollected: number;
}

export interface AstNode {
  type: string;
  name?: string;
  value?: string | number | boolean;
  children?: AstNode[];
  line?: number;
  attributes?: Record<string, any>;
}

export interface CompilerResult {
  isValid: boolean;
  syntaxStatus: string;
  compilerStatus: string;
  operationsCount: number;
  estimatedEvidenceItems: number;
  tokensCount: number;
  targetPlatform: PlatformType;
  ast: AstNode;
  irCode: string;
  bytecodeInstructions: string[];
  compilationTimeMs: number;
  errors?: string[];
}

export interface JockyScriptFile {
  id: string;
  name: string;
  description: string;
  targetPlatform: PlatformType;
  code: string;
}

export interface CorrelationNode {
  id: string;
  label: string;
  type: 'process' | 'file' | 'network' | 'log' | 'finding';
  risk: RiskLevel;
  details: string;
  subtext: string;
}

export interface CorrelationEdge {
  from: string;
  to: string;
  relationship: string;
}

export interface CorrelationGraphData {
  nodes: CorrelationNode[];
  edges: CorrelationEdge[];
}

export interface ContinuousLearningData {
  detectionAccuracy: number;
  falsePositiveRate: number;
  ruleImprovementsCount: number;
  updatedModulesCount: number;
  feedbackHistory: {
    id: string;
    caseId: string;
    ruleName: string;
    previousVerdict: string;
    updatedVerdict: string;
    analyst: string;
    date: string;
    impact: string;
  }[];
  moduleUpdates: {
    module: string;
    version: string;
    releaseDate: string;
    changes: string;
  }[];
}

export interface DashboardSummary {
  activeInvestigations: number;
  connectedSystems: number;
  evidenceItems: number;
  findings: number;
  networkEvents: number;
  criticalAlerts: number;
  investigationActivity: { date: string; open: number; resolved: number; events: number }[];
  findingsBySeverity: { severity: string; count: number; color: string }[];
  evidenceDistribution: { name: string; count: number; percentage: number; color: string }[];
  platformDistribution: { platform: string; count: number; percentage: number }[];
  recentInvestigations: Investigation[];
}
