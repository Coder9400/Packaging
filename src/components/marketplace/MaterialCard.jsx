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
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'good':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'used':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const getMaterialTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'reusable':
        return (
          <Badge variant="teal" size="xs" icon={Repeat}>
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
          <Badge variant="brand" size="xs" icon={Sparkles}>
            Reusable & Recyclable
          </Badge>
        );
    }
  };

  return (
    <Card
      hoverEffect
      className="flex flex-col justify-between overflow-hidden group border-slate-800/80 hover:border-slate-700 bg-slate-900/90"
    >
      {/* Visual / Image Banner */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
        <img
          src={material.images ? material.images[0] : 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
          alt={material.title || material.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 flex-wrap">
          <Badge variant="default" size="xs" className="bg-slate-900/90 backdrop-blur-md border-slate-700 text-white font-medium">
            {material.category}
          </Badge>
          {getMaterialTypeBadge(material.materialType)}
        </div>

        {/* Bottom Image Overlay Strip */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[150px] font-medium text-slate-200">
              {material.location || material.sellerLocation}
            </span>
          </div>

          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getConditionStyle(
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
            <div className="flex items-center gap-1.5 text-slate-400 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate font-medium">{material.companyName || material.sellerName}</span>
            </div>
            {material.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Business</span>
              </span>
            )}
          </div>

          {/* Material Name */}
          <Link to={`/marketplace/${material.id}`}>
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-2 mt-1">
              {material.title || material.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-1">
            Subtype: <span className="text-slate-300">{material.materialSubtype || 'Standard Feedstock'}</span>
          </p>
        </div>

        {/* Specs & Commercial Terms */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Available Quantity</span>
              <span className="font-bold text-white text-xs sm:text-sm mt-0.5 block">
                {formatNumber(material.availableQuantity || material.totalQuantity)} {material.unit}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Lot Price</span>
              <span className="font-bold text-emerald-400 text-xs sm:text-sm mt-0.5 block">
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
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MaterialCard;
