import React from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  FileText,
  ShoppingBag,
  Leaf,
  ArrowRight,
  PlusCircle,
  Clock,
  MapPin,
  TrendingDown,
  Truck,
  CheckCircle2,
  Package,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-semibold text-white mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="capitalize font-medium">
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value} {entry.name === 'co2e' ? 't CO₂e' : 'tons'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardPage = () => {
  const { currentCompany } = useAuth();
  const { listings, orders, requests, shipments, impactStats } = useMarketplace();

  // Mock active statistics
  const activeListingsCount = (listings || []).length;
  const pendingRequestsCount = (requests || []).filter(r => r && (r.status === 'Open' || r.status === 'Reviewing Offers')).length;
  const completedOrdersCount = (orders || []).filter(o => o && (o.orderStatus === 'Delivered' || o.orderStatus === 'Completed')).length || 42;
  const materialDivertedTons = currentCompany?.divertedTonnage || 342.5;

  // Section 1: Recent Activity items
  const recentActivities = [
    {
      id: 'act_1',
      type: 'request_received',
      title: 'New request received',
      description: 'VerdeTech Polymer Recyclers requested quote for 25 Tons Grade #11 OCC Bales',
      time: '18 minutes ago',
      icon: FileText,
      iconBg: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      badge: 'RFQ Received',
      badgeVariant: 'teal',
      link: '/requests'
    },
    {
      id: 'act_2',
      type: 'material_purchased',
      title: 'Material purchased',
      description: '200 Standard GMA Grade-A Pallets purchased from GreatLakes Retail Logistics',
      time: '2 hours ago',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badge: 'Order Settled',
      badgeVariant: 'emerald',
      link: '/orders/ord_8892'
    },
    {
      id: 'act_3',
      type: 'shipment_delivered',
      title: 'Shipment delivered',
      description: '15 Reconditioned 275-Gal IBC Totes delivered to Milwaukee processing facility',
      time: 'Yesterday at 16:15',
      icon: Truck,
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      badge: 'Delivered',
      badgeVariant: 'blue',
      link: '/logistics'
    },
    {
      id: 'act_4',
      type: 'listing_published',
      title: 'New listing published',
      description: 'Natural HDPE Washed Regrind Flakes (28,000 lbs) added to verified marketplace',
      time: '2 days ago',
      icon: Boxes,
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badge: 'Active Lot',
      badgeVariant: 'amber',
      link: '/listings'
    }
  ];

  // Section 2: 4 Recommended Materials
  const recommendedMaterials = listings.slice(0, 4);

  // Section 4: Active Shipments list
  const activeShipmentsData = [
    {
      id: 'shp_1',
      material: 'Baled OCC Corrugated (12 Tons)',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      status: 'In Transit',
      eta: 'Tomorrow, 14:00',
      carrier: 'EcoFreight (53ft Dry Van)',
      trackingNumber: 'EF-TRK-992140',
      progress: 68
    },
    {
      id: 'shp_2',
      material: '275-Gallon IBC Totes (15 Units)',
      origin: 'Milwaukee, WI',
      destination: 'Chicago, IL',
      status: 'Processing',
      eta: 'Mar 16, 2026',
      carrier: 'Dedicated Flatbed Express',
      trackingNumber: 'DF-EXP-30129',
      progress: 25
    },
    {
      id: 'shp_3',
      material: 'GMA Grade-A Pallets (200 Units)',
      origin: 'Columbus, OH',
      destination: 'Chicago, IL',
      status: 'Delivered',
      eta: 'Completed (Mar 05)',
      carrier: 'Self-Arranged Dedicated Truck',
      trackingNumber: 'GL-PICKUP-4401',
      progress: 100
    }
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {currentCompany?.name || 'ABC Manufacturing'}
            </h1>
            <Badge variant="emerald" size="xs">
              {currentCompany?.type || 'Manufacturer'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Here's what's happening with your circular materials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button to="/list-material" size="sm" variant="primary" icon={PlusCircle}>
            List Material
          </Button>
          <Button to="/requests" size="sm" variant="secondary" icon={FileText}>
            Post RFQ
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Listings"
          value={formatNumber(activeListingsCount)}
          unit="Lots"
          change="+3 new lots this month"
          trend="up"
          icon={Boxes}
          iconColor="text-brand-400"
          iconBg="bg-brand-500/10"
        />
        <StatCard
          title="Pending Requests"
          value={formatNumber(pendingRequestsCount)}
          unit="RFQs"
          change="3 awaiting bid review"
          trend="up"
          icon={FileText}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10"
        />
        <StatCard
          title="Completed Orders"
          value={formatNumber(completedOrdersCount)}
          unit="POs"
          change="₹8.4L circular value realized"
          trend="up"
          icon={ShoppingBag}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Material Diverted"
          value={formatNumber(materialDivertedTons)}
          unit="Tons"
          change="EPA WARM offset certified"
          trend="up"
          icon={Leaf}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
      </div>

      {/* Grid: Section 1 (Recent Activity) & Section 3 (Circular Impact Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* SECTION 1: Recent Activity */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <CardHeader>
            <div>
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">Live events across trading counterparties</p>
            </div>
            <Link to="/requests" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium">
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardBody className="p-0 flex-1 divide-y divide-slate-800/80">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-4 hover:bg-slate-850/40 transition duration-150 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${act.iconBg}`}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{act.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        {act.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{act.time}</span>
                  </span>
                  <Link to={act.link} className="text-emerald-400 hover:text-emerald-300 font-medium">
                    Open details →
                  </Link>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* SECTION 3: Circular Impact Chart (Materials Reused Over Last 6 Months) */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-semibold">Circular Impact Telemetry</CardTitle>
                <Badge variant="emerald" size="xs">Scope 3 GHG</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Materials reused over the last 6 months (Metric tons & CO₂e avoided)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Cardboard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-slate-300">Plastics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-300">Pallets</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impactStats?.monthlyTrends || [
                { month: 'Apr', cardboard: 120, plastics: 80, pallets: 60 },
                { month: 'May', cardboard: 180, plastics: 110, pallets: 90 },
                { month: 'Jun', cardboard: 240, plastics: 150, pallets: 120 },
                { month: 'Jul', cardboard: 290, plastics: 190, pallets: 140 },
                { month: 'Aug', cardboard: 310, plastics: 210, pallets: 160 },
                { month: 'Sep', cardboard: 330, plastics: 230, pallets: 170 }
              ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cardboardGradDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="plasticsGradDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="palletsGradDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="cardboard" name="Cardboard" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#cardboardGradDash)" />
                <Area type="monotone" dataKey="plastics" name="Plastics" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#plasticsGradDash)" />
                <Area type="monotone" dataKey="pallets" name="Pallets" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#palletsGradDash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Leaf className="w-4 h-4" />
              <span>Cumulative Avoided: 8,450.2 MT CO₂e</span>
            </span>
            <Link to="/impact" className="text-xs text-slate-300 hover:text-white flex items-center gap-1">
              <span>View Full ESG Impact Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* SECTION 2: Recommended Materials (4 material cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recommended Materials</h2>
            <p className="text-xs text-slate-400">Curated secondary packaging lots matching your procurement profile</p>
          </div>
          <Link to="/marketplace" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
            <span>Browse all materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedMaterials.map((item) => (
            <Card
              key={item.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden group border-slate-800/80 hover:border-slate-700"
            >
              <div className="relative h-36 bg-slate-900 border-b border-slate-800 overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <Badge variant="teal" size="xs">
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.sellerLocation}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">{item.estimatedCo2eSavings} t CO₂e</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 truncate block">{item.sellerName}</span>
                  <Link to={`/marketplace/${item.id}`}>
                    <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition line-clamp-2 mt-0.5">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.condition}</p>
                </div>

                <div className="pt-2.5 border-t border-slate-850 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Available Lot</span>
                    <span className="font-semibold text-slate-200">{item.availableQuantity} {item.unit}s</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Unit Rate</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(item.pricePerUnit)}</span>
                  </div>
                </div>

                <Button to={`/marketplace/${item.id}`} variant="secondary" size="xs" className="w-full">
                  View Lot Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 4: Active Shipments */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-900/40">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">Active Shipments & Freight Hauls</CardTitle>
              <Badge variant="teal" size="xs">Live Telemetry</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Material transport status, origin/destination routes, and estimated arrival</p>
          </div>
          <Button to="/logistics" size="xs" variant="outline">
            Open Logistics Desk
          </Button>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Material Lot</th>
                <th className="p-4">Route (Origin → Destination)</th>
                <th className="p-4">Carrier & Tracking</th>
                <th className="p-4">Status</th>
                <th className="p-4">ETA</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeShipmentsData.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-850/40 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{shp.material}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Backhaul Verified</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-200 font-medium">{shp.origin}</span>
                    <span className="text-slate-500 mx-1.5">➔</span>
                    <span className="text-white font-semibold">{shp.destination}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-300 block">{shp.carrier}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{shp.trackingNumber}</span>
                  </td>

                  <td className="p-4">
                    <StatusBadge status={shp.status} size="xs" />
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-slate-200 block">{shp.eta}</span>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${shp.progress}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <Button to="/logistics" size="xs" variant="outline" icon={ExternalLink}>
                      Track
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardPage;
