import React, { useState } from 'react';
import { Menu, Search, Bell, Shield, ChevronDown, Check, User, Activity, AlertCircle } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';

export const Topbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { currentCaseId, setCurrentCaseId, allCases, currentCase, globalSearch, setGlobalSearch, toasts } = useInvestigation();
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      {/* Left: Mobile menu toggle + Case Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Case Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCaseDropdown(!showCaseDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                ACTIVE CASE
              </div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                {currentCaseId}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </button>

          {showCaseDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-dropdown border border-slate-200 py-1.5 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Forensic Case
              </div>
              {allCases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentCaseId(c.id);
                    setShowCaseDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    c.id === currentCaseId ? 'bg-blue-50/60 font-semibold text-blue-900' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold">{c.id}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{c.title}</div>
                  </div>
                  {c.id === currentCaseId && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Case Risk Badge */}
        {currentCase && (
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Risk Score:</span>
            <span className={`font-bold ${
              currentCase.riskScore > 80 ? 'text-rose-600' : currentCase.riskScore > 50 ? 'text-amber-600' : 'text-blue-600'
            }`}>
              {currentCase.riskScore}/100
            </span>
          </div>
        )}
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Global search: IP, process, hash, IOC, rule..."
            className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Telemetry status + Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* System Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>24 Systems Online</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-slate-200 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Forensic Alerts</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 text-xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-rose-600 font-semibold mb-0.5">
                    <AlertCircle className="w-3.5 h-3.5" /> High Entropy DLL Detected
                  </div>
                  <p className="text-slate-600 text-[11px]">stager_drop.dll dropped on WIN-FORENSIC-01</p>
                  <span className="text-[10px] text-slate-400">3 minutes ago</span>
                </div>
                <div className="p-3 text-xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-1.5 text-blue-600 font-semibold mb-0.5">
                    <Activity className="w-3.5 h-3.5" /> Live Acquisition Complete
                  </div>
                  <p className="text-slate-600 text-[11px]">Memory dump acquired for Case JCK-2026-001</p>
                  <span className="text-[10px] text-slate-400">12 minutes ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
            SC
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900">Dr. Sarah Chen</div>
            <div className="text-[10px] text-slate-500 font-medium">CISSP, Forensic Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
