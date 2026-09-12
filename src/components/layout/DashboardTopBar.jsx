import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  Building2,
  Leaf,
  Truck,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export const DashboardTopBar = ({ onToggleSidebar }) => {
  const { currentUser, currentCompany, logout, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const navigate = useNavigate();

  const mockNotifications = [
    {
      id: 'notif_1',
      title: 'New RFQ Proposal Received',
      detail: 'VerdeTech Polymers submitted an offer on Grade #11 OCC.',
      time: '12m ago',
      icon: FileText,
      unread: true
    },
    {
      id: 'notif_2',
      title: 'Backhaul Dispatch Scheduled',
      detail: 'EcoFreight dry van scheduled for dock 4 pickup at 14:00.',
      time: '1h ago',
      icon: Truck,
      unread: true
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle & Global Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 focus:outline-none"
                aria-label="Toggle Sidebar Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search circular materials, RFQs, counterparties, or POs..."
                className="w-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 focus:border-emerald-500 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-10 pr-4 py-2 transition focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </form>
          </div>

          {/* Right: Notifications & Company Profile Menu */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowCompanyMenu(false);
                }}
                className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-fade-in space-y-2">
                  <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                    <span className="text-xs font-semibold text-white">Operational Notifications</span>
                    <Badge variant="emerald" size="xs">2 New</Badge>
                  </div>

                  <div className="divide-y divide-slate-850 max-h-72 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="p-2.5 hover:bg-slate-850/50 rounded-xl transition flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-white truncate">{notif.title}</p>
                            <span className="text-[10px] text-slate-500">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{notif.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCompanyMenu(!showCompanyMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-left transition"
                >
                  <Avatar
                    src={currentCompany?.avatar_url}
                    name={currentCompany?.name || 'Company'}
                    size="sm"
                    status="online"
                  />
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[140px]">
                      {currentCompany?.name || 'Company Facility'}
                    </p>
                    <p className="text-[10px] text-emerald-400 leading-tight mt-0.5 truncate max-w-[140px]">
                      {currentCompany?.type || 'Enterprise'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {showCompanyMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{currentCompany?.name || 'Facility'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{currentUser?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowCompanyMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition"
                    >
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Facility Settings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowCompanyMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-xs text-emerald-400 font-medium hover:underline">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
