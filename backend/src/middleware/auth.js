import { supabase } from '../config/supabase.js';

/**
 * Authentication middleware to verify Supabase JWT token.
 * Attaches user, profile, companyId, and isAdmin to req.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Fetch user profile linked to Supabase auth.users(id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, companies(*)')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.warn(`Profile lookup warning for user ${user.id}:`, profileError.message);
    }

    req.user = user;
    req.profile = profile || null;
    req.companyId = profile?.company_id || null;
    req.company = profile?.companies || null;
    req.isAdmin = profile?.is_admin || false;

    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

/**
 * Admin authorization middleware.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
  next();
};
