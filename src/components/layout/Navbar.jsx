import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Recycle,
  Search,
  Bell,
  PlusCircle,
  Menu,
  X,
  Layers,
  Sparkles,
  UserCheck,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, currentCompany, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isCurrentPath = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Material Requests (RFQ)', path: '/requests' },
    { name: 'Logistics', path: '/logistics' },
    { name: 'ESG Impact', path: '/impact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-600/30 group-hover:scale-105 transition">
                <Recycle className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight font-display">SYNAPSE</span>
                <span className="hidden sm:inline-block text-[9px] font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase">
                  Circular
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 ml-6">
              {navLinks.map((link) => {
                const active = isCurrentPath(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-semibold transition
                      ${active
                        ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions & User Profile */}
          <div className="flex items-center gap-3">
            <Button to="/list-material" size="sm" variant="primary" icon={PlusCircle} className="hidden sm:inline-flex">
              List Surplus Material
            </Button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-left transition text-xs"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                  <div className="hidden xl:block">
                    <p className="text-slate-900 font-bold leading-none truncate max-w-[130px]">{currentUser?.email || 'User Account'}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate max-w-[130px]">{currentCompany?.name || currentCompany?.type || 'Enterprise'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showPersonaMenu && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-float p-2 z-50 animate-fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.email}</p>
                      <p className="text-[10px] text-blue-600 font-medium mt-0.5 truncate">{currentCompany?.name || 'Facility Account'}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowPersonaMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium rounded-xl transition"
                    >
                      Facility Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowPersonaMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 font-medium hover:bg-rose-50 rounded-xl transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button to="/login" size="sm" variant="ghost">Sign In</Button>
                <Button to="/register" size="sm" variant="primary">Register Facility</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
