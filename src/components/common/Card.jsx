import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border transition-all duration-200
        ${glass ? 'bg-white/90 backdrop-blur-md border-slate-200/80 shadow-card' : 'bg-white border-slate-200 shadow-card'}
        ${hoverEffect ? 'hover:border-blue-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`p-5 pb-4 border-b border-slate-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`font-bold text-slate-900 tracking-tight font-display ${className}`}>
    {children}
  </h3>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 pt-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl ${className}`}>
    {children}
  </div>
);

export default Card;
