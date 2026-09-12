import React from 'react';
import { Truck, CheckCircle2, Clock, MapPin, Navigation } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { Badge } from '../common/Badge';

export const ShipmentTracker = ({ shipment }) => {
  if (!shipment) return null;

  return (
    <Card className="overflow-hidden bg-white border-slate-200/90 shadow-card">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-slate-900">{shipment.trackingNumber}</CardTitle>
              <StatusBadge status={shipment.status} size="xs" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{shipment.carrier} • {shipment.vehicleType}</p>
          </div>
        </div>

        <Badge variant="emerald" size="xs">
          {shipment.co2eReductionVsStandardFreight} GHG Savings
        </Badge>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Origin & Destination Bar */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Origin</span>
              <span className="text-xs font-semibold text-slate-900">{shipment.origin}</span>
            </div>
          </div>

          <div className="flex-1 mx-6 flex flex-col items-center">
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${shipment.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-blue-600 mt-1 font-bold">{shipment.progressPercent}% Route Completed</span>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination</span>
              <span className="text-xs font-semibold text-slate-900">{shipment.destination}</span>
            </div>
            <Navigation className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Milestones timeline */}
        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipment Milestones</h5>
          <div className="space-y-3 pl-2 border-l border-slate-200">
            {shipment.milestones.map((ms, idx) => (
              <div key={idx} className="relative pl-4 flex items-start justify-between text-xs">
                <div
                  className={`
                    absolute -left-[17px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center
                    ${ms.done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}
                  `}
                >
                  {ms.done ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                </div>
                <span className={ms.done ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                  {ms.label}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{ms.time}</span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ShipmentTracker;
