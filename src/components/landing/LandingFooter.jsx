import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Leaf, ShieldCheck, Globe } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="bg-white text-slate-500 text-xs border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Block */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-600/30">
                <Recycle className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-display">SYNAPSE</span>
                <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase">
                  Circular 2.0
                </span>
              </div>
            </Link>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              The premier B2B marketplace for surplus packaging materials and industrial secondary feedstock. Eliminating industrial landfill waste through closed-loop exchange.
            </p>

            <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>EPA Scope 3 & ISPM-15 Certified Accounting</span>
            </div>
          </div>

          {/* Navigation Column 1: Marketplace */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider font-display">
              Marketplace
            </h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="hover:text-blue-600 transition">All Materials</Link></li>
              <li><Link to="/marketplace?category=cardboard" className="hover:text-blue-600 transition">Cardboard & OCC</Link></li>
              <li><Link to="/marketplace?category=plastic" className="hover:text-blue-600 transition">Plastics & Polymers</Link></li>
              <li><Link to="/marketplace?category=pallets" className="hover:text-blue-600 transition">Wooden Pallets</Link></li>
              <li><Link to="/marketplace?category=industrial" className="hover:text-blue-600 transition">IBC Containers</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider font-display">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a></li>
              <li><a href="#impact" className="hover:text-blue-600 transition">Circular Impact</a></li>
              <li><Link to="/requests" className="hover:text-blue-600 transition">Material Requests (RFQ)</Link></li>
              <li><Link to="/logistics" className="hover:text-blue-600 transition">Green Freight Dispatch</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-600 transition">Enterprise Portal</Link></li>
            </ul>
          </div>

          {/* Navigation Column 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider font-display">
              About & Trust
            </h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link to="/admin" className="hover:text-blue-600 transition">Facility Compliance</Link></li>
              <li><Link to="/messages" className="hover:text-blue-600 transition">Contact & Support</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Synapse Circular Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified B2B Escrow</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Landfill Net</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
