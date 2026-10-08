import React from 'react';
import { RiskLevel, InvestigationStatus, IntegrityStatus } from '../../types';

export const RiskBadge: React.FC<{ level: RiskLevel | string; size?: 'sm' | 'md' }> = ({ level, size = 'sm' }) => {
  const norm = (level || 'normal').toLowerCase();
  
  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (norm === 'critical') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20';
    dotColor = 'bg-rose-600 animate-pulse';
  } else if (norm === 'high') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-600';
  } else if (norm === 'medium') {
    styles = 'bg-amber-50/70 text-amber-700 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (norm === 'low') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (norm === 'clean' || norm === 'normal') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (norm === 'info') {
    styles = 'bg-sky-50 text-sky-700 border-sky-200';
    dotColor = 'bg-sky-500';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${px} ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{level}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: InvestigationStatus | IntegrityStatus | string }> = ({ status }) => {
  const norm = (status || 'open').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (norm === 'analyzing' || norm === 'collecting' || norm === 'running') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (norm === 'completed' || norm === 'verified' || norm === 'passed' || norm === 'online') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (norm === 'review' || norm === 'under_review' || norm === 'requires_review' || norm === 'warning') {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (norm === 'failed' || norm === 'quarantined' || norm === 'integrity failed' || norm === 'critical') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (norm === 'offline' || norm === 'archived') {
    styles = 'bg-slate-100 text-slate-500 border-slate-200';
  }

  const label = norm.replace('_', ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles}`}>
      {label}
    </span>
  );
};
