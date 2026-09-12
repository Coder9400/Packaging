import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Building2,
  FileText,
  MessageSquare,
  Download,
  AlertCircle,
  Package,
  Leaf,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MOCK_LIFECYCLE_ORDERS, ORDER_LIFECYCLE_STEPS } from '../../data/requestsAndOrders';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export const OrderDetailPage = () => {
  const { id } = useParams();

  // Interactive mock state for order lifecycle
  const [order, setOrder] = useState(MOCK_LIFECYCLE_ORDERS[0]);
  const [successToast, setSuccessToast] = useState('');

  // Find index of current status in status array
  const statusOrder = [
    'Requested',
    'Accepted',
    'Confirmed',
    'Logistics Assigned',
    'In Transit',
    'Delivered',
    'Completed'
  ];

  const currentStepIndex = statusOrder.indexOf(order.currentStatus);

  const handleAdvanceStatus = (nextStatus, note) => {
    setOrder((prev) => ({
      ...prev,
      currentStatus: nextStatus,
      timelineHistory: [
        ...prev.timelineHistory,
        {
          status: nextStatus,
          timestamp: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          note: note || `Order advanced to ${nextStatus}`
        }
      ]
    }));

    setSuccessToast(`Order status updated to: ${nextStatus}`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        to="/requests"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Material Requests & Orders</span>
      </Link>

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Order Ref: {order.orderNumber}
            </h1>
            <StatusBadge status={order.currentStatus} />
          </div>
          <p className="text-xs text-slate-500">
            Material: <span className="text-slate-900 font-semibold">{order.materialName}</span> • Contracted Volume: <span className="text-blue-600 font-bold">{formatNumber(order.quantity)} {order.unit}</span>
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
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* SECTION 1: VISUAL ORDER LIFECYCLE TIMELINE */}
      <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-card">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 font-display">
              Circular Order Lifecycle Timeline
            </CardTitle>
            <Badge variant="blue" size="xs">
              Phase {currentStepIndex + 1} of 7: {order.currentStatus}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking automated escrow milestones, freight dispatch, and dock delivery inspections.
          </p>
        </div>

        {/* Visual Stepper Bar */}
        <div className="relative pt-4 pb-2">
          {/* Timeline Connector Line */}
          <div className="hidden md:block absolute top-[34px] left-8 right-8 h-1 bg-slate-100 z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
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
                      w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition duration-300 shadow-sm
                      ${isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-blue-600/30 scale-110'
                        : isPast
                          ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-600'
                          : 'bg-slate-50 border border-slate-200 text-slate-400'}
                    `}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isCurrent
                          ? 'text-blue-600'
                          : isPast
                            ? 'text-slate-900'
                            : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 max-w-[110px] mx-auto hidden md:block">
                      {step.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Active Status Trigger</span>
              <p className="text-xs font-semibold text-slate-900">
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
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => handleAdvanceStatus('Accepted', 'Seller accepted pricing terms.')}
              >
                Accept Purchase Request
              </Button>
            )}

            {order.currentStatus === 'Accepted' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => handleAdvanceStatus('Confirmed', 'Order confirmed & ₹2,18,500 locked in escrow.')}
              >
                Confirm Order & Lock Escrow
              </Button>
            )}

            {order.currentStatus === 'Confirmed' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => handleAdvanceStatus('Logistics Assigned', 'EcoFreight assigned for dock pickup.')}
              >
                Assign Logistics Carrier
              </Button>
            )}

            {order.currentStatus === 'Logistics Assigned' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => handleAdvanceStatus('In Transit', 'Material loaded; truck departed origin terminal.')}
              >
                Mark In Transit / Departed Dock
              </Button>
            )}

            {order.currentStatus === 'In Transit' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={() => handleAdvanceStatus('Delivered', 'Arrived at destination warehouse. Inspection started.')}
              >
                Confirm Dock Delivery & Inspect
              </Button>
            )}

            {order.currentStatus === 'Delivered' && (
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
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
        <Card className="p-6 space-y-4 bg-white border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Procuring Buyer
            </span>
            <Badge variant="emerald" size="xs">Verified Facility</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">{order.buyer.companyName}</h4>
              <p className="text-xs text-slate-500">{order.buyer.contactName} • {order.buyer.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Destination</span>
            <p className="text-slate-900 font-medium">{order.deliveryLocation}</p>
          </div>
        </Card>

        {/* Supplying Seller Card */}
        <Card className="p-6 space-y-4 bg-white border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Supplying Generator
            </span>
            <Badge variant="blue" size="xs">Audited Facility</Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">{order.seller.companyName}</h4>
              <p className="text-xs text-slate-500">{order.seller.contactName} • {order.seller.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Origin Pickup Dock</span>
            <p className="text-slate-900 font-medium">{order.pickupLocation}</p>
          </div>
        </Card>
      </div>

      {/* SECTION 3: MATERIAL DETAILS & PAYMENT / ESCROW SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracted Material Breakdown */}
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white border-slate-200/90 shadow-card">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 font-display">
            Contracted Circular Material Specifications
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs text-blue-600 font-semibold">{order.category}</span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5 font-display">{order.materialName}</h4>
              <p className="text-xs text-slate-500 mt-1">Subtype: {order.materialSubtype}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Contracted Lot</span>
              <span className="text-lg font-extrabold text-slate-900">{formatNumber(order.quantity)} {order.unit}</span>
              <span className="text-xs text-blue-600 block font-mono font-bold">@ ₹{order.unitPrice} / {order.unit}</span>
            </div>
          </div>

          {/* Environmental Savings Callout */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-800 block">{order.co2eAvoided} MT CO₂e Avoided</span>
                <span className="text-[10px] text-slate-500">Scope 3 greenhouse gas offset</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-blue-800 block">{order.landfillDiverted} Tonnes Diverted</span>
                <span className="text-[10px] text-slate-500">Landfill waste reduction credit</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment & Escrow Settlement Breakdown */}
        <Card className="p-6 space-y-5 bg-white border-slate-200/90 shadow-card">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Settlement Breakdown
            </span>
            <CardTitle className="text-base font-bold text-slate-900 mt-1 font-display">
              Payment & Escrow Summary
            </CardTitle>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Material Subtotal</span>
              <span className="text-slate-900 font-semibold">{formatCurrency(order.subtotal, 'INR')}</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Escrow Protection Guarantee</span>
              <span className="text-emerald-600 font-semibold">Included (₹0)</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Backhaul Green Freight</span>
              <span className="text-slate-900 font-semibold">{formatCurrency(order.estimatedFreight, 'INR')}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total Settled Amount</span>
              <span className="text-blue-600 font-mono text-base">{formatCurrency(order.totalAmount, 'INR')}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Smart Escrow Lock Active</span>
            </div>
            <p className="leading-relaxed">
              Funds are securely held and released automatically once dock inspection is confirmed.
            </p>
          </div>
        </Card>
      </div>

      {/* SECTION 4: DETAILED TIMELINE HISTORY LOG */}
      <Card className="p-6 space-y-4 bg-white border-slate-200/90 shadow-card">
        <CardTitle className="text-sm font-bold text-slate-900 font-display">
          Milestone Event Log & Chain of Custody
        </CardTitle>

        <div className="space-y-3 pl-2 border-l-2 border-slate-100 text-xs">
          {order.timelineHistory.map((item, idx) => (
            <div key={idx} className="relative pl-6 space-y-1">
              <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs font-display">{item.status}</span>
                <span className="text-slate-400 font-mono text-[11px]">{item.timestamp}</span>
              </div>
              <p className="text-slate-500 text-xs">{item.note}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
