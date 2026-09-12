import { supabase } from '../config/supabase.js';

export const getMaterials = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ref_materials')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      return res.status(200).json({ materials: [] });
    }

    return res.status(200).json({ materials: data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reference materials' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'cardboard', label: 'Cardboard', name: 'Cardboard', count: 140, iconName: 'Package', description: 'Corrugated boxes, OCC bales, kraft sheets & paper board' },
      { id: 'plastic', label: 'Plastic', name: 'Plastic', count: 98, iconName: 'Boxes', description: 'HDPE flakes, PP regrind, LDPE stretch film & polymer rolls' },
      { id: 'pallets', label: 'Wooden Pallets', name: 'Wooden Pallets', count: 64, iconName: 'Layers', description: 'Standard 48x40 GMA Grade A/B & Euro EPAL-1 skids' },
      { id: 'industrial', label: 'Industrial Containers', name: 'Industrial Containers', count: 52, iconName: 'Database', description: '275/330-gal IBC totes, steel 55-gal drums & storage bins' },
      { id: 'packaging', label: 'Packaging Materials', name: 'Packaging Materials', count: 38, iconName: 'Shield', description: 'Heavy-duty Gaylords, cushioning foam & corner edgeboards' },
      { id: 'other', label: 'Other Recyclables', name: 'Other Recyclables', count: 20, iconName: 'Recycle', description: 'Strapping coils, composite liners & secondary raw fractions' },
    ];
    return res.status(200).json({ categories });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
