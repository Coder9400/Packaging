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
    backgroundColor: '#0f172a',
    borderColor: '#334155',
    borderRadius: '0.75rem',
    fontSize: '12px',
    color: '#f1f5f9',
  },
  itemStyle: { color: '#94a3b8' },
};

/* ── Custom Pie label ─────────────────────────────────────────────────── */
const renderCustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="700">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ── Category Badge colors ────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  Cardboard: 'bg-emerald-500/20 text-emerald-300',
  Plastic:   'bg-teal-500/20 text-teal-300',
  Wood:      'bg-amber-500/20 text-amber-300',
  Other:     'bg-indigo-500/20 text-indigo-300',
};
const TYPE_COLORS = {
  Reused:   'bg-brand-500/15 text-brand-300',
  Recycled: 'bg-teal-500/15 text-teal-300',
};

/* ── Equivalency Icon Map ─────────────────────────────────────────────── */
const EQUIV_ICONS = { TreePine, Droplets, Zap, Boxes };
const EQUIV_PALETTE = {
  emerald: { card: 'bg-emerald-500/10 border-emerald-500/20', icon: 'bg-emerald-500/20 text-emerald-400', val: 'text-emerald-400' },
  teal:    { card: 'bg-teal-500/10 border-teal-500/20',       icon: 'bg-teal-500/20 text-teal-400',       val: 'text-teal-400' },
  amber:   { card: 'bg-amber-500/10 border-amber-500/20',     icon: 'bg-amber-500/20 text-amber-400',     val: 'text-amber-400' },
  indigo:  { card: 'bg-indigo-500/10 border-indigo-500/20',   icon: 'bg-indigo-500/20 text-indigo-400',   val: 'text-indigo-400' },
};

/* ════════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════ */
export const ImpactPage = () => {
  const [historyFilter, setHistoryFilter] = useState('All');

  const filteredHistory = historyFilter === 'All'
    ? IMPACT_HISTORY
    : IMPACT_HISTORY.filter(h => h.category === historyFilter);

  return (
    <div className="space-y-8">

      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-card">
        {/* Decorative ambient circle */}
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-24 rounded-full bg-teal-500/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Your Circular Impact
              </h1>
              <Badge variant="emerald" size="xs">Estimated Impact</Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1.5 max-w-xl">
              Track how your circular procurement decisions divert waste, reduce carbon, and generate measurable business savings. All values are <span className="text-emerald-400 font-semibold">estimated impact</span> — a precise calculation engine will be added in a future update.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" icon={Download}>
              Export ESG Report
            </Button>
          </div>
        </div>

        {/* Disclaimer pill */}
        <div className="relative mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 max-w-xl">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
          <span>
            <strong>Disclosure:</strong> CO₂e and environmental equivalency values shown are estimated projections based on material category and quantity. They do not represent certified carbon credits or scientifically audited measurements.
          </span>
        </div>
      </div>

      {/* ── KPI Metric Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 — Materials Reused */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-brand-400" />
            </div>
            <Badge variant="teal" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {IMPACT_OVERVIEW_METRICS.totalMaterialsReused.value}
              <span className="text-base font-semibold text-slate-400 ml-1">
                {IMPACT_OVERVIEW_METRICS.totalMaterialsReused.unit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{IMPACT_OVERVIEW_METRICS.totalMaterialsReused.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.totalMaterialsReused.change}
          </div>
        </div>

        {/* Card 2 — Waste Diverted */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <Badge variant="emerald" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {IMPACT_OVERVIEW_METRICS.wasteDiverted.value}
              <span className="text-base font-semibold text-slate-400 ml-1">
                {IMPACT_OVERVIEW_METRICS.wasteDiverted.unit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{IMPACT_OVERVIEW_METRICS.wasteDiverted.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.wasteDiverted.change}
          </div>
        </div>

        {/* Card 3 — CO2 Avoided */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-teal-400" />
            </div>
            <Badge variant="teal" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.value}
              <span className="text-base font-semibold text-slate-400 ml-1">
                {IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.unit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.estimatedCo2Avoided.change}
          </div>
        </div>

        {/* Card 4 — Business Savings */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition group shadow-card">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-amber-400" />
            </div>
            <Badge variant="amber" size="xs">Estimated</Badge>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {IMPACT_OVERVIEW_METRICS.estimatedBusinessSavings.value}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{IMPACT_OVERVIEW_METRICS.estimatedBusinessSavings.label}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {IMPACT_OVERVIEW_METRICS.estimatedBusinessSavings.change}
          </div>
        </div>
      </div>

      {/* ── CHART ROW 1: Materials Reused Over Time ──────────────────── */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Materials Reused Over Time</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Monthly units kept in active circular service — broken down by material stream</p>
          </div>
          <Badge variant="teal" size="xs">Estimated Impact · Apr–Sep 2026</Badge>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MATERIALS_REUSED_OVER_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCardboard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradWood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPlastic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="cardboardUnits" name="Cardboard" stroke="#10b981" fill="url(#gradCardboard)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="woodPallets"    name="Wood Pallets" stroke="#f59e0b" fill="url(#gradWood)"      strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="plasticUnits"   name="Plastics"     stroke="#0d9488" fill="url(#gradPlastic)"   strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── CHART ROW 2: Category Breakdown + Waste Diverted ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CHART 2 — Donut: Materials by Category */}
        <Card className="lg:col-span-5 p-6 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <CardTitle className="text-base">Materials by Category</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Proportion of diverted tonnes per material stream</p>
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
                  <span className="text-slate-300 font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white">{cat.value} t</span>
                  <span className="text-slate-500 w-8 text-right">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CHART 3 — Line: Waste Diverted Over Time */}
        <Card className="lg:col-span-7 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <CardTitle className="text-base">Waste Diverted Over Time</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Cumulative tonnes redirected from landfill and estimated CO₂e avoided</p>
            </div>
            <Badge variant="emerald" size="xs">Estimated</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WASTE_DIVERTED_OVER_TIME} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
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
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Circular Impact Summary Banner ───────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-teal-950/30 border border-emerald-500/25 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-white leading-snug">
              {IMPACT_SUMMARY_BANNER.headline}
            </p>
            <p className="text-xs text-slate-400 mt-1.5">{IMPACT_SUMMARY_BANNER.subtext}</p>
          </div>
        </div>

        {/* Breakdown Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Material Breakdown</span>
            <span>Total: 12.4 Tonnes Diverted (Estimated)</span>
          </div>

          {/* Stacked progress bar */}
          <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
            {IMPACT_SUMMARY_BANNER.breakdown.map((item) => (
              <div
                key={item.category}
                className={`${item.bgClass} transition-all duration-700`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.tonnes}t (${item.percentage}%)`}
              />
            ))}
          </div>

          {/* Legend tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {IMPACT_SUMMARY_BANNER.breakdown.map((item) => (
              <div key={item.category} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${item.bgClass}`} />
                  <span className={`text-xs font-bold ${item.textClass}`}>{item.category}</span>
                </div>
                <div className="text-base font-extrabold text-white">{item.tonnes} t</div>
                <div className="text-[10px] text-slate-500">{item.description}</div>
                <div className="text-[10px] font-bold text-slate-400">{item.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Environmental Equivalencies ──────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Environmental Equivalencies</h2>
          <p className="text-xs text-slate-400 mt-0.5">Illustrative equivalencies to contextualise estimated impact — not certified measurements.</p>
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
                  <div className={`text-2xl font-extrabold ${palette.val}`}>{eq.value}</div>
                  <div className="text-[11px] font-bold text-white mt-0.5">{eq.unit}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-300">{eq.title}</div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{eq.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Impact History Table ─────────────────────────────────────── */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <CardTitle className="text-base">Impact History</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Per-transaction circular impact log with estimated environmental value</p>
          </div>
          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['All', 'Cardboard', 'Plastic', 'Wood', 'Other'].map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                  historyFilter === f
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
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
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Material</th>
                <th className="pb-3 pr-4">Quantity</th>
                <th className="pb-3 pr-4">Est. Landfill Diverted</th>
                <th className="pb-3 pr-4">Est. CO₂e Avoided</th>
                <th className="pb-3 pr-4">Est. Cost Saved</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/40 transition group">
                  <td className="py-3.5 pr-4 text-slate-400 font-mono whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="font-semibold text-white line-clamp-1">{row.material}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{row.partner}</div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300 font-mono whitespace-nowrap">
                    {row.quantity}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-emerald-400 font-mono">{row.landfillDiverted}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-teal-400 font-mono">{row.co2Avoided}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-amber-400 font-mono">{row.costSaved}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${TYPE_COLORS[row.type] || ''}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono text-slate-400 group-hover:text-teal-400 transition">
                      {row.transactionId}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
                    No impact records found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="flex flex-wrap gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            <span className="font-bold text-white">{filteredHistory.length}</span> transactions shown
          </div>
          <div>
            Total diverted (est.):&nbsp;
            <span className="font-bold text-emerald-400">
              {filteredHistory.reduce((acc, r) => acc + parseFloat(r.landfillDiverted), 0).toFixed(2)} Tonnes
            </span>
          </div>
          <div>
            Total CO₂e avoided (est.):&nbsp;
            <span className="font-bold text-teal-400">
              {filteredHistory.reduce((acc, r) => acc + parseFloat(r.co2Avoided), 0).toFixed(2)} t CO₂e
            </span>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default ImpactPage;
