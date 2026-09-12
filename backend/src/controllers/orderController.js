import { supabase } from '../config/supabase.js';

/**
 * Format raw database order object for React UI components
 */
const formatOrderForUI = (item) => {
  const buyer = item.buyer || item.buyer_company || {};
  const seller = item.seller || item.seller_company || {};
  const listing = item.listings || {};

  return {
    id: item.id,
    orderNumber: item.order_number,
    poNumber: item.order_number,
    listingId: item.listing_id,
    materialName: listing.title || item.material_name || 'Surplus Material Lot',
    listingTitle: listing.title || 'Surplus Material Lot',
    buyerId: item.buyer_company_id,
    buyerCompanyId: item.buyer_company_id,
    buyerCompanyName: buyer.name || 'Buyer Facility',
    sellerId: item.seller_company_id,
    sellerCompanyId: item.seller_company_id,
    sellerCompanyName: seller.name || 'Seller Facility',
    quantity: parseFloat(item.quantity || 0),
    unit: item.unit || 'ton',
    unitPrice: parseFloat(item.unit_price || 0),
    totalAmount: parseFloat(item.total_amount || 0),
    totalPrice: parseFloat(item.total_amount || 0),
    currency: item.currency || 'USD',
    orderStatus: item.order_status || 'Processing',
    status: item.order_status || 'Processing',
    paymentStatus: item.payment_status || 'Escrow Held',
    logisticsType: item.logistics_type || 'Standard Freight',
    co2eAvoided: parseFloat(item.co2e_avoided || 0),
    landfillDiverted: parseFloat(item.landfill_diverted || item.quantity || 0),
    estimatedDelivery: item.estimated_delivery || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    createdDate: item.created_at,
    createdAt: item.created_at,
    listing: listing,
    buyerCompany: buyer,
    sellerCompany: seller,
    timeline: (item.order_timeline || []).map((tl) => ({
      id: tl.id,
      title: tl.title,
      description: tl.description,
      status: tl.status,
      completed: tl.completed,
      timestamp: tl.created_at,
    })),
  };
};

/**
 * Get orders associated with caller company
 */
export const getOrders = async (req, res) => {
  try {
    const companyId = req.companyId;
    const { role } = req.query;

    if (!companyId) {
      return res.status(200).json({ orders: [] });
    }

    let query = supabase
      .from('orders')
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*), order_timeline(*)')
      .order('created_at', { ascending: false });

    if (role === 'buyer') {
      query = query.eq('buyer_company_id', companyId);
    } else if (role === 'seller') {
      query = query.eq('seller_company_id', companyId);
    } else {
      query = query.or(`buyer_company_id.eq.${companyId},seller_company_id.eq.${companyId}`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('getOrders query warning:', error.message);
      return res.status(200).json({ orders: [] });
    }

    const formatted = (data || []).map(formatOrderForUI);
    return res.status(200).json({ orders: formatted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.companyId;

    const { data, error } = await supabase
      .from('orders')
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*), order_timeline(*), shipments(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify company authorization
    if (data.buyer_company_id !== companyId && data.seller_company_id !== companyId && !req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to view this order' });
    }

    const formatted = formatOrderForUI(data);
    return res.status(200).json({
      order: formatted,
      timeline: formatted.timeline,
      shipment: data.shipments?.[0] || null,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

/**
 * Create a new purchase order directly
 */
export const createOrder = async (req, res) => {
  try {
    const buyerCompanyId = req.companyId;
    if (!buyerCompanyId) {
      return res.status(403).json({ error: 'User must belong to a company to create orders' });
    }

    const { listingId, sellerCompanyId, quantity, unit, unitPrice, totalAmount, logisticsType } = req.body;

    const orderNum = `CE-2026-PO${Math.floor(100000 + Math.random() * 900000)}`;
    const qty = parseFloat(quantity || 1);
    const price = parseFloat(unitPrice || 0);
    const amount = parseFloat(totalAmount || qty * price);

    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        {
          order_number: orderNum,
          listing_id: listingId || null,
          buyer_company_id: buyerCompanyId,
          seller_company_id: sellerCompanyId || buyerCompanyId,
          quantity: qty,
          unit: unit || 'ton',
          unit_price: price,
          total_amount: amount,
          order_status: 'Processing',
          payment_status: 'Escrow Held',
          logistics_type: logisticsType || 'Standard Freight',
          co2e_avoided: qty * 1.62,
          landfill_diverted: qty,
          estimated_delivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        },
      ])
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Insert timeline milestones
    await supabase.from('order_timeline').insert([
      { order_id: order.id, title: 'Order Placed', description: 'Purchase order generated', status: 'Completed', completed: true },
      { order_id: order.id, title: 'Escrow Funds Secured', description: 'Payment locked in escrow', status: 'Processing', completed: true },
    ]);

    return res.status(201).json({
      message: 'Order created successfully',
      order: formatOrderForUI(order),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error creating order' });
  }
};

/**
 * Update order lifecycle status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;
    const companyId = req.companyId;

    const { data: existing, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (existing.buyer_company_id !== companyId && existing.seller_company_id !== companyId && !req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to update order status' });
    }

    const { data: updated, error } = await supabase
      .from('orders')
      .update({
        ...(orderStatus && { order_status: orderStatus }),
        ...(paymentStatus && { payment_status: paymentStatus }),
      })
      .eq('id', id)
      .select('*, buyer:buyer_company_id(*), seller:seller_company_id(*), listings(*)')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Append timeline milestone
    if (orderStatus) {
      await supabase.from('order_timeline').insert([
        {
          order_id: id,
          title: `Status Updated to ${orderStatus}`,
          description: `Order status advanced to ${orderStatus}`,
          status: orderStatus,
          completed: true,
        },
      ]);
    }

    return res.status(200).json({
      message: 'Order status updated',
      order: formatOrderForUI(updated),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};
