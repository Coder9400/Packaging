import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  Leaf,
  Truck,
  Building2,
  FileCheck,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  Download,
  AlertCircle,
  MessageSquare,
  Navigation,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  MOCK_LIFECYCLE_ORDERS,
  ORDER_LIFECYCLE_STEPS
} from '../../data/requestsAndOrders';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const { orders } = useMarketplace();

  // Find matching lifecycle order or fallback
  const initialOrder =
    MOCK_LIFECYCLE_ORDERS.find((o) => o.id === id) ||
    MOCK_LIFECYCLE_ORDERS[0];

  const [order, setOrder] = useState(initialOrder);
  const [successToast, setSuccessToast] = useState('');

  // Status index helper
  const statusOrder = [
    'Requested',
    'Accepted',
    'Confirmed',
    'Logistics Assigned',
    'In Transit',
    'Delivered',
    'Completed',
  ];

  const currentStepIndex = statusOrder.indexOf(order.currentStatus);

  // Transition to next lifecycle status on button click
  const handleAdvanceStatus = (nextStatus, message) => {
    const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOrder((prev) => ({
      ...prev,
      currentStatus: nextStatus,
      timelineHistory: [
        ...prev.timelineHistory,
        {
          status: nextStatus,
          timestamp: nowTime,
          note: message || `Status transitioned to ${nextStatus}.`,
        },
      ],
    }));

    setSuccessToast(`Order status updated to: ${nextStatus}!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation & Breadcrumb */}
      <Link
        to="/requests"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Material Requests & Orders</span>
      </Link>

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Order Ref: {order.orderNumber}
            </h1>
            <StatusBadge status={order.currentStatus} />
          </div>
          <p className="text-xs text-slate-400">
            Material: <span className="text-white font-semibold">{order.materialName}</span> • Contracted Volume: <span className="text-emerald-400 font-bold">{formatNumber(order.quantity)} {order.unit}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button to="/messages" variant="secondary" size="sm" icon={MessageSquare}>
            Chat Counterparty
          </Button>
          <Button variant="outline" size="sm" icon={Download}>
            ESG Certificate (PDF)
          </Button>
        </div>
      </div>

      {/* Toast alert */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* SECTION 1: VISUAL ORDER LIFECYCLE TIMELINE (7 STATUSES) */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-white">
              Circular Order Lifecycle Timeline
            </CardTitle>
            <Badge variant="emerald" size="xs">
              Phase {currentStepIndex + 1} of 7: {order.currentStatus}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking automated escrow milestones, freight dispatch, and dock delivery inspections.
          </p>
        </div>

        {/* Visual Stepper Bar */}
        <div className="relative pt-4 pb-2">
          {/* Timeline Connector Line */}
          <div className="hidden md:block absolute top-[34px] left-8 right-8 h-1 bg-slate-800 z-0">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (statusOrder.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 relative z-10">
            {ORDER_LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isUpcoming = idx > currentStepIndex;

              return (
                <div key={step.id} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`
                      w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition duration-300 shadow-md
                      ${isCurrent
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-emerald-500/30 scale-110'
                        : isPast
                          ? 'bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'}
                    `}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isCurrent
                          ? 'text-emerald-400'
                          : isPast
                            ? 'text-slate-200'
                            : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight mt-0.5 max-w-[110px] mx-auto hidden md:block">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Action Buttons based on current lifecycle status */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Active Status Trigger</span>
              <p className="text-xs font-semibold text-white">
                {order.currentStatus === 'Requested' && 'Inquiry awaiting seller terms sign-off.'}
                {order.currentStatus === 'Accepted' && 'Terms accepted. Ready to confirm order and fund escrow.'}
                {order.currentStatus === 'Confirmed' && 'Funds locked in escrow. Ready to schedule logistics dispatch.'}
                {order.currentStatus === 'Logistics Assigned' && 'Freight booked. Ready to depart origin dock.'}
                {order.currentStatus === 'In Transit' && 'Trailer on route. Ready for warehouse dock sign-off upon arrival.'}
                {order.currentStatus === 'Delivered' && 'Delivered to dock. Verify inspection and release escrow payment.'}
                {order.currentStatus === 'Completed' && 'Order completed! Scope 3 carbon reduction certificate issued.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {order.currentStatus === 'Requested' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleAdvanceStatus('Accepted', 'Seller accepted pricing terms.')}
              >
                Accept Purchase Request
              </Button>
            )}

            {order.currentStatus === 'Accepted' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleAdvanceStatus('Confirmed', 'Order confirmed & ₹2,18,500 locked in escrow.')}
              >
                Confirm Order & Lock Escrow
              </Button>
            )}

            {order.currentStatus === 'Confirmed' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleAdvanceStatus('Logistics Assigned', 'EcoFreight assigned for dock pickup.')}
              >
                Assign Logistics Carrier
              </Button>
            )}

            {order.currentStatus === 'Logistics Assigned' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleAdvanceStatus('In Transit', 'Material loaded; truck departed origin terminal.')}
              >
                Mark In Transit / Departed Dock
              </Button>
            )}

            {order.currentStatus === 'In Transit' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleAdvanceStatus('Delivered', 'Arrived at destination warehouse. Inspection started.')}
              >
                Confirm Dock Delivery & Inspect
              </Button>
            )}

            {order.currentStatus === 'Delivered' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleAdvanceStatus('Completed', 'Dock inspection signed off. Escrow funds disbursed to seller.')}
              >
                Release Escrow Funds (Complete)
              </Button>
            )}

            {order.currentStatus === 'Completed' && (
              <Badge variant="emerald" size="md">
                100% Escrow Settled
              </Badge>
            )}
          </div>
        </div>
      </Card>

      {/* SECTION 2: COUNTERPARTIES & LOCATION DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buyer Entity Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Procuring Buyer
            </span>
            <Badge variant="emerald" size="xs">Verified Facility</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{order.buyer.companyName}</h4>
              <p className="text-xs text-slate-400">{order.buyer.contactName} • {order.buyer.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Delivery Destination</span>
            <p className="text-slate-200 font-medium">{order.deliveryLocation}</p>
          </div>
        </Card>

        {/* Supplying Seller Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Supplying Generator
            </span>
            <Badge variant="teal" size="xs">Audited Facility</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{order.seller.companyName}</h4>
              <p className="text-xs text-slate-400">{order.seller.contactName} • {order.seller.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] text-slate-500 uppercase block">Origin Pickup Dock</span>
            <p className="text-slate-200 font-medium">{order.pickupLocation}</p>
          </div>
        </Card>
      </div>

      {/* SECTION 3: MATERIAL DETAILS & PAYMENT / ESCROW SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracted Material Breakdown (2 cols) */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
            Contracted Circular Material Specifications
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-xs text-emerald-400 font-semibold">{order.category}</span>
              <h4 className="text-base font-bold text-white mt-0.5">{order.materialName}</h4>
              <p className="text-xs text-slate-400 mt-1">Subtype: {order.materialSubtype}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">Contracted Lot</span>
              <span className="text-lg font-extrabold text-white">{formatNumber(order.quantity)} {order.unit}</span>
              <span className="text-xs text-emerald-400 block font-mono">@ ₹{order.unitPrice} / {order.unit}</span>
            </div>
          </div>

          {/* Environmental Savings Callout */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-3">
              <Leaf className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-300 block">{order.co2eAvoided} MT CO₂e Avoided</span>
                <span className="text-[10px] text-slate-400">Scope 3 greenhouse gas offset</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-center gap-3">
              <Package className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-teal-300 block">{order.landfillDiverted} Tonnes Diverted</span>
                <span className="text-[10px] text-slate-400">Landfill waste reduction credit</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment & Escrow Settlement Breakdown (1 col) */}
        <Card className="p-6 space-y-5 border-emerald-500/25 bg-slate-900/90">
          <div className="pb-3 border-b border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Settlement Breakdown
            </span>
            <CardTitle className="text-base font-bold text-white mt-1">
              Payment & Escrow Summary
            </CardTitle>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Material Subtotal</span>
              <span className="text-white font-medium">{formatCurrency(order.subtotal, 'INR')}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Escrow Protection Guarantee</span>
              <span className="text-emerald-400 font-medium">Included (₹0)</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Backhaul Green Freight</span>
              <span className="text-white font-medium">{formatCurrency(order.estimatedFreight, 'INR')}</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
              <span>Total Settled Amount</span>
              <span className="text-emerald-400 font-mono text-base">{formatCurrency(order.totalAmount, 'INR')}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Smart Escrow Lock Active</span>
            </div>
            <p className="leading-relaxed">
              Funds are securely held and released automatically once dock inspection is confirmed.
            </p>
          </div>
        </Card>
      </div>

      {/* SECTION 4: DETAILED TIMELINE HISTORY LOG */}
      <Card className="p-6 space-y-4">
        <CardTitle className="text-sm font-bold text-white">
          Milestone Event Log & Chain of Custody
        </CardTitle>

        <div className="space-y-3 pl-2 border-l-2 border-slate-800 text-xs">
          {order.timelineHistory.map((item, idx) => (
            <div key={idx} className="relative pl-6 space-y-1">
              <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{item.status}</span>
                <span className="text-slate-500 font-mono text-[11px]">{item.timestamp}</span>
              </div>
              <p className="text-slate-400 text-xs">{item.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
