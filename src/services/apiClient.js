import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Retrieves active authentication token from Supabase session or localStorage token
 */
const getAuthToken = async () => {
  try {
    const savedToken = localStorage.getItem('token');
    if (savedToken) return savedToken;

    if (isSupabaseConfigured()) {
      const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: {} }));
      if (session?.access_token) {
        return session.access_token;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return null;
};

/**
 * Centralized HTTP request client with automatic Bearer token injection
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Only attempt token retrieval for non-public endpoints
  if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/health')) {
    const token = await getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Handle FormData (don't set Content-Type header manually if uploading file)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.error || data.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (
      error.message === 'fetch failed' ||
      error.name === 'TypeError' ||
      error.message.includes('Failed to fetch')
    ) {
      throw new Error('Unable to connect to the Synapse server. Make sure the backend is running on port 5000.');
    }
    console.warn(`API Client Request Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export default apiClient;
