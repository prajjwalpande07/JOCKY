import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, FolderSearch, ArrowRight, ShieldAlert, Monitor, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { Investigation } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge, RiskBadge } from '../components/common/RiskBadge';
import { FilterBar, SearchBar } from '../components/common/FilterBar';
import { Pagination } from '../components/common/FeedbackComponents';
import { Modal } from '../components/common/Drawer';
import { useInvestigation } from '../context/InvestigationContext';

export const InvestigationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentCaseId, addToast, reloadCases } = useInvestigation();
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('WIN-FORENSIC-01');
  const [newPlatform, setNewPlatform] = useState<'windows' | 'ubuntu'>('windows');
  const [newInvestigator, setNewInvestigator] = useState('Dr. Sarah Chen, CISSP');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInvestigations();
  }, [statusFilter, platformFilter, search]);

  const loadInvestigations = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInvestigations({
        status: statusFilter,
        platform: platformFilter,
        search
      });
      setInvestigations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
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
        risk: 'high'
      });
      addToast('success', 'Investigation Initialized', `Case ${created.id} is now available in workspace`);
      setIsModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      await reloadCases();
      await loadInvestigations();
      setCurrentCaseId(created.id);
      navigate(`/workspace/${created.id}`);
    } catch (err) {
      addToast('error', 'Error', 'Failed to create case');
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemsPerPage = 8;
  const totalPages = Math.ceil(investigations.length / itemsPerPage);
  const paginatedData = investigations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<Investigation>[] = [
    {
      header: 'Case ID',
      width: '130px',
      render: (inv) => (
        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {inv.id}
        </span>
      )
    },
    {
      header: 'Investigation Name',
      render: (inv) => (
        <div>
          <div className="font-semibold text-slate-900 line-clamp-1">{inv.title}</div>
          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{inv.description}</div>
        </div>
      )
    },
    {
      header: 'Target System',
      width: '160px',
      render: (inv) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {inv.platform === 'windows' ? (
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <Terminal className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{inv.targetSystem}</span>
        </div>
      )
    },
    {
      header: 'Platform',
      width: '110px',
      render: (inv) => (
        <span className="capitalize text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {inv.platform}
        </span>
      )
    },
    {
      header: 'Investigator',
      width: '160px',
      render: (inv) => (
        <span className="text-xs text-slate-700 font-medium">{inv.investigator.split(',')[0]}</span>
      )
    },
    {
      header: 'Risk',
      width: '100px',
      render: (inv) => <RiskBadge level={inv.risk} />
    },
    {
      header: 'Status',
      width: '120px',
      render: (inv) => <StatusBadge status={inv.status} />
    },
    {
      header: 'Actions',
      width: '130px',
      className: 'text-right',
      render: (inv) => (
        <span className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
          Open Case <ArrowRight className="w-3.5 h-3.5" />
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
            CASE REPOSITORY
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Forensic Investigations
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Manage multi-platform digital forensic cases, telemetry acquisitions, and threat hunting workflows
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create Investigation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by case ID, title, investigator, or host..."
          className="md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            label="Status"
            selectedValue={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Open', value: 'open' },
              { label: 'Collecting', value: 'collecting' },
              { label: 'Analyzing', value: 'analyzing' },
              { label: 'Review', value: 'review' },
              { label: 'Completed', value: 'completed' },
            ]}
          />

          <FilterBar
            label="Platform"
            selectedValue={platformFilter}
            onChange={setPlatformFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Windows', value: 'windows' },
              { label: 'Ubuntu', value: 'ubuntu' },
            ]}
          />
        </div>
      </div>

      {/* Investigations Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        onRowClick={(item) => {
          setCurrentCaseId(item.id);
          navigate(`/workspace/${item.id}`);
        }}
        emptyMessage="No investigations match your filter criteria"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={investigations.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Create Investigation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initialize New Forensic Investigation"
        subtitle="Deploy JOCKY cross-platform collector to target host"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Case Title *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. APT-42 Memory & DLL Injection Triage"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Host *</label>
              <select
                value={newTarget}
                onChange={(e) => {
                  setNewTarget(e.target.value);
                  setNewPlatform(e.target.value.includes('UBUNTU') ? 'ubuntu' : 'windows');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
              >
                <option value="WIN-FORENSIC-01">WIN-FORENSIC-01 (192.168.1.20)</option>
                <option value="UBUNTU-FORENSIC-02">UBUNTU-FORENSIC-02 (192.168.1.21)</option>
                <option value="WIN-SEC-SRV-03">WIN-SEC-SRV-03 (192.168.1.45)</option>
                <option value="UBUNTU-DB-01">UBUNTU-DB-01 (192.168.1.88)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Collector Platform</label>
              <input
                type="text"
                readOnly
                value={newPlatform.toUpperCase()}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono text-slate-700 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Assigned Investigator *</label>
            <input
              type="text"
              required
              value={newInvestigator}
              onChange={(e) => setNewInvestigator(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Forensic objectives, preliminary alerts, and acquisition scope..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Case...' : 'Create Case'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
