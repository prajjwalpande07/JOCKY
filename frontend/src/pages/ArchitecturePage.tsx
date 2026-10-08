import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Workflow,
  ArrowDown,
  ArrowRight,
  Code2,
  Cpu,
  Monitor,
  Terminal,
  Layers,
  ShieldCheck,
  Search,
  Database,
  GitBranch,
  Sliders,
  ShieldAlert,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const navigate = useNavigate();

  const architectureStages = [
    {
      step: '01',
      title: 'Requirement Analysis',
      desc: 'Digital forensics & threat hunting problem statement formulation across heterogeneous OS infrastructure.',
      route: '/',
      icon: <Workflow className="w-5 h-5 text-sky-600" />,
      color: 'border-sky-300 bg-sky-50/60'
    },
    {
      step: '02',
      title: 'JOCKY Language Design',
      desc: 'Proprietary forensic domain-specific language specification with expressive declarative queries.',
      route: '/reference',
      icon: <Code2 className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50/60'
    },
    {
      step: '03',
      title: 'JOCKY Compiler (Lexer → Parser → AST → FIR)',
      desc: 'Multi-stage parsing pipeline transforming source tokens into verifiable Forensic Intermediate Representation bytecode.',
      route: '/compiler',
      icon: <Cpu className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50/60'
    },
    {
      step: '04',
      title: 'Cross-Platform Runtime (Windows + Ubuntu)',
      desc: 'Dual-target runtime dispatching execution to Windows Win32/WMI drivers and Linux kernel eBPF probes.',
      route: '/systems',
      icon: <Monitor className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-300 bg-purple-50/60'
    },
    {
      step: '05',
      title: 'Forensic Script & Function Generation',
      desc: 'Synthesizing investigation scripts for memory acquisition, process lineage tracing, and packet collection.',
      route: '/studio',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50/60'
    },
    {
      step: '06',
      title: 'Controlled Security Test Environment',
      desc: 'Safe laboratory evaluation in isolated sandboxes without harmful payload execution.',
      route: '/validation',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      color: 'border-rose-300 bg-rose-50/60'
    },
    {
      step: '07',
      title: 'Forensic Data Collection (Processes / Files / Net / Logs)',
      desc: 'Live telemetry ingestion into cryptographic containers with SHA-256 and BLAKE3 signatures.',
      route: '/evidence',
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      color: 'border-indigo-300 bg-indigo-50/60'
    },
    {
      step: '08',
      title: 'Analysis & Correlation (Rules + Anomaly Detection)',
      desc: 'Graph-based correlation mapping process creation to file drop, network socket, and security event.',
      route: '/analysis',
      icon: <GitBranch className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50/60'
    },
    {
      step: '09',
      title: 'Central Management Console',
      desc: 'Fleet-wide investigation triage, concurrent job queue monitoring, and multi-endpoint orchestration.',
      route: '/management',
      icon: <Sliders className="w-5 h-5 text-orange-600" />,
      color: 'border-orange-300 bg-orange-50/60'
    },
    {
      step: '10',
      title: 'Security Validation & Testing',
      desc: 'Automated test scenarios benchmarking telemetry completeness, latency, and noise suppression.',
      route: '/validation',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-300 bg-purple-50/60'
    },
    {
      step: '11',
      title: 'Forensic Report Generation',
      desc: 'Court-admissible PDF/JSON dossiers with cryptographic chain-of-custody attestations.',
      route: '/reports',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50/60'
    },
    {
      step: '12',
      title: 'Continuous Learning & Improvement (Feedback Loop)',
      desc: 'Triage verdicts feed back into heuristic rule tuning to refine accuracy for future investigations.',
      route: '/learning',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50/60'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1">
            FRAMEWORK PIPELINE
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            JOCKY End-to-End Architecture Flow
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Complete lifecycle from DSL design, compiler synthesis, runtime execution to evidence sealing and continuous learning
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Code2 className="w-4 h-4" />
          Launch JOCKY Studio
        </button>
      </div>

      {/* Visual Sequence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {architectureStages.map((stage, idx) => (
          <div
            key={stage.step}
            onClick={() => navigate(stage.route)}
            className={`p-5 rounded-2xl border-2 shadow-card hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between space-y-4 ${stage.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-extrabold tracking-wider opacity-60">
                  STAGE {stage.step}
                </span>
                <div className="p-2 rounded-xl bg-white shadow-xs">
                  {stage.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {stage.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {stage.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>View Module</span>
              <span className="flex items-center gap-1 text-blue-700">
                Inspect <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
