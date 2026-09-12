import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-slate-950 font-semibold shadow-lg shadow-brand-500/20 active:scale-[0.98]',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium active:scale-[0.98]',
  outline: 'bg-transparent hover:bg-brand-500/10 text-brand-400 border border-brand-500/30 hover:border-brand-500/60 font-medium',
  ghost: 'bg-transparent hover:bg-slate-800/80 text-slate-300 hover:text-white font-medium',
  danger: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-medium',
  accent: 'bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold shadow-lg shadow-teal-500/20 active:scale-[0.98]',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-xl',
  xl: 'px-6 py-3 text-lg rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  to,
  onClick,
  ...props
}) => {
  const combinedClassName = `
    inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${className}
  `;

  const content = (
    <>
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin pointer-events-none" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 shrink-0 pointer-events-none" />
      ) : null}

      <span className="pointer-events-none">{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0 pointer-events-none" />
      )}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={combinedClassName}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;

