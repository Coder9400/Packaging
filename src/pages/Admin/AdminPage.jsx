import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  Package,
  ArrowLeftRight,
  Recycle,
  Leaf,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Ban,
  AlertTriangle,
  Filter,
  ChevronDown,
  Flag,
  BarChart3,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Card, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */

const MOCK_BUSINESSES = [
  { id: 'biz_1',  name: 'Gujarat Packaging Hub Pvt. Ltd.',  type: 'Manufacturer',       location: 'Ahmedabad, GJ', joinedDate: '2026-09-01', status: 'active',   listings: 14, transactions: 28, score: 94 },
  { id: 'biz_2',  name: 'EcoPolymer Recyclers Pvt. Ltd.',   type: 'Packaging Recycler', location: 'Surat, GJ',     joinedDate: '2026-08-18', status: 'active',   listings: 8,  transactions: 19, score: 97 },
  { id: 'biz_3',  name: 'Apex Industrial Containers',        type: 'Manufacturer',       location: 'Vadodara, GJ',  joinedDate: '2026-08-05', status: 'active',   listings: 22, transactions: 41, score: 92 },
  { id: 'biz_4',  name: 'Pacific Freight Solutions',         type: 'Logistics Provider', location: 'Mumbai, MH',    joinedDate: '2026-07-22', status: 'active',   listings: 3,  transactions: 67, score: 89 },
  { id: 'biz_5',  name: 'Midwest Polymer Reclaim LLC',       type: 'Packaging Recycler', location: 'Pune, MH',      joinedDate: '2026-09-08', status: 'pending',  listings: 0,  transactions: 0,  score: null },
  { id: 'biz_6',  name: 'TimberCore Pallet Systems',         type: 'Retailer',           location: 'Nagpur, MH',    joinedDate: '2026-09-10', status: 'pending',  listings: 0,  transactions: 0,  score: null },
  { id: 'biz_7',  name: 'GreenCycle Pulp & Paper',           type: 'Packaging Recycler', location: 'Chennai, TN',   joinedDate: '2026-07-14', status: 'active',   listings: 11, transactions: 23, score: 96 },
  { id: 'biz_8',  name: 'SurplusBox Trading Co.',            type: 'Retailer',           location: 'Delhi, DL',     joinedDate: '2026-06-30', status: 'suspended',listings: 0,  transactions: 4,  score: 61 },
];

const MOCK_LISTINGS = [
  { id: 'lst_1', name: 'Double-Wall Corrugated Cartons',     category: 'Cardboard', company: 'Gujarat Packaging Hub',  price: '₹15/kg',      qty: '2,500 kg',  status: 'active',   posted: '2026-09-10', flagged: false },
  { id: 'lst_2', name: 'Food-Grade HDPE Regrind Flake',      category: 'Plastic',   company: 'Apex Industrial Containers', price: '₹32/kg',  qty: '4,200 kg',  status: 'active',   posted: '2026-09-08', flagged: false },
  { id: 'lst_3', name: 'Standard GMA Wooden Pallets',        category: 'Wood',      company: 'Pacific Freight',        price: '₹350/pallet', qty: '600 Pallets',status: 'pending', posted: '2026-09-07', flagged: false },
  { id: 'lst_4', name: '275-Gal IBC Liquid Totes',           category: 'Other',     company: 'Apex Industrial',        price: '₹3,300/unit', qty: '35 Units',  status: 'active',   posted: '2026-09-04', flagged: false },
  { id: 'lst_5', name: 'Grade #11 OCC Cardboard Bales',      category: 'Cardboard', company: 'GreenCycle Pulp',        price: '₹14/kg',      qty: '3,300 kg',  status: 'active',   posted: '2026-08-28', flagged: false },
  { id: 'lst_6', name: 'Recycled PET Strapping Rolls',       category: 'Plastic',   company: 'SurplusBox Trading',     price: '₹8/kg',       qty: '800 kg',    status: 'suspended',posted: '2026-08-20', flagged: true  },
  { id: 'lst_7', name: 'HDPE Industrial Drums (200 Litre)',  category: 'Plastic',   company: 'EcoPolymer Recyclers',   price: '₹1,800/unit', qty: '120 Units', status: 'active',   posted: '2026-08-15', flagged: false },
];

const MOCK_TRANSACTIONS = [
  { id: 'TXN-9482', date: '2026-09-10', material: 'Corrugated Cartons',    buyer: 'Gujarat Packaging Hub',  seller: 'Apex Goods Ltd.',    qty: '2,500 kg',   value: '₹37,500',   status: 'Completed' },
  { id: 'TXN-8921', date: '2026-09-08', material: 'GMA Wooden Pallets',    buyer: 'Pacific Freight',        seller: 'Apex Consumer Goods', qty: '450 Pallets', value: '₹1,57,500', status: 'Completed' },
  { id: 'TXN-8302', date: '2026-09-04', material: 'HDPE Flakes',           buyer: 'EcoPolymer Recyclers',   seller: 'Apex Consumer Goods', qty: '3,200 kg',   value: '₹1,02,400', status: 'Completed' },
  { id: 'TXN-7741', date: '2026-08-28', material: '275-Gal IBC Totes',     buyer: 'Apex Consumer Goods',    seller: 'Apex Industrial',     qty: '25 Units',   value: '₹82,500',   status: 'In Transit' },
  { id: 'TXN-7219', date: '2026-08-22', material: 'OCC Cardboard Bales',   buyer: 'GreenCycle Pulp',        seller: 'Apex Consumer Goods', qty: '3,300 kg',   value: '₹46,200',   status: 'Completed' },
  { id: 'TXN-6893', date: '2026-08-15', material: 'Gaylord Bulk Boxes',    buyer: 'Pacific Freight',        seller: 'Gujarat Packaging',   qty: '180 Boxes',  value: '₹65,300',   status: 'Completed' },
];

const MOCK_REPORTED_LISTINGS = [
  { id: 'RPT-001', listingId: 'lst_6', listingName: 'Recycled PET Strapping Rolls', company: 'SurplusBox Trading Co.', reportedBy: 'Gujarat Packaging Hub', reason: 'Inaccurate condition description — listed as "New" but items appear heavily used.', date: '2026-09-09', status: 'open' },
  { id: 'RPT-002', listingId: 'lst_3', listingName: 'Standard GMA Wooden Pallets', company: 'Pacific Freight Solutions', reportedBy: 'EcoPolymer Recyclers', reason: 'Photos do not match ISPM-15 certification claim. Heat-treat stamp not visible.', date: '2026-09-07', status: 'reviewing' },
  { id: 'RPT-003', listingId: 'lst_7', listingName: 'HDPE Industrial Drums', company: 'EcoPolymer Recyclers', reportedBy: 'Apex Industrial Containers', reason: 'Quantity listed as 120 units but only 80 were available on inspection.', date: '2026-08-30', status: 'resolved' },
];

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */

const KPI_METRICS = [
  { id: 'businesses',   label: 'Total Businesses',   value: '324',        sub: '+12 this month',    icon: Building2,     color: 'text-brand-400',   bg: 'bg-brand-500/10'   },
  { id: 'listings',     label: 'Active Listings',    value: '876',        sub: '48 pending review', icon: Package,       color: 'text-teal-400',    bg: 'bg-teal-500/10'    },
  { id: 'transactions', label: 'Transactions',        value: '1,284',      sub: 'All time',          icon: ArrowLeftRight,color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'reused',       label: 'Materials Reused',   value: '14,850 Units',sub: 'Kept in circulation',icon: Recycle,     color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  { id: 'diverted',     label: 'Materials Diverted', value: '342.5 Tonnes',sub: 'From landfill',     icon: Leaf,          color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
];

const BIZ_STATUS_STYLES = {
  active:    { badge: 'emerald', label: 'Active'    },
  pending:   { badge: 'amber',   label: 'Pending'   },
  suspended: { badge: 'rose',    label: 'Suspended' },
};

const LST_STATUS_STYLES = {
  active:    { badge: 'emerald', label: 'Active'    },
  pending:   { badge: 'amber',   label: 'Pending'   },
  suspended: { badge: 'rose',    label: 'Suspended' },
};

const TXN_STATUS_STYLES = {
  'Completed':  { badge: 'emerald', label: 'Completed' },
  'In Transit': { badge: 'teal',    label: 'In Transit' },
  'Pending':    { badge: 'amber',   label: 'Pending'   },
};

const RPT_STATUS_STYLES = {
  open:      { badge: 'rose',    label: 'Open'      },
  reviewing: { badge: 'amber',   label: 'Reviewing' },
  resolved:  { badge: 'emerald', label: 'Resolved'  },
};

const CATEGORY_PILL = {
  Cardboard: 'bg-emerald-500/15 text-emerald-400',
  Plastic:   'bg-teal-500/15 text-teal-400',
  Wood:      'bg-amber-500/15 text-amber-400',
  Other:     'bg-indigo-500/15 text-indigo-400',
};

/* ─────────────────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────────────────── */

// Compact search bar used in each table header
const TableSearch = ({ value, onChange, placeholder }) => (
  <div className="relative w-full sm:w-56">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
    />
  </div>
);

// Filter select drop-down
const TableFilter = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-7 py-1.5 text-[11px] text-slate-300 focus:outline-none focus:border-brand-500 transition cursor-pointer"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
  </div>
);

// Inline action buttons
const ActionBtn = ({ icon: Icon, label, variant = 'ghost', onClick, disabled }) => {
  const base = 'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition border';
  const styles = {
    ghost:   'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800',
    approve: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10',
    reject:  'border-rose-500/30 text-rose-400 hover:bg-rose-500/10',
    warn:    'border-amber-500/30 text-amber-400 hover:bg-amber-500/10',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant] || styles.ghost} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
};

// Section wrapper with title + controls row
const Section = ({ title, badge, badgeVariant = 'default', count, children }) => (
  <Card className="overflow-hidden">
    <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2 flex-wrap">
      <CardTitle className="text-sm">{title}</CardTitle>
      {badge && <Badge variant={badgeVariant} size="xs">{badge}</Badge>}
      {count !== undefined && (
        <span className="ml-auto text-[10px] text-slate-500">{count} records</span>
      )}
    </div>
    {children}
  </Card>
);

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export const AdminPage = () => {
  // Per-table search & filter state
  const [bizSearch,   setBizSearch]   = useState('');
  const [bizFilter,   setBizFilter]   = useState('all');
  const [lstSearch,   setLstSearch]   = useState('');
  const [lstFilter,   setLstFilter]   = useState('all');
  const [txnSearch,   setTxnSearch]   = useState('');
  const [txnFilter,   setTxnFilter]   = useState('all');
  const [rptSearch,   setRptSearch]   = useState('');
  const [rptFilter,   setRptFilter]   = useState('all');

  // Local action state (mock approve/reject/suspend)
  const [businesses,  setBusinesses]  = useState(MOCK_BUSINESSES);
  const [listings,    setListings]    = useState(MOCK_LISTINGS);
  const [reports,     setReports]     = useState(MOCK_REPORTED_LISTINGS);

  // ── Business actions
  const updateBizStatus = (id, status) =>
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));

  // ── Listing actions
  const updateLstStatus = (id, status) =>
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));

  // ── Report actions
  const updateRptStatus = (id, status) =>
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  // ── Filtered datasets
  const filteredBiz = useMemo(() => businesses.filter(b => {
    const q = bizSearch.toLowerCase();
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.type.toLowerCase().includes(q);
    const matchFilter = bizFilter === 'all' || b.status === bizFilter;
    return matchSearch && matchFilter;
  }), [businesses, bizSearch, bizFilter]);

  const filteredLst = useMemo(() => listings.filter(l => {
    const q = lstSearch.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.category.toLowerCase().includes(q);
    const matchFilter = lstFilter === 'all' || l.status === lstFilter;
    return matchSearch && matchFilter;
  }), [listings, lstSearch, lstFilter]);

  const filteredTxn = useMemo(() => MOCK_TRANSACTIONS.filter(t => {
    const q = txnSearch.toLowerCase();
    const matchSearch = !q || t.material.toLowerCase().includes(q) || t.buyer.toLowerCase().includes(q) || t.seller.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
    const matchFilter = txnFilter === 'all' || t.status === txnFilter;
    return matchSearch && matchFilter;
  }), [txnSearch, txnFilter]);

  const filteredRpt = useMemo(() => reports.filter(r => {
    const q = rptSearch.toLowerCase();
    const matchSearch = !q || r.listingName.toLowerCase().includes(q) || r.company.toLowerCase().includes(q) || r.reportedBy.toLowerCase().includes(q);
    const matchFilter = rptFilter === 'all' || r.status === rptFilter;
    return matchSearch && matchFilter;
  }), [reports, rptSearch, rptFilter]);

  const pendingBiz = businesses.filter(b => b.status === 'pending').length;
  const openReports = reports.filter(r => r.status === 'open').length;

  return (
    <div className="space-y-8">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/30 border border-slate-800 shadow-card">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Dashboard
            </h1>
            <Badge variant="brand" size="xs">Admin Console</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review registrations, approve listings, monitor transactions, and manage reported content.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {pendingBiz > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              {pendingBiz} pending approval{pendingBiz > 1 ? 's' : ''}
            </div>
          )}
          {openReports > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold">
              <Flag className="w-4 h-4" />
              {openReports} open report{openReports > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ── KPI METRICS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {KPI_METRICS.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3 shadow-card">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>
                <Icon className={`w-4.5 h-4.5 ${m.color}`} />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white leading-tight">{m.value}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{m.label}</div>
              </div>
              <div className={`text-[10px] font-medium ${m.color}`}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── SECTION 1: RECENT BUSINESSES ────────────────────────── */}
      <Section title="Recent Businesses" badge={`${pendingBiz} Pending`} badgeVariant={pendingBiz ? 'amber' : 'default'} count={filteredBiz.length}>
        {/* Controls */}
        <div className="px-5 py-3 border-b border-slate-800/60 flex flex-wrap items-center gap-3">
          <TableSearch value={bizSearch} onChange={setBizSearch} placeholder="Search companies…" />
          <TableFilter
            value={bizFilter}
            onChange={setBizFilter}
            options={[
              { value: 'all',       label: 'All Status'  },
              { value: 'active',    label: 'Active'      },
              { value: 'pending',   label: 'Pending'     },
              { value: 'suspended', label: 'Suspended'   },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-center">Listings</th>
                <th className="px-5 py-3 text-center">Transactions</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredBiz.map(b => {
                const s = BIZ_STATUS_STYLES[b.status] || BIZ_STATUS_STYLES.active;
                return (
                  <tr key={b.id} className="hover:bg-slate-900/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{b.location}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{b.type}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">{b.joinedDate}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-white">{b.listings}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-white">{b.transactions}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={s.badge} size="xs">{s.label}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <ActionBtn icon={Eye}        label="View"    onClick={() => {}} />
                        {b.status === 'pending' && <>
                          <ActionBtn icon={CheckCircle2} label="Approve" variant="approve" onClick={() => updateBizStatus(b.id, 'active')} />
                          <ActionBtn icon={XCircle}      label="Reject"  variant="reject"  onClick={() => updateBizStatus(b.id, 'suspended')} />
                        </>}
                        {b.status === 'active' &&
                          <ActionBtn icon={Ban} label="Suspend" variant="warn" onClick={() => updateBizStatus(b.id, 'suspended')} />
                        }
                        {b.status === 'suspended' &&
                          <ActionBtn icon={RefreshCw} label="Reinstate" variant="approve" onClick={() => updateBizStatus(b.id, 'active')} />
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBiz.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-500 text-xs">No businesses match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── SECTION 2: RECENT LISTINGS ──────────────────────────── */}
      <Section title="Recent Listings" count={filteredLst.length}>
        <div className="px-5 py-3 border-b border-slate-800/60 flex flex-wrap items-center gap-3">
          <TableSearch value={lstSearch} onChange={setLstSearch} placeholder="Search listings…" />
          <TableFilter
            value={lstFilter}
            onChange={setLstFilter}
            options={[
              { value: 'all',       label: 'All Status'  },
              { value: 'active',    label: 'Active'      },
              { value: 'pending',   label: 'Pending'     },
              { value: 'suspended', label: 'Suspended'   },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[740px]">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Material</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Qty / Price</th>
                <th className="px-5 py-3">Posted</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLst.map(l => {
                const s = LST_STATUS_STYLES[l.status] || LST_STATUS_STYLES.active;
                return (
                  <tr key={l.id} className="hover:bg-slate-900/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        {l.name}
                        {l.flagged && <Flag className="w-3 h-3 text-rose-400 shrink-0" title="Reported" />}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${CATEGORY_PILL[l.category] || ''}`}>
                        {l.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 truncate max-w-[130px]">{l.company}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-white font-semibold">{l.qty}</div>
                      <div className="text-[10px] text-teal-400 font-mono">{l.price}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">{l.posted}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={s.badge} size="xs">{s.label}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <ActionBtn icon={Eye}        label="View"    onClick={() => {}} />
                        {l.status === 'pending' && <>
                          <ActionBtn icon={CheckCircle2} label="Approve" variant="approve" onClick={() => updateLstStatus(l.id, 'active')} />
                          <ActionBtn icon={XCircle}      label="Reject"  variant="reject"  onClick={() => updateLstStatus(l.id, 'suspended')} />
                        </>}
                        {l.status === 'active' &&
                          <ActionBtn icon={Ban} label="Suspend" variant="warn" onClick={() => updateLstStatus(l.id, 'suspended')} />
                        }
                        {l.status === 'suspended' &&
                          <ActionBtn icon={RefreshCw} label="Reinstate" variant="approve" onClick={() => updateLstStatus(l.id, 'active')} />
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLst.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-500 text-xs">No listings match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── SECTION 3: RECENT TRANSACTIONS ──────────────────────── */}
      <Section title="Recent Transactions" count={filteredTxn.length}>
        <div className="px-5 py-3 border-b border-slate-800/60 flex flex-wrap items-center gap-3">
          <TableSearch value={txnSearch} onChange={setTxnSearch} placeholder="Search transactions…" />
          <TableFilter
            value={txnFilter}
            onChange={setTxnFilter}
            options={[
              { value: 'all',        label: 'All Status'  },
              { value: 'Completed',  label: 'Completed'   },
              { value: 'In Transit', label: 'In Transit'  },
              { value: 'Pending',    label: 'Pending'     },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">TXN ID</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Material</th>
                <th className="px-5 py-3">Buyer</th>
                <th className="px-5 py-3">Seller</th>
                <th className="px-5 py-3 text-right">Value</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTxn.map(t => {
                const s = TXN_STATUS_STYLES[t.status] || TXN_STATUS_STYLES['Pending'];
                return (
                  <tr key={t.id} className="hover:bg-slate-900/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-brand-400">{t.id}</td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono">{t.date}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">{t.material}</td>
                    <td className="px-5 py-3.5 text-slate-300 truncate max-w-[120px]">{t.buyer}</td>
                    <td className="px-5 py-3.5 text-slate-300 truncate max-w-[120px]">{t.seller}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-amber-400">{t.value}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={s.badge} size="xs">{s.label}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <ActionBtn icon={Eye} label="View" onClick={() => {}} />
                    </td>
                  </tr>
                );
              })}
              {filteredTxn.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-500 text-xs">No transactions match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── SECTION 4: REPORTED LISTINGS ────────────────────────── */}
      <Section
        title="Reported Listings"
        badge={openReports > 0 ? `${openReports} Open` : undefined}
        badgeVariant="rose"
        count={filteredRpt.length}
      >
        <div className="px-5 py-3 border-b border-slate-800/60 flex flex-wrap items-center gap-3">
          <TableSearch value={rptSearch} onChange={setRptSearch} placeholder="Search reports…" />
          <TableFilter
            value={rptFilter}
            onChange={setRptFilter}
            options={[
              { value: 'all',       label: 'All Status'  },
              { value: 'open',      label: 'Open'        },
              { value: 'reviewing', label: 'Reviewing'   },
              { value: 'resolved',  label: 'Resolved'    },
            ]}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Listing</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Reported By</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredRpt.map(r => {
                const s = RPT_STATUS_STYLES[r.status] || RPT_STATUS_STYLES.open;
                return (
                  <tr key={r.id} className="hover:bg-slate-900/30 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{r.listingName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{r.listingId}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 truncate max-w-[140px]">{r.company}</td>
                    <td className="px-5 py-3.5 text-slate-400 truncate max-w-[130px]">{r.reportedBy}</td>
                    <td className="px-5 py-3.5 text-slate-400 max-w-[220px]">
                      <p className="line-clamp-2 leading-relaxed">{r.reason}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono whitespace-nowrap">{r.date}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={s.badge} size="xs">{s.label}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <ActionBtn icon={Eye} label="View" onClick={() => {}} />
                        {r.status === 'open' && (
                          <ActionBtn icon={ShieldAlert} label="Review" variant="warn" onClick={() => updateRptStatus(r.id, 'reviewing')} />
                        )}
                        {r.status === 'reviewing' && <>
                          <ActionBtn icon={CheckCircle2} label="Resolve" variant="approve" onClick={() => updateRptStatus(r.id, 'resolved')} />
                          <ActionBtn icon={Ban}          label="Remove"  variant="reject"  onClick={() => updateLstStatus(r.listingId, 'suspended')} />
                        </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRpt.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-500 text-xs">No reports match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

    </div>
  );
};

export default AdminPage;
