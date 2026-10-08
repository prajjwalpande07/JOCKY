import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Monitor, Terminal, FolderSearch, Activity, AlertOctagon, CheckCircle2, Clock, Play, RefreshCw, Server, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { SystemHost, Investigation } from '../types';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge, RiskBadge } from '../components/common/RiskBadge';
import { useInvestigation } from '../context/InvestigationContext';

export const ManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setCurrentCaseId } = useInvestigation();
  const [systems, setSystems] = useState<SystemHost[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [collectionJobs, setCollectionJobs] = useState([
    { id: 'JOB-901', name: 'Live Memory Slice Dump', target: 'WIN-FORENSIC-01', status: 'Running', progress: 85, eta: '2 mins' },
    { id: 'JOB-902', name: 'Recursive Temp Path Hasher', target: 'UBUNTU-FORENSIC-02', status: 'Completed', progress: 100, eta: 'Done' },
    { id: 'JOB-903', name: 'EVTX Security Log Export', target: 'WIN-SEC-SRV-03', status: 'Running', progress: 42, eta: '6 mins' },
    { id: 'JOB-904', name: 'Auditd Syscall Buffer Flush', target: 'UBUNTU-DB-01', status: 'Queued', progress: 0, eta: 'Pending' },
    { id: 'JOB-905', name: 'Kernel Sockets Trace (eBPF)', target: 'GATEWAY-PRX-01', status: 'Running', progress: 75, eta: '3 mins' },
  ]);

  useEffect(() => {
    loadConsoleData();
  }, []);

  const loadConsoleData = async () => {
    setIsLoading(true);
    try {
      const [sys, inv] = await Promise.all([
        api.getSystems(),
        api.getInvestigations()
      ]);
      setSystems(sys);
      setInvestigations(inv);
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
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 inline-block mb-1">
            ENTERPRISE CENTRAL CONSOLE
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Central Management Console
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Fleet-wide orchestration of forensic acquisition jobs, agent health telemetry, and concurrent investigation workflows
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              addToast('info', 'Daemon Synchronized', 'Collection jobs synchronized with collectors.');
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Daemon
          </button>
        </div>
      </div>

      {/* 5 Operational Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Systems"
          value="24 Systems"
          subtitle="15 Win • 9 Ubuntu"
          icon={<Monitor className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Active Agents"
          value="23 / 24"
          subtitle="95.8% Telemetry Health"
          icon={<Activity className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Active Cases"
          value={`${investigations.length} Cases`}
          subtitle="Triage workspaces"
          icon={<FolderSearch className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Collection Jobs"
          value="5 Active"
          subtitle="3 Running • 1 Queued"
          icon={<Sliders className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Active Alerts"
          value="6 Alerts"
          subtitle="2 Critical • 4 High"
          icon={<AlertOctagon className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-700"
        />
      </div>

      {/* Concurrent Collection Jobs Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Forensic Collection Jobs</h3>
            <p className="text-xs text-slate-500">Live background acquisition routines across probe endpoints</p>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            FIR Runtime Queue
          </span>
        </div>

        <div className="space-y-3">
          {collectionJobs.map((job) => (
            <div key={job.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{job.id}</span>
                  <StatusBadge status={job.status} />
                  <span className="font-mono text-slate-500 text-[11px]">Target: {job.target}</span>
                </div>
                <h4 className="font-semibold text-slate-800">{job.name}</h4>
              </div>

              <div className="flex items-center gap-4 w-full md:w-64">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] mb-1 font-mono">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-bold text-slate-900">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        job.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono text-slate-500 shrink-0 text-[11px]">{job.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-System Investigation Workspaces Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Concurrent Investigations Fleet</h3>
          <button
            onClick={() => navigate('/investigations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            All Investigations →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investigations.slice(0, 6).map((inv) => (
            <div
              key={inv.id}
              onClick={() => {
                setCurrentCaseId(inv.id);
                navigate(`/workspace/${inv.id}`);
              }}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {inv.id}
                </span>
                <StatusBadge status={inv.status} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{inv.title}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Host: {inv.targetSystem} ({inv.platform})</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <RiskBadge level={inv.risk} />
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
