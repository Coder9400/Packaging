import apiClient from './apiClient';

export const requestService = {
  /**
   * Fetch incoming material requests received by a seller via Express API
   */
  async getReceivedRequests(companyId) {
    const data = await apiClient(`/requests/received?company_id=${companyId}`);
    return data.requests || [];
  },

  /**
   * Fetch material RFQs sent by a buyer via Express API
   */
  async getSentRequests(companyId) {
    const data = await apiClient(`/requests/sent?company_id=${companyId}`);
    return data.requests || [];
  },

  /**
   * Create a new purchase request / RFQ via Express API
   */
  async createRequest(requestData) {
    const data = await apiClient('/requests', {
      method: 'POST',
      body: requestData,
    });
    return data.request;
  },

  /**
   * Accept an incoming request via Express API
   */
  async acceptRequest(requestId) {
    const data = await apiClient(`/requests/${requestId}/accept`, {
      method: 'PATCH',
    });
    return data.request;
  },

  /**
   * Decline an incoming request via Express API
   */
  async rejectRequest(requestId, reason = '') {
    const data = await apiClient(`/requests/${requestId}/reject`, {
      method: 'PATCH',
      body: { reason },
    });
    return data.request;
  },
};

export default requestService;
