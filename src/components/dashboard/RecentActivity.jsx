import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const RecentActivity = ({ orders = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Material Transactions</CardTitle>
        <Link to="/requests" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          <span>View all orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-slate-800/80">
          {orders.slice(0, 4).map((order) => (
            <div key={order.id} className="p-4 hover:bg-slate-850/50 transition flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <Link to={`/orders/${order.id}`} className="text-xs font-semibold text-white hover:text-brand-400 transition line-clamp-1">
                    {order.listingTitle}
                  </Link>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {order.sellerName} → {order.buyerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs font-bold text-white">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-[10px] text-slate-400">{formatDate(order.createdDate)}</p>
                </div>
                <StatusBadge status={order.orderStatus} size="xs" />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentActivity;
