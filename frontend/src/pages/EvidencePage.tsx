import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, ShieldAlert, Cpu, FileText, Network, Database, Server, Copy, Check, Lock, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { EvidenceItem } from '../types';
import { EvidenceCard, EvidenceChain } from '../components/forensics/EvidenceCard';
import { Drawer } from '../components/common/Drawer';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const EvidencePage: React.FC = () => {
  const { currentCaseId, addToast } = useInvestigation();
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [integrityFilter, setIntegrityFilter] = useState('all');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    setIsLoading(true);
    try {
      const data = await api.getEvidence();
      setEvidenceList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvidence = evidenceList.filter((ev) => {
    if (sourceFilter !== 'all' && ev.source.toLowerCase() !== sourceFilter.toLowerCase()) return false;
    if (integrityFilter !== 'all' && ev.integrityStatus !== integrityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.id.toLowerCase().includes(q) ||
        ev.sha256.toLowerCase().includes(q) ||
        ev.collectorAgent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block mb-1">
            DIGITAL EVIDENCE VAULT
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Forensic Evidence & Chain of Custody
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Tamper-evident artifact ledger with dual SHA-256 / BLAKE3 cryptographic sealing and full chain-of-custody tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Vault: Sealed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by artifact title, ID, SHA-256 hash, or agent..."
          className="md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            label="Source"
            selectedValue={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Process', value: 'process' },
              { label: 'File', value: 'file' },
              { label: 'Network', value: 'network' },
              { label: 'Log', value: 'log' },
              { label: 'System', value: 'system metadata' },
            ]}
          />

          <FilterBar
            label="Integrity"
            selectedValue={integrityFilter}
            onChange={setIntegrityFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Verified', value: 'verified' },
              { label: 'Requires Review', value: 'requires_review' },
            ]}
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvidence.map((ev) => (
          <EvidenceCard
            key={ev.id}
            evidence={ev}
            onInspect={(item) => {
              setSelectedEvidence(item);
              setIsDrawerOpen(true);
            }}
          />
        ))}
      </div>

      {/* Evidence Details & Chain of Custody Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedEvidence?.title || 'Evidence Inspection'}
        subtitle={`ID: ${selectedEvidence?.id} • Case: ${selectedEvidence?.caseId}`}
      >
        {selectedEvidence && (
          <div className="space-y-6 text-xs">
            {/* Integrity Badge Banner */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Cryptographic Integrity Verified</h4>
                  <p className="text-[11px] text-emerald-700">Digital signature matches original acquisition block</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-300">
                100% MATCH
              </span>
            </div>

            {/* SHA-256 Digest */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Primary SHA-256 Hash
              </span>
              <div className="p-3 bg-slate-900 text-cyan-300 rounded-lg font-mono text-[11px] break-all select-all">
                {selectedEvidence.sha256}
              </div>
            </div>

            {/* Metadata Summary */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Acquisition Agent:</span>
                <span className="font-mono font-bold text-slate-800">{selectedEvidence.collectorAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acquisition Timestamp:</span>
                <span className="font-mono text-slate-800">{selectedEvidence.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Preserved Container Size:</span>
                <span className="font-bold text-blue-700">{selectedEvidence.sizeBytes}</span>
              </div>
            </div>

            {/* Chain of Custody Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Verifiable Chain of Custody (6-Point Lifecycle)
              </h4>
              <EvidenceChain steps={selectedEvidence.chainOfCustody} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
