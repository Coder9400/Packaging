/**
 * Circular Exchange - Materials Data Repository
 * Categories and curated featured material lots
 */

export const MATERIAL_CATEGORIES = [
  {
    id: "cardboard",
    name: "Cardboard",
    description: "Corrugated boxes, OCC bales, kraft sheets & paper board",
    iconName: "Package",
    activeLots: 248,
    accentColor: "emerald"
  },
  {
    id: "plastic",
    name: "Plastic",
    description: "HDPE flakes, PP regrind, LDPE stretch film & polymer rolls",
    iconName: "Boxes",
    activeLots: 194,
    accentColor: "teal"
  },
  {
    id: "pallets",
    name: "Wooden Pallets",
    description: "Standard 48x40 GMA Grade A/B & Euro EPAL-1 skids",
    iconName: "Layers",
    activeLots: 162,
    accentColor: "amber"
  },
  {
    id: "packaging",
    name: "Packaging Materials",
    description: "Heavy-duty Gaylords, cushioning foam & corner edgeboards",
    iconName: "Shield",
    activeLots: 118,
    accentColor: "blue"
  },
  {
    id: "industrial",
    name: "Industrial Containers",
    description: "275/330-gal IBC totes, steel 55-gal drums & storage bins",
    iconName: "Database",
    activeLots: 94,
    accentColor: "indigo"
  },
  {
    id: "other",
    name: "Other Recyclables",
    description: "Strapping coils, composite liners & secondary raw fractions",
    iconName: "Recycle",
    activeLots: 60,
    accentColor: "purple"
  }
];

export const FEATURED_MATERIALS = [
  {
    id: "mat_1",
    name: "Grade #11 Baled OCC Corrugated",
    category: "Cardboard",
    categoryKey: "cardboard",
    quantity: "24 Tons",
    condition: "Sorted & Baled (<1.5% contamination)",
    location: "Chicago, IL",
    price: "₹12,000 / ton",
    priceRaw: 12000,
    unit: "ton",
    companyName: "Apex Consumer Goods Ltd.",
    badge: "Mill Grade",
    colorVariant: "emerald",
    patternType: "grid",
    availableQty: 24,
    co2eAvoided: "38.8 t CO₂e"
  },
  {
    id: "mat_2",
    name: "Natural HDPE Washed Regrind Flakes",
    category: "Plastic",
    categoryKey: "plastic",
    quantity: "28,000 lbs",
    condition: "Regrind / Optical Sorted (MFI 0.8)",
    location: "Detroit, MI",
    price: "₹38 / lb",
    priceRaw: 38,
    unit: "lb",
    companyName: "VerdeTech Polymer Recyclers",
    badge: "FDA Compliant",
    colorVariant: "teal",
    patternType: "dots",
    availableQty: 28000,
    co2eAvoided: "51.8 t CO₂e"
  },
  {
    id: "mat_3",
    name: "Standard 48x40 GMA Grade-A Pallets",
    category: "Wooden Pallets",
    categoryKey: "pallets",
    quantity: "450 Pallets",
    condition: "Reconditioned / Grade A Inspected",
    location: "Columbus, OH",
    price: "₹680 / pallet",
    priceRaw: 680,
    unit: "pallet",
    companyName: "GreatLakes Retail Logistics",
    badge: "ISPM-15 Stamped",
    colorVariant: "amber",
    patternType: "stripes",
    availableQty: 450,
    co2eAvoided: "10.8 t CO₂e"
  },
  {
    id: "mat_4",
    name: "275-Gallon Reconditioned IBC Totes",
    category: "Industrial Containers",
    categoryKey: "industrial",
    quantity: "35 Totes",
    condition: "Triple-Rinsed / UN Rated",
    location: "Milwaukee, WI",
    price: "₹7,500 / tote",
    priceRaw: 7500,
    unit: "tote",
    companyName: "NorthStar Chemical Corp",
    badge: "Pressure Tested",
    colorVariant: "indigo",
    patternType: "isometric",
    availableQty: 35,
    co2eAvoided: "6.3 t CO₂e"
  },
  {
    id: "mat_5",
    name: "Clear LDPE Stretch Film Bales (98/2)",
    category: "Plastic",
    categoryKey: "plastic",
    quantity: "15 Tons",
    condition: "Clean Post-Industrial Peel",
    location: "Indianapolis, IN",
    price: "₹21,000 / ton",
    priceRaw: 21000,
    unit: "ton",
    companyName: "Metro Logistics Hub",
    badge: "Clean DC Peel",
    colorVariant: "teal",
    patternType: "dots",
    availableQty: 15,
    co2eAvoided: "27.7 t CO₂e"
  },
  {
    id: "mat_6",
    name: "4-Wall Collapsible Heavy Gaylord Boxes",
    category: "Packaging Materials",
    categoryKey: "packaging",
    quantity: "140 Boxes",
    condition: "Used Once / Like New (2500# rating)",
    location: "Toledo, OH",
    price: "₹1,450 / box",
    priceRaw: 1450,
    unit: "box",
    companyName: "Midwest Distribution Hub",
    badge: "Pallet Base Included",
    colorVariant: "blue",
    patternType: "grid",
    availableQty: 140,
    co2eAvoided: "4.9 t CO₂e"
  }
];
