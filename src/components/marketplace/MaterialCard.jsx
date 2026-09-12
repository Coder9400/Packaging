import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Leaf,
  ArrowRight,
  Repeat,
  Recycle,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatNumber } from '../../utils/formatters';

export const MaterialCard = ({ material }) => {
  const getConditionStyle = (cond) => {
    switch (cond?.toLowerCase()) {
      case 'new':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'good':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'used':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getMaterialTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'reusable':
        return (
          <Badge variant="blue" size="xs" icon={Repeat}>
            Reusable
          </Badge>
        );
      case 'recyclable':
        return (
          <Badge variant="emerald" size="xs" icon={Recycle}>
            Recyclable
          </Badge>
        );
      case 'both':
      default:
        return (
          <Badge variant="blue" size="xs" icon={Sparkles}>
            Reusable & Recyclable
          </Badge>
        );
    }
  };

  return (
    <Card
      hoverEffect
      className="flex flex-col justify-between overflow-hidden group border-slate-200/90 hover:border-blue-300 shadow-card hover:shadow-card-hover bg-white"
    >
      {/* Visual / Image Banner */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-200">
        <img
          src={material.images ? material.images[0] : 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
          alt={material.title || material.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap">
          <Badge variant="default" size="xs" className="bg-white/90 backdrop-blur-md border-slate-200 text-slate-900 font-bold shadow-sm">
            {material.category}
          </Badge>
          {getMaterialTypeBadge(material.materialType)}
        </div>

        {/* Bottom Image Overlay Strip */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-xl">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate max-w-[150px] font-semibold text-white">
              {material.location || material.sellerLocation}
            </span>
          </div>

          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getConditionStyle(
              material.condition
            )}`}
          >
            {material.condition} Condition
          </span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Seller / Company with Verified Badge */}
          <div className="flex items-center justify-between text-[11px] gap-2">
            <div className="flex items-center gap-1.5 text-slate-500 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-semibold">{material.companyName || material.sellerName}</span>
            </div>
            {material.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Business</span>
              </span>
            )}
          </div>

          {/* Material Name */}
          <Link to={`/marketplace/${material.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mt-1 font-display">
              {material.title || material.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-1">
            Subtype: <span className="text-slate-700 font-medium">{material.materialSubtype || 'Standard Feedstock'}</span>
          </p>
        </div>

        {/* Specs & Commercial Terms */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Available Quantity</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5 block font-display">
                {formatNumber(material.availableQuantity || material.totalQuantity)} {material.unit}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Lot Price</span>
              <span className="font-extrabold text-blue-600 text-xs sm:text-sm mt-0.5 block font-display">
                {material.price || `₹${material.pricePerUnit}/${material.unit}`}
              </span>
            </div>
          </div>

          <Button
            to={`/marketplace/${material.id}`}
            variant="secondary"
            size="sm"
            className="w-full group/btn justify-between"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MaterialCard;
