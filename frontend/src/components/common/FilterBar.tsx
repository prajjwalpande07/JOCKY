import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by keyword, hash, IP or artifact...',
  className = ''
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (val: string) => void;
  label?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selectedValue,
  onChange,
  label
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
      {label && (
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>{label}:</span>
        </div>
      )}
      <div className="flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60 shrink-0">
        {options.map((opt) => {
          const isActive = selectedValue === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
