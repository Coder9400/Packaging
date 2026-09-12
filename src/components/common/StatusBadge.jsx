import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';

export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const badgeStyle = getStatusBadgeStyle(status);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'}
        ${badgeStyle}
        ${className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
