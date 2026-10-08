import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FolderSearch,
  Shield,
  Clock,
  Cpu,
  FileText,
  Network as NetIcon,
  Database,
  GitBranch,
  AlertTriangle,
  History,
  CheckCircle2,
  Monitor,
  Share2,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import {
  Investigation,
  EvidenceItem,
  ProcessItem,
  FileItem,
  NetworkConnection,
  LogEntry,
  TimelineEvent,
  Finding,
  ReportItem,
  AuditLog
} from '../types';
import { StatusBadge, RiskBadge } from '../components/common/RiskBadge';
import { EvidenceCard } from '../components/forensics/EvidenceCard';
import { FindingCard } from '../components/forensics/FindingCard';
import { TimelineView } from '../components/forensics/TimelineView';
import { NetworkGraph } from '../components/forensics/NetworkGraph';
import { ReportPreview } from '../components/forensics/ReportPreview';
import { DataTable, Column } from '../components/common/DataTable';
import { useInvestigation } from '../context/InvestigationContext';

export const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCaseId, setCurrentCaseId, addToast } = useInvestigation();

  const caseId = id || currentCaseId;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'evidence' | 'processes' | 'files' | 'network' | 'logs' | 'timeline' | 'analysis' | 'findings' | 'reports' | 'audit'
  >('overview');

  const [caseData, setCaseData] = useState<Investigation | null>(null);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [network, setNetwork] = useState<NetworkConnection[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (caseId) {
      setCurrentCaseId(caseId);
      loadWorkspace(caseId);
    }
  }, [caseId]);

  const loadWorkspace = async (targetId: string) => {
    setIsLoading(true);
    try {
      const [
        inv,
        evd,
        procs,
        fls,
        nets,
        lgs,
        tml,
        fnds,
        rpts,
        aud,
        grph
      ] = await Promise.all([
        api.getInvestigation(targetId),
        api.getEvidence(targetId),
        api.getProcesses(targetId),
        api.getFiles(targetId),
        api.getNetworkConnections(targetId),
        api.getLogs(targetId),
        api.getTimeline(targetId),
        api.getFindings(targetId),
        api.getReports(targetId),
        api.getAuditLogs(),
        api.getCorrelationGraph(targetId)
      ]);

      setCaseData(inv || null);
      setEvidence(evd);
      setProcesses(procs);
      setFiles(fls);
      setNetwork(nets);
      setLogs(lgs);
      setTimeline(tml);
      setFindings(fnds);
      setReports(rpts);
      setAudit(aud);
      setGraphData(grph);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindingStatusChange = async (findingId: string, status: 'confirmed' | 'false_positive' | 'under_review', note?: string) => {
    try {
      const updated = await api.updateFindingStatus(findingId, status, note);
      if (updated) {
        setFindings(prev => prev.map(f => f.id === findingId ? updated : f));
        addToast('success', 'Finding Updated', `Status updated to ${status.replace('_', ' ')}`);
      }
    } catch (err) {
      addToast('error', 'Error', 'Failed to update finding');
    }
  };

  if (isLoading || !caseData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-2xl border border-slate-200" />
        <div className="h-10 bg-slate-200 rounded w-2/3" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FolderSearch className="w-4 h-4" /> },
    { id: 'evidence', label: `Evidence (${evidence.length})`, icon: <Shield className="w-4 h-4" /> },
    { id: 'processes', label: `Processes (${processes.length})`, icon: <Cpu className="w-4 h-4" /> },
    { id: 'files', label: `Files (${files.length})`, icon: <FileText className="w-4 h-4" /> },
    { id: 'network', label: `Network (${network.length})`, icon: <NetIcon className="w-4 h-4" /> },
    { id: 'logs', label: `Logs (${logs.length})`, icon: <Database className="w-4 h-4" /> },
    { id: 'timeline', label: `Timeline (${timeline.length})`, icon: <Clock className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis & Graph', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'findings', label: `Findings (${findings.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'reports', label: `Reports (${reports.length})`, icon: <FileCheck className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Workspace Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {caseData.id}
              </span>
              <StatusBadge status={caseData.status} />
              <RiskBadge level={caseData.risk} size="md" />
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Platform: {caseData.platform.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
              {caseData.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-4xl">
              {caseData.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                RISK SCORE
              </div>
              <div className="text-2xl font-black text-rose-600 font-mono">
                {caseData.riskScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Case Metadata Bar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Target Host:</span>
            <div className="font-bold text-slate-800 font-mono">{caseData.targetSystem}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Investigator:</span>
            <div className="font-semibold text-slate-800 truncate">{caseData.investigator.split(',')[0]}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Created Date:</span>
            <div className="font-mono text-slate-800">{caseData.createdDate.substring(0, 16)}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Evidence Acquired:</span>
            <div className="font-bold text-slate-800">{caseData.evidenceCount} items</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Findings:</span>
            <div className="font-bold text-slate-800">{caseData.findingsCount} alerts</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Collection Progress:</span>
            <div className="font-bold text-blue-700">{caseData.collectionProgress}%</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-3 pt-2 flex items-center gap-1 overflow-x-auto shadow-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overview KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Risk Score</div>
                <div className="text-3xl font-extrabold text-rose-600 mt-1">{caseData.riskScore}</div>
                <div className="text-[11px] text-slate-400 mt-1">APT Multi-Stage Heuristic</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Evidence Count</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{evidence.length}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">100% SHA-256 Verified</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Telemetry Events</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{caseData.eventsCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">Processes, Net, Logs, Inodes</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Collection Progress</div>
                <div className="text-3xl font-extrabold text-blue-600 mt-1">{caseData.collectionProgress}%</div>
                <div className="text-[11px] text-slate-400 mt-1">FIR Cross-Platform Runtime</div>
              </div>
            </div>

            {/* Micro Chronological Timeline Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Chronological Forensic Timeline Snapshot
                  </h3>
                  <p className="text-xs text-slate-500">Key sequence reconstructed from raw host telemetry</p>
                </div>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Full Timeline View →
                </button>
              </div>

              {/* Exact Timeline steps mentioned in prompt:
                  10:21:04 Process Started
                  10:21:10 File Created
                  10:21:15 Network Connection
                  10:21:19 Log Event
                  10:21:32 Suspicious Activity */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {[
                  { time: '10:21:04', title: 'Process Started', detail: 'suspicious.exe (PID 4128)', badge: 'Process', color: 'border-blue-300 bg-blue-50/70 text-blue-800' },
                  { time: '10:21:10', title: 'File Created', detail: 'stager_drop.dll (Entropy 7.84)', badge: 'File', color: 'border-emerald-300 bg-emerald-50/70 text-emerald-800' },
                  { time: '10:21:15', title: 'Network Socket', detail: '185.220.101.4:443 (TLS)', badge: 'Network', color: 'border-purple-300 bg-purple-50/70 text-purple-800' },
                  { time: '10:21:19', title: 'Log Event', detail: 'Security Event ID 4688 / Sysmon', badge: 'Log', color: 'border-amber-300 bg-amber-50/70 text-amber-800' },
                  { time: '10:21:32', title: 'Suspicious Activity', detail: 'APT Stager Heuristic Flagged', badge: 'Indicator', color: 'border-rose-300 bg-rose-50/70 text-rose-800' },
                ].map((step, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border-2 flex flex-col justify-between ${step.color}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold">{step.time}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">{step.badge}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{step.title}</h4>
                      <p className="text-[11px] opacity-90 truncate mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Findings Quick Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Priority Findings Requiring Review</h3>
                <button
                  onClick={() => setActiveTab('findings')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Manage All Findings ({findings.length}) →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {findings.slice(0, 2).map((f) => (
                  <FindingCard
                    key={f.id}
                    finding={f}
                    onStatusChange={handleFindingStatusChange}
                    onViewEvidence={() => setActiveTab('evidence')}
                    onViewTimeline={() => setActiveTab('timeline')}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cryptographically Sealed Evidence Vault</h3>
                <p className="text-xs text-slate-500">Each artifact possesses an immutable SHA-256 chain-of-custody ledger</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidence.map((item) => (
                <EvidenceCard key={item.id} evidence={item} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROCESSES */}
        {activeTab === 'processes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Process Telemetry</h3>
            <DataTable
              columns={[
                { header: 'PID', width: '90px', render: (p) => <span className="font-mono font-bold">{p.pid}</span> },
                { header: 'Process Name', render: (p) => <span className="font-bold text-slate-900">{p.name}</span> },
                { header: 'PPID', width: '90px', render: (p) => <span className="font-mono text-slate-500">{p.ppid}</span> },
                { header: 'User Token', render: (p) => <span className="font-mono text-xs">{p.user}</span> },
                { header: 'CPU / RAM', width: '130px', render: (p) => <span>{p.cpu} • {p.memory}</span> },
                { header: 'Executable Path', render: (p) => <span className="font-mono text-xs text-slate-600 truncate max-w-xs">{p.path}</span> },
                { header: 'Risk', width: '110px', render: (p) => <RiskBadge level={p.risk} /> },
                { header: 'Status', width: '100px', render: (p) => <StatusBadge status={p.status} /> }
              ]}
              data={processes}
              keyExtractor={(item) => item.pid}
            />
          </div>
        )}

        {/* TAB 4: FILES */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Targeted File Forensics</h3>
            <DataTable
              columns={[
                { header: 'File Name', render: (f) => <span className="font-bold text-slate-900">{f.name}</span> },
                { header: 'Path', render: (f) => <span className="font-mono text-xs text-slate-600">{f.path}</span> },
                { header: 'Size', width: '100px', render: (f) => <span>{f.size}</span> },
                { header: 'Entropy', width: '100px', render: (f) => <span className="font-mono font-semibold">{f.entropy}</span> },
                { header: 'SHA-256 Digest', render: (f) => <span className="font-mono text-xs text-slate-500 truncate max-w-[180px]">{f.sha256}</span> },
                { header: 'Risk', width: '100px', render: (f) => <RiskBadge level={f.risk} /> },
                { header: 'Status', width: '120px', render: (f) => <StatusBadge status={f.evidenceStatus} /> }
              ]}
              data={files}
              keyExtractor={(f) => f.id}
            />
          </div>
        )}

        {/* TAB 5: NETWORK */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Socket & Network Connection Auditing</h3>
            <DataTable
              columns={[
                { header: 'Source', width: '160px', render: (n) => <span className="font-mono text-xs">{n.sourceIp}:{n.sourcePort}</span> },
                { header: 'Destination', width: '180px', render: (n) => <span className="font-mono text-xs font-semibold">{n.destIp}:{n.destPort}</span> },
                { header: 'Protocol', width: '90px', render: (n) => <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded">{n.protocol}</span> },
                { header: 'Process', width: '150px', render: (n) => <span className="font-mono text-xs">{n.processName} ({n.pid})</span> },
                { header: 'Destination Geo / Org', render: (n) => <span className="text-xs text-slate-700">{n.destinationGeo}</span> },
                { header: 'Risk', width: '110px', render: (n) => <RiskBadge level={n.risk} /> },
                { header: 'Status', width: '120px', render: (n) => <StatusBadge status={n.status} /> }
              ]}
              data={network}
              keyExtractor={(n) => n.id}
            />
          </div>
        )}

        {/* TAB 6: LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Centralized Forensic Event Logs</h3>
            <DataTable
              columns={[
                { header: 'Timestamp', width: '160px', render: (l) => <span className="font-mono text-xs">{l.timestamp}</span> },
                { header: 'Source', width: '110px', render: (l) => <span className="font-semibold text-xs">{l.source}</span> },
                { header: 'Event ID', width: '110px', render: (l) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{l.eventId}</span> },
                { header: 'Log Message', render: (l) => <span className="text-xs text-slate-700">{l.message}</span> },
                { header: 'User', width: '140px', render: (l) => <span className="font-mono text-xs">{l.user}</span> },
                { header: 'Severity', width: '110px', render: (l) => <RiskBadge level={l.severity} /> }
              ]}
              data={logs}
              keyExtractor={(l) => l.id}
            />
          </div>
        )}

        {/* TAB 7: TIMELINE */}
        {activeTab === 'timeline' && (
          <TimelineView events={timeline} />
        )}

        {/* TAB 8: ANALYSIS & GRAPH */}
        {activeTab === 'analysis' && graphData && (
          <NetworkGraph data={graphData} />
        )}

        {/* TAB 9: FINDINGS */}
        {activeTab === 'findings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Investigative Findings & Anomaly Confirmations</h3>
              <span className="text-xs text-slate-500">Forensically qualified indicators</span>
            </div>
            <div className="space-y-4">
              {findings.map((f) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  onStatusChange={handleFindingStatusChange}
                  onViewEvidence={() => setActiveTab('evidence')}
                  onViewTimeline={() => setActiveTab('timeline')}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: REPORTS */}
        {activeTab === 'reports' && reports[0] && (
          <ReportPreview report={reports[0]} onDownload={() => addToast('info', 'Report Export', 'Generating PDF download container...')} />
        )}

        {/* TAB 11: AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Immutable Cryptographic Audit Trail</h3>
            <DataTable
              columns={[
                { header: 'Timestamp', width: '160px', render: (a) => <span className="font-mono text-xs">{a.timestamp}</span> },
                { header: 'User / Identity', width: '180px', render: (a) => <span className="text-xs font-semibold">{a.user}</span> },
                { header: 'Action', width: '150px', render: (a) => <span className="text-xs font-bold text-blue-700">{a.action}</span> },
                { header: 'Target Object', width: '180px', render: (a) => <span className="font-mono text-xs">{a.object}</span> },
                { header: 'Details', render: (a) => <span className="text-xs text-slate-600">{a.details}</span> },
                { header: 'Result', width: '100px', render: (a) => <StatusBadge status={a.result} /> },
                { header: 'Digest', width: '130px', render: (a) => <span className="font-mono text-[10px] text-slate-400">{a.hash.substring(0, 12)}...</span> }
              ]}
              data={audit}
              keyExtractor={(a) => a.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};
