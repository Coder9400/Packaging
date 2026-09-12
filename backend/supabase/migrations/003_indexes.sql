-- ========================================================
-- MIGRATION 003: PERFORMANCE INDEXES & CONSTRAINTS
-- Synapse B2B Circular Packaging & Material Network
-- ========================================================

-- Listings Indexes (Marketplace Filtering & Sorting)
CREATE INDEX IF NOT EXISTS idx_listings_company_id ON public.listings(company_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_price ON public.listings(price_per_unit);

-- Listing Images Indexes
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id, display_order);

-- Material Requests / RFQs Indexes
CREATE INDEX IF NOT EXISTS idx_requests_buyer_company ON public.material_requests(buyer_company_id);
CREATE INDEX IF NOT EXISTS idx_requests_seller_company ON public.material_requests(seller_company_id);
CREATE INDEX IF NOT EXISTS idx_requests_listing_id ON public.material_requests(listing_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.material_requests(status);

-- Orders Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer_company ON public.orders(buyer_company_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_company ON public.orders(seller_company_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON public.orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Order Timeline Indexes
CREATE INDEX IF NOT EXISTS idx_order_timeline_order_id ON public.order_timeline(order_id);

-- Shipments Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_buyer_company ON public.shipments(buyer_company_id);
CREATE INDEX IF NOT EXISTS idx_shipments_seller_company ON public.shipments(seller_company_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);

-- Messaging Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant_a_company_id, participant_b_company_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id, created_at DESC);

-- Profiles & Companies Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);
