import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter, ShieldAlert, Cpu, Network, ArrowRight, Copy, Check, Terminal, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { ProcessItem, NetworkConnection } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { RiskBadge, StatusBadge } from '../components/common/RiskBadge';
import { Drawer } from '../components/common/Drawer';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const ProcessesPage: React.FC = () => {
  const { addToast } = useInvestigation();
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedProcess, setSelectedProcess] = useState<ProcessItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProcessData();
  }, []);

  const loadProcessData = async () => {
    setIsLoading(true);
    try {
      const [procs, nets] = await Promise.all([
        api.getProcesses(),
        api.getNetworkConnections()
      ]);
      setProcesses(procs);
      setConnections(nets);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    addToast('info', 'Copied', 'Process SHA-256 copied to clipboard');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filteredProcesses = processes.filter((p) => {
    if (riskFilter !== 'all' && p.risk.toLowerCase() !== riskFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.pid.toString().includes(q) ||
        p.user.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<ProcessItem>[] = [
    {
      header: 'PID',
      width: '90px',
      render: (p) => <span className="font-mono font-bold text-slate-900">{p.pid}</span>
    },
    {
      header: 'Process',
      render: (p) => (
        <div>
          <span className="font-bold text-slate-900">{p.name}</span>
          <div className="text-[11px] font-mono text-slate-500 truncate max-w-xs">{p.path}</div>
        </div>
      )
    },
    {
      header: 'Parent PID',
      width: '120px',
      render: (p) => (
        <span className="font-mono text-xs text-slate-600">
          {p.ppid} ({p.parentName})
        </span>
      )
    },
    {
      header: 'User Token',
      width: '160px',
      render: (p) => <span className="font-mono text-xs text-slate-700">{p.user}</span>
    },
    {
      header: 'CPU / RAM',
      width: '130px',
      render: (p) => <span className="text-xs font-mono">{p.cpu} • {p.memory}</span>
    },
    {
      header: 'Start Time',
      width: '160px',
      render: (p) => <span className="font-mono text-xs text-slate-500">{p.startTime}</span>
    },
    {
      header: 'Risk',
      width: '110px',
      render: (p) => <RiskBadge level={p.risk} />
    },
    {
      header: 'Status',
      width: '100px',
      render: (p) => <StatusBadge status={p.status} />
    }
  ];

  const relatedNet = selectedProcess ? connections.filter(c => c.pid === selectedProcess.pid) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
            PROCESS FORENSICS & MEMORY
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Process Analysis
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Volatile process execution lineage, parent/child relationships, token inheritance, and memory verification
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 self-start sm:self-auto font-mono">
          Snapshot: 142 Total Processes
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by PID, process name, path, or user..."
          className="md:w-80"
        />

        <FilterBar
          label="Risk"
          selectedValue={riskFilter}
          onChange={setRiskFilter}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Critical', value: 'critical' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Normal', value: 'normal' },
          ]}
        />
      </div>

      {/* Process Table */}
      <DataTable
        columns={columns}
        data={filteredProcesses}
        keyExtractor={(p) => p.pid}
        isLoading={isLoading}
        onRowClick={(p) => {
          setSelectedProcess(p);
          setIsDrawerOpen(true);
        }}
      />

      {/* Process Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedProcess?.name || 'Process Telemetry'}
        subtitle={`PID: ${selectedProcess?.pid} • User: ${selectedProcess?.user}`}
      >
        {selectedProcess && (
          <div className="space-y-6 text-xs">
            {/* Header Overview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Risk Assessment</span>
                <div className="mt-1 flex items-center gap-2">
                  <RiskBadge level={selectedProcess.risk} size="md" />
                  <StatusBadge status={selectedProcess.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Resource</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedProcess.cpu} CPU • {selectedProcess.memory}</div>
              </div>
            </div>

            {/* Parent-Child Lineage Tree */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Execution Lineage (Parent / Child Hierarchy)
              </h4>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>├── Parent:</span>
                  <span className="text-white font-bold">{selectedProcess.parentName}</span>
                  <span className="text-slate-500">(PID: {selectedProcess.ppid})</span>
                </div>
                <div className="flex items-center gap-2 pl-4 text-cyan-300">
                  <span>└── Target:</span>
                  <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedProcess.name} (PID: {selectedProcess.pid})
                  </span>
                  <span className="text-emerald-400 font-semibold">• Active Handle</span>
                </div>
              </div>
            </div>

            {/* Command Line & Binary Attributes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Command Line Arguments</h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 break-all select-all leading-relaxed">
                {selectedProcess.commandLine}
              </div>
            </div>

            {/* SHA-256 Digest */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Executable Cryptographic Hash</h4>
                <button
                  onClick={() => copyHash(selectedProcess.sha256)}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedHash ? 'Copied' : 'Copy Hash'}
                </button>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700 break-all select-all">
                {selectedProcess.sha256}
              </div>
            </div>

            {/* Matched Anomaly Rules */}
            {selectedProcess.matchedRules && selectedProcess.matchedRules.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Matched Forensic Rules</h4>
                <div className="space-y-1">
                  {selectedProcess.matchedRules.map((rule, idx) => (
                    <div key={idx} className="bg-rose-50 border border-rose-200 text-rose-800 font-mono text-[11px] p-2 rounded flex items-center justify-between">
                      <span className="font-bold">{rule}</span>
                      <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded font-bold">TRIGGERED</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Network Sockets */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Related Network Sockets ({relatedNet.length})
              </h4>
              {relatedNet.length > 0 ? (
                <div className="space-y-2">
                  {relatedNet.map((net) => (
                    <div key={net.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{net.destIp}:{net.destPort} ({net.protocol})</span>
                        <RiskBadge level={net.risk} />
                      </div>
                      <p className="text-slate-500 font-sans text-xs">{net.destinationGeo}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No active network sockets bound to this process.</p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
