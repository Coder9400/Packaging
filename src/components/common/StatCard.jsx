import React from 'react';
import Card from './Card';

export const StatCard = ({
  title,
  value,
  unit,
  change,
  trend = 'up',
  icon: Icon,
  iconColor = 'text-brand-400',
  iconBg = 'bg-brand-500/10',
  description,
  className = '',
}) => {
  return (
    <Card className={`p-5 relative overflow-hidden bg-white border-slate-200/90 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">{value}</span>
            {unit && <span className="text-xs text-slate-500 font-medium">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border border-blue-100 ${iconBg || 'bg-blue-50'} ${iconColor || 'text-blue-600'} shrink-0 shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div className={`flex items-center gap-1 font-semibold ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
              <span>{change}</span>
            </div>
          )}
          {description && (
            <span className="text-slate-400 ml-auto truncate">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
