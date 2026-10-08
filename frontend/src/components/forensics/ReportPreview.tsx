import React from 'react';
import { ReportItem } from '../../types';
import { ShieldCheck, Download, Printer, Share2, FileCheck, CheckCircle2 } from 'lucide-react';

export const ReportPreview: React.FC<{
  report: ReportItem;
  onDownload?: () => void;
}> = ({ report, onDownload }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-300 p-8 shadow-lg max-w-4xl mx-auto text-slate-800 font-sans space-y-6">
      {/* Official Forensic Header */}
      <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              OFFICIAL FORENSIC RECORD
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Sealed
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-2">
            JOCKY DIGITAL FORENSICS & THREAT HUNTING REPORT
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            DOCUMENT REFERENCE: {report.id} // CASE: {report.caseId}
          </p>
        </div>

        <div className="text-right text-xs space-y-0.5 font-mono">
          <p className="text-slate-500">Classification: <strong className="text-slate-900">CONFIDENTIAL</strong></p>
          <p className="text-slate-500">Date: <strong className="text-slate-900">{report.created}</strong></p>
          <p className="text-slate-500">Format: <strong className="text-slate-900">{report.format}</strong></p>
        </div>
      </div>

      {/* Case Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
        <div>
          <div className="text-slate-400 font-medium">Primary Investigator</div>
          <div className="font-bold text-slate-800 mt-0.5">{report.investigator}</div>
        </div>
        <div>
          <div className="text-slate-400 font-medium">Target Host</div>
          <div className="font-bold text-slate-800 mt-0.5">WIN-FORENSIC-01</div>
        </div>
        <div>
          <div className="text-slate-400 font-medium">Evidence Count</div>
          <div className="font-bold text-slate-800 mt-0.5">32 Verified Items</div>
        </div>
        <div>
          <div className="text-slate-400 font-medium">Analysis Outcome</div>
          <div className="font-bold text-rose-700 mt-0.5">APT Stager Confirmed</div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
          1. Executive Summary
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          {report.summary} On 2026-09-28 at 10:21:04 UTC, the JOCKY collector identified multi-stage staging activity on host WIN-FORENSIC-01. Telemetry indicates initial base64-encoded execution in PowerShell invoking memory downloads, staging dynamic link library stager_drop.dll, and establishing encrypted communications to external anonymizing CIDRs.
        </p>
      </div>

      {/* Forensic Findings Matrix */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
          2. Correlated Forensic Findings Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 font-semibold text-slate-700">
              <tr>
                <th className="p-2 border-b">ID</th>
                <th className="p-2 border-b">Finding Description</th>
                <th className="p-2 border-b">Severity</th>
                <th className="p-2 border-b">Confidence</th>
                <th className="p-2 border-b">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr>
                <td className="p-2 text-slate-600">FND-01</td>
                <td className="p-2 text-slate-800">C:\Windows\Temp\suspicious.exe execution</td>
                <td className="p-2 text-rose-600 font-bold">CRITICAL</td>
                <td className="p-2">94%</td>
                <td className="p-2 text-slate-700">Under Review</td>
              </tr>
              <tr>
                <td className="p-2 text-slate-600">FND-02</td>
                <td className="p-2 text-slate-800">PowerShell -EncodedCommand DownloadString</td>
                <td className="p-2 text-amber-600 font-bold">HIGH</td>
                <td className="p-2">89%</td>
                <td className="p-2 text-rose-600 font-bold">Confirmed</td>
              </tr>
              <tr>
                <td className="p-2 text-slate-600">FND-03</td>
                <td className="p-2 text-slate-800">Egress TLS beacon to 185.220.101.4:443</td>
                <td className="p-2 text-amber-600 font-bold">HIGH</td>
                <td className="p-2">87%</td>
                <td className="p-2 text-slate-700">Under Review</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Chain of Custody & Hash Sealing */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
          3. Cryptographic Chain-of-Custody Attestation
        </h2>
        <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 className="w-4 h-4" /> SHA-256 HASH VERIFICATION PASSED
          </div>
          <div className="text-[11px] text-slate-600 truncate">
            DIGEST: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
          </div>
          <div className="text-[11px] text-slate-500">
            TIMESTAMP: 2026-09-28T10:25:12.441Z // SIGNER: JOCKY-VAULT-ED25519-KEY-01
          </div>
        </div>
      </div>

      {/* Signature Block & Actions */}
      <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-slate-700">Forensic Examiner Signature</div>
          <div className="font-serif italic text-base text-slate-800 mt-1">Dr. Sarah Chen, CISSP, GCFE</div>
          <div className="text-[10px] text-slate-400 font-mono">Digital Signature Validated // Forensic Framework v2.4.0</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Download {report.format}
          </button>
        </div>
      </div>
    </div>
  );
};
