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
  Building2,
  Store
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-float text-xs space-y-1">
        <p className="font-bold text-slate-900 mb-1.5 font-display">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="capitalize font-semibold">
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-slate-900">
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
  const { listings, orders, requests, impactStats } = useMarketplace();

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
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'RFQ Received',
      link: '/requests'
    },
    {
      id: 'act_2',
      type: 'material_purchased',
      title: 'Material purchased',
      description: '200 Standard GMA Grade-A Pallets purchased from GreatLakes Retail Logistics',
      time: '2 hours ago',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'Order Settled',
      link: '/orders/ord_8892'
    },
    {
      id: 'act_3',
      type: 'shipment_delivered',
      title: 'Shipment delivered',
      description: '15 Reconditioned 275-Gal IBC Totes delivered to Milwaukee processing facility',
      time: 'Yesterday at 16:15',
      icon: Truck,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'Delivered',
      link: '/logistics'
    },
    {
      id: 'act_4',
      type: 'listing_published',
      title: 'New listing published',
      description: 'Natural HDPE Washed Regrind Flakes (28,000 lbs) added to verified marketplace',
      time: '2 days ago',
      icon: Boxes,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'Active Lot',
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
      {/* Dashboard Top Header - Nexora Light Theme Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 border border-blue-500/20 text-white shadow-glow-blue">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Good morning, {currentCompany?.name || 'ABC Manufacturing'}
            </h1>
            <Badge variant="blue" size="xs" className="bg-white/20 text-white border-white/30">
              {currentCompany?.type || 'Manufacturer'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
            Here's what's happening across your circular material streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            to="/list-material"
            size="sm"
            className="bg-white text-blue-600 hover:bg-slate-50 font-bold shadow-md shadow-blue-900/20 rounded-xl"
            icon={PlusCircle}
          >
            + List Material
          </Button>
          <Button
            to="/marketplace"
            size="sm"
            className="bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/30 font-bold rounded-xl"
            icon={Store}
          >
            Browse Marketplace
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
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Pending Requests"
          value={formatNumber(pendingRequestsCount)}
          unit="RFQs"
          change="3 awaiting bid review"
          trend="up"
          icon={FileText}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Completed Orders"
          value={formatNumber(completedOrdersCount)}
          unit="POs"
          change="₹8.4L circular value realized"
          trend="up"
          icon={ShoppingBag}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Material Diverted"
          value={formatNumber(materialDivertedTons)}
          unit="Tons"
          change="EPA WARM offset certified"
          trend="up"
          icon={Leaf}
          iconColor="text-teal-600"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Grid: Section 1 (Recent Activity) & Section 3 (Circular Impact Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* SECTION 1: Recent Activity */}
        <Card className="lg:col-span-1 flex flex-col justify-between bg-white border-slate-200/90 shadow-card">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 font-display">Recent Activity</CardTitle>
              <p className="text-[11px] text-slate-500 mt-0.5">Live events across trading counterparties</p>
            </div>
            <Link to="/requests" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardBody className="p-0 flex-1 divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-4 hover:bg-slate-50 transition duration-150 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${act.iconBg}`}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        {act.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{act.time}</span>
                  </span>
                  <Link to={act.link} className="text-blue-600 hover:text-blue-700 font-bold">
                    Open details →
                  </Link>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* SECTION 3: Circular Impact Chart */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between space-y-4 bg-white border-slate-200/90 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-bold text-slate-900 font-display">Circular Impact Telemetry</CardTitle>
                <Badge variant="emerald" size="xs">Scope 3 GHG</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Materials reused over the last 6 months (Metric tons & CO₂e avoided)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-600">Cardboard</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Plastics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600">Pallets</span>
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
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="plasticsGradDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="palletsGradDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="cardboard" name="Cardboard" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#cardboardGradDash)" />
                <Area type="monotone" dataKey="plastics" name="Plastics" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#plasticsGradDash)" />
                <Area type="monotone" dataKey="pallets" name="Pallets" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#palletsGradDash)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Cumulative Avoided: 8,450.2 MT CO₂e</span>
            </span>
            <Link to="/impact" className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
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
            <h2 className="text-lg font-bold text-slate-900 tracking-tight font-display">Recommended Materials</h2>
            <p className="text-xs text-slate-500 font-medium">Curated secondary packaging lots matching your procurement profile</p>
          </div>
          <Link to="/marketplace" className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
            <span>Browse all materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedMaterials.map((item) => (
            <Card
              key={item.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden group border-slate-200/90 hover:border-blue-300 shadow-card hover:shadow-card-hover bg-white"
            >
              <div className="relative h-36 bg-slate-100 border-b border-slate-200 overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <Badge variant="blue" size="xs">
                    {item.category}
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>{item.sellerLocation}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{item.estimatedCo2eSavings} t CO₂e</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium truncate block">{item.sellerName}</span>
                  <Link to={`/marketplace/${item.id}`}>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 mt-0.5 font-display">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.condition}</p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Available Lot</span>
                    <span className="font-bold text-slate-900">{item.availableQuantity} {item.unit}s</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Unit Rate</span>
                    <span className="font-extrabold text-blue-600">{formatCurrency(item.pricePerUnit)}</span>
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
      <Card className="overflow-hidden bg-white border-slate-200/90 shadow-card">
        <CardHeader className="bg-slate-50 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold text-slate-900 font-display">Active Shipments & Freight Hauls</CardTitle>
              <Badge variant="blue" size="xs">Live Telemetry</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Material transport status, origin/destination routes, and estimated arrival</p>
          </div>
          <Button to="/logistics" size="xs" variant="outline">
            Open Logistics Desk
          </Button>
        </CardHeader>

        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Material Lot</th>
                <th className="p-4">Route (Origin → Destination)</th>
                <th className="p-4">Carrier & Tracking</th>
                <th className="p-4">Status</th>
                <th className="p-4">ETA</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeShipmentsData.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block font-display">{shp.material}</span>
                        <span className="text-[10px] text-emerald-700 font-bold font-mono">Backhaul Verified</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-700 font-medium">{shp.origin}</span>
                    <span className="text-slate-400 mx-1.5">➔</span>
                    <span className="text-slate-900 font-bold">{shp.destination}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-800 font-semibold block">{shp.carrier}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{shp.trackingNumber}</span>
                  </td>

                  <td className="p-4">
                    <StatusBadge status={shp.status} size="xs" />
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{shp.eta}</span>
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-blue-600 h-full rounded-full"
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
