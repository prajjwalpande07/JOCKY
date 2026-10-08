import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../common/FeedbackComponents';
import { useInvestigation } from '../../context/InvestigationContext';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, removeToast } = useInvestigation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>JOCKY Framework v2.4.0</strong> — Cross-Platform Forensic Analysis & Threat Hunting
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            SHA-256 Engine: ONLINE • Architecture: Windows/Ubuntu Hybrid
          </div>
        </footer>
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
