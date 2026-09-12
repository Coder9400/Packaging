import React from 'react';
import {
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  Fuel,
  ShieldCheck,
  Phone,
  User,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency } from '../../utils/formatters';

export const VisualRouteVisualizer = ({ shipment }) => {
  if (!shipment) return null;

  return (
    <div className="space-y-6">
      {/* Route Header Card */}
      <Card className="p-6 space-y-6 bg-slate-900/90 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight font-mono">
                {shipment.trackingNumber}
              </h3>
              <StatusBadge status={shipment.status} />
              <Badge variant="teal" size="xs">
                {shipment.category}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cargo: <span className="text-white font-semibold">{shipment.material}</span> ({shipment.quantity} {shipment.unit})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">ETA:</span>
            <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {shipment.eta}
            </span>
          </div>
        </div>

        {/* CSS/Lucide Visual Route Diagram */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-20 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
            {/* Origin Node */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Origin (Pickup)
                </span>
                <h4 className="text-base font-extrabold text-white truncate">{shipment.originCity}</h4>
                <p className="text-[11px] text-slate-400 truncate">{shipment.pickupLocation}</p>
              </div>
            </div>

            {/* Middle Vector Connector with Distance, Time & Cost */}
            <div className="flex flex-col items-center justify-center text-center px-2 py-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex items-center gap-3 text-xs font-bold text-white mb-2">
                <span className="text-emerald-400 font-mono">{shipment.distanceKm} km</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{shipment.travelTime}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-teal-400 font-mono font-bold">
                  {formatCurrency(shipment.logisticsCost, 'INR')}
                </span>
              </div>

              {/* Animated Progress Track */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${shipment.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full mt-1.5 text-[10px] text-slate-500 font-mono">
                <span>Departed</span>
                <span className="text-emerald-400 font-bold">{shipment.progressPercent}% Completed</span>
                <span>Arriving</span>
              </div>
            </div>

            {/* Destination Node */}
            <div className="flex items-start gap-3.5 md:justify-end text-left md:text-right">
              <div className="space-y-0.5 min-w-0 order-2 md:order-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Destination (Delivery)
                </span>
                <h4 className="text-base font-extrabold text-white truncate">{shipment.destinationCity}</h4>
                <p className="text-[11px] text-slate-400 truncate">{shipment.deliveryLocation}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shrink-0 order-1 md:order-2">
                <Navigation className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Live Location Callout */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400 font-medium">Current Telemetry:</span>
            <span className="font-semibold text-white truncate">{shipment.currentLocation}</span>
          </div>

          <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline">
            Carrier: {shipment.logisticsPartner}
          </span>
        </div>
      </Card>

      {/* Driver, Vehicle & Waypoints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Driver & Vehicle Telemetry (Cols 5) */}
        <Card className="lg:col-span-5 p-6 space-y-4">
          <CardTitle className="text-sm font-bold text-white">
            Vehicle & Dispatch Details
          </CardTitle>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Logistics Carrier</span>
              <p className="font-bold text-white text-sm">{shipment.logisticsPartner}</p>
              <p className="text-[11px] text-emerald-400 font-medium">Certified Green Fleet Partner</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned Vehicle</span>
                <span className="font-semibold text-white mt-0.5 block">{shipment.vehicleType}</span>
                <span className="text-[10px] text-slate-400 font-mono">{shipment.vehicleReg}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified Driver</span>
                <span className="font-semibold text-white mt-0.5 block">{shipment.driverName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{shipment.driverPhone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scope 3 Freight Optimization</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {shipment.routeOptimization.carbonSaved} via return leg backhaul consolidation.
              </p>
            </div>
          </div>
        </Card>

        {/* Right: Waypoints Progress Timeline (Cols 7) */}
        <Card className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white">
              Route Waypoint Milestones
            </CardTitle>
            <span className="text-[11px] text-slate-400 font-mono">
              {shipment.waypoints.filter((w) => w.status === 'completed').length} of {shipment.waypoints.length} Passed
            </span>
          </div>

          <div className="space-y-4 pl-2 border-l-2 border-slate-800 text-xs">
            {shipment.waypoints.map((wp, idx) => (
              <div key={idx} className="relative pl-6 space-y-0.5">
                <div
                  className={`
                    absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px]
                    ${wp.status === 'completed'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : wp.status === 'current'
                        ? 'bg-amber-500 text-slate-950 animate-pulse ring-4 ring-amber-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'}
                  `}
                >
                  {wp.status === 'completed' ? '✓' : idx + 1}
                </div>

                <div className="flex items-center justify-between">
                  <h5 className={`font-bold text-xs ${wp.status === 'completed' ? 'text-white' : wp.status === 'current' ? 'text-amber-300' : 'text-slate-400'}`}>
                    {wp.name}
                  </h5>
                  <span className="text-[11px] text-slate-500 font-mono">{wp.time}</span>
                </div>

                <p className="text-[11px] text-slate-400">{wp.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SECTION: ROUTE OPTIMIZATION SHOWCASE */}
      <Card className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/25">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <CardTitle className="text-base font-bold text-white">
                Circular Backhaul Route Optimization
              </CardTitle>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Matching returning empty freight trailers with packaging material pickups to slash transport costs and carbon emissions.
            </p>
          </div>

          <Badge variant="emerald" size="sm">
            AI Backhaul Matched
          </Badge>
        </div>

        {/* Comparison Grid: Current Route vs Optimized Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Standard Dedicated Route
            </span>
            <p className="text-xs text-slate-300 font-mono">
              {shipment.routeOptimization.currentRoute}
            </p>
            <div className="pt-2 text-[11px] text-rose-400 font-medium">
              High empty-mile deadhead on return leg
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Circular Optimized Route
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">Recommended</span>
            </div>
            <p className="text-xs text-white font-mono font-medium">
              {shipment.routeOptimization.optimizedRoute}
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
              Full two-way load utilization achieved
            </div>
          </div>
        </div>

        {/* 4 Savings Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Distance Saved</span>
            <div className="text-base font-bold text-emerald-400">{shipment.routeOptimization.distanceSaved}</div>
            <p className="text-[10px] text-slate-500">Route shortening</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Cost Saved</span>
            <div className="text-base font-bold text-teal-400">{shipment.routeOptimization.costSaved}</div>
            <p className="text-[10px] text-slate-500">Fuel & toll reduction</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Carbon Offset</span>
            <div className="text-base font-bold text-emerald-300">{shipment.routeOptimization.carbonSaved}</div>
            <p className="text-[10px] text-slate-500">Scope 3 transport</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Deadhead Avoided</span>
            <div className="text-base font-bold text-amber-400">{shipment.routeOptimization.emptyMilesSaved}</div>
            <p className="text-[10px] text-slate-500">Zero empty returns</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VisualRouteVisualizer;
