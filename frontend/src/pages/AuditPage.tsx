import React, { useState, useEffect } from 'react';
import { History, Search, Filter, ShieldCheck, Lock, Copy, Check, FileCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/RiskBadge';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const AuditPage: React.FC = () => {
  const { addToast } = useInvestigation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyDigest = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    addToast('info', 'Digest Copied', 'Cryptographic block digest copied.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'all' && log.action.toLowerCase() !== actionFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.caseId.toLowerCase().includes(q) ||
        log.object.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp (UTC)',
      width: '160px',
      render: (a) => <span className="font-mono text-xs text-slate-600">{a.timestamp}</span>
    },
    {
      header: 'Operator / Principal',
      width: '190px',
      render: (a) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {a.user}
        </span>
      )
    },
    {
      header: 'Forensic Action',
      width: '160px',
      render: (a) => (
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {a.action}
        </span>
      )
    },
    {
      header: 'Case Scope',
      width: '130px',
      render: (a) => (
        <span className="font-mono text-xs text-slate-700 font-semibold">{a.caseId}</span>
      )
    },
    {
      header: 'Target Object',
      width: '180px',
      render: (a) => <span className="font-mono text-xs text-slate-600">{a.object}</span>
    },
    {
      header: 'Audit Trail Details',
      render: (a) => <span className="text-xs text-slate-700 leading-relaxed font-sans">{a.details}</span>
    },
    {
      header: 'Result',
      width: '110px',
      render: (a) => <StatusBadge status={a.result} />
    },
    {
      header: 'Block Hash',
      width: '140px',
      className: 'text-right',
      render: (a) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyDigest(a.id, a.hash);
          }}
          className="font-mono text-[10px] text-slate-400 hover:text-blue-700 flex items-center justify-end gap-1 ml-auto"
          title="Copy block hash"
        >
          <span>{a.hash.substring(0, 10)}...</span>
          {copiedId === a.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block mb-1">
            IMMUTABLE GOVERNANCE LEDGER
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Forensic Audit Trail & Chain of Custody
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Tamper-evident chronological record of all investigator actions, evidence access, script compilations, and report releases
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 text-white flex items-center gap-1.5 font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          Ledger: Cryptographically Sealed
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter audit entries by investigator, action, case ID, or object..."
          className="md:w-80"
        />

        <FilterBar
          label="Action"
          selectedValue={actionFilter}
          onChange={setActionFilter}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Evidence Collected', value: 'evidence collected' },
            { label: 'Script Validated', value: 'script validated' },
            { label: 'Finding Reviewed', value: 'finding reviewed' },
            { label: 'Report Generated', value: 'report generated' },
            { label: 'Evidence Exported', value: 'evidence exported' },
          ]}
        />
      </div>

      {/* Audit Log Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        keyExtractor={(a) => a.id}
        isLoading={isLoading}
      />
    </div>
  );
};
