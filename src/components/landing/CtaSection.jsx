import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlusSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const CtaSection = () => {
  return (
    <section className="py-20 border-b border-slate-200/80 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-12 lg:p-16 text-center space-y-8 overflow-hidden shadow-glow-blue">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
              Build the circular supply chain with Synapse.
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-medium">
              Join hundreds of manufacturers, retailers, and recyclers already reducing landfill overhead and monetizing secondary raw materials.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
            <Button
              to="/marketplace"
              size="lg"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-slate-50 font-bold shadow-lg shadow-blue-900/20 rounded-xl"
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore Marketplace
            </Button>
            <Button
              to="/register"
              size="lg"
              className="w-full sm:w-auto bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/30 font-bold rounded-xl"
            >
              Join Synapse
            </Button>
          </div>

          <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100 font-medium relative z-10">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Zero setup fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Escrow protected settlements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Verified enterprise facilities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
