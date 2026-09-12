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
    <Card className={`p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
            {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border border-white/5 ${iconBg} ${iconColor} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {change && (
            <div className={`flex items-center gap-1 font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'}`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
              <span>{change}</span>
            </div>
          )}
          {description && (
            <span className="text-slate-500 ml-auto truncate">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
