import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Leaf, ArrowUpRight, Scale, Box } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const ListingCard = ({ listing }) => {
  return (
    <Card hoverEffect className="flex flex-col h-full overflow-hidden group bg-white border-slate-200/90 shadow-card hover:shadow-card-hover">
      {/* Image Preview with Badges */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant="blue" size="xs">
            {listing.category}
          </Badge>
          {listing.featured && (
            <Badge variant="emerald" size="xs">
              Featured Lot
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-xl">
          <div className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate max-w-[150px]">{listing.sellerLocation}</span>
          </div>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span>{listing.estimatedCo2eSavings} t CO₂e</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 mb-1">{listing.sellerName}</p>
          <Link to={`/marketplace/${listing.id}`}>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 font-display">
              {listing.title}
            </h4>
          </Link>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{listing.materialSubtype}</p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block font-bold">Available Qty</span>
            <span className="text-slate-900 font-bold">
              {formatNumber(listing.availableQuantity)} {listing.unit}s
            </span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block font-bold">Condition</span>
            <span className="text-slate-900 font-bold truncate block">{listing.condition}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price per {listing.unit}</span>
            <div className="text-base font-extrabold text-blue-600 font-display">
              {formatCurrency(listing.pricePerUnit)}
              <span className="text-xs font-normal text-slate-500"> / {listing.unit}</span>
            </div>
          </div>

          <Link
            to={`/marketplace/${listing.id}`}
            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition group/btn shadow-sm"
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
