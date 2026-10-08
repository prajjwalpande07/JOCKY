import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Search, Filter, ShieldAlert, CheckCircle, XCircle, Sliders, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { Finding } from '../types';
import { FindingCard } from '../components/forensics/FindingCard';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const FindingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentCaseId, addToast } = useInvestigation();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFindings();
  }, [currentCaseId]);

  const loadFindings = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFindings();
      setFindings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'confirmed' | 'false_positive' | 'under_review', note?: string) => {
    try {
      const updated = await api.updateFindingStatus(id, status, note);
      if (updated) {
        setFindings(prev => prev.map(f => f.id === id ? updated : f));
        addToast('success', 'Finding Updated', `Status marked as ${status.replace('_', ' ')}`);
      }
    } catch (err) {
      addToast('error', 'Error', 'Failed to update finding');
    }
  };

  const filteredFindings = findings.filter((f) => {
    if (severityFilter !== 'all' && f.severity.toLowerCase() !== severityFilter.toLowerCase()) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.ruleName.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const highCount = findings.filter(f => f.severity === 'high').length;
  const mediumCount = findings.filter(f => f.severity === 'medium').length;
  const lowCount = findings.filter(f => f.severity === 'low').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mb-1">
            THREAT HUNTING INDICATORS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Investigation Findings & Anomaly Indicators
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Peer-reviewed forensic indicators qualified with statistical confidence and investigator attestation
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono text-slate-600 flex items-center gap-2">
          <span>Active Triage Case:</span>
          <span className="font-bold text-blue-700">{currentCaseId}</span>
        </div>
      </div>

      {/* Severity Counters Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
          className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer shadow-card ${
            severityFilter === 'critical' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Critical Findings</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{criticalCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Confidence &gt; 90%</p>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'high' ? 'all' : 'high')}
          className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer shadow-card ${
            severityFilter === 'high' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">High Findings</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{highCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">High probability anomaly</p>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'medium' ? 'all' : 'medium')}
          className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer shadow-card ${
            severityFilter === 'medium' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Medium Findings</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{mediumCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Requires analyst review</p>
        </div>

        <div
          onClick={() => setSeverityFilter(severityFilter === 'low' ? 'all' : 'low')}
          className={`bg-white p-4 rounded-xl border-2 transition-all cursor-pointer shadow-card ${
            severityFilter === 'low' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Low Findings</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{lowCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Informational telemetry</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by indicator name, rule ID, or description..."
          className="md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            label="Severity"
            selectedValue={severityFilter}
            onChange={setSeverityFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Critical', value: 'critical' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
            ]}
          />

          <FilterBar
            label="Status"
            selectedValue={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Under Review', value: 'under_review' },
              { label: 'Confirmed', value: 'confirmed' },
              { label: 'False Positive', value: 'false_positive' },
            ]}
          />
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            onStatusChange={handleStatusChange}
            onViewEvidence={() => navigate('/evidence')}
            onViewTimeline={() => navigate('/timeline')}
          />
        ))}
      </div>
    </div>
  );
};
