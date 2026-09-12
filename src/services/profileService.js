import apiClient from './apiClient';

export const profileService = {
  /**
   * Fetch company profile via Express API
   */
  async getCompanyProfile(companyId) {
    const data = await apiClient(`/profile/${companyId}`);
    return data.company;
  },

  /**
   * Update corporate facility details via Express API
   */
  async updateCompanyProfile(companyId, updates) {
    const data = await apiClient(`/profile/${companyId}`, {
      method: 'PUT',
      body: updates,
    });
    return data.company;
  },
};

export default profileService;
