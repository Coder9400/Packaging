import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_MATERIALS } from '../../data/materials';
import { MapPin, Building2, Leaf, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const FeaturedMaterials = () => {
  return (
    <section className="py-20 border-b border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <Badge variant="blue" size="sm">Live Feedstock Supply</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 font-display">
              Featured Surplus Packaging Lots
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Verified bulk material quantities ready for commercial pickup or freight dispatch.
            </p>
          </div>

          <Button to="/marketplace" variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
            View All Marketplace Lots
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_MATERIALS.map((material) => (
            <Card
              key={material.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden group border-slate-200/90 hover:border-blue-300 shadow-card hover:shadow-card-hover bg-white"
            >
              {/* Styled Div Geometric Placeholder (No Stock Photos) */}
              <div className="relative h-44 w-full bg-slate-100/70 border-b border-slate-200 flex flex-col justify-between p-4 overflow-hidden">
                {/* Geometric Abstract Pattern Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-0 right-0 w-36 h-36 border border-blue-500/30 rounded-full -mr-10 -mt-10" />
                  <div className="absolute bottom-0 left-0 w-28 h-28 border border-indigo-500/20 rounded-lg -ml-6 -mb-6 rotate-12" />
                  <div className="w-full h-full bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <Badge variant="blue" size="xs">
                    {material.category}
                  </Badge>
                  <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {material.badge}
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{material.location}</span>
                  </div>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>{material.co2eAvoided}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{material.companyName}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 font-display">
                    {material.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    Condition: <span className="text-slate-700 font-medium">{material.condition}</span>
                  </p>
                </div>

                {/* Specs & Pricing Matrix */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block font-medium">Available Qty</span>
                      <span className="font-bold text-slate-900">{material.quantity}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
                      <span className="text-[10px] text-slate-500 block font-medium">Lot Rate</span>
                      <span className="font-extrabold text-blue-600">{material.price}</span>
                    </div>
                  </div>

                  <Button to={`/marketplace/${material.id}`} variant="secondary" size="sm" className="w-full">
                    View Material Lot
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMaterials;
