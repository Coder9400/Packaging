import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Clock,
  MapPin,
  Send,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Eye,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Truck,
  DollarSign
} from 'lucide-react';
import { MOCK_RECEIVED_REQUESTS, MOCK_SENT_REQUESTS } from '../../data/requestsAndOrders';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export const RequestsPage = () => {
  const navigate = useNavigate();

  // Tab state: 'Received' | 'Sent'
  const [activeTab, setActiveTab] = useState('Received');

  // Interactive mock state for requests
  const [receivedRequests, setReceivedRequests] = useState(MOCK_RECEIVED_REQUESTS);
  const [sentRequests, setSentRequests] = useState(MOCK_SENT_REQUESTS);

  // View modal state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Success alert state
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleAcceptRequest = (id) => {
    setReceivedRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Accepted' } : req))
    );
    setFeedbackMessage('Request accepted! Purchase order created and escrow locked.');
    setTimeout(() => setFeedbackMessage(''), 4000);
  };

  const handleRejectRequest = (id) => {
    setReceivedRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Rejected' } : req))
    );
    setFeedbackMessage('Request rejected.');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleOpenViewModal = (req) => {
    setSelectedRequest(req);
    setIsViewModalOpen(true);
  };

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Material Requests & Inquiries
            </h1>
            {pendingReceivedCount > 0 && (
              <Badge variant="amber" size="xs">
                {pendingReceivedCount} Action Required
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track buyer proposals received on your surplus lots and monitor purchase inquiries you have sent across the network.
          </p>
        </div>

        <Button to="/marketplace" size="md" variant="primary" icon={PlusCircle}>
          Browse Marketplace & Request
        </Button>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 animate-fade-in shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Navigation Tabs: Received vs Sent */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('Received')}
          className={`
            px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2
            ${activeTab === 'Received'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'}
          `}
        >
          <Package className="w-4 h-4" />
          <span>Received Requests</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'Received' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            {receivedRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Sent')}
          className={`
            px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2
            ${activeTab === 'Sent'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'}
          `}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'Sent' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* TAB 1: RECEIVED REQUESTS */}
      {activeTab === 'Received' && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-900/40">
            <div>
              <CardTitle className="text-sm">Inquiries Received from Buyers</CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">Review commercial terms, delivery lead times, and accept escrow orders</p>
            </div>
          </CardHeader>

          <CardBody className="p-0 overflow-x-auto">
            {receivedRequests.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Buyer Facility</th>
                    <th className="p-4">Requested Material</th>
                    <th className="p-4">Volume & Offer Price</th>
                    <th className="p-4">Buyer Message</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {receivedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-850/40 transition">
                      {/* Buyer */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.buyerAvatar}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block">{req.buyerCompany}</span>
                            <span className="text-[10px] text-slate-400">{req.buyerLocation}</span>
                          </div>
                        </div>
                      </td>

                      {/* Material */}
                      <td className="p-4">
                        <Link
                          to={`/marketplace/${req.materialId}`}
                          className="font-semibold text-white hover:text-emerald-400 transition block line-clamp-1"
                        >
                          {req.materialName}
                        </Link>
                        <span className="text-[10px] text-slate-400">{req.category}</span>
                      </td>

                      {/* Quantity & Price */}
                      <td className="p-4">
                        <span className="font-bold text-white block">
                          {formatNumber(req.requestedQuantity)} {req.unit}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-400 block font-mono">
                          {req.priceFormatted}
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="p-4 max-w-xs">
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                          "{req.message}"
                        </p>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {req.date}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={req.status} size="xs" />
                      </td>

                      {/* Actions: Accept, Reject, View */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.status === 'Pending' ? (
                            <>
                              <Button
                                size="xs"
                                variant="primary"
                                icon={CheckCircle2}
                                onClick={() => handleAcceptRequest(req.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                size="xs"
                                variant="danger"
                                icon={XCircle}
                                onClick={() => handleRejectRequest(req.id)}
                              >
                                Reject
                              </Button>
                            </>
                          ) : req.status === 'Accepted' ? (
                            <Link to={`/orders/ord_lifecycle_101`}>
                              <Button size="xs" variant="outline" icon={ArrowRight}>
                                View PO
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">Declined</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(req)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
                  title="No received requests yet"
                  description="When buyers discover your material lots on the marketplace, their purchase requests will appear here."
                />
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* TAB 2: SENT REQUESTS */}
      {activeTab === 'Sent' && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-900/40">
            <div>
              <CardTitle className="text-sm">Inquiries Sent to Suppliers</CardTitle>
              <p className="text-[11px] text-slate-400 mt-0.5">Track lifecycle progress from order acceptance through logistics and final delivery</p>
            </div>
          </CardHeader>

          <CardBody className="p-0 overflow-x-auto">
            {sentRequests.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Material Name</th>
                    <th className="p-4">Supplying Entity</th>
                    <th className="p-4">Procured Quantity</th>
                    <th className="p-4">Requested Date</th>
                    <th className="p-4">Lifecycle Status</th>
                    <th className="p-4 text-right">Lifecycle Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-850/40 transition">
                      {/* Material */}
                      <td className="p-4">
                        <Link
                          to={`/marketplace/${req.materialId}`}
                          className="font-bold text-white hover:text-emerald-400 transition block line-clamp-1"
                        >
                          {req.materialName}
                        </Link>
                        <span className="text-[10px] text-slate-400">{req.category}</span>
                      </td>

                      {/* Seller */}
                      <td className="p-4">
                        <span className="font-semibold text-white block">{req.sellerCompany}</span>
                        <span className="text-[10px] text-slate-400">{req.sellerLocation}</span>
                      </td>

                      {/* Quantity & Price */}
                      <td className="p-4">
                        <span className="font-bold text-white block">
                          {formatNumber(req.quantity)} {req.unit}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-400 block font-mono">
                          {req.priceFormatted}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {req.requestedDate}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={req.status} size="xs" />
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button to={`/orders/${req.orderId || 'ord_lifecycle_101'}`} size="xs" variant="primary" icon={ArrowRight}>
                            Track Order Lifecycle
                          </Button>

                          <Link to="/messages">
                            <button
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                              title="Chat Seller"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8">
                <EmptyState
                  title="No sent requests"
                  description="You haven't requested any materials yet. Browse the marketplace to source secondary feedstock."
                  actionLabel="Explore Marketplace"
                  onAction={() => navigate('/marketplace')}
                />
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* VIEW REQUEST MODAL */}
      {selectedRequest && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Material Purchase Inquiry"
          subtitle={`Submitted by ${selectedRequest.buyerCompany}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Material Lot:</span>
                <span className="font-bold text-white">{selectedRequest.materialName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Requested Quantity:</span>
                <span className="font-bold text-emerald-400">{selectedRequest.requestedQuantity} {selectedRequest.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Purchase Value:</span>
                <span className="font-bold text-white font-mono">{formatCurrency(selectedRequest.totalPrice, 'INR')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Preferred Pickup Date:</span>
                <span className="text-slate-200">{selectedRequest.preferredPickupDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Logistics Method:</span>
                <span className="text-slate-200">{selectedRequest.logisticsType}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Buyer Message / Dock Instructions:
              </span>
              <p className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-300 leading-relaxed text-xs">
                "{selectedRequest.message}"
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <Button to="/messages" onClick={() => setIsViewModalOpen(false)} size="xs" variant="secondary" icon={MessageSquare}>
                Chat Buyer Directly
              </Button>

              <div className="flex gap-2">
                <Button size="xs" variant="ghost" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                {selectedRequest.status === 'Pending' && (
                  <Button
                    size="xs"
                    variant="primary"
                    onClick={() => {
                      handleAcceptRequest(selectedRequest.id);
                      setIsViewModalOpen(false);
                    }}
                  >
                    Accept & Escrow
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RequestsPage;
