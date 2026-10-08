import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderSearch,
  Monitor,
  ShieldCheck,
  AlertTriangle,
  Network,
  AlertOctagon,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { DashboardSummary, Investigation } from '../types';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge, RiskBadge } from '../components/common/RiskBadge';
import { Modal } from '../components/common/Drawer';
import { useInvestigation } from '../context/InvestigationContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCaseId, addToast, reloadCases } = useInvestigation();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Investigation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('WIN-FORENSIC-01');
  const [newPlatform, setNewPlatform] = useState<'windows' | 'ubuntu'>('windows');
  const [newInvestigator, setNewInvestigator] = useState('Dr. Sarah Chen, CISSP');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const summary = await api.getDashboard();
      setData(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createInvestigation({
        title: newTitle,
        targetSystem: newTarget,
        platform: newPlatform,
        investigator: newInvestigator,
        description: newDescription,
        risk: 'medium'
      });
      addToast('success', 'Investigation Created', `Case ${created.id} initiated for ${created.targetSystem}`);
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      await reloadCases();
      await loadDashboard();
      setCurrentCaseId(created.id);
      navigate(`/workspace/${created.id}`);
    } catch (err) {
      addToast('error', 'Error', 'Failed to create investigation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-xl border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              COMMAND CENTER
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Cross-Platform Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            JOCKY Forensic Command Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Cross-Platform Digital Forensics & Threat Hunting powered by JOCKY Compiler Architecture
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/studio')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            JOCKY Studio
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Start Investigation
          </button>
        </div>
      </div>

      {/* 6 KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Active Cases"
          value={data.activeInvestigations}
          subtitle="Triage in progress"
          icon={<FolderSearch className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
          onClick={() => navigate('/investigations')}
        />
        <StatCard
          title="Connected Systems"
          value={data.connectedSystems}
          subtitle="15 Win • 9 Ubuntu"
          icon={<Monitor className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
          onClick={() => navigate('/systems')}
        />
        <StatCard
          title="Evidence Items"
          value={data.evidenceItems.toLocaleString()}
          subtitle="Cryptographically sealed"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
          onClick={() => navigate('/evidence')}
        />
        <StatCard
          title="Findings"
          value={data.findings}
          subtitle="Requires review"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
          onClick={() => navigate('/findings')}
        />
        <StatCard
          title="Network Events"
          value={data.networkEvents.toLocaleString()}
          subtitle="Past 24 hours"
          icon={<Network className="w-5 h-5" />}
          iconBg="bg-sky-50 text-sky-700"
          onClick={() => navigate('/network')}
        />
        <StatCard
          title="Critical Alerts"
          value={data.criticalAlerts}
          subtitle="High priority"
          trend="up"
          change="+2"
          icon={<AlertOctagon className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-700"
          onClick={() => navigate('/findings')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart A: Investigation Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Investigation & Telemetry Activity</h3>
              <p className="text-xs text-slate-500">Correlation of active cases vs forensic events ingested</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Active Cases
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.investigationActivity}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="open" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" name="Open Cases" />
                <Area type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved Cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Findings by Severity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Findings by Severity</h3>
            <p className="text-xs text-slate-500 mb-4">Categorized by forensic risk threshold</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.findingsBySeverity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                  <YAxis dataKey="severity" type="category" stroke="#64748b" fontSize={11} width={60} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.findingsBySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Findings: <strong className="text-slate-800">{data.findings}</strong></span>
            <button
              onClick={() => navigate('/findings')}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Findings →
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Charts: Evidence & Platform Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Evidence Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Evidence Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown of 3,482 acquired forensic artifacts</p>
          <div className="space-y-3">
            {data.evidenceDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-mono text-slate-500">{item.count.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Cross-Platform Endpoint Fleet</h3>
            <p className="text-xs text-slate-500 mb-4">Unified telemetry coverage across operating systems</p>
            <div className="grid grid-cols-2 gap-4 my-2">
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mx-auto mb-2">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-blue-950">15</div>
                <div className="text-xs font-semibold text-blue-700">Windows Endpoints</div>
                <div className="text-[10px] text-slate-500 mt-1">Windows 11 & Server 2022</div>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-2xl font-bold text-emerald-950">9</div>
                <div className="text-xs font-semibold text-emerald-700">Ubuntu / Linux Hosts</div>
                <div className="text-[10px] text-slate-500 mt-1">Ubuntu 24.04 & eBPF Daemon</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Agent Architecture: <strong className="text-slate-800">Unified FIR Collector v2.4</strong></span>
            <button onClick={() => navigate('/systems')} className="text-blue-600 hover:text-blue-800 font-semibold">
              Manage Fleet →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Investigations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Investigation Activity</h3>
            <p className="text-xs text-slate-500">Live active triage workspaces and threat hunting cases</p>
          </div>
          <button
            onClick={() => navigate('/investigations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            All Investigations <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Case ID</th>
                <th className="px-6 py-3">Investigation Name</th>
                <th className="px-6 py-3">System</th>
                <th className="px-6 py-3">Investigator</th>
                <th className="px-6 py-3">Risk</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentInvestigations.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => {
                    setCurrentCaseId(inv.id);
                    navigate(`/workspace/${inv.id}`);
                  }}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono font-bold text-blue-700">
                    {inv.id}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {inv.title}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600">
                    {inv.targetSystem}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">
                    {inv.investigator.split(',')[0]}
                  </td>
                  <td className="px-6 py-3.5">
                    <RiskBadge level={inv.risk} />
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-blue-600 hover:text-blue-800">
                    Open Workspace →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Investigation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Start New Forensic Investigation"
        subtitle="Initialize a controlled digital forensic acquisition case"
      >
        <form onSubmit={handleCreateInvestigation} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Investigation Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Host Telemetry Anomaly & Socket Inspection"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Target Endpoint System *
              </label>
              <select
                value={newTarget}
                onChange={(e) => {
                  setNewTarget(e.target.value);
                  setNewPlatform(e.target.value.startsWith('UBUNTU') || e.target.value.startsWith('GATEWAY') ? 'ubuntu' : 'windows');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="WIN-FORENSIC-01">WIN-FORENSIC-01 (192.168.1.20)</option>
                <option value="UBUNTU-FORENSIC-02">UBUNTU-FORENSIC-02 (192.168.1.21)</option>
                <option value="WIN-SEC-SRV-03">WIN-SEC-SRV-03 (192.168.1.45)</option>
                <option value="UBUNTU-DB-01">UBUNTU-DB-01 (192.168.1.88)</option>
                <option value="GATEWAY-PRX-01">GATEWAY-PRX-01 (10.0.0.15)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Platform Architecture
              </label>
              <div className="flex items-center gap-2 pt-1 font-mono">
                <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-700 uppercase">
                  {newPlatform}
                </span>
                <span className="text-[11px] text-slate-500">Auto-detected collector</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Lead Forensic Investigator *
            </label>
            <input
              type="text"
              required
              value={newInvestigator}
              onChange={(e) => setNewInvestigator(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Case Description & Initial Threat Hypothesis
            </label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="State the observed indicator, initial anomaly, or threat hunting objective..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-900 text-[11px]">
            <strong>Controlled Forensic Acquisition:</strong> Creating this case will register a cryptographic audit anchor and initialize the JOCKY collector agent in read-only telemetry capture mode.
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Initializing Case...' : 'Create & Open Workspace'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
