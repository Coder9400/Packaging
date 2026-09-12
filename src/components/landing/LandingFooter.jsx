import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Leaf, ShieldCheck, Globe } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Block */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Recycle className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-white">Circular</span>
                <span className="font-bold text-sm text-emerald-400">Exchange</span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier B2B marketplace for surplus packaging materials and industrial secondary feedstock. Eliminating industrial landfill waste through closed-loop exchange.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 font-medium text-[11px]">
              <Leaf className="w-3.5 h-3.5" />
              <span>EPA Scope 3 & ISPM-15 Certified Accounting</span>
            </div>
          </div>

          {/* Navigation Column 1: Marketplace */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="hover:text-white transition">All Materials</Link></li>
              <li><Link to="/marketplace?category=cardboard" className="hover:text-white transition">Cardboard & OCC</Link></li>
              <li><Link to="/marketplace?category=plastic" className="hover:text-white transition">Plastics & Polymers</Link></li>
              <li><Link to="/marketplace?category=pallets" className="hover:text-white transition">Wooden Pallets</Link></li>
              <li><Link to="/marketplace?category=industrial" className="hover:text-white transition">IBC Containers</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#impact" className="hover:text-white transition">Circular Impact</a></li>
              <li><Link to="/requests" className="hover:text-white transition">Material Requests (RFQ)</Link></li>
              <li><Link to="/logistics" className="hover:text-white transition">Green Freight Dispatch</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition">Enterprise Portal</Link></li>
            </ul>
          </div>

          {/* Navigation Column 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider">
              About & Trust
            </h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Facility Compliance</Link></li>
              <li><Link to="/messages" className="hover:text-white transition">Contact & Support</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Circular Exchange Inc. Hackathon Edition. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified B2B Escrow</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Zero Landfill Net</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
