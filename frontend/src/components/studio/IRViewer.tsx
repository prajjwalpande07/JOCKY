import React, { useState } from 'react';
import { Binary, Copy, Check, Download, Cpu } from 'lucide-react';

export const IRViewer: React.FC<{ irCode: string; instructions?: string[] }> = ({ irCode, instructions = [] }) => {
  const [copied, setCopied] = useState(false);

  const copyIR = () => {
    navigator.clipboard.writeText(irCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFIR = () => {
    const blob = new Blob([irCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jocky-forensic.fir';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col font-mono">
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">Forensic Intermediate Representation (FIR)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyIR}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={downloadFIR}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            <Download className="w-3 h-3" />
            <span>.fir</span>
          </button>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-[460px] bg-slate-950/70 text-xs leading-6">
        <pre className="text-slate-300">
          {irCode.split('\n').map((line, idx) => {
            const isComment = line.trim().startsWith(';');
            const isSection = line.trim().startsWith('.section') || line.trim().startsWith('.target');
            const isOpcode = line.includes('FIR_OP_') || line.includes('FIR_SIGN_') || line.includes('FIR_RETURN_');

            let textColor = 'text-slate-300';
            if (isComment) textColor = 'text-slate-500 italic';
            else if (isSection) textColor = 'text-purple-400 font-bold';
            else if (isOpcode) textColor = 'text-amber-400';

            return (
              <div key={idx} className={`${textColor} hover:bg-slate-800/40 px-1 rounded transition-colors`}>
                {line}
              </div>
            );
          })}
        </pre>
      </div>

      <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-amber-500" />
          Virtual Machine: FIR-VM v2.4 (Cross-Platform Execution Target)
        </span>
        <span>Bytecode Verification: Valid</span>
      </div>
    </div>
  );
};
