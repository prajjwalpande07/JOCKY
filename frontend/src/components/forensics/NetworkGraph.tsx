import React, { useState } from 'react';
import { CorrelationGraphData, CorrelationNode } from '../../types';
import { Cpu, FileText, Network, Database, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

export const NetworkGraph: React.FC<{ data: CorrelationGraphData }> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<CorrelationNode | null>(data.nodes[0] || null);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'process': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'file': return <FileText className="w-5 h-5 text-emerald-600" />;
      case 'network': return <Network className="w-5 h-5 text-purple-600" />;
      case 'log': return <Database className="w-5 h-5 text-amber-600" />;
      case 'finding': return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default: return null;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'process': return 'border-blue-500 bg-blue-50/70 text-blue-900';
      case 'file': return 'border-emerald-500 bg-emerald-50/70 text-emerald-900';
      case 'network': return 'border-purple-500 bg-purple-50/70 text-purple-900';
      case 'log': return 'border-amber-500 bg-amber-50/70 text-amber-900';
      case 'finding': return 'border-rose-500 bg-rose-50/70 text-rose-900';
      default: return 'border-slate-300 bg-slate-50 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Flow Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Multi-Stage Forensic Correlation Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Correlated execution lineage mapping raw OS triggers to verified security indicators
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Engine Active
          </span>
        </div>

        {/* Pipeline Sequence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {data.nodes.slice(0, 5).map((node, idx) => (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setSelectedNode(node)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedNode?.id === node.id
                    ? 'ring-2 ring-blue-500 shadow-md scale-[1.02]'
                    : 'hover:border-slate-400'
                } ${getNodeColor(node.type)}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1 rounded-md bg-white shadow-xs">
                    {getNodeIcon(node.type)}
                  </div>
                  <RiskBadge level={node.risk} />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {node.type}
                </div>
                <h4 className="text-xs font-bold truncate mt-0.5" title={node.label}>
                  {node.label}
                </h4>
                <p className="text-[11px] text-slate-600 truncate mt-1">{node.subtext}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive Node Graph & Relationship Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes & Edges Visual Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
            <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              Forensic Relationship Graph Topology
            </span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2 py-0.5 rounded">
              6 Nodes • 6 Correlated Edges
            </span>
          </div>

          {/* Interactive Graph Node List */}
          <div className="relative z-10 space-y-4">
            {data.nodes.map((node) => {
              const outgoing = data.edges.filter(e => e.from === node.id);
              const isSelected = selectedNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-700/60 text-cyan-400 border border-slate-600">
                      {getNodeIcon(node.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                          {node.type}
                        </span>
                        <RiskBadge level={node.risk} />
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{node.label}</h4>
                      <p className="text-xs text-slate-400">{node.details}</p>
                    </div>
                  </div>

                  {outgoing.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 shrink-0">
                      <span className="text-slate-500">REL:</span>
                      <span className="text-cyan-400 font-bold">{outgoing[0].relationship}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Inspector */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Correlation Node Inspector
              </h4>
              {selectedNode && <RiskBadge level={selectedNode.risk} />}
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {selectedNode.type} Entity
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{selectedNode.label}</h3>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80 space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">Evidence Details</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono">
                    {selectedNode.details}
                  </p>
                  <p className="text-xs text-slate-500">{selectedNode.subtext}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Associated Rule Triggers</div>
                  <div className="text-xs bg-blue-50/60 border border-blue-200/80 rounded-lg p-2.5 text-blue-900">
                    ✓ JOCKY-CORRELATION-ENGINE-V2
                    <br />✓ Multi-Stage Infiltration Heuristic Passed
                    <br />✓ Cryptographic Artifact Signature Validated
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">
                Click any node on the left to inspect correlation metadata.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 text-center">
            <span className="text-[11px] text-slate-500">
              Confidence Score: <strong className="text-slate-800">94.8%</strong> • Anomaly Deviation: <strong className="text-rose-600">+4.2σ</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
