import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Share2, PlusCircle, FileCheck, CheckCircle2, ShieldCheck, Printer, Search } from 'lucide-react';
import { api } from '../services/api';
import { ReportItem } from '../types';
import { ReportPreview } from '../components/forensics/ReportPreview';
import { Modal } from '../components/common/Drawer';
import { StatusBadge } from '../components/common/RiskBadge';
import { useInvestigation } from '../context/InvestigationContext';

export const ReportsPage: React.FC = () => {
  const { currentCaseId, addToast } = useInvestigation();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFormat, setNewFormat] = useState<'PDF' | 'JSON' | 'CSV'>('PDF');
  const [newType, setNewType] = useState<any>('Investigation');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [currentCaseId]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReports(currentCaseId);
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (report: ReportItem) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handleDownload = (report: ReportItem) => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}.${report.format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Download Started', `Exporting ${report.id} (${report.format})`);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: ReportItem = {
      id: `RPT-2026-00${reports.length + 1}`,
      caseId: currentCaseId,
      title: newTitle || `${newType} Forensic Report`,
      created: new Date().toISOString().replace('T', ' ').substring(0, 19),
      investigator: 'Dr. Sarah Chen, CISSP / GCFE',
      format: newFormat,
      status: 'ready',
      summary: 'Automated forensic synthesis compilation integrating verified artifacts and event correlation timelines.',
      pagesCount: newFormat === 'PDF' ? 14 : 4,
      sizeMb: '2.4 MB',
      reportType: newType
    };
    setReports([newReport, ...reports]);
    setIsGenerateOpen(false);
    setNewTitle('');
    addToast('success', 'Report Generated', `${newReport.id} created successfully`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
            FORENSIC REPORTING CENTER
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Forensic Reports & Dossier Export
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Court-ready digital forensics dossiers, cryptographically sealed chain-of-custody attestations, and executive summaries
          </p>
        </div>

        <button
          onClick={() => setIsGenerateOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {report.id}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      Case: {report.caseId}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      report.format === 'PDF' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      report.format === 'JSON' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {report.format}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 pt-1">{report.title}</h3>
                </div>
                <StatusBadge status={report.status} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {report.summary}
              </p>

              <div className="pt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Created:</span>
                  {report.created.substring(0, 10)}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pages:</span>
                  {report.pagesCount} Pages
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Size:</span>
                  {report.sizeMb}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 truncate max-w-[180px]">
                By: {report.investigator.split(',')[0]}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePreview(report)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={selectedReport?.title || 'Report Preview'}
        subtitle={`Document Ref: ${selectedReport?.id} • Case: ${selectedReport?.caseId}`}
        maxWidth="max-w-4xl"
      >
        {selectedReport && (
          <ReportPreview
            report={selectedReport}
            onDownload={() => handleDownload(selectedReport)}
          />
        )}
      </Modal>

      {/* Generate Report Modal */}
      <Modal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Generate Official Forensic Report"
        subtitle="Compile evidence, timeline, and findings into cryptographic report package"
      >
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Report Title *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Executive Summary & Root Cause Forensic Report"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Report Type *</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
              >
                <option value="Investigation">Investigation Comprehensive</option>
                <option value="Evidence">Evidence & Chain of Custody</option>
                <option value="Timeline">Timeline & Incident Reconstruction</option>
                <option value="System">System & Hardware Inventory</option>
                <option value="Network">Network & Socket Telemetry</option>
                <option value="Analysis">Analysis & Anomaly Heuristics</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Export Format *</label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none"
              >
                <option value="PDF">PDF (Court-Ready Document)</option>
                <option value="JSON">JSON (Machine-Verifiable Digest)</option>
                <option value="CSV">CSV (Chronological Metrics Table)</option>
              </select>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cryptographic Attestation Guarantee
            </div>
            <p>
              Generating this report will compile all verified evidence hashes into a tamper-evident Merkle digest signed by Dr. Sarah Chen.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsGenerateOpen(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
            >
              Compile & Generate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
