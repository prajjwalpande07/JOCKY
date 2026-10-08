import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderSearch,
  Code2,
  Cpu,
  Monitor,
  Activity,
  FileSearch,
  Network,
  Database,
  ShieldCheck,
  GitBranch,
  AlertTriangle,
  Clock,
  Sliders,
  ShieldAlert,
  FileText,
  History,
  BookOpen,
  Sparkles,
  Workflow,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navSections = [
    {
      title: 'COMMAND CENTER',
      items: [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Investigations', path: '/investigations', icon: <FolderSearch className="w-4 h-4" /> },
        { name: 'Central Console', path: '/management', icon: <Sliders className="w-4 h-4" /> },
      ]
    },
    {
      title: 'FORENSIC DSL & COMPILER',
      items: [
        { name: 'JOCKY Studio', path: '/studio', icon: <Code2 className="w-4 h-4" /> },
        { name: 'Compiler & IR', path: '/compiler', icon: <Cpu className="w-4 h-4" /> },
        { name: 'Language Reference', path: '/reference', icon: <BookOpen className="w-4 h-4" /> },
      ]
    },
    {
      title: 'TELEMETRY & COLLECTION',
      items: [
        { name: 'Systems', path: '/systems', icon: <Monitor className="w-4 h-4" /> },
        { name: 'Processes', path: '/processes', icon: <Activity className="w-4 h-4" /> },
        { name: 'Files', path: '/files', icon: <FileSearch className="w-4 h-4" /> },
        { name: 'Network', path: '/network', icon: <Network className="w-4 h-4" /> },
        { name: 'Logs', path: '/logs', icon: <Database className="w-4 h-4" /> },
      ]
    },
    {
      title: 'FORENSIC INTELLIGENCE',
      items: [
        { name: 'Evidence Vault', path: '/evidence', icon: <ShieldCheck className="w-4 h-4" /> },
        { name: 'Analysis & Correlation', path: '/analysis', icon: <GitBranch className="w-4 h-4" /> },
        { name: 'Findings', path: '/findings', icon: <AlertTriangle className="w-4 h-4" /> },
        { name: 'Timeline', path: '/timeline', icon: <Clock className="w-4 h-4" /> },
      ]
    },
    {
      title: 'VALIDATION & GOVERNANCE',
      items: [
        { name: 'Security Validation', path: '/validation', icon: <ShieldAlert className="w-4 h-4" /> },
        { name: 'Reports', path: '/reports', icon: <FileText className="w-4 h-4" /> },
        { name: 'Audit Trail', path: '/audit', icon: <History className="w-4 h-4" /> },
        { name: 'Continuous Learning', path: '/learning', icon: <Sparkles className="w-4 h-4" /> },
        { name: 'Architecture Pipeline', path: '/architecture', icon: <Workflow className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L20 6V12C20 16.5 12 21 12 21C12 21 4 16.5 4 12V6L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </div>
            <div>
              <div className="text-base font-extrabold tracking-wider text-white">JOCKY</div>
              <div className="text-[9px] font-mono tracking-tight text-blue-400 font-semibold -mt-0.5">
                FORENSIC FRAMEWORK
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Item Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer — Framework Status */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-300 font-semibold">FIR-VM v2.4</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">SECURE</span>
          </div>
        </div>
      </aside>
    </>
  );
};
