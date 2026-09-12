import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Loading = ({
  message = 'Loading data...',
  fullScreen = false,
  size = 'md',
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
        <RefreshCw className="w-5 h-5 text-brand-400 absolute" />
      </div>
      {message && <p className="mt-4 text-sm font-medium text-slate-400">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
