import React from 'react';
import { SystemHost, Investigation } from '../../types';
import { Monitor, Terminal, Shield, Cpu, HardDrive, ArrowUpRight, Activity } from 'lucide-react';
import { StatusBadge } from '../common/RiskBadge';
import { RiskBadge } from '../common/RiskBadge';

export const SystemCard: React.FC<{
  system: SystemHost;
  onSelect?: (sys: SystemHost) => void;
}> = ({ system, onSelect }) => {
  const isWindows = system.platform === 'windows';

  return (
    <div
      onClick={() => onSelect && onSelect(system)}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isWindows
              ? 'bg-blue-50 border-blue-100 text-blue-700'
              : 'bg-amber-50 border-amber-100 text-amber-700'
          }`}>
            {isWindows ? <Monitor className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{system.hostname}</h3>
              <StatusBadge status={system.status} />
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">{system.ip}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400">OS:</span>
          <span className="font-medium text-slate-800 truncate max-w-[200px]" title={system.os}>
            {system.os}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400">Agent:</span>
          <span className="font-mono text-slate-700">{system.agentVersion}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-slate-400">Last Seen:</span>
          <span className="text-slate-700">{system.lastSeen}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU</span>
            <span className="font-bold text-slate-800">{system.cpuUsage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${system.cpuUsage > 70 ? 'bg-rose-500' : 'bg-blue-600'}`}
              style={{ width: `${system.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> RAM</span>
            <span className="font-bold text-slate-800">{system.memoryUsage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full ${system.memoryUsage > 70 ? 'bg-amber-500' : 'bg-blue-600'}`}
              style={{ width: `${system.memoryUsage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          {system.evidenceCollected} Evidence items
        </span>
        <span className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5">
          Triage <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export const InvestigationCard: React.FC<{
  investigation: Investigation;
  onSelect?: (inv: Investigation) => void;
}> = ({ investigation, onSelect }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(investigation)}
      className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {investigation.id}
            </span>
            <StatusBadge status={investigation.status} />
            <RiskBadge level={investigation.risk} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
            {investigation.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Target: <span className="font-medium text-slate-700">{investigation.targetSystem}</span> ({investigation.platform})
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
        {investigation.description}
      </p>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500">Collection Progress</span>
          <span className="font-bold text-slate-800">{investigation.collectionProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${investigation.collectionProgress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
        <span>{investigation.evidenceCount} Evidence • {investigation.findingsCount} Findings</span>
        <span className="font-medium text-slate-700">{investigation.investigator.split(',')[0]}</span>
      </div>
    </div>
  );
};
