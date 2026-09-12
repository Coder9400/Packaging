import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  PlusCircle,
  X,
  Package,
  RotateCcw,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MaterialCard } from '../../components/marketplace/MaterialCard';
import { MarketplaceFilterSidebar } from '../../components/marketplace/MarketplaceFilterSidebar';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

const ITEMS_PER_PAGE = 6;

export const MarketplacePage = () => {
  const { listings } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query parameters
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState({
    category: initialCategory,
    condition: 'all',
    materialType: 'all',
    minPrice: '',
    maxPrice: '',
    minQuantity: '',
    maxQuantity: '',
    location: 'all',
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Sync state if URL search query changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
    const q = searchParams.get('search');
    if (q !== null && q !== undefined) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: 'all',
      condition: 'all',
      materialType: 'all',
      minPrice: '',
      maxPrice: '',
      minQuantity: '',
      maxQuantity: '',
      location: 'all',
    });
    setSearchParams({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Active filter count calculation
  const activeFiltersList = useMemo(() => {
    const tags = [];
    if (searchTerm) tags.push({ key: 'search', label: `Search: "${searchTerm}"`, onClear: () => setSearchTerm('') });
    if (filters.category !== 'all') tags.push({ key: 'category', label: `Category: ${filters.category}`, onClear: () => handleFilterChange('category', 'all') });
    if (filters.condition !== 'all') tags.push({ key: 'condition', label: `Condition: ${filters.condition}`, onClear: () => handleFilterChange('condition', 'all') });
    if (filters.materialType !== 'all') tags.push({ key: 'materialType', label: `Type: ${filters.materialType}`, onClear: () => handleFilterChange('materialType', 'all') });
    if (filters.minPrice) tags.push({ key: 'minPrice', label: `Min: ₹${filters.minPrice}`, onClear: () => handleFilterChange('minPrice', '') });
    if (filters.maxPrice) tags.push({ key: 'maxPrice', label: `Max: ₹${filters.maxPrice}`, onClear: () => handleFilterChange('maxPrice', '') });
    if (filters.location !== 'all') tags.push({ key: 'location', label: `Location: ${filters.location}`, onClear: () => handleFilterChange('location', 'all') });
    return tags;
  }, [filters, searchTerm]);

  // Main client-side reactive filtering and sorting
  const filteredMaterials = useMemo(() => {
    return listings.filter((item) => {
      // Search term filter
      const searchNormalized = searchTerm.trim().toLowerCase();
      if (searchNormalized) {
        const matchesTitle = (item.title || item.name || '').toLowerCase().includes(searchNormalized);
        const matchesSubtype = (item.materialSubtype || '').toLowerCase().includes(searchNormalized);
        const matchesCompany = (item.companyName || item.sellerName || '').toLowerCase().includes(searchNormalized);
        const matchesLoc = (item.location || item.sellerLocation || '').toLowerCase().includes(searchNormalized);
        const matchesCat = (item.category || '').toLowerCase().includes(searchNormalized);
        if (!matchesTitle && !matchesSubtype && !matchesCompany && !matchesLoc && !matchesCat) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all') {
        const itemCat = (item.category || '').toLowerCase();
        const targetCat = filters.category.toLowerCase();
        if (!itemCat.includes(targetCat) && !targetCat.includes(itemCat)) {
          return false;
        }
      }

      // Condition filter
      if (filters.condition !== 'all') {
        if ((item.condition || '').toLowerCase() !== filters.condition.toLowerCase()) {
          return false;
        }
      }

      // Material type filter (Reusable, Recyclable, Both)
      if (filters.materialType !== 'all') {
        const itemType = (item.materialType || '').toLowerCase();
        const targetType = filters.materialType.toLowerCase();
        if (targetType === 'both') {
          if (itemType !== 'both') return false;
        } else {
          if (itemType !== targetType && itemType !== 'both') return false;
        }
      }

      // Price range filter
      if (filters.minPrice && (item.pricePerUnit || item.priceRaw || 0) < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && (item.pricePerUnit || item.priceRaw || 0) > Number(filters.maxPrice)) {
        return false;
      }

      // Quantity range filter
      const qty = item.availableQuantity || item.totalQuantity || 0;
      if (filters.minQuantity && qty < Number(filters.minQuantity)) {
        return false;
      }
      if (filters.maxQuantity && qty > Number(filters.maxQuantity)) {
        return false;
      }

      // Location filter
      if (filters.location !== 'all') {
        const itemLoc = (item.location || item.sellerLocation || '').toLowerCase();
        if (!itemLoc.includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.pricePerUnit || a.priceRaw || 0;
      const priceB = b.pricePerUnit || b.priceRaw || 0;
      const qtyA = a.availableQuantity || a.totalQuantity || 0;
      const qtyB = b.availableQuantity || b.totalQuantity || 0;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'quantity') return qtyB - qtyA;
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      // Default: Relevance (featured first, then higher co2e)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [listings, searchTerm, filters, sortBy]);

  const visibleMaterials = filteredMaterials.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMaterials.length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="xs">B2B Material Exchange</Badge>
              <span className="text-xs text-slate-500 font-medium">100% Verified Facilities</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5 font-display">
              Find Materials. Reduce Waste.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Discover surplus and recyclable packaging materials from businesses around you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button to="/list-material" size="sm" variant="primary" icon={PlusCircle}>
              List Surplus Material
            </Button>
            <Button to="/requests" size="sm" variant="outline">
              Post Material Request (RFQ)
            </Button>
          </div>
        </div>

        {/* Big Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cardboard, plastic, pallets, containers, or city..."
            className="w-full bg-white border border-slate-200 hover:border-slate-300 text-slate-900 placeholder-slate-400 text-sm rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-600 shadow-card transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Trigger Button & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold hover:bg-slate-100 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters</span>
            {activeFiltersList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                {activeFiltersList.length}
              </span>
            )}
          </button>

          {/* Results Count */}
          <div className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-900 text-sm font-display">{filteredMaterials.length}</span> materials found
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersList.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 text-[11px] font-medium">Active filters:</span>
          {activeFiltersList.map((tag) => (
            <button
              key={tag.key}
              onClick={tag.onClear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition group"
            >
              <span>{tag.label}</span>
              <X className="w-3 h-3 text-blue-600 group-hover:scale-110" />
            </button>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-slate-500 hover:text-blue-600 font-bold underline ml-2 transition"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Layout: Filter Sidebar + Material Cards Grid */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sticky & Mobile Drawer Sidebar */}
        <MarketplaceFilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          totalResultsCount={filteredMaterials.length}
        />

        {/* Main Content Grid Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {visibleMaterials.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {visibleMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>

              {/* Load More Pagination Button */}
              {hasMore && (
                <div className="pt-8 text-center">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  >
                    Load More Materials ({filteredMaterials.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No matching packaging materials found"
              description="No surplus materials match your current filter parameters. Try adjusting your filters, searching for broader terms, or post an inquiry RFQ."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
