import React, { useState, useMemo } from 'react';
import {
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Calendar,
  Layers,
  Fuel
} from 'lucide-react';
import { MOCK_LOGISTICS_SHIPMENTS } from '../../data/logisticsData';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VisualRouteVisualizer } from '../../components/logistics/VisualRouteVisualizer';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const LogisticsPage = () => {
  // Tabs: 'Active' | 'Completed'
  const [activeTab, setActiveTab] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected shipment state for detail view
  const [selectedShipmentId, setSelectedShipmentId] = useState(MOCK_LOGISTICS_SHIPMENTS[0].id);

  // Dispatch booking modal
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Filter shipments by active tab and search query
  const filteredShipments = useMemo(() => {
    return MOCK_LOGISTICS_SHIPMENTS.filter((s) => {
      // Tab matching
      if (activeTab === 'Active' && s.routeType !== 'Active') return false;
      if (activeTab === 'Completed' && s.routeType !== 'Completed') return false;

      // Search matching
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesMat = s.material.toLowerCase().includes(query);
        const matchesOrigin = s.originCity.toLowerCase().includes(query);
        const matchesDest = s.destinationCity.toLowerCase().includes(query);
        const matchesTrk = s.trackingNumber.toLowerCase().includes(query);
        if (!matchesMat && !matchesOrigin && !matchesDest && !matchesTrk) return false;
      }

      return true;
    });
  }, [activeTab, searchTerm]);

  // Active selected shipment object
  const selectedShipment =
    MOCK_LOGISTICS_SHIPMENTS.find((s) => s.id === selectedShipmentId) ||
    filteredShipments[0] ||
    MOCK_LOGISTICS_SHIPMENTS[0];

  const activeCount = MOCK_LOGISTICS_SHIPMENTS.filter((s) => s.routeType === 'Active').length;
  const completedCount = MOCK_LOGISTICS_SHIPMENTS.filter((s) => s.routeType === 'Completed').length;

  const handleScheduleDispatch = (e) => {
    e.preventDefault();
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setIsDispatchModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-card">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Green Freight & Route Optimization
            </h1>
            <Badge variant="teal" size="xs">
              Backhaul Matchmaking Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dispatch low-emission freight trailers, fill empty returning trucks with surplus packaging, and track live transit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="md"
            variant="primary"
            icon={PlusCircle}
            onClick={() => setIsDispatchModalOpen(true)}
          >
            Schedule Backhaul Freight
          </Button>
        </div>
      </div>

      {/* Logistics KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Dedicated Hauls
          </span>
          <div className="text-2xl font-extrabold text-white">{activeCount} Shipments</div>
          <p className="text-[11px] text-teal-400 font-medium">On-route with live telemetry</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Empty Backhaul Miles Saved
          </span>
          <div className="text-2xl font-extrabold text-emerald-400">4,280 km</div>
          <p className="text-[11px] text-slate-500">Deadhead reduction</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Transport CO₂e Avoided
          </span>
          <div className="text-2xl font-extrabold text-emerald-300 font-mono">18.4 t CO₂e</div>
          <p className="text-[11px] text-slate-500">Through route consolidation</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Average Route Fill Rate
          </span>
          <div className="text-2xl font-extrabold text-amber-400">92.4%</div>
          <p className="text-[11px] text-slate-500">Vs 58% industry baseline</p>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('Active')}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2
              ${activeTab === 'Active'
                ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850 border border-transparent'}
            `}
          >
            <Truck className="w-4 h-4" />
            <span>Active Shipments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'Active' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('Completed')}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2
              ${activeTab === 'Completed'
                ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-850 border border-transparent'}
            `}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed Shipments</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'Completed' ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {completedCount}
            </span>
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search material, city, or tracking..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: Left Shipments Cards List + Right Route Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SHIPMENT CARDS (Cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeTab} Freight Dispatches ({filteredShipments.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click to inspect route</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredShipments.map((shipment) => {
              const isSelected = selectedShipment?.id === shipment.id;
              return (
                <div
                  key={shipment.id}
                  onClick={() => setSelectedShipmentId(shipment.id)}
                  className={`
                    p-4 rounded-2xl border cursor-pointer transition duration-150 space-y-3
                    ${isSelected
                      ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/30 shadow-lg shadow-teal-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'}
                  `}
                >
                  {/* Card Header: Tracking & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">
                      {shipment.trackingNumber}
                    </span>
                    <StatusBadge status={shipment.status} size="xs" />
                  </div>

                  {/* Material & Quantity */}
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{shipment.material}</h4>
                    <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                      {formatNumber(shipment.quantity)} {shipment.unit} ({shipment.category})
                    </span>
                  </div>

                  {/* Origin to Destination */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Origin</span>
                      <span className="font-semibold text-slate-200 truncate block">{shipment.originCity}</span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] font-mono text-teal-400 font-semibold">{shipment.distanceKm} km</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>

                    <div className="space-y-0.5 min-w-0 text-right">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Destination</span>
                      <span className="font-semibold text-white truncate block">{shipment.destinationCity}</span>
                    </div>
                  </div>

                  {/* Footer: Logistics Partner & ETA */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                    <span className="truncate max-w-[170px] text-[11px] text-slate-300">
                      {shipment.logisticsPartner}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-emerald-400">
                      ETA: {shipment.eta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ROUTE VISUALIZATION & OPTIMIZATION (Cols 7) */}
        <div className="lg:col-span-7">
          <VisualRouteVisualizer shipment={selectedShipment} />
        </div>
      </div>

      {/* SCHEDULE DISPATCH MODAL */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title="Schedule Backhaul Freight Dispatch"
        subtitle="Book low-emission empty-trailer return transport for your circular materials"
      >
        {dispatchSuccess ? (
          <div className="p-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Backhaul Freight Booked!</h4>
            <p className="text-xs text-slate-400">EcoFreight carrier assigned. Pickup scheduled for tomorrow 09:00 AM.</p>
          </div>
        ) : (
          <form onSubmit={handleScheduleDispatch} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Origin Pickup City"
                placeholder="e.g. Ahmedabad, Gujarat"
                defaultValue="Ahmedabad, Gujarat"
                required
              />
              <Input
                label="Destination Delivery City"
                placeholder="e.g. Gandhinagar, Gujarat"
                defaultValue="Gandhinagar, Gujarat"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Material Cargo Type"
                options={[
                  'Corrugated Cardboard Bales (2,500 kg)',
                  'GMA Wooden Pallets (450 Pallets)',
                  'HDPE Polymer Regrind (12,000 kg)',
                  '275-Gal IBC Totes (35 Totes)',
                ]}
              />
              <Select
                label="Required Vehicle Format"
                options={[
                  '14ft Clean-CNG Freight Truck',
                  '24ft Flatbed Freight Truck',
                  '32ft Multi-Axle Container',
                  '40ft Heavy-Duty Flatbed',
                ]}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated Backhaul Match Discount</span>
              </div>
              <p className="text-slate-400">
                A returning empty trailer on the Ahmedabad ➔ Gandhinagar corridor has been matched. ₹1,200 estimated backhaul discount applied.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsDispatchModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Confirm & Dispatch Carrier
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LogisticsPage;
