import React from 'react';

const badgeVariants = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-blue-50 text-blue-600 border-blue-200',
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

const badgeSizes = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon: Icon,
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${badgeVariants[variant] || badgeVariants.default}
        ${badgeSizes[size] || badgeSizes.sm}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
