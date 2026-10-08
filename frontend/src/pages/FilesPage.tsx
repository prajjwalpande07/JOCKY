import React, { useState, useEffect } from 'react';
import { FileSearch, Search, Filter, ShieldCheck, Copy, Check, FileCode, AlertTriangle, Layers } from 'lucide-react';
import { api } from '../services/api';
import { FileItem } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { RiskBadge, StatusBadge } from '../components/common/RiskBadge';
import { Drawer } from '../components/common/Drawer';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const FilesPage: React.FC = () => {
  const { addToast } = useInvestigation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [extensionFilter, setExtensionFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFiles();
      setFiles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    addToast('info', 'Copied', 'SHA-256 copied to clipboard');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filteredFiles = files.filter((f) => {
    if (riskFilter !== 'all' && f.risk.toLowerCase() !== riskFilter.toLowerCase()) return false;
    if (extensionFilter !== 'all') {
      if (!f.name.toLowerCase().endsWith(extensionFilter.toLowerCase())) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q) ||
        f.sha256.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<FileItem>[] = [
    {
      header: 'File Name',
      render: (f) => (
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900">{f.name}</span>
        </div>
      )
    },
    {
      header: 'File Path',
      render: (f) => <span className="font-mono text-xs text-slate-600 truncate max-w-sm">{f.path}</span>
    },
    {
      header: 'Size',
      width: '100px',
      render: (f) => <span className="font-mono text-xs">{f.size}</span>
    },
    {
      header: 'Entropy',
      width: '110px',
      render: (f) => (
        <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
          f.entropy > 7.5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
        }`}>
          {f.entropy}
        </span>
      )
    },
    {
      header: 'SHA-256 Digest',
      render: (f) => <span className="font-mono text-xs text-slate-500 truncate max-w-[180px]">{f.sha256}</span>
    },
    {
      header: 'File Format',
      width: '160px',
      render: (f) => <span className="text-xs text-slate-600 truncate max-w-[150px]">{f.type}</span>
    },
    {
      header: 'Risk',
      width: '110px',
      render: (f) => <RiskBadge level={f.risk} />
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
            FILE SYSTEM FORENSICS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            File Forensics & Hash Integrity
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Static binary metadata, Shannon entropy analysis, cryptographic verification, and YARA rule matching
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 self-start sm:self-auto font-mono">
          Cataloged: 980 Inodes
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by file name, directory path, or SHA-256..."
          className="md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            label="Extension"
            selectedValue={extensionFilter}
            onChange={setExtensionFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: '.dll', value: '.dll' },
              { label: '.exe', value: '.exe' },
              { label: '.log', value: '.log' },
              { label: '.bin', value: '.bin' },
            ]}
          />

          <FilterBar
            label="Risk"
            selectedValue={riskFilter}
            onChange={setRiskFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Critical', value: 'critical' },
              { label: 'High', value: 'high' },
              { label: 'Clean', value: 'clean' },
            ]}
          />
        </div>
      </div>

      {/* File Table */}
      <DataTable
        columns={columns}
        data={filteredFiles}
        keyExtractor={(f) => f.id}
        isLoading={isLoading}
        onRowClick={(f) => {
          setSelectedFile(f);
          setIsDrawerOpen(true);
        }}
      />

      {/* File Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedFile?.name || 'File Metadata'}
        subtitle={selectedFile?.path}
      >
        {selectedFile && (
          <div className="space-y-6 text-xs">
            {/* Header Risk Overview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Threat Verdict</span>
                <div className="mt-1 flex items-center gap-2">
                  <RiskBadge level={selectedFile.risk} size="md" />
                  <StatusBadge status={selectedFile.evidenceStatus} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Entropy Score</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedFile.entropy} / 8.0</div>
              </div>
            </div>

            {/* Shannon Entropy Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Shannon Entropy Calculation</span>
                <span className={`font-mono font-bold ${selectedFile.entropy > 7.2 ? 'text-rose-600' : 'text-slate-700'}`}>
                  {selectedFile.entropy > 7.2 ? 'High (Packed / Encrypted)' : 'Normal Plaintext / Binary'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${selectedFile.entropy > 7.2 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(selectedFile.entropy / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* Cryptographic SHA-256 Digest */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SHA-256 Checksum</h4>
                <button
                  onClick={() => copyHash(selectedFile.sha256)}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-[11px]"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedHash ? 'Copied' : 'Copy Hash'}
                </button>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700 break-all select-all">
                {selectedFile.sha256}
              </div>
            </div>

            {/* Matched YARA Rule */}
            {selectedFile.matchedYaraRule && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  YARA Signature Match:
                </div>
                <div className="font-mono text-xs font-bold">{selectedFile.matchedYaraRule}</div>
              </div>
            )}

            {/* Static Attributes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">File Attributes</h4>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">File Size:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedFile.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Modified ($MFT):</span>
                  <span className="font-mono text-slate-800">{selectedFile.modified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Access Permissions:</span>
                  <span className="font-mono text-slate-700 text-[11px]">{selectedFile.permissions}</span>
                </div>
                {selectedFile.relatedProcess && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Writing Process:</span>
                    <span className="font-mono text-blue-700 font-bold">{selectedFile.relatedProcess}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
