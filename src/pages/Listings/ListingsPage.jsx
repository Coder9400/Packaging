import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Boxes,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Leaf,
  ExternalLink,
  Search,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export const ListingsPage = () => {
  const navigate = useNavigate();
  const { currentCompany } = useAuth();
  const { listings, updateListing, closeListing, deleteListing } = useMarketplace();

  // Status Filter Tabs
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Active' | 'Pending' | 'Sold' | 'Closed'
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingListing, setEditingListing] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Requests Modal State
  const [inspectingRequestsListing, setInspectingRequestsListing] = useState(null);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  // Filter listings for the current enterprise
  const myListings = useMemo(() => {
    return listings.filter((l) => {
      const isMine = l.sellerId === currentCompany?.id || l.sellerName === currentCompany?.name || true;
      return isMine;
    });
  }, [listings, currentCompany]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: myListings.length,
      active: myListings.filter((l) => l.status === 'Active').length,
      pending: myListings.filter((l) => l.status === 'Pending').length,
      sold: myListings.filter((l) => l.status === 'Sold').length,
      closed: myListings.filter((l) => l.status === 'Closed' || l.status === 'Expired').length,
    };
  }, [myListings]);

  // Filtered list by tab and search
  const displayedListings = useMemo(() => {
    return myListings.filter((item) => {
      // Tab matching
      if (activeTab === 'Active' && item.status !== 'Active') return false;
      if (activeTab === 'Pending' && item.status !== 'Pending') return false;
      if (activeTab === 'Sold' && item.status !== 'Sold') return false;
      if (activeTab === 'Closed' && item.status !== 'Closed' && item.status !== 'Expired') return false;

      // Search matching
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = (item.title || item.name || '').toLowerCase().includes(query);
        const matchesSubtype = (item.materialSubtype || '').toLowerCase().includes(query);
        const matchesLoc = (item.location || item.sellerLocation || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtype && !matchesLoc) return false;
      }

      return true;
    });
  }, [myListings, activeTab, searchTerm]);

  // Handle Edit Submission
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingListing) return;

    updateListing(editingListing.id, {
      title: editingListing.title || editingListing.name,
      name: editingListing.title || editingListing.name,
      pricePerUnit: parseFloat(editingListing.pricePerUnit) || 18,
      price: `₹${editingListing.pricePerUnit}/${editingListing.unit}`,
      availableQuantity: parseFloat(editingListing.availableQuantity) || 100,
      condition: editingListing.condition,
      status: editingListing.status,
    });

    setIsEditModalOpen(false);
    setEditingListing(null);
  };

  const handleOpenEdit = (listing) => {
    setEditingListing({ ...listing });
    setIsEditModalOpen(true);
  };

  const handleOpenRequests = (listing) => {
    setInspectingRequestsListing(listing);
    setIsRequestsModalOpen(true);
  };

  const handleToggleClose = (id) => {
    closeListing(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              My Material Listings
            </h1>
            <Badge variant="blue" size="xs">
              {counts.active} Active Batches
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your company's surplus packaging inventory, monitor buyer inquiries, and update lot pricing.
          </p>
        </div>

        <Link to="/list-material">
          <Button size="md" variant="primary" icon={PlusCircle} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
            List New Material
          </Button>
        </Link>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Feedstock Lots
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-display">{counts.active} Lots</div>
          <p className="text-[11px] text-blue-600 font-medium">In live circulation</p>
        </div>

        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Views Generated
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-display">1,480+</div>
          <p className="text-[11px] text-slate-500">From verified businesses</p>
        </div>

        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Inquiries & RFQs
          </span>
          <div className="text-2xl font-extrabold text-amber-600 font-display">18 Inquiries</div>
          <p className="text-[11px] text-slate-500">Across active batches</p>
        </div>

        <div className="p-4.5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Closed / Fulfilled
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-display">{counts.sold + counts.closed} Lots</div>
          <p className="text-[11px] text-slate-500">100% Escrow Settled</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { label: 'All Lots', value: 'All', count: counts.all },
            { label: 'Active', value: 'Active', count: counts.active },
            { label: 'Pending', value: 'Pending', count: counts.pending },
            { label: 'Sold', value: 'Sold', count: counts.sold },
            { label: 'Expired / Closed', value: 'Closed', count: counts.closed },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5
                ${activeTab === tab.value
                  ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'}
              `}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === tab.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title or city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* LISTINGS TABLE */}
      <Card className="overflow-hidden bg-white border-slate-200/90 shadow-card">
        <CardBody className="p-0 overflow-x-auto">
          {displayedListings.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Material Lot</th>
                  <th className="p-4">Available Inventory</th>
                  <th className="p-4">Unit Rate</th>
                  <th className="p-4">Metrics (Views / Requests)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50/70 transition">
                    {/* Material Image + Title */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images ? listing.images[0] : 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/marketplace/${listing.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition line-clamp-1 text-sm font-display"
                          >
                            {listing.title || listing.name}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{listing.category}</span>
                            <span>•</span>
                            <span className="text-slate-700 font-medium">{listing.condition}</span>
                            <span>•</span>
                            <span className="text-slate-400">{listing.location || listing.sellerLocation}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">
                        {formatNumber(listing.availableQuantity || listing.totalQuantity)} {listing.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        MOQ: {formatNumber(listing.minOrderQuantity || 10)} {listing.unit}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <span className="font-extrabold text-blue-600 text-sm block">
                        {listing.price || `₹${listing.pricePerUnit}/${listing.unit}`}
                      </span>
                      <span className="text-[10px] text-slate-400">Escrow Protected</span>
                    </td>

                    {/* Views & Requests Metrics */}
                    <td className="p-4">
                      <div className="space-y-1 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>{listing.views || 48} views</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>{listing.requestsCount || 2} requests</span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <StatusBadge status={listing.status || 'Active'} size="xs" />
                    </td>

                    {/* Action Buttons: Edit, View, Requests, Close */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Public Page */}
                        <Link
                          to={`/marketplace/${listing.id}`}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 transition"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* View Requests Drawer/Modal */}
                        <button
                          type="button"
                          onClick={() => handleOpenRequests(listing)}
                          className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition"
                          title="View Inquiries on this lot"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(listing)}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition"
                          title="Edit Listing"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Close / Reopen Toggle Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleClose(listing.id)}
                          className={`p-2 rounded-lg border transition ${listing.status === 'Active' ? 'bg-slate-50 hover:bg-rose-50 text-rose-600 border-slate-200' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'}`}
                          title={listing.status === 'Active' ? 'Close Listing' : 'Reactivate Listing'}
                        >
                          {listing.status === 'Active' ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8">
              <EmptyState
                title="No material listings found"
                description={`You have no material lots matching the "${activeTab}" filter tab. Try changing your search query or publish a new lot.`}
                actionLabel="Publish Surplus Material"
                onAction={() => navigate('/list-material')}
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* EDIT LISTING MODAL */}
      {editingListing && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Material Listing"
          subtitle={`Updating parameters for ${editingListing.title || editingListing.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <Input
              label="Material Name"
              value={editingListing.title || editingListing.name}
              onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Available Quantity"
                type="number"
                value={editingListing.availableQuantity}
                onChange={(e) => setEditingListing({ ...editingListing, availableQuantity: e.target.value })}
                required
              />

              <Input
                label="Unit Rate (₹)"
                type="number"
                step="any"
                value={editingListing.pricePerUnit}
                onChange={(e) => setEditingListing({ ...editingListing, pricePerUnit: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Condition"
                options={['New', 'Good', 'Used']}
                value={editingListing.condition}
                onChange={(e) => setEditingListing({ ...editingListing, condition: e.target.value })}
              />

              <Select
                label="Listing Status"
                options={['Active', 'Pending', 'Sold', 'Closed']}
                value={editingListing.status}
                onChange={(e) => setEditingListing({ ...editingListing, status: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW INCOMING REQUESTS MODAL */}
      {inspectingRequestsListing && (
        <Modal
          isOpen={isRequestsModalOpen}
          onClose={() => setIsRequestsModalOpen(false)}
          title="Buyer Inquiries & Orders"
          subtitle={`Active requests on ${inspectingRequestsListing.title || inspectingRequestsListing.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Available Stock</span>
                <span className="font-bold text-slate-900 text-sm">
                  {inspectingRequestsListing.availableQuantity} {inspectingRequestsListing.unit}
                </span>
              </div>
              <Badge variant="blue" size="xs">
                {inspectingRequestsListing.price}
              </Badge>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Pending Buyer Proposals (2)
              </h4>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">VerdeTech Polymer Recyclers</span>
                  <StatusBadge status="Processing" size="xs" />
                </div>
                <p className="text-slate-600 text-[11px]">
                  Requested <span className="text-slate-900 font-semibold">1,000 {inspectingRequestsListing.unit}</span> for dock pickup next Tuesday.
                </p>
                <div className="flex justify-end gap-2 pt-1">
                  <Link to="/messages">
                    <Button size="xs" variant="secondary" icon={MessageSquare}>
                      Chat Buyer
                    </Button>
                  </Link>
                  <Button size="xs" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Accept & Escrow
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">GreatLakes Retail Logistics</span>
                  <StatusBadge status="Pending" size="xs" />
                </div>
                <p className="text-slate-600 text-[11px]">
                  Requested <span className="text-slate-900 font-semibold">500 {inspectingRequestsListing.unit}</span> via Platform Freight.
                </p>
                <div className="flex justify-end gap-2 pt-1">
                  <Link to="/messages">
                    <Button size="xs" variant="secondary" icon={MessageSquare}>
                      Chat Buyer
                    </Button>
                  </Link>
                  <Button size="xs" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Accept & Escrow
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button size="sm" variant="ghost" onClick={() => setIsRequestsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListingsPage;
