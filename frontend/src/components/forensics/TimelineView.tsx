import React, { useState } from 'react';
import { TimelineEvent } from '../../types';
import { Cpu, FileText, Network, Database, AlertCircle, Server, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const TimelineView: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory !== 'all' && ev.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedSeverity !== 'all' && ev.severity.toLowerCase() !== selectedSeverity.toLowerCase()) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'process': return <Cpu className="w-4 h-4 text-blue-600" />;
      case 'file': return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'network': return <Network className="w-4 h-4 text-purple-600" />;
      case 'log': return <Database className="w-4 h-4 text-amber-600" />;
      case 'finding': return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default: return <Server className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'process': return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'file': return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case 'network': return 'border-purple-500 bg-purple-50 text-purple-700';
      case 'log': return 'border-amber-500 bg-amber-50 text-amber-700';
      case 'finding': return 'border-rose-500 bg-rose-50 text-rose-700';
      default: return 'border-slate-500 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Category & Severity Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Source:
          </span>
          {['all', 'process', 'file', 'network', 'log', 'finding'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2 py-0.5 text-xs rounded-md capitalize transition-all ${
                selectedSeverity === sev
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="relative pl-6 md:pl-8 py-2">
        <div className="absolute left-3 md:left-4 top-2 bottom-2 w-0.5 bg-slate-200" />

        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const isExpanded = expandedId === ev.id;
            return (
              <div key={ev.id} className="relative group">
                {/* Node icon pill */}
                <div className={`absolute -left-6 md:-left-8 top-3 -translate-x-1/2 w-7 h-7 rounded-full border-2 bg-white flex items-center justify-center shadow-sm ${getCategoryColor(ev.category)}`}>
                  {getCategoryIcon(ev.category)}
                </div>

                {/* Event Card */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                  className={`bg-white rounded-xl border border-slate-200 p-4 shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
                    isExpanded ? 'ring-1 ring-blue-500/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {ev.timeOnly || ev.timestamp.substring(11)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getCategoryColor(ev.category)}`}>
                          {ev.category}
                        </span>
                        <RiskBadge level={ev.severity} />
                        {ev.user && (
                          <span className="text-xs text-slate-500 font-mono">
                            User: {ev.user}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 pt-0.5">{ev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && ev.details && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-4 -mb-4 p-4 rounded-b-xl">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Telemetry Artifact Attributes
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {Object.entries(ev.details).map(([key, val]) => (
                          <div key={key} className="bg-white p-2 rounded border border-slate-200/80">
                            <span className="font-semibold text-slate-600 mr-2">{key}:</span>
                            <span className="font-mono text-slate-800">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
