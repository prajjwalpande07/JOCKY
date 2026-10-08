import React, { useState, useEffect } from 'react';
import { Clock, Filter, Search, Calendar, Shield, Activity, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { TimelineEvent } from '../types';
import { TimelineView } from '../components/forensics/TimelineView';
import { useInvestigation } from '../context/InvestigationContext';

export const TimelinePage: React.FC = () => {
  const { currentCaseId } = useInvestigation();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, [currentCaseId]);

  const loadTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTimeline(currentCaseId);
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
            CHRONOLOGICAL INCIDENT RECONSTRUCTION
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Forensic Event Timeline
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Microsecond-accurate cross-telemetry timeline correlating process spawns, file drop I/O, network sockets, and security logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Case: {currentCaseId}
          </span>
        </div>
      </div>

      {/* Main Interactive Timeline Component */}
      <TimelineView events={events} />
    </div>
  );
};
