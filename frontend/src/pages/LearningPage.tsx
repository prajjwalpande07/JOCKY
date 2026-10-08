import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, TrendingUp, Sliders, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { ContinuousLearningData } from '../types';
import { StatCard } from '../components/common/StatCard';
import { DataTable, Column } from '../components/common/DataTable';

export const LearningPage: React.FC = () => {
  const [data, setData] = useState<ContinuousLearningData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getContinuousLearning();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loopSteps = [
    { num: '01', title: 'Investigation', desc: 'Telemetry triage on Windows/Ubuntu', color: 'border-blue-300 bg-blue-50/70 text-blue-900' },
    { num: '02', title: 'Test Result', desc: 'Laboratory sandbox validation', color: 'border-purple-300 bg-purple-50/70 text-purple-900' },
    { num: '03', title: 'Investigator Feedback', desc: 'Analyst note & confirmation verdict', color: 'border-amber-300 bg-amber-50/70 text-amber-900' },
    { num: '04', title: 'Finding Classification', desc: 'False positive vs confirmed APT', color: 'border-rose-300 bg-rose-50/70 text-rose-900' },
    { num: '05', title: 'Improve Detection Rules', desc: 'Heuristic thresholds tuned', color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900' },
    { num: '06', title: 'Update Modules', desc: 'JOCKY collector bytecode refreshed', color: 'border-sky-300 bg-sky-50/70 text-sky-900' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
            ANALYST FEEDBACK LOOP & TUNING
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Continuous Learning & Improvement
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Iterative refinement cycle translating investigator triage verdicts into higher detection accuracy and lower false positives
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Active Feedback Loop
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Detection Accuracy"
          value={`${data?.detectionAccuracy || 98.6}%`}
          subtitle="Lab & live benchmark"
          trend="up"
          change="+1.2%"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="False Positive Rate"
          value={`${data?.falsePositiveRate || 1.4}%`}
          subtitle="Noise suppression"
          trend="down"
          change="-0.8%"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Rule Improvements"
          value={`${data?.ruleImprovementsCount || 42} Rules`}
          subtitle="Tuned from case findings"
          icon={<Sliders className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Updated Modules"
          value={`${data?.updatedModulesCount || 16} Releases`}
          subtitle="Compiler & collector updates"
          icon={<Cpu className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Feedback Flow Steps Visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">JOCKY Continuous Learning Architecture Flow</h3>
            <p className="text-xs text-slate-500">Every investigation verdict directly strengthens future detection routines</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            CLOSED LOOP
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {loopSteps.map((step, idx) => (
            <div key={idx} className={`p-4 rounded-xl border-2 flex flex-col justify-between min-h-[120px] ${step.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold">{step.num}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div>
                <h4 className="text-xs font-bold mt-2">{step.title}</h4>
                <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback History Table & Module Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analyst Feedback Triage Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Investigator Feedback Adjustments</h3>
              <p className="text-xs text-slate-500">Heuristic modifications submitted by forensic examiners</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.feedbackHistory.map((fb) => (
              <div key={fb.id} className="py-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {fb.caseId}
                    </span>
                    <span className="font-bold text-slate-900">{fb.ruleName}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{fb.date}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-semibold mr-1">Previous:</span>
                    <span>{fb.previousVerdict}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-semibold mr-1">Updated:</span>
                    <span className="font-bold text-emerald-950">{fb.updatedVerdict}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Impact: <strong className="text-slate-700">{fb.impact}</strong></span>
                  <span className="font-medium text-slate-600">Analyst: {fb.analyst}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Updated Modules List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Released Module Updates</h3>
                <p className="text-xs text-slate-500">Core compiler and collector builds</p>
              </div>
            </div>

            <div className="space-y-3">
              {data?.moduleUpdates.map((mod, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{mod.module}</span>
                    <span className="font-mono text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                      {mod.version}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{mod.changes}</p>
                  <div className="text-[10px] text-slate-400 font-mono pt-1">Released: {mod.releaseDate}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500">All modules pass academic reproducible builds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
