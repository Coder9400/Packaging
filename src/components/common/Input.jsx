import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold text-slate-700 tracking-wider uppercase mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`
            block w-full rounded-xl bg-white border text-slate-900 placeholder-slate-400
            text-sm py-2.5 transition duration-150 ease-in-out shadow-sm
            focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600
            ${Icon ? 'pl-10' : 'pl-3.5'}
            pr-3.5
            ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15' : 'border-slate-200 hover:border-slate-300'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
