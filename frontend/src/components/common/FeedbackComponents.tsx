import React from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../context/InvestigationContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 sm:px-6">
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          {totalItems !== undefined && itemsPerPage !== undefined && (
            <p className="text-xs text-slate-500">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-50 rounded-md border border-slate-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((t) => {
        let border = 'border-blue-200 bg-white';
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (t.type === 'success') {
          border = 'border-emerald-200 bg-white';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (t.type === 'warning') {
          border = 'border-amber-200 bg-white';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        } else if (t.type === 'error') {
          border = 'border-rose-200 bg-white';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        }

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${border} transition-all duration-300 animate-slideUp`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => onRemove(t.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading forensic telemetry...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
    <p className="text-xs font-medium text-slate-500">{message}</p>
  </div>
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, actionText, onAction }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-card">
    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
      <AlertCircle className="w-6 h-6" />
    </div>
    <h4 className="text-sm font-bold text-slate-800">{title}</h4>
    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">{description}</p>
    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);
