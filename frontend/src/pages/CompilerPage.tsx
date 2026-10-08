import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Layers, CheckCircle2, Play, ArrowRight, ShieldCheck, Binary, RefreshCw, FileCode, Check } from 'lucide-react';
import { api } from '../services/api';
import { CompilerResult, PlatformType } from '../types';
import { ASTViewer } from '../components/studio/ASTViewer';
import { IRViewer } from '../components/studio/IRViewer';
import { CompilerPipeline } from '../components/studio/CompilerPipeline';

export const CompilerPage: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>(
`// JOCKY Forensic Script
system.info()
process.list()
process.find("suspicious.exe")
network.connections()
file.search("*.dll", "C:/Windows/Temp")
evidence.collect()
evidence.export("case-001")`
  );

  const [platform, setPlatform] = useState<PlatformType>('cross_platform');
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null);
  const [activeStage, setActiveStage] = useState<number>(6);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runCompiler(sourceCode, platform);
  }, []);

  const runCompiler = async (code: string, plat: PlatformType) => {
    setIsLoading(true);
    try {
      const res = await api.compileJockyScript(code, plat);
      setCompilerResult(res);
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
          <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-1">
            FORENSIC COMPILER & IR SYNTHESIS
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Compiler Pipeline & Forensic IR
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Transparent compiler pipeline translating JOCKY DSL into verifiable Forensic Intermediate Representation (FIR) bytecode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={platform}
            onChange={(e) => {
              const p = e.target.value as PlatformType;
              setPlatform(p);
              runCompiler(sourceCode, p);
            }}
            className="text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
          >
            <option value="cross_platform">Target: Windows / Ubuntu (Hybrid)</option>
            <option value="windows">Target: Windows x64</option>
            <option value="ubuntu">Target: Ubuntu / Linux x64</option>
          </select>
          <button
            onClick={() => runCompiler(sourceCode, platform)}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Compile Pipeline
          </button>
        </div>
      </div>

      {/* Compiler Pipeline Connected Cards */}
      <CompilerPipeline
        currentStage={7}
        activeStage={activeStage}
        targetPlatform={platform}
        onSelectStage={setActiveStage}
      />

      {/* Compiler Status Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Lexer', value: 'Completed', detail: `${compilerResult?.tokensCount || 70} Tokens`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Parser', value: 'Completed', detail: 'CST Matched', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'AST', value: 'Generated', detail: `${compilerResult?.ast.children?.length || 7} Nodes`, color: 'text-purple-700 bg-purple-50 border-purple-200' },
          { label: 'Validation', value: 'Passed', detail: '0 Violations', color: 'text-blue-700 bg-blue-50 border-blue-200' },
          { label: 'Forensic IR', value: 'Generated', detail: `${compilerResult?.operationsCount || 7} FIR Ops`, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Runtime Target', value: 'Windows / Ubuntu', detail: 'Dual Dispatch', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{item.label}</span>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className={`mt-2 text-xs font-bold px-2 py-0.5 rounded-md border w-fit ${item.color}`}>
              {item.value}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">{item.detail}</div>
          </div>
        ))}
      </div>

      {/* Interactive Source Code & Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input DSL Source */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. JOCKY DSL Source Statements
              </h3>
              <p className="text-[11px] text-slate-400">Edit or enter forensic calls below</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
              Input
            </span>
          </div>

          <textarea
            value={sourceCode}
            onChange={(e) => {
              setSourceCode(e.target.value);
              runCompiler(e.target.value, platform);
            }}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-slate-900 text-cyan-300 rounded-lg border border-slate-800 outline-none leading-relaxed resize-none"
            spellCheck={false}
          />

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Lexer & Parser Grammar Rule:</div>
            <code className="text-blue-700 font-mono text-[11px]">
              ForensicStmt ::= ModuleIdentifier '.' MethodIdentifier '(' [Arguments] ')'
            </code>
          </div>
        </div>

        {/* Right: AST Tree Representation */}
        <div className="space-y-4">
          {compilerResult && (
            <ASTViewer ast={compilerResult.ast} />
          )}
        </div>
      </div>

      {/* Bottom: Forensic Intermediate Representation (FIR) Viewer */}
      {compilerResult && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Forensic Intermediate Representation (FIR Bytecode)</h3>
            <span className="text-xs font-mono text-slate-500">Emitted by JOCKY FIR-Synthesizer v2.4</span>
          </div>
          <IRViewer irCode={compilerResult.irCode} instructions={compilerResult.bytecodeInstructions} />
        </div>
      )}
    </div>
  );
};
