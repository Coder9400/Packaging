/**
 * Circular Impact Telemetry & Analytics Mock Data
 * Label all values as "Estimated impact" per platform guidelines.
 */

export const IMPACT_OVERVIEW_METRICS = {
  totalMaterialsReused: {
    value: '14,850',
    unit: 'Units',
    label: 'Total Materials Reused',
    change: '+32% vs last quarter',
    trend: 'up',
    subtitle: 'Kept in active industrial rotation'
  },
  wasteDiverted: {
    value: '12.4',
    unit: 'Tonnes',
    label: 'Waste Diverted',
    change: '+4.2 tonnes this month',
    trend: 'up',
    subtitle: 'Redirected from landfill disposal'
  },
  estimatedCo2Avoided: {
    value: '19.8',
    unit: 't CO₂e',
    label: 'Estimated CO₂ Impact Avoided',
    change: 'Scope 3 displacement',
    trend: 'up',
    subtitle: 'Equivalent to 248 mature trees'
  },
  estimatedBusinessSavings: {
    value: '₹4,85,000',
    unit: 'INR',
    label: 'Estimated Business Savings',
    change: '-34% vs virgin materials',
    trend: 'up',
    subtitle: 'Direct bottom-line procurement savings'
  }
};

export const IMPACT_SUMMARY_BANNER = {
  headline: "Your business has helped divert 12.4 tonnes of packaging material from potential landfill disposal.",
  subtext: "Through circular exchange and certified secondary feedstock reuse, you have prevented 19.8 metric tonnes of Scope 3 greenhouse gas emissions.",
  breakdown: [
    {
      category: 'Cardboard',
      tonnes: 5.8,
      percentage: 47,
      color: '#10b981', // emerald-500
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-400',
      description: 'OCC Bales & Corrugated Cartons'
    },
    {
      category: 'Plastic',
      tonnes: 3.4,
      percentage: 27,
      color: '#0d9488', // teal-600
      bgClass: 'bg-teal-500',
      textClass: 'text-teal-400',
      description: 'HDPE Regrind & Strapping Drums'
    },
    {
      category: 'Wood',
      tonnes: 2.2,
      percentage: 18,
      color: '#f59e0b', // amber-500
      bgClass: 'bg-amber-500',
      textClass: 'text-amber-400',
      description: 'GMA Pallets & Industrial Crates'
    },
    {
      category: 'Other',
      tonnes: 1.0,
      percentage: 8,
      color: '#6366f1', // indigo-500
      bgClass: 'bg-indigo-500',
      textClass: 'text-indigo-400',
      description: 'IBC Totes & Steel Drums'
    }
  ]
};

// CHART 1: Materials reused over time (Monthly breakdown in units)
export const MATERIALS_REUSED_OVER_TIME = [
  { month: 'Apr', reusedUnits: 1200, cardboardUnits: 650, woodPallets: 350, plasticUnits: 200 },
  { month: 'May', reusedUnits: 1850, cardboardUnits: 980, woodPallets: 520, plasticUnits: 350 },
  { month: 'Jun', reusedUnits: 2400, cardboardUnits: 1250, woodPallets: 680, plasticUnits: 470 },
  { month: 'Jul', reusedUnits: 2950, cardboardUnits: 1550, woodPallets: 820, plasticUnits: 580 },
  { month: 'Aug', reusedUnits: 3150, cardboardUnits: 1600, woodPallets: 900, plasticUnits: 650 },
  { month: 'Sep', reusedUnits: 3300, cardboardUnits: 1720, woodPallets: 950, plasticUnits: 630 }
];

// CHART 2: Materials by category (Donut / Pie data)
export const MATERIALS_BY_CATEGORY = [
  { name: 'Cardboard', value: 5.8, unit: 'Tonnes', percentage: 47, color: '#10b981' },
  { name: 'Plastic', value: 3.4, unit: 'Tonnes', percentage: 27, color: '#0d9488' },
  { name: 'Wood', value: 2.2, unit: 'Tonnes', percentage: 18, color: '#f59e0b' },
  { name: 'Other', value: 1.0, unit: 'Tonnes', percentage: 8, color: '#6366f1' }
];

// CHART 3: Waste diverted over time (Cumulative tonnes diverted)
export const WASTE_DIVERTED_OVER_TIME = [
  { month: 'Apr', monthlyDiverted: 1.2, cumulativeDiverted: 1.2, co2Avoided: 1.9 },
  { month: 'May', monthlyDiverted: 1.8, cumulativeDiverted: 3.0, co2Avoided: 4.8 },
  { month: 'Jun', monthlyDiverted: 2.2, cumulativeDiverted: 5.2, co2Avoided: 8.3 },
  { month: 'Jul', monthlyDiverted: 2.4, cumulativeDiverted: 7.6, co2Avoided: 12.1 },
  { month: 'Aug', monthlyDiverted: 2.3, cumulativeDiverted: 9.9, co2Avoided: 15.8 },
  { month: 'Sep', monthlyDiverted: 2.5, cumulativeDiverted: 12.4, co2Avoided: 19.8 }
];

// Environmental Equivalencies
export const ENVIRONMENTAL_EQUIVALENCIES = [
  {
    id: 'trees',
    title: 'Trees Preserved',
    value: '248',
    unit: 'Mature Trees',
    detail: 'Equivalent forestry spared from timber logging',
    icon: 'TreePine',
    color: 'emerald'
  },
  {
    id: 'water',
    title: 'Water Conserved',
    value: '84,000',
    unit: 'Litres',
    detail: 'Industrial process water conserved vs virgin pulp manufacturing',
    icon: 'Droplets',
    color: 'teal'
  },
  {
    id: 'energy',
    title: 'Energy Saved',
    value: '32,500',
    unit: 'kWh',
    detail: 'Grid electrical energy avoided in raw material refining',
    icon: 'Zap',
    color: 'amber'
  },
  {
    id: 'landfill',
    title: 'Landfill Airspace',
    value: '48.2',
    unit: 'm³ Saved',
    detail: 'Compact volume prevented from landfill accumulation',
    icon: 'Boxes',
    color: 'indigo'
  }
];

// Impact History Table
export const IMPACT_HISTORY = [
  {
    id: 'IMP-2026-089',
    date: '2026-09-10',
    material: 'Double-Wall Corrugated Cartons',
    category: 'Cardboard',
    quantity: '2,500 kg',
    landfillDiverted: '2.50 Tonnes',
    co2Avoided: '4.05 t CO₂e',
    costSaved: '₹37,500',
    transactionId: 'ORD-9482',
    partner: 'Apex Logistics & Warehousing',
    type: 'Reused'
  },
  {
    id: 'IMP-2026-088',
    date: '2026-09-08',
    material: 'Standard GMA Wooden Pallets (48x40)',
    category: 'Wood',
    quantity: '450 Pallets',
    landfillDiverted: '1.80 Tonnes',
    co2Avoided: '10.8 t CO₂e',
    costSaved: '₹1,57,500',
    transactionId: 'ORD-8921',
    partner: 'Gujarat Packaging Hub',
    type: 'Reused'
  },
  {
    id: 'IMP-2026-087',
    date: '2026-09-04',
    material: 'Clean Natural HDPE Flakes',
    category: 'Plastic',
    quantity: '3,200 kg',
    landfillDiverted: '3.20 Tonnes',
    co2Avoided: '5.92 t CO₂e',
    costSaved: '₹96,000',
    transactionId: 'ORD-8302',
    partner: 'EcoPolymer Recyclers',
    type: 'Recycled'
  },
  {
    id: 'IMP-2026-086',
    date: '2026-08-28',
    material: '275-Gallon IBC Liquid Totes',
    category: 'Other',
    quantity: '25 Units',
    landfillDiverted: '1.00 Tonnes',
    co2Avoided: '4.50 t CO₂e',
    costSaved: '₹82,500',
    transactionId: 'ORD-7741',
    partner: 'ChemClean Solvents Corp',
    type: 'Reused'
  },
  {
    id: 'IMP-2026-085',
    date: '2026-08-22',
    material: 'Grade #11 OCC Cardboard Bales',
    category: 'Cardboard',
    quantity: '3,300 kg',
    landfillDiverted: '3.30 Tonnes',
    co2Avoided: '5.34 t CO₂e',
    costSaved: '₹46,200',
    transactionId: 'ORD-7219',
    partner: 'GreenCycle Pulp & Paper',
    type: 'Recycled'
  },
  {
    id: 'IMP-2026-084',
    date: '2026-08-15',
    material: 'Heavy-Duty Gaylord Bulk Boxes',
    category: 'Cardboard',
    quantity: '180 Boxes',
    landfillDiverted: '0.60 Tonnes',
    co2Avoided: '0.97 t CO₂e',
    costSaved: '₹65,300',
    transactionId: 'ORD-6893',
    partner: 'Pacific Freight Solutions',
    type: 'Reused'
  }
];
