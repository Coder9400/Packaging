import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  MapPin,
  ShieldCheck,
  Leaf,
  Repeat,
  Recycle,
  Sparkles,
  Building2,
  Calendar,
  Truck,
  CheckCircle2,
  FileCheck,
  MessageSquare,
  Plus,
  Minus,
  Star,
  Layers,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export const MaterialDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, addOrder, addRequest } = useMarketplace();
  const { currentCompany } = useAuth();

  // Find listing by ID or fallback to first
  const material = listings.find((l) => l.id === id) || listings[0];

  const [selectedImage, setSelectedImage] = useState(0);

  // Quantity selector state
  const minQty = material?.minOrderQuantity || 10;
  const maxQty = material?.availableQuantity || material?.totalQuantity || 1000;
  const unitPrice = material?.pricePerUnit || material?.priceRaw || 18;

  const [quantity, setQuantity] = useState(minQty);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Request modal form
  const [requestForm, setRequestForm] = useState({
    message: `Hello ${material?.companyName || material?.sellerName}, we are interested in procuring this ${material?.name || material?.title} batch for our processing facility.`,
    pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    logisticsPreference: 'Platform Backhaul Logistics',
  });

  if (!material) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900 font-display">Material lot not found</h2>
        <p className="text-xs text-slate-500 mt-2 font-medium">The listing you requested may have been fulfilled or decommissioned.</p>
        <Link to="/marketplace" className="mt-4 inline-block">
          <Button variant="primary" size="sm">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const handleQuantityChange = (delta) => {
    const step = minQty >= 100 ? 50 : minQty >= 10 ? 10 : 1;
    setQuantity((prev) => {
      const next = prev + delta * step;
      if (next < minQty) return minQty;
      if (next > maxQty) return maxQty;
      return next;
    });
  };

  const handleDirectQuantityInput = (e) => {
    const val = Number(e.target.value);
    if (isNaN(val)) return;
    if (val > maxQty) {
      setQuantity(maxQty);
    } else {
      setQuantity(val);
    }
  };

  const estimatedTotal = quantity * unitPrice;
  const calculatedCo2e = ((quantity * (material.co2eFactor || 0.05))).toFixed(2);
  const calculatedLandfillTons = ((quantity * (material.unit === 'kg' ? 0.001 : material.unit === 'ton' ? 1 : 0.02))).toFixed(2);

  const handleSendRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save as mock order & request in MarketplaceContext
    addOrder({
      listingId: material.id,
      listingTitle: material.title || material.name,
      buyerId: currentCompany?.id || 'comp_buyer',
      buyerName: currentCompany?.name || 'Procuring Enterprise',
      sellerId: material.sellerId,
      sellerName: material.companyName || material.sellerName,
      quantity: Number(quantity),
      unit: material.unit,
      unitPrice: unitPrice,
      totalAmount: estimatedTotal,
      currency: 'INR',
      orderStatus: 'Processing',
      paymentStatus: 'Escrow Held',
      logisticsType: requestForm.logisticsPreference,
      co2eAvoided: parseFloat(calculatedCo2e),
      landfillDiverted: parseFloat(calculatedLandfillTons),
      estimatedDelivery: requestForm.pickupDate,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSuccess(false);
  };

  // Specifications array filtered for existing fields
  const specifications = [
    { label: 'Material Category', value: material.category },
    { label: 'Material Subtype', value: material.materialSubtype },
    { label: 'Available Quantity', value: `${formatNumber(material.availableQuantity || material.totalQuantity)} ${material.unit}` },
    { label: 'Minimum Order Qty', value: `${formatNumber(material.minOrderQuantity)} ${material.unit}` },
    { label: 'Condition Standard', value: material.condition },
    { label: 'Material Classification', value: material.materialType || 'Recyclable' },
    { label: 'Dimensions / Format', value: material.dimensions },
    { label: 'Weight Spec', value: material.weightPerUnit },
    { label: 'Contamination Level', value: material.contaminationRate },
    { label: 'Pickup / Dock Protocol', value: material.pickupType },
    { label: 'Inspection Certificate', value: material.inspectionCertificate },
    { label: 'Dispatch Location', value: material.location || material.sellerLocation },
  ].filter((spec) => spec.value);

  return (
    <div className="space-y-6">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/marketplace" className="hover:text-blue-600 transition">
          Marketplace
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500">Material</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold truncate max-w-xs sm:max-w-md">
          {material.name || material.title}
        </span>
      </nav>

      {/* TOP SECTION: Left Large Image Gallery + Right Material Summary & Seller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Image Gallery (Cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-card">
            <div className="relative h-80 sm:h-96 lg:h-[420px] w-full bg-slate-100 overflow-hidden">
              <img
                src={material.images ? material.images[selectedImage] : 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
                alt={material.title || material.name}
                className="w-full h-full object-cover"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-md border-slate-200 text-slate-900 font-bold shadow-sm">
                  {material.category}
                </Badge>
                <Badge variant="emerald" size="sm">
                  {material.condition} Condition
                </Badge>
                <Badge variant="blue" size="sm">
                  {material.materialType || 'Recyclable'}
                </Badge>
              </div>

              {/* Inspection Certificate Seal */}
              {material.inspectionCertificate && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 shadow-sm font-semibold">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-mono text-[11px]">{material.inspectionCertificate}</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {material.images && material.images.length > 1 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-3">
                {material.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`
                      w-16 h-16 rounded-xl overflow-hidden border-2 transition
                      ${selectedImage === idx ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}
                    `}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Material Details, Seller, Price & Purchase (Cols 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {material.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{material.condition} Condition</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
              {material.title || material.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{material.location || material.sellerLocation}</span>
            </div>
          </div>

          {/* Pricing & Availability Card */}
          <Card className="p-6 space-y-5 border-blue-200/80 bg-white shadow-card">
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Material Rate
                </span>
                <div className="text-3xl font-extrabold text-blue-600 tracking-tight mt-0.5 font-display">
                  {material.price || `₹${unitPrice}/${material.unit}`}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Available Batch
                </span>
                <span className="text-sm font-bold text-slate-900 font-display">
                  {formatNumber(material.availableQuantity || material.totalQuantity)} {material.unit}
                </span>
              </div>
            </div>

            {/* Quantity Selector Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">Select Quantity:</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  MOQ: {formatNumber(minQty)} {material.unit}
                </span>
              </div>

              {/* [-] Qty [+] Selector */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= minQty}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 flex items-center justify-center font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="number"
                    min={minQty}
                    max={maxQty}
                    value={quantity}
                    onChange={handleDirectQuantityInput}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl py-2 px-3 text-center text-sm font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                    {material.unit}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQty}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 flex items-center justify-center font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Estimated Total Calculation */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Estimated Total:</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {formatCurrency(estimatedTotal, 'INR')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button
                size="lg"
                variant="primary"
                className="w-full justify-center text-sm font-bold shadow-sm shadow-blue-600/30"
                onClick={() => setIsModalOpen(true)}
              >
                Request Material
              </Button>

              <Link to="/messages" className="block w-full">
                <Button
                  size="md"
                  variant="secondary"
                  className="w-full justify-center text-xs"
                  icon={MessageSquare}
                >
                  Contact Seller
                </Button>
              </Link>
            </div>
          </Card>

          {/* SELLER / COMPANY PROFILE CARD */}
          <Card className="p-5 space-y-4 bg-white border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Seller Facility
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Business</span>
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">{material.companyName || material.sellerName}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{material.location || material.sellerLocation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Facility Rating</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>4.9 / 5.0</span>
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Transactions</span>
                <span className="font-bold text-blue-600 mt-0.5 block">
                  38 Transactions
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MIDDLE SECTION: Description & Circular Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Detailed Material Description (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-4 bg-white border-slate-200/90 shadow-card">
            <h3 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 font-display">
              Material Description
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {material.description ||
                'High quality post-industrial surplus material sorted and prepared in accordance with industry circularity standards. Inspected for moisture thresholds and contamination purity prior to warehouse storage.'}
            </p>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Handling & Transport Protocols</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Loading protocol: <span className="text-slate-900 font-bold">{material.pickupType || 'Dock Height / Forklift Assisted'}</span>. Palletized and strapped for standard dry van or flatbed freight pickup.
              </p>
            </div>
          </Card>

          {/* MATERIAL SPECIFICATIONS MATRIX */}
          <Card className="p-6 sm:p-8 space-y-4 bg-white border-slate-200/90 shadow-card">
            <h3 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 font-display">
              Material Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {specifications.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <span className="text-slate-500 text-[11px] font-semibold">{spec.label}</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[180px]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CIRCULAR IMPACT SIDEBAR (1 col) */}
        <div className="space-y-6">
          <Card className="p-6 space-y-6 bg-white border-slate-200/90 shadow-card">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">Circular Impact</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Audited environmental benefit of reusing this material batch
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Stat 1: Landfill Diversion */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Estimated Landfill Diversion
                </span>
                <div className="text-2xl font-extrabold text-emerald-700 font-display">
                  {calculatedLandfillTons} Tons
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Redirected from waste disposal sites</p>
              </div>

              {/* Stat 2: Material Reuse */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Estimated Material Reuse
                </span>
                <div className="text-2xl font-extrabold text-blue-700 font-display">
                  100% Circular
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Displaces virgin resource extraction</p>
              </div>

              {/* Stat 3: Scope 3 CO2e Avoided */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  Estimated CO₂ Avoided
                </span>
                <div className="text-2xl font-extrabold text-indigo-700 font-mono">
                  {calculatedCo2e} t CO₂e
                </div>
                <p className="text-[11px] text-slate-500 font-medium">EPA WARM 15.0 emissions credit</p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link to="/impact" className="text-xs text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1">
                <span>View Scope 3 Reporting Standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* REQUEST MATERIAL MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Request Material Batch"
        subtitle={`Submit a purchase order request to ${material.companyName || material.sellerName}`}
      >
        {isSuccess ? (
          <div className="p-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 font-display">Material Request Dispatched!</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm mx-auto font-medium">
                Your inquiry for <span className="text-slate-900 font-bold">{quantity} {material.unit}</span> has been sent to <span className="text-slate-900 font-bold">{material.companyName || material.sellerName}</span> with escrow protection.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="text-blue-600 font-bold">CE-2026-RQ{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Escrow Subtotal:</span>
                <span className="text-slate-900 font-bold">{formatCurrency(estimatedTotal, 'INR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Date:</span>
                <span className="text-slate-700 font-medium">{requestForm.pickupDate}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button size="sm" variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button to="/requests" size="sm" variant="primary">
                View in My Orders
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
            {/* Summary Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Material Lot:</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">{material.title || material.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Requested Quantity:</span>
                <span className="font-bold text-blue-600">{quantity} {material.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Estimated Total:</span>
                <span className="font-bold text-slate-900 font-mono">{formatCurrency(estimatedTotal, 'INR')}</span>
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Preferred Pickup / Delivery Date
              </label>
              <input
                type="date"
                required
                value={requestForm.pickupDate}
                onChange={(e) => setRequestForm({ ...requestForm, pickupDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Logistics Method
              </label>
              <select
                value={requestForm.logisticsPreference}
                onChange={(e) => setRequestForm({ ...requestForm, logisticsPreference: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Platform Backhaul Logistics">Platform Backhaul Logistics (Low Emission)</option>
                <option value="Buyer Arranged Dedicated Truck">Buyer Arranged Dedicated Truck</option>
                <option value="Seller Dock Pickup">Direct Seller Dock Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Message to Seller (Specifications / Dock Instructions)
              </label>
              <textarea
                rows={3}
                required
                value={requestForm.message}
                onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600 placeholder-slate-400"
                placeholder="Include warehouse unloading hours, forklift constraints, or lab sample requirements..."
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Funds are held in secure escrow and only disbursed upon dock inspection acceptance.
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Send Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MaterialDetailPage;
