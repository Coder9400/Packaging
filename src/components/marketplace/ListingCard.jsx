import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Leaf, ArrowUpRight, Scale, Box } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const ListingCard = ({ listing }) => {
  return (
    <Card hoverEffect className="flex flex-col h-full overflow-hidden group">
      {/* Image Preview with Badges */}
      <div className="relative h-44 w-full bg-slate-850 overflow-hidden">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30" />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant="teal" size="xs" className="backdrop-blur-md bg-teal-950/80">
            {listing.category}
          </Badge>
          {listing.featured && (
            <Badge variant="emerald" size="xs" className="backdrop-blur-md bg-emerald-950/80">
              Featured Lot
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="truncate max-w-[150px]">{listing.sellerLocation}</span>
          </div>
          <span className="font-semibold text-emerald-400 flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            <span>{listing.estimatedCo2eSavings} t CO₂e</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-[11px] font-medium text-slate-400 mb-1">{listing.sellerName}</p>
          <Link to={`/marketplace/${listing.id}`}>
            <h4 className="text-sm font-semibold text-white group-hover:text-brand-400 transition line-clamp-2">
              {listing.title}
            </h4>
          </Link>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{listing.materialSubtype}</p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 block">Available Qty</span>
            <span className="text-slate-200 font-semibold">
              {formatNumber(listing.availableQuantity)} {listing.unit}s
            </span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 block">Condition</span>
            <span className="text-slate-200 font-semibold truncate block">{listing.condition}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price per {listing.unit}</span>
            <div className="text-base font-bold text-brand-400">
              {formatCurrency(listing.pricePerUnit)}
              <span className="text-xs font-normal text-slate-400"> / {listing.unit}</span>
            </div>
          </div>

          <Link
            to={`/marketplace/${listing.id}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-300 transition group/btn"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ListingCard;
