import React from 'react';
import { CheckCircle2, ArrowRight, Code, Terminal, FileCode, Check, Cpu, ShieldCheck, Layers } from 'lucide-react';
import { PlatformType } from '../../types';

interface CompilerPipelineProps {
  currentStage?: number;
  targetPlatform?: PlatformType;
  onSelectStage?: (stage: number) => void;
  activeStage?: number;
}

export const CompilerPipeline: React.FC<CompilerPipelineProps> = ({
  currentStage = 6,
  targetPlatform = 'cross_platform',
  onSelectStage,
  activeStage = 6
}) => {
  const stages = [
    {
      id: 1,
      name: 'JOCKY Source',
      desc: 'DSL High-Level Spec',
      status: 'Ready',
      icon: <Code className="w-4 h-4 text-sky-600" />,
      color: 'border-sky-200 bg-sky-50/50'
    },
    {
      id: 2,
      name: 'Lexer',
      desc: 'Tokenization Stream',
      status: 'Completed',
      icon: <Terminal className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/50'
    },
    {
      id: 3,
      name: 'Parser',
      desc: 'CST Grammar Match',
      status: 'Completed',
      icon: <FileCode className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/50'
    },
    {
      id: 4,
      name: 'AST',
      desc: 'Abstract Syntax Tree',
      status: 'Generated',
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/50'
    },
    {
      id: 5,
      name: 'Semantic Validation',
      desc: 'Type & Scope Check',
      status: 'Passed',
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      id: 6,
      name: 'Forensic IR',
      desc: 'Target-Neutral Bytecode',
      status: 'Generated',
      icon: <Cpu className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/50'
    },
    {
      id: 7,
      name: 'Cross-Platform Runtime',
      desc: 'Windows / Ubuntu Target',
      status: 'Emitted',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/50'
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            JOCKY Compiler & Code Synthesis Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Transforms domain-specific forensic statements into verifiable bytecode across Windows & Ubuntu runtimes
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Runtime Target:</span>
          <span className="bg-slate-100 border border-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded font-bold uppercase">
            {targetPlatform}
          </span>
        </div>
      </div>

      {/* Connected Pipeline Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 items-center">
        {stages.map((stage, idx) => {
          const isSelected = activeStage === stage.id;
          return (
            <div
              key={stage.id}
              onClick={() => onSelectStage && onSelectStage(stage.id)}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                isSelected
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20 bg-blue-50/40'
                  : 'hover:border-slate-300 bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 font-mono">0{stage.id}</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> {stage.status}
                </span>
              </div>

              <div className="my-1">
                <div className="p-1.5 rounded-lg bg-slate-50 w-fit mb-1 border border-slate-100">
                  {stage.icon}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{stage.name}</h4>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
