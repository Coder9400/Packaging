# SYNAPSE — FINAL BACKEND ARCHITECTURE & DATABASE RECONCILIATION

**Project Name:** Synapse (Circular Exchange B2B Packaging & Material Network)  
**Date:** September 12, 2026  
**Target Architecture:** React/Vite Frontend $\rightarrow$ Express/Node.js REST API $\rightarrow$ Supabase (PostgreSQL, Supabase Auth, Supabase Storage)  

---

## A. FINAL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                   React / Vite Frontend                     │
│  (State managed in Contexts, delegating via src/services)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST Requests (JWT Bearer Header)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Node.js / Express Backend                  │
│ (Port 5000 | Auth Middleware | Express Controllers & Routes) │
└──────────────────────────────┬──────────────────────────────┘
                               │ Supabase JS Client / Service Role
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Platform                      │
│  ├── Supabase Auth (User credentials & JWT issuance)        │
│  ├── PostgreSQL Database (Authoritative data store & RLS)   │
│  └── Supabase Storage (Public bucket: listing-images)       │
└─────────────────────────────────────────────────────────────┘
```

- **Permanent Source of Truth:** Supabase PostgreSQL database.
- **Client Storage Policy:** Zero application data in browser `localStorage`. `localStorage` is used solely for standard UI layout toggles (e.g. dark mode, sidebar state).
- **Primary Keys:** Standard 128-bit PostgreSQL `UUID` (`gen_random_uuid()`) for all application tables. Fake timestamp string IDs (e.g., `mat_${Date.now()}`) are strictly prohibited.

---

## B. FINAL ENTITY MODEL

1. **`auth.users`** *(System)*: Native Supabase Auth table holding encrypted user credentials, email, and authentication metadata.
2. **`companies`**: B2B corporate enterprise / facility profile (Manufacturer, Recycler, Retailer, Logistics Provider).
3. **`profiles`**: User account details extending `auth.users`, linking a logged-in user to their `companies.id` via `profiles.company_id`.
4. **`ref_materials`**: Baseline reference material catalog containing standard material classifications, standard packaging specs, and default Scope 3 CO2e avoided factors (e.g., 1.62 t CO2e / ton recycled OCC).
5. **`listings`**: Active surplus packaging or material lots offered on the marketplace.
6. **`listing_images`**: Public photo attachments associated with a material listing.
7. **`material_requests`**: B2B purchase requests / RFQs submitted by buyer companies to seller companies.
8. **`orders`**: Formally executed commercial purchase orders with escrow tracking, final pricing, and environmental telemetry.
9. **`order_timeline`**: Milestone audit log tracking order lifecycle stages (Escrow Held, Logistics Picked Up, Inspection Passed, Escrow Disbursed).
10. **`shipments`**: Active freight tracking, carrier dispatch details, and transit metrics.
11. **`conversations`**: B2B chat thread metadata between two trading partner companies.
12. **`messages`**: Individual thread chat messages.
13. **`impact_summaries`**: Calculated or cached Scope 3 ESG circular metrics (reused tonnage, waste diverted, CO2e avoided, financial savings).

---

## C. FINAL DATABASE SCHEMA

### 1. DDL & Entity Specifications

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Definitions
CREATE TYPE business_type_enum AS ENUM ('Manufacturer', 'Packaging Recycler', 'Retailer', 'Logistics Provider');
CREATE TYPE material_condition_enum AS ENUM ('New', 'Good', 'Sorted & Baled', 'Regrind / Flake', 'Cleaned & Rinsed', 'Used');
CREATE TYPE listing_status_enum AS ENUM ('Active', 'Pending', 'Sold', 'Closed', 'Expired');
CREATE TYPE request_status_enum AS ENUM ('Pending', 'Accepted', 'Rejected');
CREATE TYPE order_status_enum AS ENUM ('Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled');
CREATE TYPE payment_status_enum AS ENUM ('Escrow Held', 'Disbursed', 'Refunded');
CREATE TYPE shipment_status_enum AS ENUM ('Pickup Scheduled', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered');

-- 1. Companies Table
CREATE TABLE public.companies (
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
    rating NUMERIC(3,2) DEFAULT 5.0,
    sustainability_score INT DEFAULT 90,
    diverted_tonnage NUMERIC(10,2) DEFAULT 0.0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
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
CREATE TABLE public.ref_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    default_unit TEXT DEFAULT 'kg',
    co2_factor_per_unit NUMERIC(8,4) DEFAULT 1.62,
    typical_contamination TEXT,
    recycling_process TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Listings Table (Marketplace Lots)
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    material_id UUID REFERENCES public.ref_materials(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    material_subtype TEXT,
    condition material_condition_enum NOT NULL DEFAULT 'Good',
    price_per_unit NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'ton',
    currency TEXT DEFAULT 'USD',
    total_quantity NUMERIC(12,2) NOT NULL,
    available_quantity NUMERIC(12,2) NOT NULL,
    min_order_quantity NUMERIC(12,2) DEFAULT 1.0,
    location TEXT,
    city TEXT,
    state TEXT,
    dimensions TEXT,
    weight_per_unit TEXT,
    co2e_factor NUMERIC(8,4) DEFAULT 1.62,
    estimated_co2e_savings NUMERIC(10,2),
    inspection_certificate TEXT,
    contamination_rate TEXT,
    pickup_type TEXT,
    description TEXT,
    status listing_status_enum DEFAULT 'Active',
    views_count INT DEFAULT 0,
    requests_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Listing Images Table
CREATE TABLE public.listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Material Requests / RFQs
CREATE TABLE public.material_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_company_id UUID NOT NULL REFERENCES public.companies(id),
    seller_company_id UUID NOT NULL REFERENCES public.companies(id),
    requested_quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    pickup_date DATE,
    logistics_type TEXT,
    message TEXT,
    status request_status_enum DEFAULT 'Pending',
    reject_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
    buyer_company_id UUID NOT NULL REFERENCES public.companies(id),
    seller_company_id UUID NOT NULL REFERENCES public.companies(id),
    quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    order_status order_status_enum DEFAULT 'Processing',
    payment_status payment_status_enum DEFAULT 'Escrow Held',
    logistics_type TEXT,
    co2e_avoided NUMERIC(10,2),
    landfill_diverted NUMERIC(10,2),
    estimated_delivery DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Order Timeline Table
CREATE TABLE public.order_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Shipments Table
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_code TEXT UNIQUE NOT NULL,
    buyer_company_id UUID REFERENCES public.companies(id),
    seller_company_id UUID REFERENCES public.companies(id),
    carrier_name TEXT,
    material_name TEXT NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    delivery_location TEXT NOT NULL,
    status shipment_status_enum DEFAULT 'Pickup Scheduled',
    eta DATE,
    distance_km NUMERIC(8,2),
    est_hours NUMERIC(6,2),
    est_cost_inr NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. B2B Conversations Table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_a_company_id UUID NOT NULL REFERENCES public.companies(id),
    participant_b_company_id UUID NOT NULL REFERENCES public.companies(id),
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. B2B Messages Table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_company_id UUID NOT NULL REFERENCES public.companies(id),
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Impact Summaries Table
CREATE TABLE public.impact_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
    total_reused_tons NUMERIC(10,2) DEFAULT 0,
    waste_diverted_tons NUMERIC(10,2) DEFAULT 0,
    co2_avoided_tons NUMERIC(10,2) DEFAULT 0,
    business_savings_inr NUMERIC(14,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. Indexes

```sql
CREATE INDEX idx_listings_company ON public.listings(company_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_category ON public.listings(category);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_company_id);
CREATE INDEX idx_orders_seller ON public.orders(seller_company_id);
CREATE INDEX idx_material_requests_buyer ON public.material_requests(buyer_company_id);
CREATE INDEX idx_material_requests_seller ON public.material_requests(seller_company_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_shipments_order ON public.shipments(order_id);
```

### 3. PostgreSQL Functions / RPCs (Atomic Transaction Handling)

```sql
CREATE OR REPLACE FUNCTION accept_material_request(p_request_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_req RECORD;
    v_listing RECORD;
    v_order_id UUID;
    v_order_num TEXT;
    v_co2_avoided NUMERIC;
BEGIN
    -- Select & lock request
    SELECT * INTO v_req FROM public.material_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request % not found', p_request_id;
    END IF;

    IF v_req.status != 'Pending' THEN
        RAISE EXCEPTION 'Request status must be Pending to accept';
    END IF;

    -- Select & lock listing
    SELECT * INTO v_listing FROM public.listings WHERE id = v_req.listing_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing % not found', v_req.listing_id;
    END IF;

    IF v_listing.available_quantity < v_req.requested_quantity THEN
        RAISE EXCEPTION 'Insufficient quantity available. Requested: %, Available: %', 
            v_req.requested_quantity, v_listing.available_quantity;
    END IF;

    -- Update request status
    UPDATE public.material_requests SET status = 'Accepted' WHERE id = p_request_id;

    -- Decrease listing available quantity
    UPDATE public.listings 
    SET available_quantity = available_quantity - v_req.requested_quantity,
        status = CASE WHEN (available_quantity - v_req.requested_quantity) <= 0 THEN 'Sold'::listing_status_enum ELSE status END
    WHERE id = v_req.listing_id;

    -- Generate order number & calculate CO2
    v_order_num := 'CE-2026-PO' || FLOOR(1000 + random() * 9000)::TEXT;
    v_co2_avoided := (v_req.requested_quantity * COALESCE(v_listing.co2e_factor, 1.62));

    -- Insert Order
    INSERT INTO public.orders (
        order_number, listing_id, buyer_company_id, seller_company_id,
        quantity, unit, unit_price, total_amount, currency,
        order_status, payment_status, logistics_type, co2e_avoided, landfill_diverted, estimated_delivery
    ) VALUES (
        v_order_num, v_req.listing_id, v_req.buyer_company_id, v_req.seller_company_id,
        v_req.requested_quantity, v_req.unit, v_req.unit_price, v_req.total_price, 'USD',
        'Processing', 'Escrow Held', v_req.logistics_type, v_co2_avoided, v_req.requested_quantity, CURRENT_DATE + INTERVAL '5 days'
    ) RETURNING id INTO v_order_id;

    -- Insert Order Timeline Initial Event
    INSERT INTO public.order_timeline (order_id, title, description, status, completed)
    VALUES 
    (v_order_id, 'Purchase Request Accepted', 'Seller accepted request. Escrow lock initialized.', 'Completed', true),
    (v_order_id, 'Escrow Funds Secured', 'Payment of $' || v_req.total_price || ' locked in escrow.', 'Processing', true);

    -- Create Shipment
    INSERT INTO public.shipments (
        order_id, tracking_code, buyer_company_id, seller_company_id, carrier_name,
        material_name, quantity, unit, pickup_location, delivery_location, status, eta
    ) VALUES (
        v_order_id, 'TRK-' || UPPER(SUBSTRING(v_order_id::text, 1, 8)),
        v_req.buyer_company_id, v_req.seller_company_id, 'EcoFreight Consolidated Lines',
        v_listing.title, v_req.requested_quantity, v_req.unit,
        COALESCE(v_listing.location, 'Seller Facility'), 'Buyer Distribution Center',
        'Pickup Scheduled', CURRENT_DATE + INTERVAL '5 days'
    );

    RETURN jsonb_build_object('success', true, 'order_id', v_order_id, 'order_number', v_order_num);
END;
$$ LANGUAGE plpgsql;
```

---

## D. FINAL API CONTRACT

| Service Method | HTTP Method | Express Endpoint | Request Body / Params | Auth Required | Response Shape | Supabase Tables / RPC Used |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `authService.login` | `POST` | `/api/auth/login` | `{ email, password }` | Public | `{ user, session, company }` | `auth.users`, `profiles`, `companies` |
| `authService.register` | `POST` | `/api/auth/register` | `{ companyName, email, password, businessType, location, fullName }` | Public | `{ user, session, company }` | `auth.users`, `companies`, `profiles` |
| `authService.getCurrentUser` | `GET` | `/api/auth/me` | None | Yes | `{ user, company }` | `profiles`, `companies` |
| `materialService.getMarketplaceMaterials` | `GET` | `/api/listings` | Query: `category`, `condition`, `search`, `minPrice`, `maxPrice` | Public | `{ listings: [...] }` | `listings`, `listing_images`, `companies` |
| `materialService.getMaterialById` | `GET` | `/api/listings/:id` | Param: `id` | Public | `{ listing: {...} }` | `listings`, `listing_images`, `companies` |
| `listingService.createListing` | `POST` | `/api/listings` | Multipart Form / JSON | Yes | `{ listing: {...} }` | `listings`, `listing_images` |
| `listingService.updateListing` | `PUT` | `/api/listings/:id` | Param: `id`, JSON body | Yes | `{ listing: {...} }` | `listings` |
| `listingService.updateListingStatus` | `PATCH` | `/api/listings/:id/status` | Param: `id`, `{ status }` | Yes | `{ listing: {...} }` | `listings` |
| `listingService.deleteListing` | `DELETE` | `/api/listings/:id` | Param: `id` | Yes | `{ message: "..." }` | `listings` |
| `listingService.uploadListingImage` | `POST` | `/api/listings/:id/images` | Multipart file field `'image'` | Yes | `{ image: {...} }` | `listing-images` Storage, `listing_images` Table |
| `requestService.getReceivedRequests` | `GET` | `/api/requests/received` | Query: `company_id` | Yes | `{ requests: [...] }` | `material_requests`, `listings`, `companies` |
| `requestService.getSentRequests` | `GET` | `/api/requests/sent` | Query: `company_id` | Yes | `{ requests: [...] }` | `material_requests`, `listings`, `companies` |
| `requestService.createRequest` | `POST` | `/api/requests` | Request payload | Yes | `{ request: {...} }` | `material_requests`, `listings` |
| `requestService.acceptRequest` | `PATCH` | `/api/requests/:id/accept` | Param: `id` | Yes | `{ success: true, order_id, order_number }` | RPC `accept_material_request` |
| `requestService.rejectRequest` | `PATCH` | `/api/requests/:id/reject` | Param: `id`, `{ reason }` | Yes | `{ request: {...} }` | `material_requests` |
| `orderService.getCompanyOrders` | `GET` | `/api/orders` | Query: `role` ('buyer'/'seller') | Yes | `{ orders: [...] }` | `orders`, `listings`, `companies` |
| `orderService.getOrderById` | `GET` | `/api/orders/:id` | Param: `id` | Yes | `{ order, timeline, shipment }` | `orders`, `order_timeline`, `shipments` |
| `orderService.createOrder` | `POST` | `/api/orders` | Order payload | Yes | `{ order: {...} }` | `orders`, `order_timeline` |
| `orderService.updateOrderStatus` | `PATCH` | `/api/orders/:id/status` | Param: `id`, `{ orderStatus, paymentStatus }` | Yes | `{ order: {...} }` | `orders` |
| `logisticsService.getActiveShipments` | `GET` | `/api/logistics/active` | Query: `company_id` | Yes | `{ shipments: [...] }` | `shipments` |
| `logisticsService.getCompletedShipments` | `GET` | `/api/logistics/completed` | Query: `company_id` | Yes | `{ shipments: [...] }` | `shipments` |
| `logisticsService.getRouteOptimizationData` | `GET` | `/api/logistics/optimization` | Query: `origin`, `destination` | Yes | `{ optimization: {...} }` | Express Dynamic Calculation |
| `logisticsService.updateShipmentStatus` | `PATCH` | `/api/logistics/shipments/:id/status` | Param: `id`, `{ status, eta }` | Yes | `{ shipment: {...} }` | `shipments` |
| `messageService.getConversations` | `GET` | `/api/messages/conversations` | None | Yes | `{ conversations: [...] }` | `conversations`, `companies` |
| `messageService.getMessages` | `GET` | `/api/messages/:conversationId` | Param: `conversationId` | Yes | `{ messages: [...] }` | `messages` |
| `messageService.sendMessage` | `POST` | `/api/messages` | `{ conversationId, text }` | Yes | `{ message: {...} }` | `messages`, `conversations` |
| `profileService.getCompanyProfile` | `GET` | `/api/profile/:companyId` | Param: `companyId` | Yes | `{ company: {...} }` | `companies` |
| `profileService.updateCompanyProfile` | `PUT` | `/api/profile/:companyId` | Param: `companyId`, body | Yes | `{ company: {...} }` | `companies` |
| `impactService.getImpactSummary` | `GET` | `/api/impact/summary` | Query: `company_id` | Yes | `{ metrics, reusedOverTime, materialsByCategory, wasteDivertedOverTime }` | Derived from `orders`, `shipments`, `listings` |

---

## E. AUTHENTICATION FLOW

```
React App Mounts
       ↓
Check Supabase Session (or local JWT storage)
       ↓
Include Authorization: Bearer <token> in API requests
       ↓
Express requireAuth Middleware
       ↓
Call supabase.auth.getUser(token)
       ↓
Fetch profile: SELECT company_id, is_admin FROM profiles WHERE id = user.id
       ↓
Attach req.user = { id: user.id, email: user.email, company_id: profile.company_id, is_admin: profile.is_admin }
       ↓
Proceed to Express Controller Handler
```

- **Credential Storage:** Passwords stored exclusively inside Supabase Auth. No raw passwords stored in application tables.
- **Session Identification:** Standardized on `profiles.company_id`. Old inconsistent `companies.user_id` is removed.

---

## F. AUTHORIZATION MODEL

1. **User Identity & Company Scope:**
   - Every protected route extracts `req.user.company_id`.
   - Operations modifying or querying company-scoped records verify `record.company_id === req.user.company_id` or `record.buyer_company_id === req.user.company_id || record.seller_company_id === req.user.company_id`.
2. **Admin Authorization:**
   - Identified via `profiles.is_admin === true` in database.
   - Checked via Express middleware `requireAdmin`:
     ```js
     export const requireAdmin = (req, res, next) => {
       if (!req.user || !req.user.is_admin) {
         return res.status(403).json({ error: 'Access denied: Admin privileges required' });
       }
       next();
     };
     ```

---

## G. RFQ $\rightarrow$ ORDER TRANSACTION DESIGN

The RFQ acceptance lifecycle is implemented atomically via PostgreSQL RPC `accept_material_request(p_request_id)`:

```
PATCH /api/requests/:id/accept
       ↓
Express Controller invokes supabase.rpc('accept_material_request', { p_request_id: req.params.id })
       ↓
PostgreSQL Atomic Function:
  1. Lock material_requests row (FOR UPDATE)
  2. Verify request status is 'Pending'
  3. Lock listings row (FOR UPDATE)
  4. Verify listing available_quantity >= requested_quantity
  5. Update request status to 'Accepted'
  6. Decrease listing available_quantity by requested_quantity (set status to 'Sold' if available_quantity == 0)
  7. Generate unique order number (e.g. CE-2026-PO8492)
  8. Insert row into orders table (payment_status: 'Escrow Held', order_status: 'Processing')
  9. Insert initial rows into order_timeline table
 10. Insert initial row into shipments table
       ↓
Returns { success: true, order_id, order_number }
```

---

## H. LOGISTICS DESIGN

- **`shipments` Table:** Authoritative entity for tracking active freight dispatches, tracking codes, carrier names, pickup/delivery locations, status, and ETAs.
- **Route Optimization Data:** Derived dynamically by Express API in `GET /api/logistics/optimization`. Calculates distance, estimated freight transit time, eco-routing emissions, and cost comparison without requiring a static or duplicated database table.

---

## I. MESSAGING DESIGN

- **`conversations` Table:** Stores thread headers between two companies (`participant_a_company_id`, `participant_b_company_id`), caching `last_message` and `last_message_at` for performance.
- **`messages` Table:** Stores individual thread history (`conversation_id`, `sender_company_id`, `text`, `created_at`).

---

## J. IMPACT ANALYTICS DESIGN

- **Aggregation Strategy:** Scope 3 ESG carbon telemetry (tons reused, CO2e avoided, waste diverted, financial savings) is calculated dynamically from completed `orders` and `listings` grouped by company:
  $$\text{CO2e Avoided} = \sum (\text{Order Quantity} \times \text{Material CO2e Factor})$$
- Time-series monthly trends (`reusedOverTime`, `wasteDivertedOverTime`) are computed via SQL aggregation functions on `orders.created_at`.

---

## K. STORAGE DESIGN

- **Supabase Storage Bucket:** `listing-images` (Public Read access).
- **Upload Path:** `listings/{listing_id}/{timestamp}_{filename}`.
- **Database Tracking:** Every upload inserts a public image URL into `listing_images` table (`id`, `listing_id`, `image_url`, `display_order`).

---

## L. FRONTEND MIGRATION MAP

| Frontend Service File | Current Mechanism | Required API Integration |
| :--- | :--- | :--- |
| `src/services/authService.js` | Direct Supabase / Mock | Call `apiClient` endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`) |
| `src/services/materialService.js` | Mock dataset / Direct Supabase | Call `apiClient` endpoints (`/api/listings`, `/api/listings/:id`) |
| `src/services/listingService.js` | Mock dataset / Direct Supabase | Call `apiClient` endpoints (`/api/listings`, `/api/listings/:id/images`) |
| `src/services/orderService.js` | Mock dataset / Direct Supabase | Call `apiClient` endpoints (`/api/orders`, `/api/orders/:id`) |
| `src/services/requestService.js` | Mock dataset / Direct Supabase | Call `apiClient` endpoints (`/api/requests`, `/api/requests/:id/accept`) |
| `src/services/logisticsService.js` | Mock dataset | Call `apiClient` endpoints (`/api/logistics/active`, `/api/logistics/completed`) |
| `src/services/messageService.js` | Mock dataset | Call `apiClient` endpoints (`/api/messages/conversations`, `/api/messages/:id`) |
| `src/services/profileService.js` | Mock dataset | Call `apiClient` endpoints (`/api/profile/:companyId`) |
| `src/services/impactService.js` | Mock dataset | Call `apiClient` endpoint (`/api/impact/summary`) |

---

## M. LOCALSTORAGE REMOVAL PLAN

| Key / Reference | Current Classification | Action |
| :--- | :--- | :--- |
| `circular_exchange_auth_user` | Application Auth Data | **REPLACE WITH SUPABASE AUTH SESSION** & `/api/auth/me` |
| `token` | Auth Bearer Token | **REPLACE WITH SUPABASE AUTH SESSION** |
| `circular_exchange_registered_users` | App Data | **REMOVE** (handled in Supabase Auth & PostgreSQL `profiles`) |
| `circular_exchange_listings` | App Data | **REMOVE** (fetched dynamically from `/api/listings`) |
| `circular_exchange_orders` | App Data | **REMOVE** (fetched dynamically from `/api/orders`) |
| `circular_exchange_requests` | App Data | **REMOVE** (fetched dynamically from `/api/requests`) |

---

## N. MOCK-DATA REMOVAL PLAN

The following pages currently import static fallback mock data from `src/data/*` and will be updated to fetch exclusively from Express API endpoints via context hooks:

1. `src/pages/Dashboard/DashboardPage.jsx`
2. `src/pages/Marketplace/MarketplacePage.jsx`
3. `src/pages/Marketplace/MaterialDetailPage.jsx`
4. `src/pages/Orders/RequestsPage.jsx`
5. `src/pages/Orders/OrderDetailPage.jsx`
6. `src/pages/Logistics/LogisticsPage.jsx`
7. `src/pages/Impact/ImpactPage.jsx`
8. `src/pages/Messages/MessagesPage.jsx`
9. `src/pages/Admin/AdminPage.jsx`

---

## O. SECURITY MODEL

1. **JWT Verification:** All protected routes run `requireAuth` middleware verifying tokens via `supabase.auth.getUser(token)`.
2. **Service Role Secret Safety:** `SUPABASE_SERVICE_ROLE_KEY` is maintained strictly within backend environment variables (`.env`). It is NEVER exposed to Vite frontend builds.
3. **CORS Policy:** Restricts access to authorized origin (`http://localhost:5173` in development).
4. **File Upload Restrictions:** Express `multer` middleware enforces maximum 5 MB limit and image MIME-type validation (`image/jpeg`, `image/png`, `image/webp`).

---

## P. MIGRATION SEQUENCE

1. **SQL DDL Execution:** Apply schema definitions (tables, indexes, RPC `accept_material_request`) to Supabase PostgreSQL database.
2. **Storage Setup:** Verify Supabase Storage bucket `listing-images` has public read access.
3. **Backend Express API Build:** Implement ES module Express controllers and routes in `backend/src/`.
4. **Frontend API Layer Refactoring:** Update `src/services/*` to send requests to Express API.
5. **LocalStorage & Mock Data Cleanup:** Remove local storage fallback logic in `AuthContext.jsx` & `MarketplaceContext.jsx`.
6. **E2E Verification:** Test registration, login, listing creation with image upload, RFQ submission, acceptance, order generation, and messaging.

---

## Q. TESTING STRATEGY

1. **Auth & Token Verification:** Verify `/api/auth/register`, `/api/auth/login`, and protected route rejection when token is missing or invalid.
2. **Atomic RFQ Acceptance Test:** Test calling `/api/requests/:id/accept` to verify:
   - Request status changes to `Accepted`
   - Listing `available_quantity` decreases correctly
   - Order, timeline, and shipment records are created in a single transaction
3. **Multipart Upload Test:** Verify photo upload to `/api/listings/:id/images` stores file in Supabase Storage and returns valid public URL.

---

## R. RISKS / UNRESOLVED QUESTIONS FOR HUMAN APPROVAL

1. **Supabase Email Confirmation:** Should email confirmation be required upon registration, or should users be auto-confirmed for testing?
2. **Initial Seed Data:** Should baseline reference materials (`ref_materials`) be seeded automatically during SQL setup?

---

ARCHITECTURE RECONCILIATION COMPLETE
