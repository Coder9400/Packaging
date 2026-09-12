import React, { useState } from 'react';
import {
  Leaf,
  TrendingDown,
  Recycle,
  IndianRupee,
  TreePine,
  Droplets,
  Zap,
  Boxes,
  Download,
  Info,
  CheckCircle2,
  ArrowUpRight,
  Package,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  IMPACT_OVERVIEW_METRICS,
  IMPACT_SUMMARY_BANNER,
  MATERIALS_REUSED_OVER_TIME,
  MATERIALS_BY_CATEGORY,
  WASTE_DIVERTED_OVER_TIME,
  ENVIRONMENTAL_EQUIVALENCIES,
  IMPACT_HISTORY
} from '../../data/impactData';
import { Card, CardTitle } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

/* ── Recharts shared tooltip style ───────────────────────────────────── */
const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: '0.75rem',
    fontSize: '12px',
    color: '#0f172a',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  itemStyle: { color: '#475569' },
};

/* ── Custom Pie label ─────────────────────────────────────────────────── */
const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ── Category Badge colors ────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  Cardboard: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Plastic:   'bg-blue-50 text-blue-700 border border-blue-200',
  Wood:      'bg-amber-50 text-amber-700 border border-amber-200',
  Other:     'bg-indigo-50 text-indigo-700 border border-indigo-200',
};
const TYPE_COLORS = {
  Reused:   'bg-blue-50 text-blue-700 font-bold',
  Recycled: 'bg-emerald-50 text-emerald-700 font-bold',
};

/* ── Equivalency Icon Map ─────────────────────────────────────────────── */
const EQUIV_ICONS = { TreePine, Droplets, Zap, Boxes };
const EQUIV_PALETTE = {
  emerald: { card: 'bg-white border-slate-200 shadow-card', icon: 'bg-emerald-50 text-emerald-600 border border-emerald-200', val: 'text-emerald-600' },
  teal:    { card: 'bg-white border-slate-200 shadow-card', icon: 'bg-blue-50 text-blue-600 border border-blue-200',       val: 'text-blue-600' },
  amber:   { card: 'bg-white border-slate-200 shadow-card', icon: 'bg-amber-50 text-amber-600 border border-amber-200',     val: 'text-amber-600' },
  indigo:  { card: 'bg-white border-slate-200 shadow-card', icon: 'bg-indigo-50 text-indigo-600 border border-indigo-200',   val: 'text-indigo-600' },
};

export const ImpactPage = () => {
  const [historyFilter, setHistoryFilter] = useState('All');

  const filteredHistory = historyFilter === 'All'
    ? IMPACT_HISTORY
    : IMPACT_HISTORY.filter(h => h.category === historyFilter);

  return (
    <div className="space-y-8">

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-teal-50/60 border border-blue-200/80 shadow-card">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Your Circular Impact
              </h1>
              <Badge variant="blue" size="xs">Estimated Impact</Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1.5 max-w-xl">
              Track how your circular procurement decisions divert waste, reduce carbon, and generate measurable business savings. All values are <span className="text-blue-600 font-semibold">estimated impact</span> — verified calculations added per transaction.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" icon={Download}>
              Export ESG Report
            </Button>
          </div>
        </div>

        {/* Disclaimer pill */}
        <div className="relative mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 max-w-xl shadow-xs">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600" />
          <span>
            <strong>Disclosure:</strong> CO₂e and environmental equivalency values shown are estimated projections based on material category and quantity. They do not represent certified carbon credits or scientifically audited measurements.
          </span>
        </div>
      </div>

      {/* ── KPI Metric Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 — Materials Reused */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 hover:border-slate-300 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-blue-600" />
            </div>
            <Badge variant="blue" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {IMPACT_OVERVIEW_METRICS.totalMaterialsReused.value}
              <span className="text-base font-semibold text-slate-500 ml-1">
                {IMPACT_OVERVIEW_METRICS.totalMaterialsReused.unit}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{IMPACT_OVERVIEW_METRICS.totalMaterialsReused.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.totalMaterialsReused.change}
          </div>
        </div>

        {/* Card 2 — Waste Diverted */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 hover:border-slate-300 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <Badge variant="emerald" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {IMPACT_OVERVIEW_METRICS.wasteDiverted.value}
              <span className="text-base font-semibold text-slate-500 ml-1">
                {IMPACT_OVERVIEW_METRICS.wasteDiverted.unit}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{IMPACT_OVERVIEW_METRICS.wasteDiverted.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.wasteDiverted.change}
          </div>
        </div>

        {/* Card 3 — CO2 Avoided */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 hover:border-slate-300 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-blue-600" />
            </div>
            <Badge variant="blue" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.value}
              <span className="text-base font-semibold text-slate-500 ml-1">
                {IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.unit}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.change}
          </div>
        </div>

        {/* Card 4 — Business Savings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-3 hover:border-slate-300 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-amber-600" />
            </div>
            <Badge variant="amber" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {IMPACT_OVERVIEW_METRICS.estimatedBusinessSavings.value}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{IMPACT_OVERVIEW_METRICS.estimatedBusinessSavings.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.estimatedBusinessSavings.change}
          </div>
        </div>
      </div>

      {/* ── CHART ROW 1: Materials Reused Over Time ──────────────────── */}
      <Card className="p-6 space-y-5 bg-white border-slate-200/90 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 font-display">Materials Reused Over Time</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Monthly units kept in active circular service — broken down by material stream</p>
          </div>
          <Badge variant="blue" size="xs">Estimated Impact · Apr–Sep 2026</Badge>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MATERIALS_REUSED_OVER_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCardboard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradWood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPlastic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="cardboardUnits" name="Cardboard" stroke="#10b981" fill="url(#gradCardboard)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="woodPallets"    name="Wood Pallets" stroke="#f59e0b" fill="url(#gradWood)"      strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="plasticUnits"   name="Plastics"     stroke="#2563eb" fill="url(#gradPlastic)"   strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── CHART ROW 2: Category Breakdown + Waste Diverted ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CHART 2 — Donut: Materials by Category */}
        <Card className="lg:col-span-5 p-6 space-y-5 bg-white border-slate-200/90 shadow-card">
          <div className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 font-display">Materials by Category</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Proportion of diverted tonnes per material stream</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MATERIALS_BY_CATEGORY}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomPieLabel}
                >
                  {MATERIALS_BY_CATEGORY.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(val) => [`${val} Tonnes`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="space-y-2.5">
            {MATERIALS_BY_CATEGORY.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-700 font-semibold">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900">{cat.value} t</span>
                  <span className="text-slate-500 w-8 text-right font-medium">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CHART 3 — Line: Waste Diverted Over Time */}
        <Card className="lg:col-span-7 p-6 space-y-5 bg-white border-slate-200/90 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 font-display">Waste Diverted Over Time</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Cumulative tonnes redirected from landfill and estimated CO₂e avoided</p>
            </div>
            <Badge variant="emerald" size="xs">Estimated</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WASTE_DIVERTED_OVER_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v, name) => [`${v} t`, name]} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="cumulativeDiverted"
                  name="Cumulative Diverted (t)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="co2Avoided"
                  name="Est. CO₂e Avoided (t)"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ fill: '#2563eb', r: 3, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Circular Impact Summary Banner ───────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-teal-50/50 border border-blue-200/80 shadow-card space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug font-display">
              {IMPACT_SUMMARY_BANNER.headline}
            </p>
            <p className="text-xs text-slate-600 mt-1.5">{IMPACT_SUMMARY_BANNER.subtext}</p>
          </div>
        </div>

        {/* Breakdown Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Material Breakdown</span>
            <span>Total: 12.4 Tonnes Diverted (Estimated)</span>
          </div>

          {/* Stacked progress bar */}
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5 bg-slate-100 p-0.5 border border-slate-200">
            {IMPACT_SUMMARY_BANNER.breakdown.map((item) => (
              <div
                key={item.category}
                className={`${item.bgClass} transition-all duration-700 rounded-full`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.tonnes}t (${item.percentage}%)`}
              />
            ))}
          </div>

          {/* Legend tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {IMPACT_SUMMARY_BANNER.breakdown.map((item) => (
              <div key={item.category} className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${item.bgClass}`} />
                  <span className="text-xs font-bold text-slate-900 font-display">{item.category}</span>
                </div>
                <div className="text-base font-extrabold text-slate-900">{item.tonnes} t</div>
                <div className="text-[10px] text-slate-500">{item.description}</div>
                <div className="text-[10px] font-bold text-blue-600">{item.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Environmental Equivalencies ──────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-display">Environmental Equivalencies</h2>
          <p className="text-xs text-slate-500 mt-0.5">Illustrative equivalencies to contextualise estimated impact — not certified measurements.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ENVIRONMENTAL_EQUIVALENCIES.map((eq) => {
            const IconComp = EQUIV_ICONS[eq.icon];
            const palette = EQUIV_PALETTE[eq.color];
            return (
              <div key={eq.id} className={`p-5 rounded-2xl border space-y-3 ${palette.card}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${palette.icon}`}>
                  {IconComp && <IconComp className="w-5 h-5" />}
                </div>
                <div>
                  <div className={`text-2xl font-extrabold font-display ${palette.val}`}>{eq.value}</div>
                  <div className="text-[11px] font-bold text-slate-900 mt-0.5">{eq.unit}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 font-display">{eq.title}</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{eq.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Impact History Table ─────────────────────────────────────── */}
      <Card className="p-6 space-y-5 bg-white border-slate-200/90 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 font-display">Impact History</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Per-transaction circular impact log with estimated environmental value</p>
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Cardboard', 'Plastic', 'Wood', 'Other'].map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                  historyFilter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3">Date</th>
                <th className="p-3">Material</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Est. Landfill Diverted</th>
                <th className="p-3">Est. CO₂e Avoided</th>
                <th className="p-3">Est. Cost Saved</th>
                <th className="p-3">Type</th>
                <th className="p-3">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition group">
                  <td className="p-3 text-slate-500 font-mono whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 line-clamp-1 font-display">{row.material}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{row.partner}</div>
                  </td>
                  <td className="p-3 text-slate-700 font-mono whitespace-nowrap font-bold">
                    {row.quantity}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-emerald-600 font-mono">{row.landfillDiverted}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-blue-600 font-mono">{row.co2Avoided}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-amber-600 font-mono">{row.costSaved}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${TYPE_COLORS[row.type] || ''}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-slate-400 group-hover:text-blue-600 transition">
                      {row.transactionId}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    No impact records found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-900">{filteredHistory.length}</span> transactions shown
          </div>
          <div>
            Total diverted (est.):&nbsp;
            <span className="font-bold text-emerald-600">
              {filteredHistory.reduce((acc, r) => acc + parseFloat(r.landfillDiverted), 0).toFixed(2)} Tonnes
            </span>
          </div>
          <div>
            Total CO₂e avoided (est.):&nbsp;
            <span className="font-bold text-blue-600">
              {filteredHistory.reduce((acc, r) => acc + parseFloat(r.co2Avoided), 0).toFixed(2)} t CO₂e
            </span>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default ImpactPage;
