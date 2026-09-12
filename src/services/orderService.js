import apiClient from './apiClient';

export const orderService = {
  /**
   * Fetch orders associated with a company via Express API
   */
  async getCompanyOrders(companyId, role = 'buyer') {
    const data = await apiClient(`/orders?company_id=${companyId}&role=${role}`);
    return data.orders || [];
  },

  /**
   * Fetch single order by unique ID via Express API
   */
  async getOrderById(orderId) {
    const data = await apiClient(`/orders/${orderId}`);
    return data.order;
  },

  /**
   * Create new purchase order via Express API
   */
  async createOrder(orderData) {
    const data = await apiClient('/orders', {
      method: 'POST',
      body: orderData,
    });
    return data.order;
  },

  /**
   * Advance or update order lifecycle status via Express API
   */
  async updateOrderStatus(orderId, orderStatus, paymentStatus = null) {
    const data = await apiClient(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { orderStatus, paymentStatus },
    });
    return data.order;
  },
};

export default orderService;
