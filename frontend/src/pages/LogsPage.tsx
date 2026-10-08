import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, ShieldAlert, FileText, Copy, Check, Terminal } from 'lucide-react';
import { api } from '../services/api';
import { LogEntry } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { RiskBadge } from '../components/common/RiskBadge';
import { Drawer } from '../components/common/Drawer';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const LogsPage: React.FC = () => {
  const { addToast } = useInvestigation();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getLogs();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((l) => {
    if (sourceFilter !== 'all' && l.source.toLowerCase() !== sourceFilter.toLowerCase()) return false;
    if (severityFilter !== 'all' && l.severity.toLowerCase() !== severityFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.message.toLowerCase().includes(q) ||
        l.eventId.toString().toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        (l.relatedProcess && l.relatedProcess.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const columns: Column<LogEntry>[] = [
    {
      header: 'Timestamp',
      width: '160px',
      render: (l) => <span className="font-mono text-xs text-slate-600">{l.timestamp}</span>
    },
    {
      header: 'Channel Source',
      width: '130px',
      render: (l) => (
        <span className="font-semibold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
          {l.source}
        </span>
      )
    },
    {
      header: 'Event ID',
      width: '110px',
      render: (l) => (
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {l.eventId}
        </span>
      )
    },
    {
      header: 'Security Log Message',
      render: (l) => <span className="text-xs text-slate-700 leading-relaxed font-sans">{l.message}</span>
    },
    {
      header: 'Associated Process',
      width: '160px',
      render: (l) => (
        <span className="font-mono text-xs text-slate-600">
          {l.relatedProcess || '—'}
        </span>
      )
    },
    {
      header: 'User Subject',
      width: '140px',
      render: (l) => <span className="font-mono text-xs text-slate-500">{l.user}</span>
    },
    {
      header: 'Severity',
      width: '110px',
      render: (l) => <RiskBadge level={l.severity} />
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
            SECURITY EVENT INGESTION
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Centralized Log Analysis
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Aggregated forensic logs from Windows Event Channels (EVTX), Linux Auditd, and Sysmon records
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 self-start sm:self-auto font-mono">
          EVTX / Syslog Stream: Active
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by Event ID, message text, process, or username..."
          className="md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            label="Source"
            selectedValue={sourceFilter}
            onChange={setSourceFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Security', value: 'security' },
              { label: 'Network', value: 'network' },
              { label: 'Auditd', value: 'auditd' },
              { label: 'Application', value: 'application' },
              { label: 'System', value: 'system' },
            ]}
          />

          <FilterBar
            label="Severity"
            selectedValue={severityFilter}
            onChange={setSeverityFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Critical', value: 'critical' },
              { label: 'High', value: 'high' },
              { label: 'Medium', value: 'medium' },
              { label: 'Low', value: 'low' },
              { label: 'Info', value: 'info' },
            ]}
          />
        </div>
      </div>

      {/* Log Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        keyExtractor={(l) => l.id}
        isLoading={isLoading}
        onRowClick={(l) => {
          setSelectedLog(l);
          setIsDrawerOpen(true);
        }}
      />

      {/* Log Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Event ID: ${selectedLog?.eventId || ''}`}
        subtitle={`Channel: ${selectedLog?.source} • Timestamp: ${selectedLog?.timestamp}`}
      >
        {selectedLog && (
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Severity</span>
                <div className="mt-1"><RiskBadge level={selectedLog.severity} size="md" /></div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Process</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedLog.relatedProcess || 'N/A'}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Event Message</h4>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed font-sans text-xs">
                {selectedLog.message}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Raw XML / Syslog Format</h4>
              <pre className="p-4 bg-slate-900 text-cyan-300 font-mono text-[11px] rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing" />
    <EventID>${selectedLog.eventId}</EventID>
    <TimeCreated SystemTime="${selectedLog.timestamp}Z" />
    <Channel>${selectedLog.source}</Channel>
    <Execution ProcessID="${selectedLog.relatedProcess || '1024'}" />
  </System>
  <EventData>
    <Data Name="SubjectUserName">${selectedLog.user}</Data>
    <Data Name="Details">${selectedLog.message}</Data>
  </EventData>
</Event>`}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
