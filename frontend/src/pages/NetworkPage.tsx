import React, { useState, useEffect } from 'react';
import { Network, Search, Filter, Globe, Activity, ShieldAlert, ArrowUpRight, Radio } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '../services/api';
import { NetworkConnection } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { RiskBadge, StatusBadge } from '../components/common/RiskBadge';
import { SearchBar, FilterBar } from '../components/common/FilterBar';

export const NetworkPage: React.FC = () => {
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [search, setSearch] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNetworkConnections();
      setConnections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const trafficTimeSeries = [
    { time: '10:00', inbound: 420, outbound: 850 },
    { time: '10:05', inbound: 640, outbound: 920 },
    { time: '10:10', inbound: 510, outbound: 780 },
    { time: '10:15', inbound: 720, outbound: 1450 },
    { time: '10:20', inbound: 980, outbound: 3840 }, // Outbound spike
    { time: '10:25', inbound: 850, outbound: 1820 },
    { time: '10:30', inbound: 620, outbound: 940 },
  ];

  const protocolData = [
    { name: 'TLS (443)', value: 58, color: '#2563EB' },
    { name: 'HTTP (80)', value: 22, color: '#7C3AED' },
    { name: 'DNS (53)', value: 12, color: '#0284C7' },
    { name: 'SSH (22)', value: 8, color: '#059669' },
  ];

  const filteredConnections = connections.filter((conn) => {
    if (protocolFilter !== 'all' && conn.protocol.toLowerCase() !== protocolFilter.toLowerCase()) return false;
    if (riskFilter !== 'all' && conn.risk.toLowerCase() !== riskFilter.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        conn.sourceIp.includes(q) ||
        conn.destIp.includes(q) ||
        conn.processName.toLowerCase().includes(q) ||
        conn.destinationGeo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<NetworkConnection>[] = [
    {
      header: 'Source Endpoint',
      width: '180px',
      render: (c) => (
        <span className="font-mono text-xs text-slate-800">
          {c.sourceIp}:{c.sourcePort}
        </span>
      )
    },
    {
      header: 'Destination Endpoint',
      width: '190px',
      render: (c) => (
        <div className="font-mono text-xs">
          <span className="font-bold text-slate-900">{c.destIp}:{c.destPort}</span>
        </div>
      )
    },
    {
      header: 'Protocol',
      width: '90px',
      render: (c) => (
        <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">
          {c.protocol}
        </span>
      )
    },
    {
      header: 'Owning Process',
      width: '160px',
      render: (c) => (
        <span className="font-mono text-xs font-semibold text-blue-700">
          {c.processName} ({c.pid})
        </span>
      )
    },
    {
      header: 'Destination Geo / Organization',
      render: (c) => (
        <div>
          <span className="text-xs text-slate-800 font-medium">{c.destinationGeo}</span>
          {c.suspiciousIndicator && (
            <div className="text-[11px] text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              {c.suspiciousIndicator}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Payload Volume',
      width: '120px',
      render: (c) => <span className="font-mono text-xs text-slate-500">{c.bytesTransferred}</span>
    },
    {
      header: 'Risk',
      width: '110px',
      render: (c) => <RiskBadge level={c.risk} />
    },
    {
      header: 'State',
      width: '110px',
      render: (c) => <StatusBadge status={c.status} />
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block mb-1">
            NETWORK FORENSICS & SOCKET AUDITING
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Network Forensics & Socket Telemetry
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Passive socket inspection, egress beacon identification, and external C2 IP correlation
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 self-start sm:self-auto font-mono flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          Packet Probe: Active
        </span>
      </div>

      {/* Network Traffic & Protocols Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Activity Time-Series */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Egress / Ingress Network Telemetry</h3>
              <p className="text-xs text-slate-500">Bytes per second transferred across active sockets</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Outbound Egress
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Inbound
              </span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficTimeSeries}>
                <defs>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="outbound" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" name="Outbound KB/s" />
                <Area type="monotone" dataKey="inbound" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" name="Inbound KB/s" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Protocol Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Traffic classification by L4/L7 protocol</p>
            <div className="space-y-3">
              {protocolData.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.name}</span>
                    <span className="font-mono text-slate-500">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>PCAP Buffer: <strong className="text-slate-800">1.24 MB Ring</strong></span>
            <span className="text-purple-600 font-semibold">Zero Packet Drop</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by IP, process name, or geographical destination..."
          className="md:w-80"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterBar
            label="Protocol"
            selectedValue={protocolFilter}
            onChange={setProtocolFilter}
            options={[
              { label: 'All', value: 'all' },
              { label: 'TLS', value: 'tls' },
              { label: 'HTTP', value: 'http' },
              { label: 'TCP', value: 'tcp' },
              { label: 'DNS', value: 'dns' },
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
              { label: 'Normal', value: 'normal' },
            ]}
          />
        </div>
      </div>

      {/* Connections Table */}
      <DataTable
        columns={columns}
        data={filteredConnections}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
      />
    </div>
  );
};
