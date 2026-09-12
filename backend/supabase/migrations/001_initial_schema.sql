-- ========================================================
-- MIGRATION 001: INITIAL SCHEMA & DOMAIN TYPES
-- Synapse B2B Circular Packaging & Material Network
-- ========================================================

-- Custom Enum Types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type_enum') THEN
        CREATE TYPE business_type_enum AS ENUM ('Manufacturer', 'Packaging Recycler', 'Retailer', 'Logistics Provider');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'material_condition_enum') THEN
        CREATE TYPE material_condition_enum AS ENUM ('New', 'Good', 'Sorted & Baled', 'Regrind / Flake', 'Cleaned & Rinsed', 'Used');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listing_status_enum') THEN
        CREATE TYPE listing_status_enum AS ENUM ('Active', 'Pending', 'Sold', 'Closed', 'Expired');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status_enum') THEN
        CREATE TYPE request_status_enum AS ENUM ('Pending', 'Accepted', 'Rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM ('Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('Escrow Held', 'Disbursed', 'Refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shipment_status_enum') THEN
        CREATE TYPE shipment_status_enum AS ENUM ('Pickup Scheduled', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered');
    END IF;
END $$;

-- Sequence for Collision-Safe Sequential Order Numbers (CE-2026-PO000001)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1 INCREMENT BY 1;

-- 1. Companies Table (B2B Enterprises)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type business_type_enum NOT NULL DEFAULT 'Manufacturer',
    industry TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    location TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 5.0 CONSTRAINT chk_company_rating CHECK (rating >= 0.0 AND rating <= 5.0),
    sustainability_score INT DEFAULT 90 CONSTRAINT chk_sustainability_score CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    diverted_tonnage NUMERIC(10,2) DEFAULT 0.0 CONSTRAINT chk_diverted_tonnage CHECK (diverted_tonnage >= 0),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'Sustainability Director',
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Reference Material Catalog
CREATE TABLE IF NOT EXISTS public.ref_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    default_unit TEXT DEFAULT 'kg',
    co2_factor_per_unit NUMERIC(8,4) DEFAULT 1.62 CONSTRAINT chk_ref_co2 CHECK (co2_factor_per_unit >= 0),
    typical_contamination TEXT,
    recycling_process TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Listings Table (Marketplace Lots)
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    material_id UUID REFERENCES public.ref_materials(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    material_subtype TEXT,
    condition material_condition_enum NOT NULL DEFAULT 'Good',
    price_per_unit NUMERIC(12,2) NOT NULL CONSTRAINT chk_listing_price CHECK (price_per_unit >= 0),
    unit TEXT NOT NULL DEFAULT 'ton',
    currency TEXT DEFAULT 'USD',
    total_quantity NUMERIC(12,2) NOT NULL CONSTRAINT chk_listing_total_qty CHECK (total_quantity > 0),
    available_quantity NUMERIC(12,2) NOT NULL CONSTRAINT chk_listing_avail_qty CHECK (available_quantity >= 0),
    min_order_quantity NUMERIC(12,2) DEFAULT 1.0 CONSTRAINT chk_listing_min_qty CHECK (min_order_quantity > 0),
    location TEXT,
    city TEXT,
    state TEXT,
    dimensions TEXT,
    weight_per_unit TEXT,
    co2e_factor NUMERIC(8,4) DEFAULT 1.62 CONSTRAINT chk_listing_co2e CHECK (co2e_factor >= 0),
    estimated_co2e_savings NUMERIC(10,2),
    inspection_certificate TEXT,
    contamination_rate TEXT,
    pickup_type TEXT,
    description TEXT,
    status listing_status_enum DEFAULT 'Active',
    views_count INT DEFAULT 0 CONSTRAINT chk_views CHECK (views_count >= 0),
    requests_count INT DEFAULT 0 CONSTRAINT chk_requests CHECK (requests_count >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_avail_lte_total CHECK (available_quantity <= total_quantity)
);

-- 5. Listing Images Table
CREATE TABLE IF NOT EXISTS public.listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Material Requests / RFQs
CREATE TABLE IF NOT EXISTS public.material_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    seller_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    requested_quantity NUMERIC(12,2) NOT NULL CONSTRAINT chk_req_qty CHECK (requested_quantity > 0),
    unit TEXT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL CONSTRAINT chk_req_unit_price CHECK (unit_price >= 0),
    total_price NUMERIC(12,2) NOT NULL CONSTRAINT chk_req_total_price CHECK (total_price >= 0),
    pickup_date DATE,
    logistics_type TEXT,
    message TEXT,
    status request_status_enum DEFAULT 'Pending',
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT ('CE-2026-PO' || lpad(nextval('order_number_seq')::text, 6, '0')),
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    buyer_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    seller_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    quantity NUMERIC(12,2) NOT NULL CONSTRAINT chk_order_qty CHECK (quantity > 0),
    unit TEXT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL CONSTRAINT chk_order_price CHECK (unit_price >= 0),
    total_amount NUMERIC(12,2) NOT NULL CONSTRAINT chk_order_total CHECK (total_amount >= 0),
    currency TEXT DEFAULT 'USD',
    order_status order_status_enum DEFAULT 'Processing',
    payment_status payment_status_enum DEFAULT 'Escrow Held',
    logistics_type TEXT,
    co2e_avoided NUMERIC(10,2) CONSTRAINT chk_order_co2 CHECK (co2e_avoided >= 0),
    landfill_diverted NUMERIC(10,2) CONSTRAINT chk_order_landfill CHECK (landfill_diverted >= 0),
    estimated_delivery DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Order Timeline Table
CREATE TABLE IF NOT EXISTS public.order_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_code TEXT UNIQUE NOT NULL,
    buyer_company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    seller_company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    carrier_name TEXT,
    material_name TEXT NOT NULL,
    quantity NUMERIC(12,2) NOT NULL CONSTRAINT chk_shipment_qty CHECK (quantity > 0),
    unit TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    status shipment_status_enum DEFAULT 'Pickup Scheduled',
    eta DATE,
    distance_km NUMERIC(8,2) CONSTRAINT chk_shipment_dist CHECK (distance_km >= 0),
    est_hours NUMERIC(6,2) CONSTRAINT chk_shipment_hours CHECK (est_hours >= 0),
    est_cost_inr NUMERIC(12,2) CONSTRAINT chk_shipment_cost CHECK (est_cost_inr >= 0),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. B2B Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_a_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    participant_b_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_normalized_participants CHECK (participant_a_company_id < participant_b_company_id),
    CONSTRAINT unq_company_conversation UNIQUE (participant_a_company_id, participant_b_company_id)
);

-- 11. B2B Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Impact Summaries Table
CREATE TABLE IF NOT EXISTS public.impact_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    total_reused_tons NUMERIC(10,2) DEFAULT 0 CONSTRAINT chk_reused_tons CHECK (total_reused_tons >= 0),
    waste_diverted_tons NUMERIC(10,2) DEFAULT 0 CONSTRAINT chk_diverted_tons CHECK (waste_diverted_tons >= 0),
    co2_avoided_tons NUMERIC(10,2) DEFAULT 0 CONSTRAINT chk_co2_tons CHECK (co2_avoided_tons >= 0),
    business_savings_inr NUMERIC(14,2) DEFAULT 0 CONSTRAINT chk_savings CHECK (business_savings_inr >= 0),
    updated_at TIMESTAMPTZ DEFAULT now()
);
