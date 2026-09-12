import apiClient from './apiClient';

export const impactService = {
  /**
   * Fetch company circular environmental impact KPI summary & chart data via Express API
   */
  async getImpactSummary(companyId = null) {
    const query = companyId ? `?company_id=${companyId}` : '';
    return await apiClient(`/impact/summary${query}`);
  },

  async getImpactMetrics(companyId = null) {
    const summary = await this.getImpactSummary(companyId);
    return summary.metrics;
  },

  async getMaterialsReusedOverTime(companyId = null) {
    const summary = await this.getImpactSummary(companyId);
    return summary.reusedOverTime || [];
  },

  async getMaterialsByCategory(companyId = null) {
    const summary = await this.getImpactSummary(companyId);
    return summary.materialsByCategory || [];
  },

  async getWasteDivertedOverTime(companyId = null) {
    const summary = await this.getImpactSummary(companyId);
    return summary.wasteDivertedOverTime || [];
  },
};

export default impactService;
