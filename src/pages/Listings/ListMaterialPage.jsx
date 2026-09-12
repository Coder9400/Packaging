import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  PlusSquare,
  Sparkles,
  ShieldCheck,
  Leaf,
  FileCheck,
  CheckCircle2,
  DollarSign,
  Building2,
  MapPin,
  Image as ImageIcon,
  Trash2,
  Eye,
  ArrowRight,
  TrendingDown,
  Repeat,
  Recycle,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const PRESET_IMAGES = [
  { id: 'img_1', label: 'OCC Cardboard Bales', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80', category: 'Cardboard' },
  { id: 'img_2', label: 'HDPE Flakes / Regrind', url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80', category: 'Plastic' },
  { id: 'img_3', label: 'GMA Wooden Pallets', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', category: 'Wooden Pallets' },
  { id: 'img_4', label: '275-Gal IBC Totes', url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80', category: 'Industrial Materials' },
  { id: 'img_5', label: 'Clear LDPE Stretch Film', url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80', category: 'Plastic' },
  { id: 'img_6', label: 'Heavy Gaylord Boxes', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80', category: 'Packaging' },
];

export const ListMaterialPage = () => {
  const navigate = useNavigate();
  const { currentCompany } = useAuth();
  const { addListing } = useMarketplace();

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Basic Info
    materialName: '',
    category: 'Cardboard',
    materialType: 'Recyclable',
    materialSubtype: '',

    // Section 2: Availability
    quantity: '2500',
    unit: 'kg',
    condition: 'Good',
    minOrderQuantity: '500',

    // Section 3: Pricing
    price: '18',
    priceUnit: 'kg',

    // Section 4: Location
    pickupLocation: 'Dock 4, Industrial Logistics Park',
    city: 'Ahmedabad',
    state: 'Gujarat',

    // Section 5: Description
    description: 'Clean, mill-grade corrugated cardboard bales generated from high-volume FMCG packaging lines. Moisture tested under 12% and tightly wire-strapped.',

    // Section 6: Images
    images: [PRESET_IMAGES[0].url],
    customImageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdListingId, setCreatedListingId] = useState('');

  // Section 7: Dynamic Circular Impact Calculations
  const calculatedImpact = useMemo(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const unit = formData.unit;

    // Normalize to metric tons
    let weightInTonnes = 0;
    if (unit === 'kg') weightInTonnes = qty / 1000;
    else if (unit === 'ton') weightInTonnes = qty;
    else if (unit === 'pallet') weightInTonnes = (qty * 17) / 1000;
    else if (unit === 'box') weightInTonnes = (qty * 20) / 1000;
    else if (unit === 'tote') weightInTonnes = (qty * 60) / 1000;
    else weightInTonnes = qty * 0.001;

    let co2Factor = 1.62; // OCC baseline
    if (formData.category === 'Plastic') co2Factor = 1.85;
    if (formData.category === 'Wooden Pallets') co2Factor = 0.55;
    if (formData.category === 'Industrial Materials') co2Factor = 2.1;

    const co2Avoided = (weightInTonnes * co2Factor).toFixed(2);
    const treesPreserved = Math.round(weightInTonnes * 17);
    const waterSavedGallons = Math.round(weightInTonnes * 7000);

    return {
      landfillDiversionTonnes: weightInTonnes.toFixed(2),
      co2Avoided,
      treesPreserved,
      waterSavedGallons,
    };
  }, [formData.quantity, formData.unit, formData.category]);

  const handleAddImagePreset = (url) => {
    if (!formData.images.includes(url)) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleMockCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload with object URL
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, images: [...prev.images, fakeUrl] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const priceNum = parseFloat(formData.price) || 18;
    const qtyNum = parseFloat(formData.quantity) || 100;
    const moqNum = parseFloat(formData.minOrderQuantity) || 10;
    const locationString = `${formData.city}, ${formData.state}`;

    const newListing = addListing({
      title: formData.materialName,
      name: formData.materialName,
      category: formData.category,
      categoryKey: formData.category.toLowerCase().replace(/\s+/g, '-'),
      materialType: formData.materialType,
      materialSubtype: formData.materialSubtype || `${formData.category} Feedstock`,
      sellerId: currentCompany?.id || 'comp_current',
      sellerName: currentCompany?.name || 'My Enterprise Facility',
      companyName: currentCompany?.name || 'My Enterprise Facility',
      sellerLocation: locationString,
      location: locationString,
      pickupLocation: formData.pickupLocation,
      condition: formData.condition,
      pricePerUnit: priceNum,
      price: `₹${priceNum}/${formData.priceUnit}`,
      unit: formData.unit,
      currency: 'INR',
      totalQuantity: qtyNum,
      availableQuantity: qtyNum,
      minOrderQuantity: moqNum,
      dimensions: `${formData.quantity} ${formData.unit} Batch`,
      weightPerUnit: `Standard ${formData.unit}`,
      co2eFactor: parseFloat(calculatedImpact.co2Avoided) / (parseFloat(calculatedImpact.landfillDiversionTonnes) || 1),
      estimatedCo2eSavings: parseFloat(calculatedImpact.co2Avoided),
      images: formData.images.length > 0 ? formData.images : [PRESET_IMAGES[0].url],
      inspectionCertificate: 'ISPM-15 / EPA Certified Lot',
      contaminationRate: '< 1.5%',
      pickupType: 'Dock Height / Forklift Ready',
      description: formData.description,
      status: 'Active',
      views: 1,
      requestsCount: 0,
      createdAt: new Date().toISOString(),
    });

    setCreatedListingId(newListing.id);
    setIsSubmitting(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              List Surplus Packaging Material
            </h1>
            <Badge variant="emerald" size="xs">Step-by-Step B2B Publishing</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish secondary materials and reusable industrial containers to certified business processors.
          </p>
        </div>

        <Button to="/listings" variant="ghost" size="sm">
          View Existing Inventory
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MULTI-SECTION FORM (Cols 8) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          {/* SECTION 1 — BASIC INFORMATION */}
          <Card className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">1</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Basic Material Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Material Name / Title"
                  placeholder="e.g. Corrugated Cardboard Bales (Grade #11)"
                  value={formData.materialName}
                  onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                  required
                />
              </div>

              <Select
                label="Material Category"
                options={[
                  'Cardboard',
                  'Plastic',
                  'Wooden Pallets',
                  'Packaging',
                  'Industrial Materials',
                  'Other',
                ]}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              <Select
                label="Material Classification"
                options={[
                  'Reusable',
                  'Recyclable',
                  'Both',
                ]}
                value={formData.materialType}
                onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Material Grade / Subtype Specification"
                  placeholder="e.g. Mill Grade OCC / Natural Flake / ISPM-15 Hardwood"
                  value={formData.materialSubtype}
                  onChange={(e) => setFormData({ ...formData, materialSubtype: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* SECTION 2 — AVAILABILITY & CONDITION */}
          <Card className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">2</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Availability & Lot Sizing
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Total Available Quantity"
                type="number"
                placeholder="2500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />

              <Select
                label="Measurement Unit"
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'ton', label: 'Metric Tons (ton)' },
                  { value: 'pallet', label: 'Pallets (units)' },
                  { value: 'box', label: 'Boxes / Gaylords' },
                  { value: 'tote', label: 'IBC Totes (units)' },
                  { value: 'piece', label: 'Pieces (pcs)' },
                ]}
                value={formData.unit}
                onChange={(e) => {
                  setFormData({ ...formData, unit: e.target.value, priceUnit: e.target.value });
                }}
              />

              <Select
                label="Material Condition"
                options={['New', 'Good', 'Used']}
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              />

              <div className="sm:col-span-3">
                <Input
                  label="Minimum Order Quantity (MOQ)"
                  type="number"
                  placeholder="500"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                  helperText="Smallest lot size a buyer may request"
                  required
                />
              </div>
            </div>
          </Card>

          {/* SECTION 3 — PRICING */}
          <Card className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">3</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Commercial Pricing Terms
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Unit Price (₹ INR)"
                type="number"
                step="any"
                placeholder="18"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />

              <Input
                label="Price Denomination Unit"
                value={`per ${formData.priceUnit}`}
                disabled
                helperText="Synced with material measurement unit"
              />
            </div>
          </Card>

          {/* SECTION 4 — LOCATION & PICKUP */}
          <Card className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">4</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Facility & Dispatch Location
              </h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Pickup Location / Dock Address"
                placeholder="e.g. Dock 4, Industrial Logistics Park, Western Express Zone"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="e.g. Ahmedabad, Detroit, Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />

                <Input
                  label="State / Region"
                  placeholder="e.g. Gujarat, MI, Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>
          </Card>

          {/* SECTION 5 — DETAILED DESCRIPTION */}
          <Card className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">5</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Detailed Material Description
              </h3>
            </div>

            <div>
              <textarea
                rows={4}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="Detail packaging origin, moisture content thresholds, wire/tape inclusions, storage conditions, and forklift unloading schedule constraints..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </Card>

          {/* SECTION 6 — IMAGES & VISUAL UPLOAD */}
          <Card className="p-6 space-y-5 bg-slate-900/80 border-slate-800">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">6</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Material Visuals & Gallery
              </h3>
            </div>

            <div className="space-y-4">
              {/* Preset Image Library Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Select Visual Preset or Upload
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleAddImagePreset(preset.url)}
                      className={`
                        p-2 rounded-xl border text-left flex items-center gap-2.5 transition
                        ${formData.images.includes(preset.url) ? 'bg-emerald-500/15 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}
                      `}
                    >
                      <img src={preset.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-[11px] truncate font-medium">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone UI */}
              <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center bg-slate-950/40">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-medium">Upload batch inspection photographs</p>
                <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                <label className="mt-3 inline-block">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition">
                    Browse Local Files
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMockCustomUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Active Gallery Previews */}
              {formData.images.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold block">Attached Photos ({formData.images.length})</span>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0 group">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute inset-0 bg-slate-950/80 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* SECTION 8 — PUBLISH ACTION */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button to="/listings" variant="ghost" size="md">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              icon={PlusSquare}
            >
              Publish Material Listing
            </Button>
          </div>
        </form>

        {/* RIGHT COLUMN: SECTION 7 (DYNAMIC IMPACT) & LIVE PREVIEW (Cols 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* SECTION 7 — DYNAMIC CIRCULAR IMPACT CALCULATOR */}
          <Card className="p-6 space-y-5 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Dynamic Circular Impact</h3>
              </div>
              <p className="text-xs text-slate-400">
                Automatically calculated based on your lot quantity ({formData.quantity} {formData.unit})
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Estimated Landfill Diversion
                </span>
                <div className="text-2xl font-extrabold text-emerald-400">
                  {calculatedImpact.landfillDiversionTonnes} Tonnes
                </div>
                <p className="text-[10px] text-slate-500">Redirected industrial packaging weight</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Estimated Scope 3 CO₂ Avoidance
                </span>
                <div className="text-2xl font-extrabold text-emerald-300 font-mono">
                  {calculatedImpact.co2Avoided} t CO₂e
                </div>
                <p className="text-[10px] text-slate-500">Calculated via EPA WARM 15.0 model</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Trees Preserved</span>
                  <span className="font-bold text-white">~{calculatedImpact.treesPreserved} Trees</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Water Saved</span>
                  <span className="font-bold text-white">{formatNumber(calculatedImpact.waterSavedGallons)} Gal</span>
                </div>
              </div>
            </div>
          </Card>

          {/* SECTION 8: LIVE MARKETPLACE CARD PREVIEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Card Preview
              </span>
              <Badge variant="teal" size="xs">Marketplace Card</Badge>
            </div>

            <Card className="overflow-hidden border-slate-800 bg-slate-900">
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img
                  src={formData.images[0] || PRESET_IMAGES[0].url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <Badge variant="default" size="xs" className="bg-slate-900/90 text-white">
                    {formData.category}
                  </Badge>
                  <Badge variant="emerald" size="xs">
                    {formData.condition}
                  </Badge>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{formData.city || 'Ahmedabad'}, {formData.state || 'Gujarat'}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{calculatedImpact.co2Avoided} t CO₂e</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block truncate">{currentCompany?.name || 'My Facility'}</span>
                  <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                    {formData.materialName || 'Untitled Material Lot'}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {formData.materialType} • {formData.materialSubtype || 'Standard Feedstock'}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Available Lot</span>
                    <span className="font-bold text-white">{formatNumber(formData.quantity || '0')} {formData.unit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Unit Price</span>
                    <span className="font-bold text-emerald-400">₹{formData.price || '0'}/{formData.priceUnit}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate('/listings');
        }}
        title="Material Listing Published Successfully!"
        subtitle="Your surplus lot is now active and discoverable on the B2B circular marketplace."
      >
        <div className="p-6 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">{formData.materialName}</h4>
            <p className="text-xs text-slate-400">
              Published at <span className="text-emerald-400 font-semibold">₹{formData.price}/{formData.priceUnit}</span> • <span className="text-white font-medium">{formatNumber(formData.quantity)} {formData.unit}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Leaf className="w-3.5 h-3.5" />
                <span>Scope 3 Avoidance Credited:</span>
              </span>
              <span className="font-bold">{calculatedImpact.co2Avoided} MT CO₂e</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Landfill Diversion:</span>
              <span className="font-bold">{calculatedImpact.landfillDiversionTonnes} Tonnes</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-3">
            <Button
              size="md"
              variant="secondary"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate(`/marketplace/${createdListingId}`);
              }}
            >
              View Public Page
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/listings');
              }}
            >
              Go to My Listings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListMaterialPage;
