import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: ReactNode;
  iconBg?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon,
  iconBg = 'bg-blue-50 text-blue-700',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-card transition-all duration-200 hover:shadow-card-hover ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      {(subtitle || change) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-semibold ${
                trend === 'up'
                  ? 'text-rose-600'
                  : trend === 'down'
                  ? 'text-emerald-600'
                  : 'text-slate-600'
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
