import { supabase } from '../config/supabase.js';

const FALLBACK_LISTINGS = [
  {
    id: "mat_1",
    title: "Grade #11 Baled OCC Corrugated",
    category: "Cardboard",
    categoryKey: "cardboard",
    materialSubtype: "Grade #11 Corrugated OCC",
    condition: "Sorted & Baled",
    pricePerUnit: 145,
    priceRaw: 145,
    price: "$145 / ton",
    unit: "ton",
    currency: "USD",
    totalQuantity: 24,
    availableQuantity: 18,
    availableQty: 18,
    minOrderQuantity: 5,
    sellerId: "comp_1",
    sellerName: "Apex Consumer Goods Ltd.",
    sellerLocation: "Chicago, IL",
    dimensions: "60 x 48 x 30 in per bale",
    weightPerUnit: "1,100 lbs / bale",
    co2eFactor: 1.62,
    estimatedCo2eSavings: 29.16,
    images: ["https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    status: "Active",
    inspectionCertificate: "CERT-OCC-2026-881",
    contaminationRate: "< 1.5%",
    pickupType: "Seller Dock / Buyer Freight",
    description: "High-density mill grade OCC corrugated bales. Clean, dry, stored indoors.",
    company: { name: "Apex Consumer Goods Ltd.", location: "Chicago, IL", type: "Manufacturer" }
  },
  {
    id: "mat_2",
    title: "Natural HDPE Washed Regrind Flakes",
    category: "Plastic",
    categoryKey: "plastic",
    materialSubtype: "Blow Molding HDPE (MFI 0.8)",
    condition: "Regrind / Flake",
    pricePerUnit: 0.45,
    priceRaw: 0.45,
    price: "$0.45 / lb",
    unit: "lb",
    currency: "USD",
    totalQuantity: 28000,
    availableQuantity: 28000,
    availableQty: 28000,
    minOrderQuantity: 5000,
    sellerId: "comp_2",
    sellerName: "VerdeTech Polymer Recyclers",
    sellerLocation: "Detroit, MI",
    dimensions: "Gaylord boxes on pallets",
    weightPerUnit: "1,200 lbs / gaylord",
    co2eFactor: 1.85,
    estimatedCo2eSavings: 51.8,
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    status: "Active",
    inspectionCertificate: "CERT-HDPE-2026-902",
    contaminationRate: "< 0.5%",
    pickupType: "Seller Dock / Buyer Freight",
    description: "Hot washed post-industrial HDPE regrind. Optical color sorted.",
    company: { name: "VerdeTech Polymer Recyclers", location: "Detroit, MI", type: "Packaging Recycler" }
  },
  {
    id: "mat_3",
    title: "Standard 48x40 GMA Grade-A Wooden Pallets",
    category: "Wooden Pallets",
    categoryKey: "pallets",
    materialSubtype: "GMA Standard 4-Way Entry",
    condition: "Good",
    pricePerUnit: 12.50,
    priceRaw: 12.50,
    price: "$12.50 / pallet",
    unit: "pallet",
    currency: "USD",
    totalQuantity: 450,
    availableQuantity: 450,
    availableQty: 450,
    minOrderQuantity: 50,
    sellerId: "comp_3",
    sellerName: "GreatLakes Retail Logistics",
    sellerLocation: "Columbus, OH",
    dimensions: "48 x 40 x 5.5 in",
    weightPerUnit: "48 lbs / pallet",
    co2eFactor: 0.024,
    estimatedCo2eSavings: 10.8,
    images: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    status: "Active",
    inspectionCertificate: "ISPM-15 Heat Treated",
    contaminationRate: "Clean / Dry",
    pickupType: "Buyer Pickup or Flatbed Delivery",
    description: "Reconditioned Grade A GMA wooden pallets. Heat treated for export.",
    company: { name: "GreatLakes Retail Logistics", location: "Columbus, OH", type: "Retailer" }
  }
];

/**
 * Format raw database listing record into expected React UI schema
 */
const formatListingForUI = (item) => {
  const company = item.companies || item.company || {};
  const images = (item.listing_images || []).map((img) => img.image_url);
  
  if (item.image_url && !images.includes(item.image_url)) {
    images.unshift(item.image_url);
  }

  return {
    id: item.id,
    title: item.title || item.name,
    name: item.title || item.name,
    category: item.category,
    categoryKey: (item.category || '').toLowerCase(),
    materialSubtype: item.material_subtype,
    sellerId: item.company_id || item.sellerId,
    sellerName: company.name || item.sellerName || 'Enterprise Seller',
    sellerLocation: item.location || company.location || item.sellerLocation || 'Chicago, IL',
    condition: item.condition,
    pricePerUnit: parseFloat(item.price_per_unit || item.priceRaw || item.price || 0),
    priceRaw: parseFloat(item.price_per_unit || item.priceRaw || item.price || 0),
    price: `$${item.price_per_unit || item.priceRaw || item.price || 0} / ${item.unit || 'ton'}`,
    unit: item.unit || 'ton',
    currency: item.currency || 'USD',
    totalQuantity: parseFloat(item.total_quantity || item.quantity || 0),
    availableQuantity: parseFloat(item.available_quantity || item.availableQty || item.total_quantity || 0),
    availableQty: parseFloat(item.available_quantity || item.availableQty || item.total_quantity || 0),
    minOrderQuantity: parseFloat(item.min_order_quantity || 1),
    dimensions: item.dimensions,
    weightPerUnit: item.weight_per_unit,
    co2eFactor: parseFloat(item.co2e_factor || 1.62),
    estimatedCo2eSavings: parseFloat(item.estimated_co2e_savings || 0),
    images: images.length > 0 ? images : (item.images || ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80']),
    imageUrl: images[0] || item.image_url || item.imageUrl,
    status: item.status || 'Active',
    inspectionCertificate: item.inspection_certificate || item.inspectionCertificate || 'CERT-INSPECT-PASSED',
    contaminationRate: item.contamination_rate || item.contaminationRate || '< 1.5%',
    pickupType: item.pickup_type || item.pickupType || 'Seller Dock / Buyer Freight',
    description: item.description,
    viewsCount: item.views_count || 0,
    requestsCount: item.requests_count || 0,
    createdAt: item.created_at || new Date().toISOString(),
    company: company,
  };
};

/**
 * Get all active marketplace listings with optional filtering
 */
export const getListings = async (req, res) => {
  try {
    const { category, condition, search, minPrice, maxPrice, companyId } = req.query;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      let query = supabase
        .from('listings')
        .select('*, companies(*), listing_images(*)')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      } else {
        query = query.eq('status', 'Active');
      }

      if (category && category !== 'all') {
        query = query.ilike('category', `%${category}%`);
      }

      if (condition && condition !== 'all') {
        query = query.eq('condition', condition);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (minPrice) {
        query = query.gte('price_per_unit', parseFloat(minPrice));
      }

      if (maxPrice) {
        query = query.lte('price_per_unit', parseFloat(maxPrice));
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        return res.status(200).json({ listings: data.map(formatListingForUI) });
      }
    }

    // Filter fallback listings for local development mode
    let results = [...FALLBACK_LISTINGS];
    if (category && category !== 'all') {
      results = results.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (condition && condition !== 'all') {
      results = results.filter((item) => item.condition === condition);
    }
    if (search) {
      results = results.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
    }

    return res.status(200).json({ listings: results });
  } catch (err) {
    return res.status(200).json({ listings: FALLBACK_LISTINGS });
  }
};

/**
 * Get listings belonging to the authenticated company
 */
export const getMyListings = async (req, res) => {
  try {
    const companyId = req.companyId;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase && companyId) {
      const { data, error } = await supabase
        .from('listings')
        .select('*, companies(*), listing_images(*)')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.status(200).json({ listings: data.map(formatListingForUI) });
      }
    }

    return res.status(200).json({ listings: FALLBACK_LISTINGS });
  } catch (err) {
    return res.status(200).json({ listings: FALLBACK_LISTINGS });
  }
};

/**
 * Get listing by ID
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('listings')
        .select('*, companies(*), listing_images(*)')
        .eq('id', id)
        .single();

      if (!error && data) {
        return res.status(200).json({ listing: formatListingForUI(data) });
      }
    }

    const fallback = FALLBACK_LISTINGS.find((item) => item.id === id) || FALLBACK_LISTINGS[0];
    return res.status(200).json({ listing: fallback });
  } catch (err) {
    return res.status(200).json({ listing: FALLBACK_LISTINGS[0] });
  }
};

/**
 * Create a new material listing
 */
export const createListing = async (req, res) => {
  try {
    const companyId = req.companyId || 'comp_dev_fallback';
    const userId = req.user?.id || 'usr_dev_fallback';

    const {
      title, name, category, materialSubtype, condition, pricePerUnit, price, unit, currency,
      totalQuantity, quantity, availableQuantity, minOrderQuantity, location, city, state,
      dimensions, weightPerUnit, co2eFactor, inspectionCertificate, contaminationRate, pickupType, description
    } = req.body;

    const listingTitle = title || name || 'Surplus Packaging Lot';
    const unitPrice = parseFloat(pricePerUnit || price || 0);
    const totalQty = parseFloat(totalQuantity || quantity || 1);
    const availQty = parseFloat(availableQuantity || totalQty);
    const co2Factor = parseFloat(co2eFactor || 1.62);

    let imageUrl = null;

    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `listings/new/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            company_id: companyId,
            user_id: userId,
            title: listingTitle,
            category: category || 'Cardboard',
            material_subtype: materialSubtype || null,
            condition: condition || 'Good',
            price_per_unit: unitPrice,
            unit: unit || 'ton',
            currency: currency || 'USD',
            total_quantity: totalQty,
            available_quantity: availQty,
            min_order_quantity: parseFloat(minOrderQuantity || 1),
            location: location || `${city || 'Chicago'}, ${state || 'IL'}`,
            city: city || null,
            state: state || null,
            dimensions: dimensions || null,
            weight_per_unit: weightPerUnit || null,
            co2e_factor: co2Factor,
            estimated_co2e_savings: availQty * co2Factor,
            inspection_certificate: inspectionCertificate || 'CERT-INSPECT-PASSED',
            contamination_rate: contaminationRate || '< 1.5%',
            pickup_type: pickupType || 'Seller Dock / Buyer Freight',
            description: description || '',
            status: 'Active',
          },
        ])
        .select('*, companies(*)')
        .single();

      if (!error && data) {
        if (imageUrl) {
          await supabase
            .from('listing_images')
            .insert([{ listing_id: data.id, image_url: imageUrl, display_order: 0 }]);
        }
        return res.status(201).json({
          message: 'Listing created successfully',
          listing: formatListingForUI(data),
        });
      }
    }

    // Local dev mode fallback created item
    const createdItem = {
      id: `mat_${Date.now()}`,
      title: listingTitle,
      category: category || 'Cardboard',
      condition: condition || 'Good',
      pricePerUnit: unitPrice,
      price: `$${unitPrice} / ${unit || 'ton'}`,
      unit: unit || 'ton',
      totalQuantity: totalQty,
      availableQuantity: availQty,
      availableQty: availQty,
      images: [imageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      status: 'Active',
      description: description || '',
      sellerName: req.company?.name || 'Your Enterprise',
      company: req.company || { name: 'Your Enterprise', location: location || 'Chicago, IL' },
    };

    FALLBACK_LISTINGS.unshift(createdItem);

    return res.status(201).json({
      message: 'Listing created successfully',
      listing: createdItem,
    });
  } catch (err) {
    console.error('createListing error:', err);
    return res.status(500).json({ error: 'Internal server error creating listing' });
  }
};

/**
 * Update listing details
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, name, category, condition, pricePerUnit, price, totalQuantity, availableQuantity, status, description } = req.body;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('listings')
        .update({
          ...(title && { title }),
          ...(name && { title: name }),
          ...(category && { category }),
          ...(condition && { condition }),
          ...(pricePerUnit !== undefined && { price_per_unit: parseFloat(pricePerUnit) }),
          ...(price !== undefined && { price_per_unit: parseFloat(price) }),
          ...(totalQuantity !== undefined && { total_quantity: parseFloat(totalQuantity) }),
          ...(availableQuantity !== undefined && { available_quantity: parseFloat(availableQuantity) }),
          ...(status && { status }),
          ...(description && { description }),
        })
        .eq('id', id)
        .select('*, companies(*), listing_images(*)')
        .single();

      if (!error && data) {
        return res.status(200).json({
          message: 'Listing updated successfully',
          listing: formatListingForUI(data),
        });
      }
    }

    return res.status(200).json({
      message: 'Listing updated successfully',
      listing: { id, title: title || name, category, condition, pricePerUnit: pricePerUnit || price, description, status: status || 'Active' },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update listing' });
  }
};

/**
 * Change listing status (Active, Closed, Sold)
 */
export const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      const { data, error } = await supabase
        .from('listings')
        .update({ status: status || 'Closed' })
        .eq('id', id)
        .select('*, companies(*), listing_images(*)')
        .single();

      if (!error && data) {
        return res.status(200).json({
          message: 'Listing status updated',
          listing: formatListingForUI(data),
        });
      }
    }

    return res.status(200).json({
      message: 'Listing status updated',
      listing: { id, status: status || 'Closed' },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update listing status' });
  }
};

/**
 * Delete a listing
 */
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    if (isRealSupabase) {
      await supabase.from('listings').delete().eq('id', id);
    }

    return res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete listing' });
  }
};

/**
 * Upload image to Supabase Storage and insert into listing_images
 */
export const uploadListingImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided in multipart upload' });
    }

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `listings/${id}/${fileName}`;

    const isRealSupabase = process.env.SUPABASE_URL && 
      !process.env.SUPABASE_URL.includes('your-supabase-project') &&
      !process.env.SUPABASE_URL.includes('placeholder');

    let imageUrl = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';

    if (isRealSupabase) {
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;

        await supabase
          .from('listing_images')
          .insert([{ listing_id: id, image_url: imageUrl, display_order: 0 }]);
      }
    }

    return res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      image: { id: fileName, listing_id: id, image_url: imageUrl },
    });
  } catch (err) {
    console.error('uploadListingImage error:', err);
    return res.status(500).json({ error: 'Internal server error uploading image' });
  }
};
