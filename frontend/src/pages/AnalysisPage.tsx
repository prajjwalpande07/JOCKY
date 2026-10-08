import React, { useState, useEffect } from 'react';
import { GitBranch, ShieldCheck, Sparkles, AlertTriangle, Cpu, Network, Database, FileText, ArrowRight, Sliders, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { CorrelationGraphData } from '../types';
import { NetworkGraph } from '../components/forensics/NetworkGraph';
import { StatCard } from '../components/common/StatCard';
import { useInvestigation } from '../context/InvestigationContext';

export const AnalysisPage: React.FC = () => {
  const { currentCaseId } = useInvestigation();
  const [graphData, setGraphData] = useState<CorrelationGraphData | null>(null);
  const [activeEngineTab, setActiveEngineTab] = useState<'graph' | 'rules' | 'anomalies'>('graph');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGraph();
  }, [currentCaseId]);

  const loadGraph = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCorrelationGraph(currentCaseId);
      setGraphData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
            CROSS-TELEMETRY CORRELATION ENGINE
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Analysis & Event Correlation
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Multi-stage heuristic correlation graph linking processes, modified files, sockets, and security log entries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Rules Engine: v2.4 Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Correlated Nodes"
          value="6 Entities"
          subtitle="Process, File, Net, Log"
          icon={<GitBranch className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active Rules"
          value="42 Rules"
          subtitle="JOCKY Forensic DSL Spec"
          icon={<Sliders className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Anomaly Confidence"
          value="94.8%"
          subtitle="Deviation score +4.2σ"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-700"
        />
        <StatCard
          title="Suppression Rate"
          value="99.4%"
          subtitle="Noise filter calibrated"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
      </div>

      {/* Engine View Mode Switcher */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveEngineTab('graph')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeEngineTab === 'graph' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Relationship Graph
        </button>
        <button
          onClick={() => setActiveEngineTab('rules')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeEngineTab === 'rules' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Heuristic Rules (42)
        </button>
        <button
          onClick={() => setActiveEngineTab('anomalies')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeEngineTab === 'anomalies' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Anomaly Detection Feed
        </button>
      </div>

      {/* Main View Area */}
      {activeEngineTab === 'graph' && graphData && (
        <NetworkGraph data={graphData} />
      )}

      {activeEngineTab === 'rules' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Active Forensic Correlation Rules Engine</h3>
          <p className="text-xs text-slate-500">
            Automated correlation rules running over live JOCKY telemetry buffers
          </p>
          <div className="divide-y divide-slate-100">
            {[
              { id: 'JOCKY-RULE-PROC-044', name: 'Untrusted Temp Directory Binary Execution', target: 'Process + File', status: 'ACTIVE', triggers: 16 },
              { id: 'JOCKY-RULE-PS-012', name: 'Base64 Encoded Script Block Execution', target: 'PowerShell Telemetry', status: 'ACTIVE', triggers: 24 },
              { id: 'JOCKY-RULE-NET-088', name: 'Egress Beacon to Known Tor / Proxy Exit', target: 'Socket Ring Buffer', status: 'ACTIVE', triggers: 10 },
              { id: 'JOCKY-RULE-FILE-027', name: 'Suspicious High Entropy DLL Creation', target: 'File Entropy Scanner', status: 'ACTIVE', triggers: 9 },
              { id: 'JOCKY-RULE-SVC-005', name: 'Event ID 7045 Unsigned Service Installation', target: 'Security EVTX Channel', status: 'ACTIVE', triggers: 4 },
            ].map((rule) => (
              <div key={rule.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700">{rule.id}</span>
                    <span className="font-semibold text-slate-900">{rule.name}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Target: {rule.target}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-600 font-semibold">{rule.triggers} Triggers</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200 text-[10px]">
                    {rule.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeEngineTab === 'anomalies' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Statistical Anomaly Detection Pipeline</h3>
          <p className="text-xs text-slate-500">
            Multi-variate baseline deviations computed across Windows and Ubuntu host fleets
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Anomaly #1</span>
              <h4 className="text-xs font-bold text-slate-900">Outbound Entropy Surge (PID 4128)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Observed payload entropy 7.92 vs host baseline 4.10. High probability of encrypted command-and-control encapsulation.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">Confidence: 94.8% • Metric: Shannon Byte Deviation</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Anomaly #2</span>
              <h4 className="text-xs font-bold text-slate-900">Process Tree Parent Discrepancy (PID 2840)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                PowerShell invoked by non-interactive background agent cmd.exe with execution policy bypass flags.
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">Confidence: 89.2% • Metric: Lineage Profiler</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
