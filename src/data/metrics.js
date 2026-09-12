/**
 * Circular Exchange - Metrics & Operational Flow Data
 */

export const TRUST_METRICS = [
  {
    id: "diverted",
    value: "12,450+ kg",
    label: "Materials Diverted",
    subtext: "Diverted from industrial landfills",
    trend: "+24% this quarter",
    color: "emerald"
  },
  {
    id: "businesses",
    value: "324",
    label: "Active Businesses",
    subtext: "Verified manufacturers & recyclers",
    trend: "Across 18 regional hubs",
    color: "teal"
  },
  {
    id: "listings",
    value: "876",
    label: "Material Listings",
    subtext: "Active circular feedstock lots",
    trend: "Updated daily",
    color: "brand"
  },
  {
    id: "savings",
    value: "₹8.4L",
    label: "Estimated Business Savings",
    subtext: "Saved vs virgin procurement",
    trend: "Direct bottom-line impact",
    color: "amber"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "List Materials",
    description: "Upload surplus packaging, baled cardboard, polymer regrind, or reconditioned pallets with quantity, grade specs, and dock pickup parameters.",
    iconName: "PlusCircle",
    tag: "Generators & Retailers"
  },
  {
    step: "02",
    title: "Find Opportunities",
    description: "Browse verified industrial lots filtered by material stream, purity standard, MOQ, distance, and real-time Scope 3 GHG savings factor.",
    iconName: "Search",
    tag: "Processors & Recyclers"
  },
  {
    step: "03",
    title: "Request & Transact",
    description: "Submit wholesale bids, coordinate lab quality samples, and lock settlement securely inside platform escrow pending dock inspection.",
    iconName: "Handshake",
    tag: "Secure Settlement"
  },
  {
    step: "04",
    title: "Move & Track",
    description: "Coordinate optimized backhaul freight or direct facility dispatch with automated chain-of-custody transfer and instant ESG audit certificates.",
    iconName: "Truck",
    tag: "Chain of Custody"
  }
];

export const IMPACT_STATISTICS = [
  {
    id: "waste_diverted",
    value: "12.45 Tons",
    label: "Waste Diverted from Landfills",
    description: "Industrial packaging redirected into circular remanufacturing cycles.",
    iconName: "Trash2",
    metricColor: "emerald"
  },
  {
    id: "materials_reused",
    value: "8,400+ Units",
    label: "Packaging Materials Reused",
    description: "Heavy-duty pallets, IBC containers, and Gaylord boxes kept in active service.",
    iconName: "Boxes",
    metricColor: "teal"
  },
  {
    id: "co2_avoided",
    value: "20.2 t CO₂e",
    label: "Estimated Scope 3 CO₂ Avoided",
    description: "Greenhouse gas emissions eliminated by displacing virgin material extraction.",
    iconName: "Leaf",
    metricColor: "brand"
  },
  {
    id: "cost_saved",
    value: "₹8.4 Lakhs",
    label: "Enterprise Procurement Saved",
    description: "Net cost savings delivered to participating business buyers and recyclers.",
    iconName: "TrendingDown",
    metricColor: "amber"
  }
];
