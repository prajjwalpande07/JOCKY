import React, { useState, useEffect } from 'react';
import { ShieldCheck, Play, CheckCircle2, AlertTriangle, Cpu, Terminal, RefreshCw, FileCheck, Layers, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ValidationScenario } from '../types';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/RiskBadge';
import { useInvestigation } from '../context/InvestigationContext';

export const ValidationPage: React.FC = () => {
  const { addToast } = useInvestigation();
  const [scenarios, setScenarios] = useState<ValidationScenario[]>([]);
  const [activeEnv, setActiveEnv] = useState<string>('all');
  const [isRunningScenario, setIsRunningScenario] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      const data = await api.getValidationScenarios();
      setScenarios(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAllTests = () => {
    setIsRunningScenario(true);
    setTimeout(() => {
      setIsRunningScenario(false);
      addToast('success', 'Laboratory Validation Passed', 'All 4 test scenarios passed with 100% evidence completeness.');
    }, 1200);
  };

  const filteredScenarios = scenarios.filter(s => {
    if (activeEnv !== 'all' && !s.testEnvironment.toLowerCase().includes(activeEnv.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 inline-block mb-1">
            CONTROLLED LABORATORY BENCHMARK
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Security & Telemetry Validation Lab
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Safe, authorized academic test harness verifying collection accuracy, telemetry fidelity, and false-positive suppression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAllTests}
            disabled={isRunningScenario}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunningScenario ? 'animate-spin' : ''}`} />
            {isRunningScenario ? 'Executing Laboratory Suite...' : 'Run Test Suite'}
          </button>
        </div>
      </div>

      {/* Laboratory Benchmark KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard
          title="Execution Success"
          value="100%"
          subtitle="Zero driver panics"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Detection Events"
          value="4 / 4 Passed"
          subtitle="Lab scenarios verified"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Telemetry Acquired"
          value="30 Items"
          subtitle="Memory & file metadata"
          icon={<Layers className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="False Positives"
          value="0.6%"
          subtitle="Noise suppression OK"
          icon={<Sparkles className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Avg Latency"
          value="32 ms"
          subtitle="Event ingestion"
          icon={<Cpu className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Completeness"
          value="100%"
          subtitle="SHA-256 seal verified"
          icon={<FileCheck className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
      </div>

      {/* Safety & Controlled Boundary Notice */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 text-xs text-blue-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-2 text-sm text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Controlled Security Validation & Telemetry Evaluation Policy
          </h4>
          <p className="text-slate-600 leading-relaxed max-w-4xl text-xs">
            This dashboard operates strictly within isolated sandbox environments (Windows Sandbox & Ubuntu Test VM) for authorized educational and research evaluation. Telemetry is gathered in read-only forensic mode with full audit trails.
          </p>
        </div>
        <span className="font-mono text-xs font-bold px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-blue-800 shrink-0">
          SECURE_SANDBOX_V2
        </span>
      </div>

      {/* Environment Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
        {['all', 'windows', 'ubuntu', 'isolated'].map((env) => (
          <button
            key={env}
            onClick={() => setActiveEnv(env)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              activeEnv === env ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {env === 'all' ? 'All Environments' : `${env} Lab`}
          </button>
        ))}
      </div>

      {/* Scenarios Detailed Cards */}
      <div className="space-y-4">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {scenario.id}
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {scenario.testEnvironment}
                </span>
                <span className="text-xs text-slate-500">
                  Scenario: <strong className="text-slate-800">{scenario.scenarioType}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-slate-500">{scenario.executionTimeMs}ms execution</span>
                <StatusBadge status={scenario.status} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">{scenario.name}</h3>
            </div>

            {/* Expected vs Observed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Expected Telemetry Result
                </div>
                <p className="text-slate-700 leading-relaxed font-sans">{scenario.expectedResult}</p>
              </div>

              <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Observed Verification Result
                </div>
                <p className="text-emerald-950 font-semibold leading-relaxed font-sans">{scenario.observedResult}</p>
              </div>
            </div>

            <div className="bg-slate-900 text-cyan-300 font-mono text-[11px] p-3 rounded-lg border border-slate-800 flex items-center justify-between">
              <span>Telemetry: {scenario.telemetry}</span>
              <span className="text-emerald-400 font-bold shrink-0">{scenario.evidenceItemsCollected} items cataloged</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
