import apiClient from './apiClient';

export const api = {
    // Authentication
    signUp: async (email, password, fullName) => {
        return await apiClient('/auth/register', {
            method: 'POST',
            body: { email, password, fullName, companyName: `${fullName}'s Enterprise` },
        });
    },

    signIn: async (email, password) => {
        return await apiClient('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
    },

    getProfile: async () => {
        return await apiClient('/auth/me');
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('circular_exchange_auth_user');
    },

    // Listings
    getListings: async () => {
        const data = await apiClient('/listings');
        return data.listings || [];
    },

    getListingById: async (id) => {
        const data = await apiClient(`/listings/${id}`);
        return data.listing;
    },

    createListing: async (formData) => {
        return await apiClient('/listings', {
            method: 'POST',
            body: formData,
        });
    },

    deleteListing: async (id) => {
        return await apiClient(`/listings/${id}`, {
            method: 'DELETE',
        });
    },
};

export default api;