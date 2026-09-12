import React from 'react';
import { TRUST_METRICS } from '../../data/metrics';
import { Leaf, Building2, Boxes, TrendingDown } from 'lucide-react';

const iconMap = {
  diverted: Leaf,
  businesses: Building2,
  listings: Boxes,
  savings: TrendingDown
};

export const MetricsStrip = () => {
  return (
    <section className="py-12 bg-slate-900/40 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_METRICS.map((item) => {
            const IconComponent = iconMap[item.id] || Leaf;
            return (
              <div
                key={item.id}
                className="flex flex-col p-5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition duration-150 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {item.value}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MetricsStrip;
