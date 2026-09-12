/**
 * Circular Exchange - Mock Data Repository
 * Realistic industrial B2B circular packaging & materials data
 */

export const MOCK_COMPANIES = [
  {
    id: "comp_1",
    name: "Apex Consumer Goods Ltd.",
    type: "Manufacturer",
    industry: "FMCG / Food & Beverage",
    verified: true,
    rating: 4.9,
    reviewsCount: 38,
    location: "Chicago, IL",
    address: "4500 W Industrial Pkwy, Chicago, IL 60638",
    avatar: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=150&q=80",
    sustainabilityScore: 94,
    divertedTonnage: 342.5,
    joinedDate: "2023-04-15",
    description: "High-volume consumer goods manufacturer generating clean, sorted corrugated cardboard and food-grade HDPE scrap."
  },
  {
    id: "comp_2",
    name: "VerdeTech Polymer Recyclers",
    type: "Packaging Recycler",
    industry: "Plastics Recycling & Compounding",
    verified: true,
    rating: 4.8,
    reviewsCount: 52,
    location: "Detroit, MI",
    address: "12800 Plymouth Rd, Detroit, MI 48227",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&q=80",
    sustainabilityScore: 98,
    divertedTonnage: 1280.0,
    joinedDate: "2022-11-10",
    description: "Certified closed-loop recycler processing post-industrial HDPE, PP, and PET back into premium circular resins."
  },
  {
    id: "comp_3",
    name: "GreatLakes Retail Logistics",
    type: "Retailer",
    industry: "Department Stores & Distribution",
    verified: true,
    rating: 4.7,
    reviewsCount: 29,
    location: "Columbus, OH",
    address: "8800 Distribution Way, Columbus, OH 43228",
    avatar: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=150&q=80",
    sustainabilityScore: 88,
    divertedTonnage: 215.0,
    joinedDate: "2023-08-01",
    description: "Regional distribution hub with ongoing supply of Grade-A standard GMA wooden pallets and heavy-duty shrink wrap."
  },
  {
    id: "comp_4",
    name: "EcoFreight Consolidated Lines",
    type: "Logistics Company",
    industry: "Freight & Heavy Haul",
    verified: true,
    rating: 4.9,
    reviewsCount: 84,
    location: "Indianapolis, IN",
    address: "3200 Intermodal Way, Indianapolis, IN 46241",
    avatar: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=150&q=80",
    sustainabilityScore: 92,
    divertedTonnage: 650.0,
    joinedDate: "2023-01-20",
    description: "Specialized green freight network offering empty-backhaul matching and low-emission fleet transport for circular materials."
  },
  {
    id: "comp_5",
    name: "NorthStar Chemical & Ingredients",
    type: "Manufacturer",
    industry: "Specialty Chemicals",
    verified: true,
    rating: 4.6,
    reviewsCount: 19,
    location: "Milwaukee, WI",
    address: "7100 N Green Bay Ave, Milwaukee, WI 53209",
    avatar: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=150&q=80",
    sustainabilityScore: 89,
    divertedTonnage: 180.4,
    joinedDate: "2023-09-12",
    description: "Surplus industrial intermediate bulk containers (IBCs) and steel 55-gallon drums, cleaned and triple-rinsed."
  }
];

export const MOCK_USERS = [
  {
    id: "usr_1",
    name: "Elena Rostova",
    email: "elena.r@apexgoods.com",
    role: "Sustainability Director",
    companyId: "comp_1",
    companyName: "Apex Consumer Goods Ltd.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (312) 555-0192",
    notificationsCount: 4
  },
  {
    id: "usr_2",
    name: "Marcus Vance",
    email: "m.vance@verdetech.com",
    role: "Procurement Manager",
    companyId: "comp_2",
    companyName: "VerdeTech Polymer Recyclers",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    phone: "+1 (313) 555-0144",
    notificationsCount: 2
  }
];

export const MOCK_MATERIAL_CATEGORIES = [
  { id: "cardboard", name: "Cardboard & Paper", icon: "Package", count: 28 },
  { id: "plastics", name: "Plastics & Polymers", icon: "Boxes", count: 34 },
  { id: "pallets", name: "Wooden Pallets & Crates", icon: "Layers", count: 19 },
  { id: "containers", name: "Industrial Containers & IBCs", icon: "Database", count: 14 },
  { id: "strapping", name: "Strapping & Protective Film", icon: "Shield", count: 12 },
  { id: "foam", name: "Foam & Cushioning Inserts", icon: "Sparkles", count: 8 }
];

export const MOCK_LISTINGS = [
  {
    id: "list_101",
    title: "Baled OCC Old Corrugated Cardboard (Mill Grade)",
    category: "cardboard",
    materialSubtype: "Grade #11 Corrugated OCC",
    sellerId: "comp_1",
    sellerName: "Apex Consumer Goods Ltd.",
    sellerLocation: "Chicago, IL",
    condition: "Sorted & Baled",
    pricePerUnit: 145,
    unit: "ton",
    currency: "USD",
    totalQuantity: 24,
    minOrderQuantity: 5,
    availableQuantity: 18,
    dimensions: "60 x 48 x 30 in per bale",
    weightPerUnit: "1,100 lbs / bale",
    co2eFactor: 1.62, // tons CO2e saved per ton recycled
    estimatedCo2eSavings: 29.16, // for available
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80"
    ],
    status: "Active",
    featured: true,
    inspectionCertificate: "CERT-OCC-2026-881",
    contaminationRate: "< 1.5%",
    logisticsReady: true,
    pickupType: "Dock Height / Forklift Assisted",
    createdAt: "2026-03-01T10:30:00Z",
    description: "Consistently sorted clean OCC corrugated cardboard from manufacturing packaging line. Baled tightly with heavy wire strapping. Moisture tested under 12%."
  },
  {
    id: "list_102",
    title: "Reground Food-Grade HDPE Flakes (Natural / Uncolored)",
    category: "plastics",
    materialSubtype: "HDPE Injection/Blow Grade",
    sellerId: "comp_2",
    sellerName: "VerdeTech Polymer Recyclers",
    sellerLocation: "Detroit, MI",
    condition: "Regrind / Cleaned",
    pricePerUnit: 0.48,
    unit: "lb",
    currency: "USD",
    totalQuantity: 40000,
    minOrderQuantity: 5000,
    availableQuantity: 28000,
    dimensions: "Gaylord Boxes on standard pallets",
    weightPerUnit: "1,500 lbs / Gaylord",
    co2eFactor: 0.0019, // per lb
    estimatedCo2eSavings: 53.2,
    images: [
      "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
    ],
    status: "Active",
    featured: true,
    inspectionCertificate: "FDA-COMPLIANT-CIRCULAR-2026",
    contaminationRate: "0.02% (Optical Sorted)",
    logisticsReady: true,
    pickupType: "Full Truckload (FTL) or LTL",
    createdAt: "2026-03-04T14:15:00Z",
    description: "High-purity natural HDPE washed regrind flakes derived exclusively from pre-consumer blow-molded dairy and juice containers. MFI: 0.7 - 1.1 g/10min."
  },
  {
    id: "list_103",
    title: "Standard 48x40 GMA Grade-A 4-Way Wooden Pallets",
    category: "pallets",
    materialSubtype: "Hardwood / Softwood Blend",
    sellerId: "comp_3",
    sellerName: "GreatLakes Retail Logistics",
    sellerLocation: "Columbus, OH",
    condition: "Reconditioned / Grade A",
    pricePerUnit: 8.50,
    unit: "pallet",
    currency: "USD",
    totalQuantity: 650,
    minOrderQuantity: 100,
    availableQuantity: 450,
    dimensions: "48 x 40 x 4.75 in",
    weightPerUnit: "38 lbs",
    co2eFactor: 0.024,
    estimatedCo2eSavings: 10.8,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
    ],
    status: "Active",
    featured: true,
    inspectionCertificate: "ISPM-15 Heat Treated",
    contaminationRate: "None",
    logisticsReady: true,
    pickupType: "Flatbed / Dry Van Loading Ready",
    createdAt: "2026-03-06T09:00:00Z",
    description: "Inspected Grade A GMA 48x40 pallets with clean stringers and no cracked deck boards. ISPM-15 heat-treat stamped for domestic and export freight."
  },
  {
    id: "list_104",
    title: "Reconditioned 275-Gallon IBC Totes with UN Rating",
    category: "containers",
    materialSubtype: "Composite IBC (HDPE Bottle + Galvanized Steel Cage)",
    sellerId: "comp_5",
    sellerName: "NorthStar Chemical & Ingredients",
    sellerLocation: "Milwaukee, WI",
    condition: "Triple-Rinsed / Certified Clean",
    pricePerUnit: 95,
    unit: "tote",
    currency: "USD",
    totalQuantity: 60,
    minOrderQuantity: 10,
    availableQuantity: 35,
    dimensions: "40 x 48 x 46 in",
    weightPerUnit: "135 lbs",
    co2eFactor: 0.18,
    estimatedCo2eSavings: 6.3,
    images: [
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80"
    ],
    status: "Active",
    featured: false,
    inspectionCertificate: "DOT / UN 31HA1/Y Approved",
    contaminationRate: "0.0% (Phosphate neutralized wash)",
    logisticsReady: true,
    pickupType: "Loading Dock / Forklift Ready",
    createdAt: "2026-03-07T16:20:00Z",
    description: "Heavy duty 275-gallon IBC liquid containers. Replaced bottom discharge valves (2-inch camlock) and pressure tested up to 100 kPa."
  },
  {
    id: "list_105",
    title: "Heavy Duty Gaylord Boxes with Wooden Pallet Bases (4-Wall)",
    category: "cardboard",
    materialSubtype: "Octagonal / Rectangular Heavy Corrugated",
    sellerId: "comp_1",
    sellerName: "Apex Consumer Goods Ltd.",
    sellerLocation: "Chicago, IL",
    condition: "Used Once / Like New",
    pricePerUnit: 18.00,
    unit: "box",
    currency: "USD",
    totalQuantity: 200,
    minOrderQuantity: 25,
    availableQuantity: 140,
    dimensions: "48 x 40 x 42 in",
    weightPerUnit: "45 lbs",
    co2eFactor: 0.035,
    estimatedCo2eSavings: 4.9,
    images: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
    ],
    status: "Active",
    featured: false,
    inspectionCertificate: "Burst Test 1100# Verified",
    contaminationRate: "None",
    logisticsReady: true,
    pickupType: "Collapsed / Flat Stacked",
    createdAt: "2026-03-08T11:45:00Z",
    description: "4-wall heavy duty Gaylord bulk boxes. Folded flat for easy freight loading. Capable of bearing up to 2,500 lbs stack weight."
  },
  {
    id: "list_106",
    title: "Post-Industrial LDPE Clear Shrink Film Bales (98/2 Grade)",
    category: "plastics",
    materialSubtype: "LDPE Film #4",
    sellerId: "comp_3",
    sellerName: "GreatLakes Retail Logistics",
    sellerLocation: "Columbus, OH",
    condition: "Baled Film",
    pricePerUnit: 260,
    unit: "ton",
    currency: "USD",
    totalQuantity: 15,
    minOrderQuantity: 3,
    availableQuantity: 15,
    dimensions: "60 x 48 x 42 in",
    weightPerUnit: "1,200 lbs / bale",
    co2eFactor: 1.85,
    estimatedCo2eSavings: 27.75,
    images: [
      "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80"
    ],
    status: "Active",
    featured: false,
    inspectionCertificate: "ASTM D883 Verified",
    contaminationRate: "< 2% paper label inclusion",
    logisticsReady: true,
    pickupType: "Dock Height",
    createdAt: "2026-03-09T08:10:00Z",
    description: "Clean stretch film peeled from incoming distribution center pallet loads. Virtually transparent, minimal tape, zero food contamination."
  }
];

export const MOCK_ORDERS = [
  {
    id: "ord_8891",
    orderNumber: "CE-2026-08891",
    listingId: "list_101",
    listingTitle: "Baled OCC Old Corrugated Cardboard (Mill Grade)",
    buyerId: "comp_2",
    buyerName: "VerdeTech Polymer Recyclers",
    sellerId: "comp_1",
    sellerName: "Apex Consumer Goods Ltd.",
    quantity: 12,
    unit: "ton",
    unitPrice: 145,
    totalAmount: 1740,
    currency: "USD",
    orderStatus: "In Transit",
    paymentStatus: "Escrow Held",
    logisticsType: "Seller Dispatched (EcoFreight)",
    shipmentId: "shp_501",
    co2eAvoided: 19.44, // tons
    landfillDiverted: 12.0, // tons
    createdDate: "2026-03-08T14:20:00Z",
    estimatedDelivery: "2026-03-12"
  },
  {
    id: "ord_8892",
    orderNumber: "CE-2026-08892",
    listingId: "list_103",
    listingTitle: "Standard 48x40 GMA Grade-A 4-Way Wooden Pallets",
    buyerId: "comp_1",
    buyerName: "Apex Consumer Goods Ltd.",
    sellerId: "comp_3",
    sellerName: "GreatLakes Retail Logistics",
    quantity: 200,
    unit: "pallet",
    unitPrice: 8.50,
    totalAmount: 1700,
    currency: "USD",
    orderStatus: "Delivered",
    paymentStatus: "Settled",
    logisticsType: "Buyer Pickup",
    shipmentId: "shp_502",
    co2eAvoided: 4.8,
    landfillDiverted: 3.8,
    createdDate: "2026-03-02T11:00:00Z",
    estimatedDelivery: "2026-03-05"
  },
  {
    id: "ord_8893",
    orderNumber: "CE-2026-08893",
    listingId: "list_104",
    listingTitle: "Reconditioned 275-Gallon IBC Totes with UN Rating",
    buyerId: "comp_1",
    buyerName: "Apex Consumer Goods Ltd.",
    sellerId: "comp_5",
    sellerName: "NorthStar Chemical & Ingredients",
    quantity: 15,
    unit: "tote",
    unitPrice: 95,
    totalAmount: 1425,
    currency: "USD",
    orderStatus: "Processing",
    paymentStatus: "Escrow Held",
    logisticsType: "Platform Logistics Brokerage",
    shipmentId: "shp_503",
    co2eAvoided: 2.7,
    landfillDiverted: 1.0,
    createdDate: "2026-03-10T09:15:00Z",
    estimatedDelivery: "2026-03-16"
  }
];

export const MOCK_REQUESTS = [
  {
    id: "rfq_301",
    title: "Need 25 Tons Monthly: Unprinted Clean Kraft Box Off-Cuts",
    category: "cardboard",
    buyerId: "comp_2",
    buyerName: "VerdeTech Polymer Recyclers",
    targetPrice: 160,
    unit: "ton",
    quantityNeeded: 25,
    frequency: "Recurring Monthly",
    location: "Detroit, MI (within 200 miles)",
    status: "Open",
    proposalsCount: 3,
    deadline: "2026-03-25",
    description: "Seeking steady stream of unprinted industrial kraft or chipboard production waste. Must be free from wax coatings or heavy laminates."
  },
  {
    id: "rfq_302",
    title: "Looking for 500 Euro EPAL-1 Standard Pallets",
    category: "pallets",
    buyerId: "comp_1",
    buyerName: "Apex Consumer Goods Ltd.",
    targetPrice: 11.50,
    unit: "pallet",
    quantityNeeded: 500,
    frequency: "One-Time Batch",
    location: "Chicago, IL",
    status: "Reviewing Offers",
    proposalsCount: 5,
    deadline: "2026-03-18",
    description: "Immediate need for EPAL certified Euro-pallets for European container export shipment."
  }
];

export const MOCK_SHIPMENTS = [
  {
    id: "shp_501",
    orderId: "ord_8891",
    trackingNumber: "EF-TRK-992140",
    carrier: "EcoFreight Consolidated Lines",
    vehicleType: "53ft Clean-Diesel Dry Van (Backhaul Route)",
    origin: "Chicago, IL",
    destination: "Detroit, MI",
    status: "In Transit",
    currentLocation: "Kalamazoo, MI (I-94 Eastbound)",
    progressPercent: 68,
    pickupDate: "2026-03-09T08:00:00Z",
    estimatedArrival: "2026-03-12T14:00:00Z",
    co2eReductionVsStandardFreight: "38% (Backhaul Optimization)",
    milestones: [
      { label: "Dispatch Confirmed & Dock Scheduled", time: "2026-03-08 16:30", done: true },
      { label: "Loaded & Weighed at Origin Facility", time: "2026-03-09 09:15", done: true },
      { label: "Departed Origin Terminal", time: "2026-03-09 11:00", done: true },
      { label: "In Transit / Intermediate Waypoint", time: "2026-03-10 14:20", done: true },
      { label: "Out for Final Delivery", time: "Pending", done: false },
      { label: "Delivered & Recycler Certificate Issued", time: "Pending", done: false }
    ]
  },
  {
    id: "shp_502",
    orderId: "ord_8892",
    trackingNumber: "GL-PICKUP-4401",
    carrier: "Self-Arranged Dedicated Truck",
    vehicleType: "Flatbed 48ft",
    origin: "Columbus, OH",
    destination: "Chicago, IL",
    status: "Delivered",
    currentLocation: "Chicago, IL",
    progressPercent: 100,
    pickupDate: "2026-03-03T10:00:00Z",
    estimatedArrival: "2026-03-05T16:00:00Z",
    co2eReductionVsStandardFreight: "15%",
    milestones: [
      { label: "Pickup Scheduled", time: "2026-03-02 12:00", done: true },
      { label: "Pallets Loaded & Strapped", time: "2026-03-03 10:45", done: true },
      { label: "Arrived at Buyer Warehouse", time: "2026-03-05 15:30", done: true },
      { label: "Inspected & Accepted", time: "2026-03-05 16:15", done: true }
    ]
  }
];

export const MOCK_IMPACT_STATS = {
  overall: {
    landfillDivertedTons: 4820.6,
    co2eSavedMetricTons: 8450.2,
    virginMaterialCostSavedUSD: 1420000,
    treesPreservedEquiv: 41200,
    waterGallonsSaved: 38500000,
    activeExchangesCount: 184,
    participatingEnterprises: 42
  },
  monthlyTrends: [
    { month: "Oct 2025", cardboard: 140, plastics: 85, pallets: 45, containers: 20, co2e: 480 },
    { month: "Nov 2025", cardboard: 165, plastics: 92, pallets: 52, containers: 25, co2e: 560 },
    { month: "Dec 2025", cardboard: 210, plastics: 110, pallets: 68, containers: 32, co2e: 720 },
    { month: "Jan 2026", cardboard: 195, plastics: 125, pallets: 60, containers: 28, co2e: 690 },
    { month: "Feb 2026", cardboard: 240, plastics: 140, pallets: 75, containers: 38, co2e: 840 },
    { month: "Mar 2026", cardboard: 290, plastics: 168, pallets: 90, containers: 45, co2e: 980 }
  ],
  materialBreakdown: [
    { name: "Corrugated Cardboard", value: 44, color: "#10b981" },
    { name: "Rigid & Film Plastics", value: 31, color: "#0d9488" },
    { name: "Wooden Pallets/Skids", value: 16, color: "#f59e0b" },
    { name: "Intermediate Bulk Containers", value: 9, color: "#6366f1" }
  ]
};
