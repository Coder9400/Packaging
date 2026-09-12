import { supabase } from '../config/supabase.js';

/**
 * Get profile & company information for logged in user or specified companyId
 */
export const getProfile = async (req, res) => {
  try {
    const targetCompanyId = req.params.companyId || req.companyId;

    if (!targetCompanyId) {
      return res.status(200).json({
        profile: req.profile,
        company: req.company,
      });
    }

    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', targetCompanyId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Company profile not found' });
    }

    return res.status(200).json({
      profile: req.profile,
      company,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error fetching profile' });
  }
};

/**
 * Update company facility profile details
 */
export const updateProfile = async (req, res) => {
  try {
    const targetCompanyId = req.params.companyId || req.companyId;

    if (!targetCompanyId) {
      return res.status(400).json({ error: 'No associated company to update' });
    }

    // Verify ownership: user can only update their own company profile unless admin
    if (targetCompanyId !== req.companyId && !req.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to update another company profile' });
    }

    const { name, type, industry, phone, location, address, city, state, description, avatar_url } = req.body;

    const { data: updatedCompany, error } = await supabase
      .from('companies')
      .update({
        ...(name && { name }),
        ...(type && { type }),
        ...(industry && { industry }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(description && { description }),
        ...(avatar_url && { avatar_url }),
      })
      .eq('id', targetCompanyId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      company: updatedCompany,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error updating profile' });
  }
};
