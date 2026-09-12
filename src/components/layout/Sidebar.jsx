import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Boxes,
  FileText,
  ShoppingBag,
  Truck,
  MessageSquare,
  Leaf,
  Building2,
  Settings,
  LogOut,
  Recycle,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentCompany, logout } = useAuth();
  const { orders, requests, listings } = useMarketplace();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeOrdersCount = orders.filter(o => o.orderStatus === 'In Transit' || o.orderStatus === 'Processing').length;
  const openRequestsCount = requests.filter(r => r.status === 'Open').length;
  const activeListingsCount = listings.filter(l => l.sellerId === currentCompany?.id).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Marketplace', path: '/marketplace', icon: Store },
    { label: 'My Listings', path: '/listings', icon: Boxes, badge: activeListingsCount },
    { label: 'Requests', path: '/requests', icon: FileText, badge: openRequestsCount },
    { label: 'Orders', path: '/requests?tab=orders', icon: ShoppingBag, badge: activeOrdersCount },
    { label: 'Logistics', path: '/logistics', icon: Truck },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Impact', path: '/impact', icon: Leaf },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90
          transition-transform duration-200 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col justify-between overflow-y-auto p-4 shadow-sm
        `}
      >
        <div className="space-y-6">
          {/* Logo & Close Button Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-600/30 group-hover:scale-105 transition">
                <Recycle className="w-4.5 h-4.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 tracking-tight font-display">SYNAPSE</span>
                <span className="text-[9px] font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase">
                  Circular
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Company Context Pill */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Enterprise</span>
              <Badge variant="blue" size="xs">Verified</Badge>
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">{currentCompany?.name || 'Company Profile'}</p>
            <p className="text-[10px] text-blue-600 font-semibold truncate">{currentCompany?.type || 'Manufacturer'}</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/dashboard'}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition duration-150
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Company, Settings, Logout */}
        <div className="space-y-1 pt-4 border-t border-slate-100">
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition
              ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
            `}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Company Profile</span>
          </NavLink>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Enterprise Facility Settings"
        subtitle="Configure material notifications, API keys, and ESG reporting standards"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900">Automated ESG Certification</h4>
            <label className="flex items-center justify-between text-slate-700 font-medium cursor-pointer">
              <span>Generate EPA WARM audit certificates on dock delivery</span>
              <input type="checkbox" defaultChecked className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500/20" />
            </label>
            <label className="flex items-center justify-between text-slate-700 font-medium cursor-pointer">
              <span>Automatic backhaul freight matchmaking</span>
              <input type="checkbox" defaultChecked className="rounded bg-white border-slate-300 text-blue-600 focus:ring-blue-500/20" />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" variant="primary" onClick={() => setIsSettingsOpen(false)}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
