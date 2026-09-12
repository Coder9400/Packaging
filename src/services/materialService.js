import apiClient from './apiClient';

export const materialService = {
  /**
   * Fetch all marketplace material listings with filter options via Express API
   */
  async getMarketplaceMaterials(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.condition && filters.condition !== 'all') params.append('condition', filters.condition);
    if (filters.search) params.append('search', filters.search);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const data = await apiClient(`/listings${queryString}`);
    return data.listings || [];
  },

  /**
   * Fetch material listing by unique ID via Express API
   */
  async getMaterialById(id) {
    const data = await apiClient(`/listings/${id}`);
    return data.listing;
  },

  /**
   * Fetch material categories
   */
  async getCategories() {
    return [
      { id: 'cat_cardboard', label: 'Cardboard', count: 140 },
      { id: 'cat_plastic', label: 'Plastic', count: 98 },
      { id: 'cat_pallets', label: 'Wooden Pallets', count: 64 },
      { id: 'cat_industrial', label: 'Industrial Materials', count: 52 },
    ];
  },
};

export default materialService;
