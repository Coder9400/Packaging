import apiClient from './apiClient';

export const listingService = {
  /**
   * Fetch listings created by a specific company via Express API
   */
  async getCompanyListings(companyId) {
    const data = await apiClient(`/listings?companyId=${companyId}`);
    return data.listings || [];
  },

  /**
   * Create a new surplus material listing via Express API
   */
  async createListing(listingData) {
    const data = await apiClient('/listings', {
      method: 'POST',
      body: listingData,
    });
    return data.listing;
  },

  /**
   * Update an existing material listing via Express API
   */
  async updateListing(id, updates) {
    const data = await apiClient(`/listings/${id}`, {
      method: 'PUT',
      body: updates,
    });
    return data.listing;
  },

  /**
   * Change listing status (Active, Pending, Sold, Closed) via Express API
   */
  async updateListingStatus(id, status) {
    const data = await apiClient(`/listings/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return data.listing;
  },

  /**
   * Upload listing photograph to Supabase Storage via Express API
   */
  async uploadListingImage(listingId, file) {
    const formData = new FormData();
    formData.append('image', file);

    const data = await apiClient(`/listings/${listingId}/images`, {
      method: 'POST',
      body: formData,
    });
    return data.imageUrl || data.image?.image_url;
  },

  /**
   * Delete or decommission a material listing via Express API
   */
  async deleteListing(id) {
    return await apiClient(`/listings/${id}`, {
      method: 'DELETE',
    });
  },
};

export default listingService;
