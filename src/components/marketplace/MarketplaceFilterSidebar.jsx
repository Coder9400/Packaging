import React from 'react';
import { Filter, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const MarketplaceFilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpen,
  onClose,
  totalResultsCount
}) => {
  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Cardboard', value: 'Cardboard' },
    { label: 'Plastic', value: 'Plastic' },
    { label: 'Wooden Pallets', value: 'Wooden Pallets' },
    { label: 'Packaging', value: 'Packaging' },
    { label: 'Industrial Materials', value: 'Industrial Materials' },
    { label: 'Other', value: 'Other' },
  ];

  const conditions = [
    { label: 'All Conditions', value: 'all' },
    { label: 'New', value: 'New' },
    { label: 'Good', value: 'Good' },
    { label: 'Used', value: 'Used' },
  ];

  const materialTypes = [
    { label: 'All Types', value: 'all' },
    { label: 'Reusable', value: 'Reusable' },
    { label: 'Recyclable', value: 'Recyclable' },
    { label: 'Both', value: 'Both' },
  ];

  const locations = [
    'All Locations',
    'Ahmedabad, Gujarat',
    'Mumbai, Maharashtra',
    'Delhi NCR',
    'Bengaluru, Karnataka',
    'Pune, Maharashtra',
    'Chennai, Tamil Nadu',
    'Hyderabad, Telangana',
    'Kolkata, West Bengal',
    'Surat, Gujarat',
    'Detroit, MI',
    'Columbus, OH',
    'Milwaukee, WI',
    'Chicago, IL',
  ];

  const content = (
    <div className="space-y-6 text-xs">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Filter Materials</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-medium transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onFilterChange('category', cat.value)}
              className={`
                w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition
                ${filters.category === cat.value
                  ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'}
              `}
            >
              <span>{cat.label}</span>
              {filters.category === cat.value && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Filter */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Condition
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {conditions.map((cond) => (
            <button
              key={cond.value}
              type="button"
              onClick={() => onFilterChange('condition', cond.value)}
              className={`
                px-2.5 py-1.5 rounded-lg text-center transition
                ${filters.condition === cond.value
                  ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'}
              `}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material Type (Reusable / Recyclable / Both) */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Material Type
        </label>
        <div className="space-y-1">
          {materialTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onFilterChange('materialType', type.value)}
              className={`
                w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition
                ${filters.materialType === type.value
                  ? 'bg-teal-500/15 text-teal-400 font-semibold border border-teal-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'}
              `}
            >
              <span>{type.label}</span>
              {filters.materialType === type.value && <Check className="w-3.5 h-3.5 text-teal-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-500 block mb-1">Minimum (₹)</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-1">Maximum (₹)</span>
            <input
              type="number"
              placeholder="10000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Quantity Range */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Quantity Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-500 block mb-1">Min Qty</span>
            <input
              type="number"
              placeholder="0"
              value={filters.minQuantity}
              onChange={(e) => onFilterChange('minQuantity', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-1">Max Qty</span>
            <input
              type="number"
              placeholder="50000"
              value={filters.maxQuantity}
              onChange={(e) => onFilterChange('maxQuantity', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Location (City / Region) */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Location / Region
        </label>
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc === 'All Locations' ? 'all' : loc} className="bg-slate-900 text-white">
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Action */}
      <div className="pt-4 border-t border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          icon={RotateCcw}
          onClick={onResetFilters}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Filter Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 sticky top-24 shadow-card">
          {content}
        </div>
      </aside>

      {/* Mobile Responsive Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="font-bold text-sm text-white">Filters</span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {content}

              <div className="mt-6 pt-4 border-t border-slate-800">
                <Button variant="primary" size="md" className="w-full" onClick={onClose}>
                  Apply Filters ({totalResultsCount} found)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketplaceFilterSidebar;
