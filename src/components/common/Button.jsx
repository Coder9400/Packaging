import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-600/30 active:scale-[0.98]',
  secondary: 'bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200/80 active:scale-[0.98]',
  outline: 'bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 shadow-sm active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-medium',
  danger: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-medium',
  accent: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm active:scale-[0.98]',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-full',
  sm: 'px-3.5 py-1.5 text-xs rounded-full',
  md: 'px-4.5 py-2 text-sm rounded-full',
  lg: 'px-6 py-2.5 text-sm rounded-full',
  xl: 'px-7 py-3 text-base rounded-full',
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

