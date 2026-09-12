import apiClient from './apiClient';

export const messageService = {
  /**
   * Fetch all active B2B conversations via Express API
   */
  async getConversations(companyId = null) {
    const query = companyId ? `?company_id=${companyId}` : '';
    const data = await apiClient(`/messages/conversations${query}`);
    return data.conversations || [];
  },

  /**
   * Fetch message thread history via Express API
   */
  async getMessages(conversationId) {
    const data = await apiClient(`/messages/${conversationId}`);
    return data.messages || [];
  },

  /**
   * Send a new chat message in a conversation thread via Express API
   */
  async sendMessage(conversationId, senderId, text) {
    const data = await apiClient('/messages', {
      method: 'POST',
      body: { conversationId, senderId, text },
    });
    return data.messageItem;
  },
};

export default messageService;
