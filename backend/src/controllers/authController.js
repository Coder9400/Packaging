import { supabase } from '../config/supabase.js';
import { generateUUID } from '../utils/index.js';

/**
 * Register new user & company facility
 */
export const register = async (req, res) => {
  try {
    const { email, password, companyName, businessType, location, contactName, fullName, phone } = req.body;

    if (!email || !password || !companyName) {
      return res.status(400).json({ error: 'Email, password, and company name are required' });
    }

    let authUser = null;
    let authSession = null;

    const isRealSupabase = process.env.SUPABASE_URL &&
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || contactName || companyName,
            company_name: companyName,
          },
        },
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      authUser = authData.user;
      authSession = authData.session;
    }

    // Fallback UUID generation if Supabase Auth is offline or unconfigured
    if (!authUser) {
      const fallbackId = generateUUID();
      authUser = {
        id: fallbackId,
        email,
        user_metadata: { full_name: fullName || contactName || companyName },
      };
      authSession = {
        access_token: `token_${fallbackId}`,
        user: authUser,
      };
    }

    // Insert Company record in public.companies
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert([
        {
          name: companyName,
          type: businessType || 'Manufacturer',
          email,
          phone: phone || null,
          location: location || null,
          is_verified: true,
          rating: 5.0,
          sustainability_score: 90,
          diverted_tonnage: 0.0,
        },
      ])
      .select()
      .single();

    let createdCompany = company;
    if (companyError || !company) {
      createdCompany = {
        id: generateUUID(),
        name: companyName,
        type: businessType || 'Manufacturer',
        email,
        phone: phone || null,
        location: location || null,
        is_verified: true,
        rating: 5.0,
        sustainability_score: 90,
        diverted_tonnage: 0.0,
      };
    }

    // Insert Profile record linking auth.users(id) to companies(id)
    const { data: profile } = await supabase
      .from('profiles')
      .insert([
        {
          id: authUser.id,
          company_id: createdCompany.id,
          full_name: fullName || contactName || `${companyName} Lead`,
          email,
          phone: phone || null,
          role: businessType || 'Sustainability Director',
          is_admin: false,
        },
      ])
      .select()
      .single();

    const createdProfile = profile || {
      id: authUser.id,
      company_id: createdCompany.id,
      full_name: fullName || contactName || `${companyName} Lead`,
      email,
      phone: phone || null,
      role: businessType || 'Sustainability Director',
      is_admin: false,
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: authUser,
      session: authSession,
      profile: createdProfile,
      company: createdCompany,
    });
  } catch (err) {
    console.error('Registration exception:', err);
    return res.status(400).json({ error: err.message || 'Failed to complete registration' });
  }
};

/**
 * Sign in existing user with password
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const isRealSupabase = process.env.SUPABASE_URL &&
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('id', data.user.id)
        .single();

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: data.user,
        session: data.session,
        profile: profile || null,
        company: profile?.companies || null,
      });
    }

    // Development fallback login
    const fallbackId = generateUUID();
    const mockUser = { id: fallbackId, email, user_metadata: { full_name: 'Enterprise Representative' } };
    const mockCompany = { id: generateUUID(), name: 'Apex Consumer Goods Ltd.', type: 'Manufacturer', email, location: 'Chicago, IL', is_verified: true };
    const mockProfile = { id: fallbackId, company_id: mockCompany.id, full_name: 'Enterprise Representative', email, role: 'Manufacturer', is_admin: false };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: mockUser,
      session: { access_token: `token_${fallbackId}`, user: mockUser },
      profile: mockProfile,
      company: mockCompany,
    });
  } catch (err) {
    console.error('Login exception:', err);
    return res.status(401).json({ error: err.message || 'Invalid credentials' });
  }
};

/**
 * Get current authenticated user profile & company
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user,
      profile: req.profile,
      company: req.company,
      companyId: req.companyId,
      isAdmin: req.isAdmin,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error fetching user session' });
  }
};

/**
 * Logout
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to logout' });
  }
};
