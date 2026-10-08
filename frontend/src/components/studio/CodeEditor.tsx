import React, { useRef } from 'react';
import { Copy, RotateCcw, Check, Code } from 'lucide-react';
import { useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = value.split('\n');

  const copyCode = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col font-mono text-xs">
      {/* Editor Header Toolbar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            JOCKY DSL Source
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {lines.length} lines • UTF-8
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
            title="Copy script"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 min-h-[360px] max-h-[560px] overflow-hidden relative">
        {/* Line Numbers */}
        <div className="bg-slate-950/60 text-slate-600 select-none py-3 px-3 text-right font-mono border-r border-slate-800/80 w-12 shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          className="flex-1 bg-transparent text-cyan-300 p-3 font-mono leading-6 outline-none resize-none overflow-y-auto selection:bg-blue-500/30 selection:text-white"
          placeholder="// Enter JOCKY forensic script commands here..."
        />
      </div>

      {/* Editor Footer Status */}
      <div className="bg-slate-950 px-4 py-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Dialect: JOCKY Forensic DSL v2.4</span>
        <span>Encoding: LF • Tab Size: 2</span>
      </div>
    </div>
  );
};
