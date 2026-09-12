-- ========================================================
-- MIGRATION 004: SEED REFERENCE MATERIAL CATALOG
-- Synapse B2B Circular Packaging & Material Network
-- ========================================================

-- Insert baseline reference materials into ref_materials table
INSERT INTO public.ref_materials (name, category, default_unit, co2_factor_per_unit, typical_contamination, recycling_process)
VALUES
    (
        'Grade #11 Corrugated OCC',
        'Cardboard',
        'ton',
        1.6200,
        '< 1.5% non-paper materials',
        'Hydrapulped into secondary linerboard and corrugated medium.'
    ),
    (
        'Kraft Unbleached Paper Board',
        'Cardboard',
        'ton',
        1.4500,
        '< 1.0% tape/staples',
        'Repulped for high-strength paper packaging.'
    ),
    (
        'Natural HDPE Washed Regrind',
        'Plastic',
        'lb',
        0.00185,
        '< 0.5% PP/PET polymers (MFI 0.8)',
        'Hot-washed, optically sorted, extruded into blow-molding circular resins.'
    ),
    (
        'Post-Industrial PP Regrind Flakes',
        'Plastic',
        'lb',
        0.00170,
        '< 0.8% color variation',
        'Melt-filtered and compounded into injection molding compounds.'
    ),
    (
        'Clear LDPE Stretch Film (98/2)',
        'Plastic',
        'ton',
        1.8500,
        '< 2.0% labels and dirt',
        'Shredded, washed, and pelletized into recycled film resin.'
    ),
    (
        'Standard 48x40 GMA Grade-A Pallet',
        'Wooden Pallets',
        'pallet',
        0.0240,
        'N/A (ISPM-15 Heat Treated)',
        'Repaired, stringer-reinforced, and recirculated into FMCG supply chains.'
    ),
    (
        'Euro EPAL-1 Wood Skid (800x1200mm)',
        'Wooden Pallets',
        'pallet',
        0.0260,
        'N/A (EPAL Inspected)',
        'Quality inspected and returned to European pool logistics.'
    ),
    (
        '275-Gallon Reconditioned IBC Tote',
        'Industrial Containers',
        'tote',
        0.1800,
        'Triple-rinsed / UN Rated',
        'High-pressure chemical wash, leak tested, bottle replaced if damaged.'
    ),
    (
        '55-Gallon Open Head Steel Drum',
        'Industrial Containers',
        'drum',
        0.0450,
        'Rinsed clean',
        'Shot-blasted, re-coated, and pressure certified.'
    ),
    (
        '4-Wall Collapsible Heavy Gaylord Box',
        'Packaging Materials',
        'box',
        0.0350,
        'Minor tape residue (2500# rated)',
        'Sorted, flattened, and resold for bulk granulate storage.'
    )
ON CONFLICT DO NOTHING;
