import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PlusSquare,
  Building2,
  Package,
  Recycle,
  Repeat,
  Factory,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80 bg-slate-950">
      {/* Subtle Ambient Radial Highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle Category Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>B2B Circular Packaging & Secondary Raw Materials Exchange</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Give Packaging a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">Second Life.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect businesses with surplus packaging materials to the companies that can reuse or recycle them.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button to="/marketplace" size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
              Explore Materials
            </Button>
            <Button to="/list-material" size="lg" variant="secondary" icon={PlusSquare} className="w-full sm:w-auto">
              List Your Materials
            </Button>
          </div>
        </div>

        {/* Original Circular Flow Diagram Visual (SVG & Geometric CSS Flow) */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-center mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                Closed-Loop Industrial Material Flow
              </span>
            </div>

            {/* Step Nodes Flow Container */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative items-center">
              {/* Node 1: Business */}
              <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white">Business</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Manufacturing / Retail</span>
              </div>

              {/* Connector 1 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                <span className="text-[10px] text-slate-500 font-mono mb-0.5">Generates</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-slate-700 to-emerald-500/50 relative">
                  <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-emerald-400 rotate-45" />
                </div>
              </div>

              {/* Node 2: Surplus Material */}
              <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-2">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white">Surplus Material</span>
                <span className="text-[10px] text-teal-400/80 mt-0.5">Cardboard, Pallets, Resin</span>
              </div>

              {/* Connector 2 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                <span className="text-[10px] text-emerald-400 font-mono mb-0.5">Matches</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-teal-500/50 to-emerald-500 relative">
                  <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-emerald-400 rotate-45" />
                </div>
              </div>

              {/* Central Hub Node 3: Circular Exchange */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-b from-emerald-950/40 to-slate-950 border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 mb-2 font-bold">
                  <Recycle className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white">Circular Exchange</span>
                <span className="text-[10px] text-emerald-400 mt-0.5 font-medium">B2B Network & Escrow</span>
              </div>
            </div>

            {/* Bottom Row Return Flow for Complete Circular Loop */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-800/60 items-center">
              <div className="hidden md:block col-span-2 text-right pr-4">
                <span className="text-[11px] text-emerald-400 font-medium">
                  Zero landfill waste loop ➔
                </span>
              </div>

              {/* Node 4: Reuse / Recycle */}
              <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                  <Repeat className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white">Reuse / Recycle</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Clean Repulping & Regrind</span>
              </div>

              {/* Connector 3 */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                <span className="text-[10px] text-slate-500 font-mono mb-0.5">Feeds</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-slate-700 relative">
                  <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-slate-400 rotate-45" />
                </div>
              </div>

              {/* Node 5: New Business Production */}
              <div className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-2">
                  <Factory className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-white">New Business</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Secondary Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
