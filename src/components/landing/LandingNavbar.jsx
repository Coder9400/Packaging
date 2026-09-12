import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200 shadow-sm shadow-blue-600/30">
              <Recycle className="w-4.5 h-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight font-display">SYNAPSE</span>
              <span className="hidden sm:inline-block text-[9px] font-bold tracking-widest text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                2.0 Live
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600">
            <Link to="/marketplace" className="hover:text-blue-600 transition-colors duration-150">
              Marketplace
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-blue-600 transition-colors duration-150"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-blue-600 transition-colors duration-150"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="hover:text-blue-600 transition-colors duration-150"
            >
              Material Categories
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Button to="/login" size="sm" variant="ghost">
              Sign In
            </Button>
            <Button to="/register" size="sm" variant="primary" icon={ArrowRight} iconPosition="right">
              Get Started Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-blue-600"
            >
              Marketplace
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-blue-600"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-blue-600"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-blue-600"
            >
              Material Categories
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Button to="/login" size="sm" variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Button>
            <Button to="/register" size="sm" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Get Started Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
