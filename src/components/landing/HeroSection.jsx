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
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50 to-blue-50/30">
      {/* Subtle Blue Glow Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtext, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Pill Badge */}
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100/80 transition group shadow-sm"
            >
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                NEW
              </span>
              <span>Synapse 2.0 is live</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-display">
              The All-in-One B2B Platform for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Circular Packaging
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Synapse helps you buy, sell, request, and transport secondary raw materials — all in one powerful connected platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                to="/register"
                size="lg"
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                className="shadow-glow-blue"
              >
                Start Your Free Trial
              </Button>

              <Button
                to="/marketplace"
                size="lg"
                variant="outline"
                icon={Sparkles}
              >
                Explore Marketplace
              </Button>
            </div>

            {/* Checkmarks Strip */}
            <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>14-day enterprise trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right Column: Nexora-style Elevated SaaS Dashboard Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-float p-5 sm:p-7 space-y-6 backdrop-blur-xl">
              {/* Mockup Top Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 font-display block">Dashboard Command</span>
                    <span className="text-[11px] text-slate-400">Welcome back, Apex Logistics!</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    ● Live Telemetry
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards Row */}
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Revenue</span>
                  <span className="text-base font-extrabold text-slate-900 font-display block mt-0.5">₹24,980</span>
                  <span className="text-[10px] font-bold text-emerald-600">+12.4%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Active Lots</span>
                  <span className="text-base font-extrabold text-slate-900 font-display block mt-0.5">128</span>
                  <span className="text-[10px] font-bold text-blue-600">+8.1%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tons Diverted</span>
                  <span className="text-base font-extrabold text-slate-900 font-display block mt-0.5">1,245</span>
                  <span className="text-[10px] font-bold text-indigo-600">+18.7%</span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-white border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Circular Exchange Growth</span>
                  <span className="text-[11px] font-semibold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-sm">
                    This Month ▾
                  </span>
                </div>
                <div className="h-16 w-full flex items-end justify-between gap-1 pt-2">
                  {[35, 45, 30, 65, 80, 55, 90, 70, 95, 110, 85, 120].map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-blue-600 rounded-t-sm hover:bg-indigo-600 transition"
                      style={{ height: `${(h / 120) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block text-left">
                  Recent Platform Events
                </span>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">25 Tons Grade OCC Sold</p>
                      <p className="text-[10px] text-slate-500">VerdeTech Polymers</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">2m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
