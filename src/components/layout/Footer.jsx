import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Leaf, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-600/30">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-900 font-display">Circular Exchange</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              The premier B2B circular marketplace matching industrial surplus packaging and recyclable materials with certified processors.
            </p>
            <div className="flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero landfill target protocol</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-3 font-display">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="hover:text-blue-600 transition">Browse All Materials</Link></li>
              <li><Link to="/marketplace?category=cardboard" className="hover:text-blue-600 transition">Corrugated & Cardboard</Link></li>
              <li><Link to="/marketplace?category=plastics" className="hover:text-blue-600 transition">Rigid & Film Polymers</Link></li>
              <li><Link to="/marketplace?category=pallets" className="hover:text-blue-600 transition">Wooden Pallets (ISPM-15)</Link></li>
              <li><Link to="/marketplace?category=containers" className="hover:text-blue-600 transition">IBC Totes & Steel Drums</Link></li>
            </ul>
          </div>

          {/* Enterprise & ESG */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-3 font-display">Circular Intelligence</h4>
            <ul className="space-y-2">
              <li><Link to="/impact" className="hover:text-blue-600 transition">Scope 3 CO2e Telemetry</Link></li>
              <li><Link to="/requests" className="hover:text-blue-600 transition">Submit RFQ / Material Request</Link></li>
              <li><Link to="/logistics" className="hover:text-blue-600 transition">Green Freight Dispatch</Link></li>
              <li><Link to="/admin" className="hover:text-blue-600 transition">Facility Compliance & Audits</Link></li>
            </ul>
          </div>

          {/* Standards & Trust */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-3 font-display">Security & Trust</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Verified Facilities Only</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>ISPM-15 & DOT Certified</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Escrow protected industrial payment settlements and chain of custody tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Circular Exchange Inc. Hackathon Edition. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition">Terms of Service</Link>
            <Link to="/compliance" className="hover:text-blue-600 transition">Material Grading Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
