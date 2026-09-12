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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform duration-200">
              <Recycle className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">Circular</span>
              <span className="font-bold text-base text-emerald-400 tracking-tight">Exchange</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-slate-300">
            <Link to="/marketplace" className="hover:text-white transition-colors duration-150">
              Marketplace
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors duration-150"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="hover:text-white transition-colors duration-150"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="hover:text-white transition-colors duration-150"
            >
              Material Categories
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Button to="/login" size="sm" variant="ghost">
              Login
            </Button>
            <Button to="/register" size="sm" variant="primary" icon={ArrowRight} iconPosition="right">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-2.5 text-sm font-medium text-slate-300">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white"
            >
              Marketplace
            </Link>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('impact')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white"
            >
              Impact
            </button>
            <button
              onClick={() => scrollToSection('categories')}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-900 hover:text-white"
            >
              Material Categories
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <Button to="/login" size="sm" variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Button>
            <Button to="/register" size="sm" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
