import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, FileText, Cpu, Network, Database, Server, Copy, Check } from 'lucide-react';
import { EvidenceItem, CustodyStep } from '../../types';
import { useState } from 'react';

export const EvidenceChain: React.FC<{ steps: CustodyStep[] }> = ({ steps }) => {
  return (
    <div className="relative py-4">
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200" />
      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.step} className="relative flex items-start gap-4 pl-10">
            <div className="absolute left-2.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100 flex items-center justify-center text-[10px] text-white font-bold" />
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Step {step.step}: {step.action}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{step.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-700">Actor:</span> {step.actor}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{step.notes}</p>
              {step.hash && (
                <div className="mt-2 text-[10px] font-mono bg-white border border-slate-200 rounded px-2 py-1 text-slate-600 truncate">
                  <span className="text-slate-400 font-semibold mr-1">DIGEST:</span>
                  {step.hash}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EvidenceCard: React.FC<{
  evidence: EvidenceItem;
  onInspect?: (evidence: EvidenceItem) => void;
}> = ({ evidence, onInspect }) => {
  const [copied, setCopied] = useState(false);

  const copyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(evidence.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Process': return <Cpu className="w-4 h-4 text-blue-600" />;
      case 'File': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'Network': return <Network className="w-4 h-4 text-purple-600" />;
      case 'Log': return <Database className="w-4 h-4 text-amber-600" />;
      default: return <Server className="w-4 h-4 text-slate-600" />;
    }
  };

  const getIntegrityBadge = () => {
    if (evidence.integrityStatus === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified
        </span>
      );
    }
    if (evidence.integrityStatus === 'requires_review') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          Verification Required
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
        <XCircle className="w-3.5 h-3.5" />
        Integrity Failed
      </span>
    );
  };

  return (
    <div
      onClick={() => onInspect && onInspect(evidence)}
      className="bg-white rounded-xl border border-slate-200 p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            {getSourceIcon(evidence.source)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{evidence.title}</h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
              <span>{evidence.id}</span>
              <span>•</span>
              <span>Case: {evidence.caseId}</span>
            </div>
          </div>
        </div>
        {getIntegrityBadge()}
      </div>

      <div className="bg-slate-50 rounded-lg p-2.5 my-3 border border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span className="font-medium text-slate-600">SHA-256 Digest</span>
          <button
            onClick={copyHash}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="font-mono text-[10px] text-slate-700 truncate select-all">
          {evidence.sha256}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Collector: {evidence.collectorAgent}</span>
        <span className="font-medium text-slate-700">{evidence.sizeBytes}</span>
      </div>
    </div>
  );
};
