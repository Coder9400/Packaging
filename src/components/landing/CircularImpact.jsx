import React from 'react';
import { IMPACT_STATISTICS } from '../../data/metrics';
import { Trash2, Boxes, Leaf, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const impactIcons = {
  Trash2,
  Boxes,
  Leaf,
  TrendingDown
};

export const CircularImpact = () => {
  return (
    <section id="impact" className="py-24 border-b border-slate-800/80 bg-slate-900/60 relative overflow-hidden">
      {/* Background Subtle Accent Gradients */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="emerald" size="sm">Audited Environmental Impact</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Every reused material is one less material sent to landfill.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transparent circular economy accounting aligned with EPA WARM standard emissions offsets.
          </p>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {IMPACT_STATISTICS.map((stat) => {
            const Icon = impactIcons[stat.iconName] || Leaf;
            return (
              <div
                key={stat.id}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 text-[10px] text-emerald-400 font-mono">
                  Verified by ISO 14044 LCA
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <Button to="/impact" variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
            View Detailed Scope 3 ESG Telemetry
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CircularImpact;
