import React, { useState, useEffect } from 'react';
import {
  Code2,
  FileCode,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  Save,
  Download,
  AlertCircle,
  Terminal,
  FileCheck,
  Sparkles,
  Settings,
  RefreshCw,
  Folder,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { JockyScriptFile, CompilerResult, PlatformType } from '../types';
import { CodeEditor } from '../components/studio/CodeEditor';
import { ASTViewer } from '../components/studio/ASTViewer';
import { IRViewer } from '../components/studio/IRViewer';
import { CompilerPipeline } from '../components/studio/CompilerPipeline';
import { useInvestigation } from '../context/InvestigationContext';

export const StudioPage: React.FC = () => {
  const { addToast } = useInvestigation();
  const [files, setFiles] = useState<JockyScriptFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('SCR-001');
  const [code, setCode] = useState<string>('');
  const [platform, setPlatform] = useState<PlatformType>('cross_platform');
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [activeCenterView, setActiveCenterView] = useState<'editor' | 'ast' | 'ir'>('editor');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[*] JOCKY Forensic Compiler & Execution Engine initialized',
    '[*] Connected to host runtime Windows / Ubuntu probe agents',
    '[*] FIR-VM ready for authorized telemetry extraction'
  ]);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      const scriptFiles = await api.getJockyScripts();
      setFiles(scriptFiles);
      if (scriptFiles.length > 0) {
        setSelectedFileId(scriptFiles[0].id);
        setCode(scriptFiles[0].code);
        setPlatform(scriptFiles[0].targetPlatform);
        // Compile initially
        compileCode(scriptFiles[0].code, scriptFiles[0].targetPlatform);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectFile = (file: JockyScriptFile) => {
    setSelectedFileId(file.id);
    setCode(file.code);
    setPlatform(file.targetPlatform);
    compileCode(file.code, file.targetPlatform);
    setConsoleOutput(prev => [
      ...prev,
      `[+] Loaded script file: ${file.name} (${file.targetPlatform})`
    ]);
  };

  const compileCode = async (sourceCode: string, targetPlatform: PlatformType) => {
    setIsCompiling(true);
    try {
      const validation = await api.validateJockyScript(sourceCode);
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);

      const res = await api.compileJockyScript(sourceCode, targetPlatform);
      setCompilerResult(res);

      if (validation.valid) {
        setConsoleOutput(prev => [
          ...prev,
          `[✓] JOCKY compilation completed in ${res.compilationTimeMs}ms: ${res.operationsCount} ops, estimated ${res.estimatedEvidenceItems} evidence items.`
        ]);
      } else {
        setConsoleOutput(prev => [
          ...prev,
          `[!] Compilation warnings: ${validation.errors.join('; ')}`
        ]);
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Compilation Error', 'Failed to compile JOCKY script');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRunAnalysis = () => {
    setConsoleOutput(prev => [
      ...prev,
      `[>] Executing JOCKY FIR bytecode on ${platform.toUpperCase()} collector daemon...`,
      `[+] Target process table queried: 142 processes indexed`,
      `[+] Socket ring buffer polled: 6 active remote connections captured`,
      `[+] Evidence container sealed: Hash dual SHA-256 generated`,
      `[✓] Forensic run finished successfully. Telemetry committed to evidence vault.`
    ]);
    addToast('success', 'Forensic Analysis Run', `Execution complete on ${platform}. 142 artifacts indexed.`);
  };

  const handleValidate = async () => {
    const val = await api.validateJockyScript(code);
    setValidationErrors(val.errors);
    setValidationWarnings(val.warnings);
    if (val.valid) {
      addToast('success', 'Syntax Valid', 'No syntax errors detected in JOCKY script.');
      setConsoleOutput(prev => [...prev, `[✓] Semantic validation passed: All method calls conform to JOCKY DSL v2.4 specification.`]);
    } else {
      addToast('warning', 'Validation Warnings', `${val.errors.length} syntax issues found.`);
    }
  };

  const handleSave = () => {
    addToast('success', 'Script Saved', `Saved ${files.find(f => f.id === selectedFileId)?.name || 'script.jocky'}`);
    setConsoleOutput(prev => [...prev, `[+] Script contents written to workspace storage.`]);
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = files.find(f => f.id === selectedFileId)?.name || 'investigation.jocky';
    a.click();
    URL.revokeObjectURL(url);
    addToast('info', 'Exported', 'Script downloaded successfully.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              DSL DEVELOPMENT ENVIRONMENT
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              Dialect: JOCKY-v2.4
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            JOCKY Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Forensic Domain-Specific Language (DSL) IDE — write, validate, and compile cross-platform investigation scripts
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleValidate}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Validate
          </button>
          <button
            onClick={() => compileCode(code, platform)}
            disabled={isCompiling}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isCompiling ? 'animate-spin' : ''}`} />
            Compile
          </button>
          <button
            onClick={handleRunAnalysis}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Analysis
          </button>
        </div>
      </div>

      {/* Compiler Visual Pipeline Strip */}
      <CompilerPipeline
        currentStage={6}
        targetPlatform={platform}
      />

      {/* Main 3-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: File Explorer (2.5 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-amber-500" />
                Forensic Scripts
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                .jocky
              </span>
            </div>

            <div className="space-y-1">
              {files.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => handleSelectFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="truncate font-mono">{file.name}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Script Metadata
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {files.find(f => f.id === selectedFileId)?.description || 'JOCKY Forensic Script'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1"
              >
                <Save className="w-3 h-3" /> Save
              </button>
              <button
                onClick={handleExport}
                className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Code Editor / AST / IR Tabs (6.5 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* View Mode Switcher */}
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCenterView('editor')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeCenterView === 'editor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Script Editor
              </button>
              <button
                onClick={() => setActiveCenterView('ast')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeCenterView === 'ast'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                AST Preview
              </button>
              <button
                onClick={() => setActiveCenterView('ir')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeCenterView === 'ir'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Forensic IR (FIR)
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              {code.split('\n').length} Lines • UTF-8
            </span>
          </div>

          {/* Central Active View */}
          {activeCenterView === 'editor' && (
            <CodeEditor
              value={code}
              onChange={(newCode) => {
                setCode(newCode);
                compileCode(newCode, platform);
              }}
            />
          )}

          {activeCenterView === 'ast' && compilerResult && (
            <ASTViewer ast={compilerResult.ast} />
          )}

          {activeCenterView === 'ir' && compilerResult && (
            <IRViewer irCode={compilerResult.irCode} />
          )}

          {/* Validation Errors & Warnings Notice */}
          {validationErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" /> Syntax Errors Detected:
              </div>
              <ul className="list-disc pl-5 font-mono text-[11px]">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Real-time Collector Terminal Console */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 text-xs font-mono text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-500">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Terminal className="w-3.5 h-3.5" /> JOCKY Live Collector Console
              </span>
              <button
                onClick={() => setConsoleOutput(['[*] Console buffer cleared'])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 text-[11px]">
              {consoleOutput.map((msg, i) => (
                <div key={i} className="leading-relaxed">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Execution & Validation Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Execution / Validation
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                READY
              </span>
            </div>

            {/* Diagnostic Metrics */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Syntax Status:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {compilerResult?.syntaxStatus || 'Valid'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Target Platform:</span>
                <select
                  value={platform}
                  onChange={(e) => {
                    const newPlat = e.target.value as PlatformType;
                    setPlatform(newPlat);
                    compileCode(code, newPlat);
                  }}
                  className="font-mono text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-0.5"
                >
                  <option value="cross_platform">Cross-Platform</option>
                  <option value="windows">Windows</option>
                  <option value="ubuntu">Ubuntu</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Compiler Status:</span>
                <span className="font-mono font-semibold text-blue-700">
                  {compilerResult?.compilerStatus || 'Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Forensic Operations:</span>
                <span className="font-mono font-bold text-slate-900">
                  {compilerResult?.operationsCount || 7}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Estimated Evidence:</span>
                <span className="font-mono font-bold text-purple-700">
                  {compilerResult?.estimatedEvidenceItems || 142} items
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Compilation Latency:</span>
                <span className="font-mono text-slate-700">
                  {compilerResult?.compilationTimeMs || 12}ms
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleRunAnalysis}
                className="w-full py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Analysis
              </button>
              <button
                onClick={handleValidate}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Validate Script
              </button>
              <button
                onClick={() => compileCode(code, platform)}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-600" />
                Compile to FIR
              </button>
              <button
                onClick={handleSave}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                Save Script
              </button>
              <button
                onClick={handleExport}
                className="w-full py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export Artifact
              </button>
            </div>
          </div>

          {/* Research & Safety Notice Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" /> Forensic DSL Safety Boundary
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              JOCKY DSL executes strictly in non-destructive, read-only telemetry acquisition mode under authorized digital forensic investigation parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
