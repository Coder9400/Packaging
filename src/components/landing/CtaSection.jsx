import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const CtaSection = () => {
  return (
    <section className="py-20 border-b border-slate-800/80 bg-slate-950 relative overflow-hidden">
      {/* Background Subtle Gradient Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 text-center space-y-8 overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Turn surplus into opportunity.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Join hundreds of manufacturers, retailers, and recyclers already reducing landfill overhead and monetizing secondary raw materials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
            <Button to="/list-material" size="lg" variant="primary" icon={PlusSquare} className="w-full sm:w-auto">
              List Your Material
            </Button>
            <Button to="/marketplace" size="lg" variant="secondary" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
              Explore Marketplace
            </Button>
          </div>

          <div className="pt-6 border-t border-slate-850 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 relative z-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero setup fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Escrow protected settlements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified enterprise facilities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
