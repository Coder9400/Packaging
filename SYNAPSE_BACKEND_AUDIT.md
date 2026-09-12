# SYNAPSE FULL-STACK BACKEND & SCHEMA AUDIT REPORT

**Project Name:** Synapse (Circular Exchange B2B Packaging & Material Network)  
**Date:** September 12, 2026  
**Target Stack:** React + Vite Frontend $\rightarrow$ Express / Node.js Backend API $\rightarrow$ Supabase (PostgreSQL, Supabase Auth, Storage Bucket `listing-images`)  

---

## 1. Frontend Data Access Inventory

Every frontend service and context provider in `src/services/*` and `src/context/*` has been audited to map data targets, expected payloads, returned attributes, and execution paths:

| Service / Context Function | Target Table / Endpoint | Input Payload / Parameters | Returned Attributes / Objects | Data Source Type |
| :--- | :--- | :--- | :--- | :--- |
| `AuthContext.login` | Local state / `authService.login` | `email`, `password` | `{ user, company }` | `localStorage` + Mock Array |
| `AuthContext.register` | Local state / `authService.register` | `{ companyName, email, phone, password, businessType, location, contactName }` | `{ user, company }` | `localStorage` + Mock Array |
| `MarketplaceContext.addListing` | Local state | `newListing` object | Created listing object with `id: mat_${Date.now()}` | `localStorage` |
| `MarketplaceContext.addOrder` | Local state | `newOrder` object | Created order object with `id: ord_${Date.now()}` | `localStorage` |
| `MarketplaceContext.addRequest` | Local state | `newRequest` object | Created request object with `id: rfq_${Date.now()}` | `localStorage` |
| `authService.login` | Supabase `auth.signInWithPassword` & Table `companies` | `email`, `password` | `{ user, session, company }` | Direct Supabase Client / Mock Fallback |
| `authService.register` | Supabase `auth.signUp` & Table `companies` | Registration object | `{ user, company }` | Direct Supabase Client / Mock Fallback |
| `authService.resetPassword` | Supabase `auth.resetPasswordForEmail` | `email` | `{ success: true }` | Direct Supabase Client / Mock Fallback |
| `materialService.getMarketplaceMaterials` | Table `materials` joined with `companies` | `filters` (`category`, `condition`, `search`, `minPrice`, `maxPrice`) | Array of material listing objects | Direct Supabase Client / Mock Fallback |
| `materialService.getMaterialById` | Table `materials` | `id` | Single material object | Direct Supabase Client / Mock Fallback |
| `materialService.getCategories` | Table `material_categories` | None | Category metadata array | Direct Supabase Client / Mock Fallback |
| `materialService.getBaselineMaterials` | Table `ref_materials` | None | Reference material specs array | Direct Supabase Client / Mock Fallback |
| `listingService.getCompanyListings` | Table `materials` | `companyId` | Array of company listings | Direct Supabase Client / Mock Fallback |
| `listingService.createListing` | Table `materials` | Listing creation payload | Created listing object | Direct Supabase Client / Mock Fallback |
| `listingService.updateListing` | Table `materials` | `id`, `updates` | Updated listing object | Direct Supabase Client / Mock Fallback |
| `listingService.updateListingStatus` | Table `materials` | `id`, `status` | Updated status object | Direct Supabase Client / Mock Fallback |
| `listingService.deleteListing` | Table `materials` | `id` | Boolean success | Direct Supabase Client / Mock Fallback |
| `orderService.getCompanyOrders` | Table `orders` joined with `materials`, `companies` | `companyId`, `role` | Array of order objects | Direct Supabase Client / Mock Fallback |
| `orderService.getOrderById` | Table `orders` | `orderId` | Order object + timeline + ESG cert | Direct Supabase Client / Mock Fallback |
| `orderService.createOrder` | Table `orders` | Purchase order payload | Created order object | Direct Supabase Client / Mock Fallback |
| `orderService.updateOrderStatus` | Table `orders` | `orderId`, `orderStatus`, `paymentStatus` | Updated order status | Direct Supabase Client / Mock Fallback |
| `orderService.getOrderTimeline` | Table `order_timeline` | `orderId` | Timeline events array | Direct Supabase Client / Mock Fallback |
| `requestService.getReceivedRequests` | Table `material_requests` | `companyId` | Received requests array | Direct Supabase Client / Mock Fallback |
| `requestService.getSentRequests` | Table `material_requests` | `companyId` | Sent requests array | Direct Supabase Client / Mock Fallback |
| `requestService.createRequest` | Table `material_requests` | Request payload | Created request object | Direct Supabase Client / Mock Fallback |
| `requestService.acceptRequest` | Table `material_requests` | `requestId` | Updated request (`status: 'Accepted'`) | Direct Supabase Client / Mock Fallback |
| `requestService.rejectRequest` | Table `material_requests` | `requestId`, `reason` | Updated request (`status: 'Rejected'`) | Direct Supabase Client / Mock Fallback |
| `logisticsService.getActiveShipments` | Table `shipments` | `companyId` | Active shipments array | Direct Supabase Client / Mock Fallback |
| `logisticsService.getCompletedShipments` | Table `shipments` | `companyId` | Delivered shipments array | Direct Supabase Client / Mock Fallback |
| `logisticsService.getShipmentById` | Table `shipments` | `shipmentId` | Single shipment route object | Direct Supabase Client / Mock Fallback |
| `logisticsService.getRouteOptimizationData` | Table `route_optimizations` | `originCity`, `destinationCity` | Route optimization comparison | Direct Supabase Client / Mock Fallback |
| `logisticsService.updateShipmentStatus` | Table `shipments` | `shipmentId`, `status`, `eta` | Updated shipment object | Direct Supabase Client / Mock Fallback |
| `messageService.getConversations` | Table `conversations` | `companyId` | B2B conversations array | Direct Supabase Client / Mock Fallback |
| `messageService.getMessages` | Table `messages` | `conversationId` | Array of thread messages | Direct Supabase Client / Mock Fallback |
| `messageService.sendMessage` | Table `messages` & `conversations` | `conversationId`, `senderId`, `text` | Created message object | Direct Supabase Client / Mock Fallback |
| `messageService.createConversation` | Table `conversations` | `participantAId`, `participantBId`, `initialMessage` | Created conversation object | Direct Supabase Client / Mock Fallback |
| `profileService.getCompanyProfile` | Table `companies` | `companyId` | Company profile object | Direct Supabase Client / Mock Fallback |
| `profileService.updateCompanyProfile` | Table `companies` | `companyId`, `updates` | Updated company object | Direct Supabase Client / Mock Fallback |
| `impactService.getImpactMetrics` | Table `company_impact_summaries` | `companyId` | Scope 3 ESG metrics object | Direct Supabase Client / Mock Fallback |
| `impactService.getMaterialsReusedOverTime` | Table `impact_timeline_reused` | `companyId` | Monthly reuse array | Direct Supabase Client / Mock Fallback |
| `impactService.getMaterialsByCategory` | Table `impact_by_category` | `companyId` | Category tonnage breakdown | Direct Supabase Client / Mock Fallback |
| `impactService.getWasteDivertedOverTime` | Table `impact_timeline_diverted` | `companyId` | Monthly diversion array | Direct Supabase Client / Mock Fallback |
| `impactService.getImpactTransactions` | Table `impact_transactions` | `companyId` | Audit log transaction array | Direct Supabase Client / Mock Fallback |

---

## 2. State & Mock ID Contamination Audit

### A. LocalStorage Key Inventory
The following keys are stored in browser `localStorage`:

1. **`circular_exchange_auth_user`** (`src/context/AuthContext.jsx`)
   - Purpose: Cache authenticated user profile.
   - Initialized: On app mount.
   - Mutated: `login()`, `register()`, `switchUser()`.
   - Purged: `logout()`.
2. **`circular_exchange_auth_company`** (`src/context/AuthContext.jsx`)
   - Purpose: Cache user's company profile.
   - Initialized: On app mount.
   - Mutated: `login()`, `register()`, `switchUser()`.
   - Purged: `logout()`.
3. **`circular_exchange_registered_users`** (`src/context/AuthContext.jsx`)
   - Purpose: Store dynamically registered test users locally.
   - Mutated: `register()`.
4. **`circular_exchange_listings`** (`src/context/MarketplaceContext.jsx`)
   - Purpose: Persist marketplace material listings in browser memory.
   - Mutated: `addListing()`, `updateListing()`, `closeListing()`, `deleteListing()`.
5. **`circular_exchange_orders`** (`src/context/MarketplaceContext.jsx`)
   - Purpose: Persist order history in browser memory.
   - Mutated: `addOrder()`.
6. **`circular_exchange_requests`** (`src/context/MarketplaceContext.jsx`)
   - Purpose: Persist RFQs in browser memory.
   - Mutated: `addRequest()`.

### B. Simulated Primary Key Generators
The codebase relies on timestamp-string key generators that must be replaced by database-generated UUIDs (`gen_random_uuid()`):

* Listing IDs: `mat_${Date.now()}`
* Order IDs: `ord_${Date.now()}`
* Order Numbers: `CE-2026-PO${Math.floor(1000 + Math.random() * 9000)}`
* Request IDs: `rfq_${Date.now()}` or `req_${Date.now()}`
* Message IDs: `msg_${Date.now()}`
* Conversation IDs: `conv_${Date.now()}`
* Company IDs: `comp_${Date.now()}`
* User IDs: `usr_${Date.now()}` or `user_${Date.now()}`

### C. UI Components Relying on Mock Constants
* `DashboardPage.jsx`: Renders `MOCK_METRICS` and `MOCK_RECENT_ACTIVITY`.
* `MarketplacePage.jsx`: Falls back to context `listings` initialized from `MARKETPLACE_MATERIALS`.
* `MaterialDetailPage.jsx`: Reads `listings` array from context; falls back to static dataset.
* `RequestsPage.jsx`: Imports `MOCK_RECEIVED_REQUESTS` and `MOCK_SENT_REQUESTS`.
* `OrderDetailPage.jsx`: Imports `MOCK_ORDERS`, `MOCK_ORDER_TIMELINE`, and `MOCK_ESG_CERTIFICATE`.
* `LogisticsPage.jsx`: Imports `MOCK_ACTIVE_SHIPMENTS`, `MOCK_COMPLETED_SHIPMENTS`, and `MOCK_ROUTE_OPTIMIZATION`.
* `ImpactPage.jsx`: Imports `MOCK_IMPACT_METRICS`, `MOCK_MATERIALS_REUSED_OVER_TIME`, `MOCK_MATERIALS_BY_CATEGORY`, `MOCK_WASTE_DIVERTED_OVER_TIME`, `MOCK_IMPACT_TRANSACTIONS`.
* `MessagesPage.jsx`: Renders static `MOCK_CONVERSATIONS` array.
* `AdminPage.jsx`: Maintains local component state seeded with mock array data for businesses, listings, transactions, and reported items.

---

## 3. Schema & Data Model Mismatch Analysis

### Architectural Divergence
* **Frontend Expectation**: Treats a single table (`materials`) as the primary container containing title, category, price, available quantity, array of image URLs (`images`), condition, co2e factor, seller info, etc.
* **Backend Expectation (`backend/src/routes/listingRoutes.js`)**: Expects a normalized relational schema:
  - `companies` (id, name, business_type, city, state)
  - `materials` (id, name, category) — reference catalog
  - `listings` (id, company_id, material_id, title, description, quantity, unit, condition, price, price_unit, city, state, address, expires_at, status)
  - `listing_images` (id, listing_id, image_url, display_order)
  - `profiles` (id, company_id) — user account linked to Supabase Auth `auth.users(id)`.

### Definitive PostgreSQL Schema

To unify frontend and backend expectations into a single, production-grade schema without data loss:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE business_type_enum AS ENUM ('Manufacturer', 'Retailer', 'Packaging Recycler', 'Logistics Provider');
CREATE TYPE material_condition_enum AS ENUM ('New', 'Good', 'Used');
CREATE TYPE listing_status_enum AS ENUM ('Active', 'Pending', 'Sold', 'Closed', 'Expired');
CREATE TYPE request_status_enum AS ENUM ('Pending', 'Accepted', 'Rejected', 'Open');
CREATE TYPE order_status_enum AS ENUM ('Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled');
CREATE TYPE payment_status_enum AS ENUM ('Escrow Held', 'Disbursed', 'Refunded');
CREATE TYPE shipment_status_enum AS ENUM ('Pickup Scheduled', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered');

-- 1. Companies Table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type business_type_enum NOT NULL DEFAULT 'Manufacturer',
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    location TEXT,
    city TEXT,
    state TEXT,
    address TEXT,
    is_verified BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 5.0,
    sustainability_score INT DEFAULT 90,
    diverted_tonnage NUMERIC(10,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'Operations Lead',
    avatar_url TEXT,
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

-- 4. Listings Table (Unified Material Lots)
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.ref_materials(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    material_type TEXT NOT NULL DEFAULT 'Recyclable',
    material_subtype TEXT,
    condition material_condition_enum NOT NULL DEFAULT 'Good',
    price_per_unit NUMERIC(12,2) NOT NULL,
    price_unit TEXT NOT NULL DEFAULT 'kg',
    currency TEXT DEFAULT 'INR',
    total_quantity NUMERIC(12,2) NOT NULL,
    available_quantity NUMERIC(12,2) NOT NULL,
    min_order_quantity NUMERIC(12,2) DEFAULT 1.0,
    city TEXT,
    state TEXT,
    pickup_location TEXT,
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
    buyer_id UUID NOT NULL REFERENCES public.companies(id),
    seller_id UUID NOT NULL REFERENCES public.companies(id),
    quantity NUMERIC(12,2) NOT NULL,
    unit TEXT NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
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
    buyer_id UUID REFERENCES public.companies(id),
    seller_id UUID REFERENCES public.companies(id),
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
    participant_a_id UUID NOT NULL REFERENCES public.companies(id),
    participant_b_id UUID NOT NULL REFERENCES public.companies(id),
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

-- 12. Circular Impact Summaries Table
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

---

## 4. Route Coverage & API Delta

### Current Implemented Backend Endpoints vs. Frontend Requirements

| Endpoint | Status | Request Payload | Response Schema | Missing Elements / Required Fixes |
| :--- | :--- | :--- | :--- | :--- |
| `GET /` | Working | None | `{ message: "..." }` | Fix project name in message from "PeoplePay360" to "Synapse API" |
| `GET /api/health` | Working | None | `{ status: "ok", database: "..." }` | Validates DB connection |
| `POST /api/auth/login` | Working | `{ email, password }` | `{ user, access_token }` | Needs to return associated `company` object |
| `GET /api/auth/test` | Working | Bearer Token | `{ user_id }` | Test utility route |
| `GET /api/listings` | Mismatched | None | `{ listings: [...] }` | Must format joined `listing_images` into `images: []` array expected by frontend |
| `GET /api/listings/:id` | Mismatched | URL Param `:id` | `{ listing: {...} }` | Must flatten `listing_images` array for frontend consumption |
| `POST /api/listings` | Working | Listing JSON | `{ listing }` | Check `profiles` for `company_id` |
| `POST /api/listings/:id/images` | Working | Multipart `image` | `{ image }` | Uploads file to Supabase Storage bucket `listing-images` |

### Missing Express Backend Endpoints Required by Frontend Flows

1. **Authentication & Profile**:
   - `POST /api/auth/register` (Registers user in Supabase Auth & inserts `companies` + `profiles` records)
   - `GET /api/auth/me` (Returns logged-in user profile & company metadata)
   - `POST /api/auth/reset-password` (Triggers auth reset link)
2. **Listings Management**:
   - `PUT /api/listings/:id` (Edits existing material listing attributes)
   - `PATCH /api/listings/:id/status` (Toggles status between Active, Closed, Sold)
   - `DELETE /api/listings/:id` (Deletes material listing)
   - `GET /api/listings/my-listings` (Fetches listings owned by caller's company)
3. **Material Requests / RFQs**:
   - `GET /api/requests/received` (Fetches incoming inquiries for seller)
   - `GET /api/requests/sent` (Fetches sent RFQs for buyer)
   - `POST /api/requests` (Creates new purchase inquiry)
   - `PATCH /api/requests/:id/accept` (Accepts request & locks escrow)
   - `PATCH /api/requests/:id/reject` (Rejects request)
4. **Orders & Lifecycle**:
   - `GET /api/orders` (Fetches company purchase orders)
   - `GET /api/orders/:id` (Fetches order details, timeline, and ESG certificate)
   - `POST /api/orders` (Creates purchase order)
   - `PATCH /api/orders/:id/status` (Advances order lifecycle status)
5. **Logistics & Shipments**:
   - `GET /api/logistics/active` (Fetches active shipments)
   - `GET /api/logistics/completed` (Fetches completed deliveries)
   - `GET /api/logistics/optimization` (Fetches route optimization metrics)
   - `PATCH /api/logistics/shipments/:id/status` (Updates shipment status & ETA)
6. **Messaging**:
   - `GET /api/messages/conversations` (Fetches B2B conversation threads)
   - `GET /api/messages/:conversationId` (Fetches messages in thread)
   - `POST /api/messages` (Posts new chat message)
7. **Impact Analytics**:
   - `GET /api/impact/summary` (Fetches Scope 3 ESG carbon metrics & time-series data)
8. **Admin Operations**:
   - `GET /api/admin/metrics` (Fetches system KPIs)
   - `GET /api/admin/businesses` (Fetches business listings & statuses)
   - `PATCH /api/admin/businesses/:id/status` (Approves, rejects, or suspends business accounts)

---

## 5. Supabase Storage Integration Gap

### Client vs. Server Handler Audit
* **Client Handlers (`src/pages/Listings/ListMaterialPage.jsx`)**: Uses preset image URLs or `URL.createObjectURL(file)` to generate transient browser preview URLs, storing them as raw string arrays in component state.
* **Server Pipeline (`backend/src/routes/listingRoutes.js`)**:
  - Implements `multer.memoryStorage()` for file buffering.
  - Enforces 5 MB file size limit and image MIME-type validation.
  - Uploads file buffer to Supabase Storage bucket `listing-images` via `supabase.storage.from("listing-images").upload(...)`.
  - Generates public URL via `getPublicUrl(...)`.
  - Saves record in `listing_images` table (`id`, `listing_id`, `image_url`, `display_order`).

### Standard Multipart Upload Contract
To connect frontend image uploads directly to the backend storage pipeline:

```http
POST /api/listings/:id/images
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="image"; filename="batch_inspection_1.jpg"
Content-Type: image/jpeg

(binary file content)
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Expected JSON Response:**
```json
{
  "message": "Image uploaded successfully",
  "image": {
    "id": "e4b8a2c1-9d3f-4a5b-8c7e-1a2b3c4d5e6f",
    "listing_id": "b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "image_url": "https://<PROJECT_ID>.supabase.co/storage/v1/object/public/listing-images/b1a2c3d4.../1726123456789.jpg",
    "display_order": 0
  }
}
```

---

## 6. Actionable Non-Destructive Migration Roadmap

To transition Synapse from browser `localStorage` and direct mock data into a persistent `React Frontend -> Express Backend -> Supabase` architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    React / Vite Frontend                    │
│   (State managed via Context, calling src/services/api)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST Requests (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Node.js / Express Backend                 │
│  (Port 5000 | Auth Middleware | Express Controllers/Routes) │
└──────────────────────────────┬──────────────────────────────┘
                               │ Supabase JS Client / Service Role
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Platform                      │
│   ├── Auth (User authentication & JWT dispatch)             │
│   ├── PostgreSQL Database (Normalized tables & RLS)        │
│   └── Storage (Public bucket: listing-images)               │
└──────────────────────────────┴──────────────────────────────┘
```

### Phase 2: Database Migration & Schema Creation
1. Apply the complete non-destructive DDL migration (`001_initial_schema.sql`) to Supabase PostgreSQL database creating all 12 tables and ENUM types.
2. Ensure Supabase Storage bucket `listing-images` is created with public read permissions.
3. Seed `ref_materials` table with baseline material specifications (`src/data/materials.js`).

### Phase 3: Express Backend Route Expansion
1. Refactor `backend/src/routes/listingRoutes.js` to align listing payloads (joining `listing_images` into an array of string URLs).
2. Create `backend/src/routes/authRoutes.js` (implement `/register`, `/me`, `/reset-password`).
3. Create `backend/src/routes/orderRoutes.js` (implement GET, POST, PATCH orders & timelines).
4. Create `backend/src/routes/requestRoutes.js` (implement GET, POST, accept, reject RFQs).
5. Create `backend/src/routes/logisticsRoutes.js` (implement GET, PATCH shipments & route optimizations).
6. Create `backend/src/routes/messageRoutes.js` (implement GET, POST conversations & messages).
7. Create `backend/src/routes/profileRoutes.js` (implement GET, PUT company profiles).
8. Create `backend/src/routes/impactRoutes.js` (implement GET Scope 3 ESG carbon metrics).
9. Create `backend/src/routes/adminRoutes.js` (implement GET, PATCH admin metrics & moderation).
10. Register all routes in `backend/server.js` under `/api/*`.

### Phase 4: Frontend Centralized API Client Layer
1. Create `src/services/apiClient.js` implementing a unified `fetch` wrapper configured with `VITE_API_URL` (default `http://localhost:5000/api`).
2. Include automatic `Authorization: Bearer <token>` token injection from session storage.

### Phase 5: Refactoring Frontend Services
1. Update `src/services/authService.js`, `materialService.js`, `listingService.js`, `orderService.js`, `requestService.js`, `logisticsService.js`, `messageService.js`, `profileService.js`, `impactService.js` to delegate network requests to `apiClient.js` endpoints instead of querying Supabase directly or reading mock constants.

### Phase 6: Eliminating Browser LocalStorage & Context Refactoring
1. Remove `localStorage.getItem` and `localStorage.setItem` calls from `AuthContext.jsx` and `MarketplaceContext.jsx`.
2. Update contexts to fetch active user session, company profile, listings, orders, and requests dynamically from Express API routes upon application load.

### Phase 7: End-to-End Testing & Verification
1. Test facility registration, login, session persistence, and logout.
2. Test material listing creation with file upload to `listing-images` bucket.
3. Test purchase request submission, approval, order creation, logistics tracking, and messaging.
4. Run `npm run build` to verify clean compilation.

---
*Audit complete — waiting for approval.*
