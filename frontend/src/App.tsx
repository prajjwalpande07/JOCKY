import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InvestigationProvider } from './context/InvestigationContext';
import { Layout } from './components/layout/Layout';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { InvestigationsPage } from './pages/InvestigationsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { StudioPage } from './pages/StudioPage';
import { ReferencePage } from './pages/ReferencePage';
import { CompilerPage } from './pages/CompilerPage';
import { SystemsPage } from './pages/SystemsPage';
import { ProcessesPage } from './pages/ProcessesPage';
import { FilesPage } from './pages/FilesPage';
import { NetworkPage } from './pages/NetworkPage';
import { LogsPage } from './pages/LogsPage';
import { EvidencePage } from './pages/EvidencePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { FindingsPage } from './pages/FindingsPage';
import { TimelinePage } from './pages/TimelinePage';
import { ManagementPage } from './pages/ManagementPage';
import { ValidationPage } from './pages/ValidationPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditPage } from './pages/AuditPage';
import { LearningPage } from './pages/LearningPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export function App() {
  return (
    <InvestigationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="investigations" element={<InvestigationsPage />} />
            <Route path="workspace" element={<WorkspacePage />} />
            <Route path="workspace/:id" element={<WorkspacePage />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="reference" element={<ReferencePage />} />
            <Route path="compiler" element={<CompilerPage />} />
            <Route path="systems" element={<SystemsPage />} />
            <Route path="processes" element={<ProcessesPage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="network" element={<NetworkPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="evidence" element={<EvidencePage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="findings" element={<FindingsPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="management" element={<ManagementPage />} />
            <Route path="validation" element={<ValidationPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </InvestigationProvider>
  );
}

export default App;
