import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  value,
  onChange,
  placeholder = 'Select an option',
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-slate-300 tracking-wide uppercase"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`
            block w-full appearance-none rounded-lg bg-slate-900/80 border text-slate-100
            text-sm py-2.5 pl-3.5 pr-10 transition duration-150 ease-in-out cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
            ${error ? 'border-rose-500/80' : 'border-slate-700/80 hover:border-slate-600'}
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="" className="bg-slate-900 text-slate-400">{placeholder}</option>}
          {options.map((opt) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-slate-900 text-slate-100">
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;
