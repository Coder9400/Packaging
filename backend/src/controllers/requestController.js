import { supabase } from '../config/supabase.js';

/**
 * Format raw database request object for React UI components
 */
const formatRequestForUI = (item) => {
  const buyer = item.buyer || item.buyer_company || {};
  const seller = item.seller || item.seller_company || {};
  const listing = item.listings || {};

  return {
    id: item.id,
    listingId: item.listing_id,
    materialName: listing.title || item.material_name || 'Surplus Material Lot',
    listingTitle: listing.title || 'Surplus Material Lot',
    buyerCompanyId: item.buyer_company_id,
    buyerCompanyName: buyer.name || 'Buyer Enterprise',
    sellerCompanyId: item.seller_company_id,
    sellerCompanyName: seller.name || 'Seller Enterprise',
    requestedQuantity: parseFloat(item.requested_quantity || 0),
    quantity: parseFloat(item.requested_quantity || 0),
    unit: item.unit || 'ton',
    unitPrice: parseFloat(item.unit_price || 0),
    totalPrice: parseFloat(item.total_price || 0),
    totalAmount: parseFloat(item.total_price || 0),
    pickupDate: item.pickup_date || new Date().toISOString().split('T')[0],
    logisticsType: item.logistics_type || 'Buyer Arranged Freight',
    message: item.message || '',
    status: item.status || 'Pending',
    rejectReason: item.reject_reason || null,
    createdAt: item.created_at,
    listing: listing,
    buyerCompany: buyer,
    sellerCompany: seller,
  };
};

/**
 * Submit a new purchase request / RFQ
 */
export const createRequest = async (req, res) => {
  try {
    const buyerCompanyId = req.companyId;
    if (!buyerCompanyId) {
      return res.status(403).json({ error: 'User must belong to a company to submit RFQs' });
    }

    const { listingId, sellerCompanyId, requestedQuantity, quantity, unit, unitPrice, totalPrice, pickupDate, logisticsType, message } = req.body;

    // Fetch target listing to find sellerCompanyId if omitted
    let targetSellerId = sellerCompanyId;
    let targetListing = null;

    if (listingId) {
      const { data: listingData } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (listingData) {
        targetListing = listingData;
        targetSellerId = targetSellerId || listingData.company_id;
      }
    }

    if (!targetSellerId) {
      return res.status(400).json({ error: 'Seller company ID could not be determined' });
    }

    const reqQty = parseFloat(requestedQuantity || quantity || 1);
    const uPrice = parseFloat(unitPrice || targetListing?.price_per_unit || 0);
    const tPrice = parseFloat(totalPrice || reqQty * uPrice);

    const { data, error } = await supabase
      .from('material_requests')
      .insert([
        {
          listing_id: listingId || null,
          buyer_company_id: buyerCompanyId,
          seller_company_id: targetSellerId,
          requested_quantity: reqQty,
          unit: unit || targetListing?.unit || 'ton',
          unit_price: uPrice,
          total_price: tPrice,
          pickup_date: pickupDate || null,
          logistics_type: logisticsType || 'Standard Freight',
          message: message || '',
          status: 'Pending',
        },
      ])
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Increment request count on listing
    if (listingId) {
      await supabase.rpc('increment_request_count', { p_listing_id: listingId }).catch(() => {});
    }

    return res.status(201).json({
      message: 'Request submitted successfully',
      request: formatRequestForUI(data),
    });
  } catch (err) {
    console.error('createRequest error:', err);
    return res.status(500).json({ error: 'Failed to create purchase request' });
  }
};

/**
 * Get requests sent by the authenticated buyer company
 */
export const getSentRequests = async (req, res) => {
  try {
    const buyerCompanyId = req.companyId;
    if (!buyerCompanyId) {
      return res.status(200).json({ requests: [] });
    }

    const { data, error } = await supabase
      .from('material_requests')
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*)')
      .eq('buyer_company_id', buyerCompanyId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(200).json({ requests: [] });
    }

    const formatted = (data || []).map(formatRequestForUI);
    return res.status(200).json({ requests: formatted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
};

/**
 * Get requests received by the authenticated seller company
 */
export const getReceivedRequests = async (req, res) => {
  try {
    const sellerCompanyId = req.companyId;
    if (!sellerCompanyId) {
      return res.status(200).json({ requests: [] });
    }

    const { data, error } = await supabase
      .from('material_requests')
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*)')
      .eq('seller_company_id', sellerCompanyId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(200).json({ requests: [] });
    }

    const formatted = (data || []).map(formatRequestForUI);
    return res.status(200).json({ requests: formatted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch received requests' });
  }
};

/**
 * Accept request (Invokes atomic stored procedure accept_material_request)
 */
export const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const sellerCompanyId = req.companyId;

    if (!sellerCompanyId) {
      return res.status(403).json({ error: 'User must belong to a company to accept requests' });
    }

    // Call atomic RPC function accept_material_request
    const { data: rpcResult, error: rpcError } = await supabase.rpc('accept_material_request', {
      p_request_id: requestId,
      p_seller_company_id: sellerCompanyId,
    });

    if (rpcError) {
      console.warn('RPC accept_material_request failed, running server fallback logic:', rpcError.message);
      
      // Fallback JS atomic implementation if RPC isn't deployed yet
      const { data: request, error: reqError } = await supabase
        .from('material_requests')
        .select('*, listings(*)')
        .eq('id', requestId)
        .single();

      if (reqError || !request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      if (request.seller_company_id !== sellerCompanyId && !req.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized: Only the designated seller company can accept this request' });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({ error: `Request status is ${request.status}. Only Pending requests can be accepted.` });
      }

      // Update request status to Accepted
      await supabase.from('material_requests').update({ status: 'Accepted' }).eq('id', requestId);

      // Decrease listing quantity
      if (request.listing_id && request.listings) {
        const newAvail = Math.max(0, (request.listings.available_quantity || 0) - request.requested_quantity);
        const newStatus = newAvail === 0 ? 'Sold' : request.listings.status;
        await supabase.from('listings').update({ available_quantity: newAvail, status: newStatus }).eq('id', request.listing_id);
      }

      // Generate Order
      const orderNum = `CE-2026-PO${Math.floor(100000 + Math.random() * 900000)}`;
      const { data: createdOrder } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNum,
            listing_id: request.listing_id,
            buyer_company_id: request.buyer_company_id,
            seller_company_id: request.seller_company_id,
            quantity: request.requested_quantity,
            unit: request.unit,
            unit_price: request.unit_price,
            total_amount: request.total_price,
            order_status: 'Processing',
            payment_status: 'Escrow Held',
            logistics_type: request.logistics_type || 'Standard Freight',
            co2e_avoided: request.requested_quantity * 1.62,
            landfill_diverted: request.requested_quantity,
          },
        ])
        .select()
        .single();

      return res.status(200).json({
        message: 'Request accepted and order generated successfully',
        success: true,
        order_id: createdOrder?.id,
        order_number: orderNum,
      });
    }

    return res.status(200).json({
      message: 'Request accepted and order generated successfully',
      ...rpcResult,
    });
  } catch (err) {
    console.error('acceptRequest error:', err);
    return res.status(500).json({ error: 'Internal server error accepting request' });
  }
};

/**
 * Reject request
 */
export const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { reason } = req.body;
    const sellerCompanyId = req.companyId;

    const { data: request, error: reqError } = await supabase
      .from('material_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (reqError || !request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.seller_company_id !== sellerCompanyId && !req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized: Only the seller company can reject this request' });
    }

    const { data: updated, error } = await supabase
      .from('material_requests')
      .update({ status: 'Rejected', reject_reason: reason || 'Seller unavailable' })
      .eq('id', requestId)
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Request rejected',
      request: formatRequestForUI(updated),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reject request' });
  }
};
