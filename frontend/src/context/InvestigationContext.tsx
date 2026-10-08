import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Investigation } from '../types';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface InvestigationContextType {
  currentCaseId: string;
  currentCase: Investigation | null;
  setCurrentCaseId: (id: string) => void;
  allCases: Investigation[];
  reloadCases: () => Promise<void>;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCaseId, setCurrentCaseId] = useState<string>('JCK-2026-001');
  const [currentCase, setCurrentCase] = useState<Investigation | null>(null);
  const [allCases, setAllCases] = useState<Investigation[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([
    {
      id: 'toast-init-1',
      type: 'info',
      title: 'JOCKY Forensic Runtime Active',
      message: 'Connected to 24 systems across Windows & Ubuntu fleets.'
    }
  ]);

  const reloadCases = async () => {
    try {
      const cases = await api.getInvestigations();
      setAllCases(cases);
      const active = cases.find(c => c.id === currentCaseId) || cases[0] || null;
      setCurrentCase(active);
    } catch (e) {
      console.error('Failed to load investigations', e);
    }
  };

  useEffect(() => {
    reloadCases();
  }, [currentCaseId]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <InvestigationContext.Provider
      value={{
        currentCaseId,
        currentCase,
        setCurrentCaseId,
        allCases,
        reloadCases,
        globalSearch,
        setGlobalSearch,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const ctx = useContext(InvestigationContext);
  if (!ctx) throw new Error('useInvestigation must be used within an InvestigationProvider');
  return ctx;
};
