import {
  DashboardSummary,
  Investigation,
  SystemHost,
  ProcessItem,
  FileItem,
  NetworkConnection,
  LogEntry,
  EvidenceItem,
  Finding,
  TimelineEvent,
  ReportItem,
  AuditLog,
  ValidationScenario,
  JockyScriptFile,
  CompilerResult,
  AstNode,
  PlatformType,
  CorrelationGraphData,
  ContinuousLearningData
} from '../types';

import {
  MOCK_DASHBOARD_SUMMARY,
  MOCK_INVESTIGATIONS,
  MOCK_SYSTEMS,
  MOCK_PROCESSES,
  MOCK_FILES,
  MOCK_NETWORK_CONNECTIONS,
  MOCK_LOGS,
  MOCK_EVIDENCE,
  MOCK_FINDINGS,
  MOCK_TIMELINE,
  MOCK_REPORTS,
  MOCK_AUDIT_LOGS,
  MOCK_VALIDATION_SCENARIOS,
  MOCK_JOCKY_SCRIPTS,
  MOCK_CORRELATION_GRAPH,
  MOCK_CONTINUOUS_LEARNING
} from './mockData';

// Simulated latency to mirror real FastAPI async behavior
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

// Central In-Memory Store
let investigations = [...MOCK_INVESTIGATIONS];
let findings = [...MOCK_FINDINGS];
let evidence = [...MOCK_EVIDENCE];
let auditLogs = [...MOCK_AUDIT_LOGS];

export const api = {
  // Dashboard Endpoint: GET /api/dashboard
  async getDashboard(): Promise<DashboardSummary> {
    await delay();
    return {
      ...MOCK_DASHBOARD_SUMMARY,
      activeInvestigations: investigations.filter(i => i.status !== 'completed' && i.status !== 'archived').length,
      findings: findings.length,
      recentInvestigations: investigations.slice(0, 5)
    };
  },

  // Investigations Endpoint: GET /api/investigations
  async getInvestigations(filter?: { status?: string; platform?: string; search?: string }): Promise<Investigation[]> {
    await delay();
    let result = [...investigations];
    if (filter?.status && filter.status !== 'all') {
      result = result.filter(inv => inv.status.toLowerCase() === filter.status?.toLowerCase());
    }
    if (filter?.platform && filter.platform !== 'all') {
      result = result.filter(inv => inv.platform.toLowerCase() === filter.platform?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(inv =>
        inv.id.toLowerCase().includes(q) ||
        inv.title.toLowerCase().includes(q) ||
        inv.targetSystem.toLowerCase().includes(q) ||
        inv.investigator.toLowerCase().includes(q)
      );
    }
    return result;
  },

  // Single Investigation: GET /api/investigations/:id
  async getInvestigation(id: string): Promise<Investigation | undefined> {
    await delay();
    return investigations.find(i => i.id === id) || investigations[0];
  },

  // Create Investigation: POST /api/investigations
  async createInvestigation(data: Partial<Investigation>): Promise<Investigation> {
    await delay(200);
    const newId = `JCK-2026-${String(investigations.length + 1).padStart(3, '0')}`;
    const newInv: Investigation = {
      id: newId,
      title: data.title || 'Untitled Forensic Investigation',
      targetSystem: data.targetSystem || 'WIN-FORENSIC-01',
      platform: data.platform || 'windows',
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      investigator: data.investigator || 'Dr. Sarah Chen, CISSP',
      risk: data.risk || 'medium',
      status: 'open',
      evidenceCount: 0,
      eventsCount: 0,
      findingsCount: 0,
      description: data.description || 'Forensic investigation triage initiated via JOCKY Command Center.',
      riskScore: 45,
      collectionProgress: 10
    };
    investigations = [newInv, ...investigations];

    // Add Audit Log
    const newAudit: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: newInv.investigator,
      action: 'Investigation Created',
      caseId: newInv.id,
      object: `Case ${newInv.id}`,
      result: 'SUCCESS',
      details: `New triage workspace initialized for target ${newInv.targetSystem}`,
      hash: Math.random().toString(16).substring(2, 18)
    };
    auditLogs = [newAudit, ...auditLogs];

    return newInv;
  },

  // Systems Endpoint: GET /api/systems
  async getSystems(): Promise<SystemHost[]> {
    await delay();
    return MOCK_SYSTEMS;
  },

  // Processes Endpoint: GET /api/processes
  async getProcesses(caseId?: string): Promise<ProcessItem[]> {
    await delay();
    return MOCK_PROCESSES;
  },

  // Files Endpoint: GET /api/files
  async getFiles(caseId?: string): Promise<FileItem[]> {
    await delay();
    return MOCK_FILES;
  },

  // Network Connections: GET /api/network
  async getNetworkConnections(caseId?: string): Promise<NetworkConnection[]> {
    await delay();
    return MOCK_NETWORK_CONNECTIONS;
  },

  // Logs Endpoint: GET /api/logs
  async getLogs(caseId?: string): Promise<LogEntry[]> {
    await delay();
    return MOCK_LOGS;
  },

  // Evidence Endpoint: GET /api/evidence
  async getEvidence(caseId?: string): Promise<EvidenceItem[]> {
    await delay();
    if (caseId) {
      return evidence.filter(e => e.caseId === caseId);
    }
    return evidence;
  },

  // Findings Endpoint: GET /api/findings
  async getFindings(caseId?: string): Promise<Finding[]> {
    await delay();
    if (caseId) {
      return findings.filter(f => f.caseId === caseId);
    }
    return findings;
  },

  // Update Finding Status: PATCH /api/findings/:id
  async updateFindingStatus(findingId: string, status: 'confirmed' | 'false_positive' | 'under_review', note?: string): Promise<Finding | undefined> {
    await delay();
    const f = findings.find(item => item.id === findingId);
    if (f) {
      f.status = status;
      if (note) {
        f.investigatorNotes = [...(f.investigatorNotes || []), note];
      }
      return { ...f };
    }
    return undefined;
  },

  // Timeline Endpoint: GET /api/timeline
  async getTimeline(caseId?: string): Promise<TimelineEvent[]> {
    await delay();
    return MOCK_TIMELINE;
  },

  // Reports Endpoint: GET /api/reports
  async getReports(caseId?: string): Promise<ReportItem[]> {
    await delay();
    return MOCK_REPORTS;
  },

  // Audit Logs: GET /api/audit
  async getAuditLogs(): Promise<AuditLog[]> {
    await delay();
    return auditLogs;
  },

  // Validation Scenarios: GET /api/validation
  async getValidationScenarios(): Promise<ValidationScenario[]> {
    await delay();
    return MOCK_VALIDATION_SCENARIOS;
  },

  // JOCKY Script Files: GET /api/jocky/scripts
  async getJockyScripts(): Promise<JockyScriptFile[]> {
    await delay();
    return MOCK_JOCKY_SCRIPTS;
  },

  // Correlation Graph: GET /api/correlation
  async getCorrelationGraph(caseId?: string): Promise<CorrelationGraphData> {
    await delay();
    return MOCK_CORRELATION_GRAPH;
  },

  // Continuous Learning: GET /api/learning
  async getContinuousLearning(): Promise<ContinuousLearningData> {
    await delay();
    return MOCK_CONTINUOUS_LEARNING;
  },

  // JOCKY DSL Compiler: POST /api/jocky/compile
  async compileJockyScript(code: string, targetPlatform: PlatformType = 'cross_platform'): Promise<CompilerResult> {
    const startTime = performance.now();
    await delay(150);

    const lines = code.split('\n');
    const validLines = lines.filter(l => l.trim() && !l.trim().startsWith('//'));
    const opsCount = validLines.length;

    // Real dynamic AST Generation based on script code lines
    const astRoot: AstNode = {
      type: 'Program',
      name: 'ForensicRoot',
      children: []
    };

    const firInstructions: string[] = [
      `; JOCKY Forensic Intermediate Representation (FIR v2.4)`,
      `; Target Platform Architecture: ${targetPlatform.toUpperCase()}`,
      `; Timestamp: ${new Date().toISOString()}`,
      `; Operations Count: ${opsCount}`,
      ``,
      `.section .metadata`,
      `  FIR_ARCH        "${targetPlatform}"`,
      `  FIR_PRIVILEGE   "ELEVATED_FORENSIC_ACQUISITION"`,
      `  FIR_HASH_ALGO   "SHA256_BLAKE3_DUAL"`,
      ``,
      `.section .bytecode`
    ];

    let estimatedItems = 0;

    validLines.forEach((line, idx) => {
      const trimmed = line.trim();
      const match = trimmed.match(/^([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\((.*)\)$/);
      if (match) {
        const [_, mod, fn, argsStr] = match;
        const rawArgs = argsStr.trim() ? argsStr.split(',').map(a => a.trim().replace(/^['"]|['"]$/g, '')) : [];
        
        astRoot.children?.push({
          type: 'FunctionCall',
          name: `${mod}.${fn}`,
          line: idx + 1,
          attributes: { module: mod, function: fn, arguments: rawArgs },
          children: [
            { type: 'Identifier', value: mod },
            { type: 'Method', value: fn },
            ...(rawArgs.map(arg => ({ type: 'Argument', value: arg })))
          ]
        });

        // Generate matching FIR opcode
        const opName = `FIR_OP_${mod.toUpperCase()}_${fn.toUpperCase()}`;
        const formattedArgs = rawArgs.length > 0 ? ` [${rawArgs.map(a => `"${a}"`).join(', ')}]` : '';
        firInstructions.push(`  ${opName.padEnd(28)}%reg_${idx}${formattedArgs}`);

        // Estimate evidence yield
        if (mod === 'process') estimatedItems += 45;
        else if (mod === 'file') estimatedItems += 80;
        else if (mod === 'network') estimatedItems += 25;
        else if (mod === 'log') estimatedItems += 60;
        else estimatedItems += 10;
      } else {
        astRoot.children?.push({
          type: 'ExpressionStatement',
          name: trimmed,
          line: idx + 1
        });
        firInstructions.push(`  FIR_OP_RAW_STMT             "${trimmed}"`);
      }
    });

    firInstructions.push(
      ``,
      `.section .integrity`,
      `  FIR_SIGN_CONTAINER      "TAMPER_EVIDENT_MERKLE_TREE"`,
      `  FIR_RETURN_STATUS       %r_success`
    );

    const execTime = Math.round(performance.now() - startTime);

    return {
      isValid: true,
      syntaxStatus: 'Valid',
      compilerStatus: 'Ready',
      operationsCount: opsCount,
      estimatedEvidenceItems: Math.max(1, estimatedItems),
      tokensCount: opsCount * 8 + 14,
      targetPlatform,
      ast: astRoot,
      irCode: firInstructions.join('\n'),
      bytecodeInstructions: firInstructions.filter(l => l.startsWith('  FIR_OP_')),
      compilationTimeMs: execTime
    };
  },

  // JOCKY DSL Validator: POST /api/jocky/validate
  async validateJockyScript(code: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    await delay(80);
    const errors: string[] = [];
    const warnings: string[] = [];

    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) return;

      // Check unbalanced parentheses
      const openParen = (trimmed.match(/\(/g) || []).length;
      const closeParen = (trimmed.match(/\)/g) || []).length;
      if (openParen !== closeParen) {
        errors.push(`Line ${index + 1}: Unbalanced parentheses in '${trimmed}'`);
      }

      // Check valid JOCKY module prefixes
      const validModules = ['system', 'process', 'network', 'file', 'log', 'evidence', 'report'];
      const firstPart = trimmed.split('.')[0];
      if (!validModules.includes(firstPart) && trimmed.includes('.')) {
        warnings.push(`Line ${index + 1}: Unknown module namespace '${firstPart}'. Supported: ${validModules.join(', ')}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
};
