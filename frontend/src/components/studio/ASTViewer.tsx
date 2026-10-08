import React, { useState } from 'react';
import { AstNode } from '../../types';
import { ChevronRight, ChevronDown, FolderTree, FileCode, Hash, Terminal } from 'lucide-react';

const AstNodeItem: React.FC<{ node: AstNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const getNodeBadge = (type: string) => {
    switch (type) {
      case 'Program': return 'bg-purple-900/60 text-purple-300 border-purple-700/60';
      case 'FunctionCall': return 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60';
      case 'Identifier': return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
      case 'Method': return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
      case 'Argument': return 'bg-amber-900/60 text-amber-300 border-amber-700/60';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="font-mono text-xs select-none">
      <div
        className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && setCollapsed(!collapsed)}
      >
        {hasChildren ? (
          collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )
        ) : (
          <span className="w-3.5 h-3.5 shrink-0" />
        )}

        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getNodeBadge(node.type)}`}>
          {node.type}
        </span>

        {node.name && (
          <span className="text-white font-semibold">{node.name}</span>
        )}

        {node.value !== undefined && (
          <span className="text-amber-300">"{String(node.value)}"</span>
        )}

        {node.line && (
          <span className="text-[10px] text-slate-500 ml-auto">L{node.line}</span>
        )}
      </div>

      {!collapsed && hasChildren && (
        <div className="border-l border-slate-800 ml-4">
          {node.children!.map((child, idx) => (
            <AstNodeItem key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ASTViewer: React.FC<{ ast: AstNode }> = ({ ast }) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-200">Abstract Syntax Tree (AST)</span>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded">
          {ast.children?.length || 0} Root Branches
        </span>
      </div>

      <div className="p-4 overflow-y-auto max-h-[460px] bg-slate-900/90 space-y-0.5">
        <AstNodeItem node={ast} />
      </div>
    </div>
  );
};
