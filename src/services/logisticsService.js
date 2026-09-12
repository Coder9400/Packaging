import apiClient from './apiClient';

export const logisticsService = {
  /**
   * Fetch active shipments via Express API
   */
  async getActiveShipments(companyId = null) {
    const query = companyId ? `?company_id=${companyId}` : '';
    const data = await apiClient(`/logistics/active${query}`);
    return data.shipments || [];
  },

  /**
   * Fetch completed shipments via Express API
   */
  async getCompletedShipments(companyId = null) {
    const query = companyId ? `?company_id=${companyId}` : '';
    const data = await apiClient(`/logistics/completed${query}`);
    return data.shipments || [];
  },

  /**
   * Fetch route optimization analytics via Express API
   */
  async getRouteOptimizationData(originCity = 'Ahmedabad', destinationCity = 'Gandhinagar') {
    const data = await apiClient(`/logistics/optimization?origin=${originCity}&destination=${destinationCity}`);
    return data.optimization;
  },

  /**
   * Update shipment tracking status via Express API
   */
  async updateShipmentStatus(shipmentId, status, eta = null) {
    const data = await apiClient(`/logistics/shipments/${shipmentId}/status`, {
      method: 'PATCH',
      body: { status, eta },
    });
    return data.shipment;
  },
};

export default logisticsService;
