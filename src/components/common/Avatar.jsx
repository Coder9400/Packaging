import React from 'react';

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

export const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  status,
}) => {
  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover border border-slate-700/80`}
        />
      ) : (
        <div
          className={`
            ${sizeClasses[size] || sizeClasses.md}
            rounded-full bg-gradient-to-br from-brand-600 to-teal-700
            text-white font-semibold flex items-center justify-center border border-slate-700/80
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-slate-900
            ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'}
            ${status === 'online' ? 'bg-emerald-500' : status === 'busy' ? 'bg-amber-500' : 'bg-slate-500'}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
