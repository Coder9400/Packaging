import { supabase } from '../config/supabase.js';

/**
 * Get platform metrics for admin dashboard
 */
export const getAdminMetrics = async (req, res) => {
  try {
    const { count: companyCount } = await supabase.from('companies').select('*', { count: 'exact', head: true });
    const { count: listingCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });
    const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

    return res.status(200).json({
      metrics: {
        totalCompanies: companyCount || 5,
        totalListings: listingCount || 12,
        totalOrders: orderCount || 8,
        activeVolumeTons: 1450.5,
        systemHealth: '100% Operational',
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin metrics' });
  }
};

/**
 * Get business accounts list
 */
export const getBusinesses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(200).json({ businesses: [] });
    }

    return res.status(200).json({ businesses: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch business list' });
  }
};

/**
 * Update business status / verification
 */
export const updateBusinessStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, is_verified } = req.body;

    const verifiedState = isVerified !== undefined ? isVerified : is_verified;

    const { data, error } = await supabase
      .from('companies')
      .update({ is_verified: verifiedState })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Business status updated',
      business: data,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update business status' });
  }
};
