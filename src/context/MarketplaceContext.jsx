import React, { createContext, useContext, useState, useEffect } from 'react';
import { materialService } from '../services/materialService';
import { listingService } from '../services/listingService';
import { orderService } from '../services/orderService';
import { requestService } from '../services/requestService';
import { logisticsService } from '../services/logisticsService';
import { impactService } from '../services/impactService';
import { useAuth } from './AuthContext';

const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {
  const { isAuthenticated, currentCompany } = useAuth();

  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load active data from Express API on mount & auth changes
  useEffect(() => {
    const loadMarketplaceData = async () => {
      setIsLoading(true);
      try {
        const [fetchedListings, fetchedOrders, fetchedRequests, fetchedShipments, fetchedImpact] = await Promise.allSettled([
          materialService.getMarketplaceMaterials(),
          isAuthenticated ? orderService.getCompanyOrders(currentCompany?.id) : Promise.resolve([]),
          isAuthenticated ? requestService.getReceivedRequests(currentCompany?.id) : Promise.resolve([]),
          isAuthenticated ? logisticsService.getActiveShipments(currentCompany?.id) : Promise.resolve([]),
          isAuthenticated ? impactService.getImpactMetrics(currentCompany?.id) : Promise.resolve(null),
        ]);

        if (fetchedListings.status === 'fulfilled') setListings(fetchedListings.value || []);
        if (fetchedOrders.status === 'fulfilled') setOrders(fetchedOrders.value || []);
        if (fetchedRequests.status === 'fulfilled') setRequests(fetchedRequests.value || []);
        if (fetchedShipments.status === 'fulfilled') setShipments(fetchedShipments.value || []);
        if (fetchedImpact.status === 'fulfilled') setImpactStats(fetchedImpact.value || null);
      } catch (err) {
        console.error('Failed loading marketplace data from API:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketplaceData();
  }, [isAuthenticated, currentCompany?.id]);

  /**
   * Create new material listing lot
   */
  const addListing = async (newListingData) => {
    const created = await listingService.createListing(newListingData);
    if (created) {
      setListings((prev) => [created, ...prev]);
    }
    return created;
  };

  /**
   * Update listing details
   */
  const updateListing = async (id, updatedData) => {
    const updated = await listingService.updateListing(id, updatedData);
    if (updated) {
      setListings((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    }
    return updated;
  };

  /**
   * Close or decommission listing
   */
  const closeListing = async (id) => {
    const target = listings.find((l) => l.id === id);
    const nextStatus = target?.status === 'Active' ? 'Closed' : 'Active';
    const updated = await listingService.updateListingStatus(id, nextStatus);
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
    return updated;
  };

  /**
   * Delete listing lot
   */
  const deleteListing = async (id) => {
    await listingService.deleteListing(id);
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Create purchase order
   */
  const addOrder = async (newOrderData) => {
    const created = await orderService.createOrder(newOrderData);
    if (created) {
      setOrders((prev) => [created, ...prev]);
    }
    return created;
  };

  /**
   * Submit purchase RFQ request
   */
  const addRequest = async (newRequestData) => {
    const created = await requestService.createRequest(newRequestData);
    if (created) {
      setRequests((prev) => [created, ...prev]);
    }
    return created;
  };

  return (
    <MarketplaceContext.Provider
      value={{
        listings,
        orders,
        requests,
        shipments,
        impactStats,
        isLoading,
        addListing,
        updateListing,
        closeListing,
        deleteListing,
        addOrder,
        addRequest,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);
export default MarketplaceContext;
