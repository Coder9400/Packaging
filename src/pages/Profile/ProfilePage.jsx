import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Leaf,
  Award,
  FileCheck,
  Edit3,
  X,
  Check,
  Star,
  Package,
  TrendingDown,
  IndianRupee,
  Recycle,
  ArrowUpRight,
  Calendar,
  Globe,
  Factory,
  BadgeCheck,
  Upload,
  Camera,
  ChevronRight,
  BarChart3,
  Boxes,
  Truck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardTitle } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

/* ─────────────────────────────────────────────────────────────
   MOCK DATA (Supabase-ready structure)
───────────────────────────────────────────────────────────── */

// Profile-page specific enrichments
const MOCK_PROFILE_EXTENSION = {
  website: 'www.apexconsumergoods.com',
  gstNumber: '24AABCA1234B1ZX',
  registrationNumber: 'CIN U74900MH2018PTC310000',
  employeeCount: '200-500',
  yearFounded: '2008',
  certifications: [
    {
      id: 'cert_1',
      name: 'ISPM-15 Heat Treated Pallet Compliance',
      body: 'International Plant Protection Convention',
      status: 'active',
      validUntil: '2026-12-31',
      icon: ShieldCheck,
      color: 'emerald',
    },
    {
      id: 'cert_2',
      name: 'ISO 14001:2015 Environmental Management',
      body: 'Bureau Veritas Certification',
      status: 'active',
      validUntil: '2027-05-14',
      icon: Leaf,
      color: 'teal',
    },
    {
      id: 'cert_3',
      name: 'EPA WARM Scope 3 Accounting Protocol',
      body: 'US Environmental Protection Agency',
      status: 'active',
      validUntil: '2026-09-30',
      icon: FileCheck,
      color: 'brand',
    },
  ],
  stats: {
    materialsListed: 24,
    materialsPurchased: 18,
    completedTransactions: 42,
    materialsReused: '14,850 Units',
    wasteDiverted: '12.4 Tonnes',
    estimatedCo2Avoided: '19.8 t CO₂e',
    estimatedSavings: '₹4,85,000',
    sustainabilityScore: 94,
    networkPartners: 28,
    avgRating: 4.9,
    reviewCount: 38,
  },
};

const MOCK_ACTIVE_LISTINGS = [
  {
    id: 'LST-0041',
    name: 'Double-Wall Corrugated Cartons (Grade #11)',
    category: 'Cardboard',
    quantity: '2,500 kg',
    price: '₹15/kg',
    condition: 'Good',
    status: 'active',
    posted: '2026-09-01',
    views: 142,
    inquiries: 8,
  },
  {
    id: 'LST-0038',
    name: 'Food-Grade HDPE Regrind Flake',
    category: 'Plastic',
    quantity: '4,200 kg',
    price: '₹32/kg',
    condition: 'Good',
    status: 'active',
    posted: '2026-08-22',
    views: 214,
    inquiries: 12,
  },
  {
    id: 'LST-0035',
    name: 'Standard GMA Wooden Pallets (48×40)',
    category: 'Wood',
    quantity: '600 Pallets',
    price: '₹350/pallet',
    condition: 'Used',
    status: 'active',
    posted: '2026-08-14',
    views: 96,
    inquiries: 5,
  },
];

const MOCK_TRANSACTION_HISTORY = [
  {
    id: 'TXN-9482',
    date: '2026-09-10',
    material: 'Corrugated Cartons',
    counterparty: 'Gujarat Packaging Hub',
    role: 'Seller',
    quantity: '2,500 kg',
    value: '₹37,500',
    status: 'Completed',
  },
  {
    id: 'TXN-8921',
    date: '2026-09-08',
    material: 'GMA Wooden Pallets',
    counterparty: 'Pacific Freight Solutions',
    role: 'Seller',
    quantity: '450 Pallets',
    value: '₹1,57,500',
    status: 'Completed',
  },
  {
    id: 'TXN-8302',
    date: '2026-09-04',
    material: 'HDPE Flakes',
    counterparty: 'EcoPolymer Recyclers',
    role: 'Buyer',
    quantity: '3,200 kg',
    value: '₹1,02,400',
    status: 'Completed',
  },
  {
    id: 'TXN-7741',
    date: '2026-08-28',
    material: '275-Gal IBC Totes',
    counterparty: 'Apex Industrial Containers',
    role: 'Buyer',
    quantity: '25 Units',
    value: '₹82,500',
    status: 'Completed',
  },
  {
    id: 'TXN-7219',
    date: '2026-08-22',
    material: 'OCC Cardboard Bales',
    counterparty: 'GreenCycle Pulp & Paper',
    role: 'Seller',
    quantity: '3,300 kg',
    value: '₹49,500',
    status: 'Completed',
  },
];

const BUSINESS_TYPES = [
  'Manufacturer', 'Retailer', 'Packaging Recycler', 'Logistics Provider', 'Distributor', 'Other'
];

/* ─────────────────────────────────────────────────────────────
   EDIT PROFILE MODAL
───────────────────────────────────────────────────────────── */
const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate async save — swap for supabase.from('companies').update() later
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave(form);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">Edit Company Profile</h2>
            <p className="text-xs text-slate-400 mt-0.5">Changes are saved to local state. Supabase sync will be added later.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">

          {/* Company Identity */}
          <fieldset className="space-y-3">
            <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 w-full">
              Company Identity
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Company Name</label>
                <input
                  value={form.companyName}
                  onChange={e => set('companyName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Business Type</label>
                <select
                  value={form.businessType}
                  onChange={e => set('businessType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition appearance-none"
                >
                  {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Company Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition resize-none leading-relaxed"
              />
            </div>
          </fieldset>

          {/* Contact Information */}
          <fieldset className="space-y-3">
            <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 w-full">
              Contact & Location
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Contact Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Phone</label>
                <input
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Location / City</label>
                <input
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Website</label>
                <input
                  value={form.website}
                  onChange={e => set('website', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Full Registered Address</label>
                <input
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>
          </fieldset>

          {/* Legal & Registration */}
          <fieldset className="space-y-3">
            <legend className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 w-full">
              Legal & Registration
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">GST Number</label>
                <input
                  value={form.gstNumber}
                  onChange={e => set('gstNumber', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">CIN / Registration No.</label>
                <input
                  value={form.registrationNumber}
                  onChange={e => set('registrationNumber', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>
          </fieldset>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-800 shrink-0 bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition
              ${saved
                ? 'bg-emerald-600 text-white'
                : saving
                  ? 'bg-brand-700 text-white cursor-wait'
                  : 'bg-brand-600 hover:bg-brand-500 text-white'}
            `}
          >
            {saved
              ? <><Check className="w-3.5 h-3.5" /> Saved!</>
              : saving
                ? 'Saving…'
                : <><Check className="w-3.5 h-3.5" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SCORE RING
───────────────────────────────────────────────────────────── */
const ScoreRing = ({ score, size = 80 }) => {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth="7" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#10b981" strokeWidth="7"
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────
   CERT COLOR PALETTE
───────────────────────────────────────────────────────────── */
const CERT_PALETTE = {
  emerald: { wrap: 'bg-emerald-500/10 border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-400', badge: 'emerald' },
  teal:    { wrap: 'bg-teal-500/10 border-teal-500/20',       icon: 'bg-teal-500/20 text-teal-400',       badge: 'teal'    },
  brand:   { wrap: 'bg-brand-500/10 border-brand-500/20',     icon: 'bg-brand-500/20 text-brand-400',     badge: 'brand'   },
};

const STATUS_COLORS = {
  active:    'bg-emerald-500/15 text-emerald-400',
  Completed: 'bg-emerald-500/15 text-emerald-400',
  pending:   'bg-amber-500/15 text-amber-400',
};

const CATEGORY_PILL = {
  Cardboard: 'bg-emerald-500/15 text-emerald-400',
  Plastic:   'bg-teal-500/15 text-teal-400',
  Wood:      'bg-amber-500/15 text-amber-400',
  Other:     'bg-indigo-500/15 text-indigo-400',
};

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export const ProfilePage = () => {
  const { currentUser, currentCompany, setCurrentCompany } = useAuth();
  const ext = MOCK_PROFILE_EXTENSION;
  const stats = ext.stats;

  // Local profile state (Supabase-ready)
  const [profile, setProfile] = useState({
    companyName:        currentCompany?.name         || 'Apex Consumer Goods Ltd.',
    businessType:       currentCompany?.type         || 'Manufacturer',
    description:        currentCompany?.description  || 'High-volume consumer goods manufacturer generating clean, sorted corrugated cardboard and food-grade HDPE scrap.',
    email:              currentUser?.email            || 'contact@apexconsumergoods.com',
    phone:              currentUser?.phone            || '+91 79210 88341',
    location:           currentCompany?.location      || 'Ahmedabad, Gujarat',
    address:            currentCompany?.address       || 'Plot 14, GIDC Industrial Estate, Vatva, Ahmedabad 382445',
    website:            ext.website,
    gstNumber:          ext.gstNumber,
    registrationNumber: ext.registrationNumber,
    verified:           currentCompany?.verified ?? true,
    joinedDate:         currentCompany?.joinedDate    || '2023-04-15',
    sustainabilityScore: stats.sustainabilityScore,
    divertedTonnage:    currentCompany?.divertedTonnage || 342.5,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [logoUploadHover, setLogoUploadHover] = useState(false);

  const handleSaveProfile = (newData) => {
    setProfile(newData);
    // Supabase: await supabase.from('companies').update({...newData}).eq('id', currentCompany.id)
  };

  // Avatar initials from company name
  const initials = profile.companyName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <>
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={profile}
        onSave={handleSaveProfile}
      />

      <div className="space-y-8">

        {/* ── HERO HEADER ───────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/30 shadow-card">
          {/* Ambient glow */}
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />

          {/* Cover strip */}
          <div className="h-24 sm:h-32 bg-gradient-to-r from-brand-900/60 via-emerald-900/30 to-teal-900/40 border-b border-slate-800" />

          <div className="px-6 pb-6 -mt-10 sm:-mt-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

              {/* Logo block */}
              <div className="flex items-end gap-5">
                {/* Company Logo Avatar */}
                <div
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setLogoUploadHover(true)}
                  onMouseLeave={() => setLogoUploadHover(false)}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 border-4 border-slate-900 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-xl select-none">
                    {initials}
                  </div>
                  {logoUploadHover && (
                    <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center border-4 border-brand-500/60">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {profile.companyName}
                    </h1>
                    {profile.verified && (
                      <div className="flex items-center gap-1 text-emerald-400" title="Verified Business">
                        <BadgeCheck className="w-5 h-5" />
                        <span className="text-[11px] font-bold">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="brand" size="xs">{profile.businessType}</Badge>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      Member since {profile.joinedDate}
                    </span>
                  </div>
                  {/* Star rating */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(stats.avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-white ml-0.5">{stats.avgRating}</span>
                    <span className="text-[10px] text-slate-500">({stats.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" icon={Edit3} onClick={() => setIsEditOpen(true)}>
                Edit Profile
              </Button>
            </div>

            {/* Stat Pills Row */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Materials Listed',        value: stats.materialsListed,          icon: Package,   color: 'text-brand-400' },
                { label: 'Materials Purchased',     value: stats.materialsPurchased,        icon: Boxes,     color: 'text-teal-400'  },
                { label: 'Completed Transactions',  value: stats.completedTransactions,     icon: Check,     color: 'text-emerald-400' },
                { label: 'Materials Reused',        value: stats.materialsReused,           icon: Recycle,   color: 'text-amber-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className={`flex items-center gap-1.5 ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN GRID: 2/3 left + 1/3 right ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* About Company */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <CardTitle className="text-sm">About the Company</CardTitle>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{profile.description}</p>
            </Card>

            {/* Business Information */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <CardTitle className="text-sm">Business Information</CardTitle>
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {[
                  { icon: Factory,  label: 'Business Type',        value: profile.businessType },
                  { icon: MapPin,   label: 'Location',              value: profile.location },
                  { icon: Mail,     label: 'Contact Email',         value: profile.email },
                  { icon: Phone,    label: 'Phone',                 value: profile.phone },
                  { icon: Globe,    label: 'Website',               value: profile.website },
                  { icon: Building2, label: 'Registered Address',   value: profile.address },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 font-semibold block">{label}</span>
                      <span className="text-slate-200 font-medium break-all">{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal row */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">GST Number</span>
                  <span className="font-mono font-bold text-slate-300">{profile.gstNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">Registration No.</span>
                  <span className="font-mono font-bold text-slate-300 break-all">{profile.registrationNumber}</span>
                </div>
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6 space-y-4">
              <CardTitle className="text-sm border-b border-slate-800 pb-3">
                Certifications & Compliance
              </CardTitle>
              <div className="space-y-3">
                {ext.certifications.map(cert => {
                  const palette = CERT_PALETTE[cert.color] || CERT_PALETTE.emerald;
                  const Icon = cert.icon;
                  return (
                    <div key={cert.id} className={`flex items-center justify-between p-3.5 rounded-xl border ${palette.wrap}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${palette.icon}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{cert.name}</h4>
                          <p className="text-[10px] text-slate-400">{cert.body} · Valid until {cert.validUntil}</p>
                        </div>
                      </div>
                      <Badge variant={palette.badge} size="xs">Active</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Active Listings */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <CardTitle className="text-sm">Active Listings</CardTitle>
                <a href="/listings" className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold transition flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </a>
              </div>
              <div className="space-y-3">
                {MOCK_ACTIVE_LISTINGS.map(lst => (
                  <div key={lst.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition text-xs">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-bold ${CATEGORY_PILL[lst.category] || ''}`}>
                      {lst.category[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{lst.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lst.quantity} · {lst.price} · Posted {lst.posted}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-[10px] text-slate-400">{lst.views} views</p>
                      <p className="text-[10px] font-bold text-teal-400">{lst.inquiries} inquiries</p>
                    </div>
                    <Badge variant="emerald" size="xs">Active</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Transaction History */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <CardTitle className="text-sm">Transaction History</CardTitle>
                <Badge variant="default" size="xs">{MOCK_TRANSACTION_HISTORY.length} records</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[540px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="pb-2.5 pr-3 text-left">Date</th>
                      <th className="pb-2.5 pr-3 text-left">Material</th>
                      <th className="pb-2.5 pr-3 text-left">Counterparty</th>
                      <th className="pb-2.5 pr-3 text-left">Role</th>
                      <th className="pb-2.5 pr-3 text-right">Value</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {MOCK_TRANSACTION_HISTORY.map(txn => (
                      <tr key={txn.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 pr-3 text-slate-400 font-mono whitespace-nowrap">{txn.date}</td>
                        <td className="py-3 pr-3 font-semibold text-white">{txn.material}</td>
                        <td className="py-3 pr-3 text-slate-300 truncate max-w-[140px]">{txn.counterparty}</td>
                        <td className="py-3 pr-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${txn.role === 'Seller' ? 'bg-brand-500/15 text-brand-400' : 'bg-teal-500/15 text-teal-400'}`}>
                            {txn.role}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-right font-mono font-bold text-amber-400">{txn.value}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Sustainability Score Ring */}
            <Card className="p-5 space-y-4 border-emerald-500/20">
              <CardTitle className="text-sm text-center">Circularity Score</CardTitle>
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <ScoreRing score={profile.sustainabilityScore} size={100} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white">{profile.sustainabilityScore}</span>
                    <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
                  </div>
                </div>
                <Badge variant="emerald" size="xs">Excellent · Top 8%</Badge>
                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Your business scores in the top 8% of all Circular Exchange facilities.
                </p>
              </div>
            </Card>

            {/* Circular Performance */}
            <Card className="p-5 space-y-4">
              <CardTitle className="text-sm border-b border-slate-800 pb-3">
                Circular Performance
              </CardTitle>
              <div className="space-y-3 text-xs">
                {[
                  { label: 'Materials Diverted',      value: `${profile.divertedTonnage} Tonnes`, icon: Leaf,         color: 'text-emerald-400' },
                  { label: 'Est. CO₂ Impact Avoided', value: stats.estimatedCo2Avoided,          icon: TrendingDown,  color: 'text-teal-400' },
                  { label: 'Est. Business Savings',   value: stats.estimatedSavings,             icon: IndianRupee,   color: 'text-amber-400' },
                  { label: 'Network Partners',        value: `${stats.networkPartners} Enterprises`, icon: Building2, color: 'text-brand-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-800/60 last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-slate-400">{label}</span>
                    </div>
                    <span className={`font-bold ${color}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-[10px] text-slate-500 flex items-center gap-1">
                <span className="text-amber-400 font-bold">*</span>
                All impact values are estimated projections.
              </div>
            </Card>

            {/* Quick Info Card */}
            <Card className="p-5 space-y-3">
              <CardTitle className="text-sm border-b border-slate-800 pb-3">Company Details</CardTitle>
              <div className="space-y-2.5 text-xs">
                {[
                  { label: 'Year Founded',    value: ext.yearFounded },
                  { label: 'Employee Count',  value: ext.employeeCount },
                  { label: 'Member Since',    value: profile.joinedDate },
                  { label: 'Member Tier',     value: 'Growth Partner' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA: Edit Profile */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-500/10 border border-brand-500/25 hover:border-brand-500/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/30 transition">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Edit Company Profile</p>
                  <p className="text-[10px] text-slate-400">Update description, contacts & legal</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;
