import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Terminal, Search, Filter, ShieldCheck, Activity, Cpu, HardDrive, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { SystemHost } from '../types';
import { SystemCard } from '../components/forensics/SystemCard';
import { Drawer } from '../components/common/Drawer';
import { StatusBadge } from '../components/common/RiskBadge';
import { SearchBar, FilterBar } from '../components/common/FilterBar';
import { useInvestigation } from '../context/InvestigationContext';

export const SystemsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setCurrentCaseId } = useInvestigation();
  const [systems, setSystems] = useState<SystemHost[]>([]);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [selectedSystem, setSelectedSystem] = useState<SystemHost | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSystems();
      setSystems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSystem = (sys: SystemHost) => {
    setSelectedSystem(sys);
    setIsDrawerOpen(true);
  };

  const filteredSystems = systems.filter((sys) => {
    if (platformFilter !== 'all' && sys.platform !== platformFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        sys.hostname.toLowerCase().includes(q) ||
        sys.ip.includes(q) ||
        sys.os.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const windowsSystems = filteredSystems.filter(s => s.platform === 'windows');
  const ubuntuSystems = filteredSystems.filter(s => s.platform === 'ubuntu');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
            ENDPOINT TELEMETRY FLEET
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Connected Systems
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Cross-platform forensic probe daemons running across Windows and Ubuntu/Linux enterprise infrastructure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loadSystems();
              addToast('info', 'Refreshed', 'Telemetry pinged across fleet.');
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Ping Fleet
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by hostname, IP address, or OS..."
          className="md:w-80"
        />

        <FilterBar
          label="Platform"
          selectedValue={platformFilter}
          onChange={setPlatformFilter}
          options={[
            { label: 'All Systems', value: 'all' },
            { label: 'Windows', value: 'windows' },
            { label: 'Ubuntu / Linux', value: 'ubuntu' },
          ]}
        />
      </div>

      {/* Windows Systems Section */}
      {(platformFilter === 'all' || platformFilter === 'windows') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Windows Forensic Hosts ({windowsSystems.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {windowsSystems.map((sys) => (
              <SystemCard key={sys.id} system={sys} onSelect={handleSelectSystem} />
            ))}
          </div>
        </div>
      )}

      {/* Ubuntu Systems Section */}
      {(platformFilter === 'all' || platformFilter === 'ubuntu') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Ubuntu & Linux Server Hosts ({ubuntuSystems.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ubuntuSystems.map((sys) => (
              <SystemCard key={sys.id} system={sys} onSelect={handleSelectSystem} />
            ))}
          </div>
        </div>
      )}

      {/* System Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedSystem?.hostname || 'System Details'}
        subtitle={`IP: ${selectedSystem?.ip} • OS: ${selectedSystem?.os}`}
      >
        {selectedSystem && (
          <div className="space-y-6 text-xs">
            {/* Header Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Daemon Status</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedSystem.status.toUpperCase()}</div>
              </div>
              <StatusBadge status={selectedSystem.status} />
            </div>

            {/* Performance Gauges */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Host Telemetry Load</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold"><Cpu className="w-3.5 h-3.5" /> CPU Load</span>
                    <span className="font-mono font-bold text-slate-900">{selectedSystem.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${selectedSystem.cpuUsage}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-semibold"><HardDrive className="w-3.5 h-3.5" /> Memory</span>
                    <span className="font-mono font-bold text-slate-900">{selectedSystem.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedSystem.memoryUsage}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* System Attributes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">System Attributes</h4>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Agent Release:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSystem.agentVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">JOCKY Version:</span>
                  <span className="font-mono text-slate-800">{selectedSystem.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Telemetry Heartbeat:</span>
                  <span className="text-slate-800">{selectedSystem.lastSeen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Preserved Evidence Items:</span>
                  <span className="font-bold text-blue-700">{selectedSystem.evidenceCollected} items</span>
                </div>
              </div>
            </div>

            {/* Active Case Association */}
            {selectedSystem.activeCaseId && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Active Investigation</span>
                <h4 className="text-sm font-bold text-blue-950 font-mono">{selectedSystem.activeCaseId}</h4>
                <button
                  onClick={() => {
                    setCurrentCaseId(selectedSystem.activeCaseId!);
                    navigate(`/workspace/${selectedSystem.activeCaseId}`);
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm flex items-center justify-center gap-1 mt-2"
                >
                  Open Investigation Workspace <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  navigate('/studio');
                  addToast('info', 'Studio Loaded', `Prepared investigation script for ${selectedSystem.hostname}`);
                }}
                className="w-full py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                Launch JOCKY Script on this Host
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
