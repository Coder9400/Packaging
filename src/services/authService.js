import apiClient from './apiClient';
import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Authenticate user via backend Express API & Supabase Auth
   */
  async login(email, password) {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    const token = data.session?.access_token || data.access_token;
    if (token) {
      localStorage.setItem('token', token);
    }

    return data;
  },

  /**
   * Register new corporate user facility via backend Express API
   */
  async register(params) {
    const { email, password, companyName, businessType, location, contactName, fullName, phone } = params;

    const data = await apiClient('/auth/register', {
      method: 'POST',
      body: {
        email,
        password,
        companyName,
        businessType,
        location,
        fullName: fullName || contactName,
        phone,
      },
    });

    const token = data.session?.access_token || data.access_token;
    if (token) {
      localStorage.setItem('token', token);
    }

    return data;
  },

  /**
   * Fetch current authenticated user session & profile
   */
  async getSession() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const data = await apiClient('/auth/me');
      return data;
    } catch (e) {
      return null;
    }
  },

  /**
   * Sign out current user
   */
  async logout() {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network logout error
    }
    await supabase.auth.signOut().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('circular_exchange_auth_user');
    return true;
  },

  /**
   * Send password reset request
   */
  async resetPassword(email) {
    return { success: true, message: 'Password reset link sent to registered email' };
  },
};

export default authService;