# SYNAPSE BACKEND ARCHITECTURE & DATA MODEL AUDIT PLAN

**Project Name:** Synapse (Circular Exchange B2B Packaging & Material Network)  
**Target Stack:** React + Vite Frontend $\rightarrow$ Express / Node.js Backend API $\rightarrow$ Supabase (Supabase Auth, PostgreSQL, Supabase Storage)  
**Date:** September 12, 2026  

---

## 1. FRONTEND DATA MODEL

The Synapse frontend (`src/pages/*`, `src/context/*`, `src/services/*`, `src/data/*`) operates around 12 primary domain entities required for full platform functionality:

1. **User Account (`User`)**: Authenticated facility representative or corporate administrator.
2. **Company / Facility (`Company`)**: B2B enterprise entity (Manufacturer, Recycler, Retailer, Logistics Provider) owning listings, orders, and ESG metrics.
3. **User Profile (`Profile`)**: User profile linking Supabase Auth `auth.users` to a specific `Company`.
4. **Reference Material Catalog (`RefMaterial`)**: Benchmark material taxonomy (e.g., OCC Cardboard, HDPE Regrind, Wooden GMA Pallets) with standard CO2e savings factors.
5. **Material Listing (`Listing`)**: Active surplus packaging or raw material lot offered on the marketplace.
6. **Listing Image (`ListingImage`)**: Photos associated with a material listing.
7. **Material Request / RFQ (`MaterialRequest`)**: B2B inquiry or purchase request submitted by a buyer to a seller for a specific listing.
8. **Purchase Order (`Order`)**: Confirmed commercial transaction with escrow status, tracking numbers, and compliance data.
9. **Order Timeline (`OrderTimeline`)**: Event log tracking milestone progress (Escrow Secured, Freight Picked Up, Quality Verified, Escrow Released).
10. **Shipment / Logistics (`Shipment`)**: Carrier shipment tracking, route metrics, and transit ETAs.
11. **B2B Conversation (`Conversation`)**: Messaging thread header between two trading partner companies.
12. **B2B Message (`Message`)**: Individual chat message within a conversation thread.
13. **Impact Summary (`ImpactSummary`)**: Aggregated Scope 3 ESG metrics (CO2e avoided, waste diverted, financial savings).

---

## 2. SUPABASE TABLE AUDIT

| Table Name | Frontend Reference | Status | Notes |
| :--- | :--- | :--- | :--- |
| `auth.users` | Supabase Auth | Confirmed (System) | Native Supabase Auth table for email/password credentials |
| `companies` | `profileService`, `mockData` | Unconfirmed / Needs Creation | Stores B2B company profile, sustainability score, rating |
| `profiles` | `authService`, `AuthContext` | Unconfirmed / Needs Creation | Maps `auth.users.id` to `companies.id` |
| `ref_materials` | `materialService`, `materials.js` | Unconfirmed / Needs Creation | Reference material specs & baseline carbon factors |
| `listings` | `listingService`, `materialService` | Unconfirmed / Needs Creation | Core marketplace inventory table |
| `listing_images` | `listingService` | Unconfirmed / Needs Creation | Holds public image URLs for listings |
| `material_requests` | `requestService`, `requestsAndOrders.js` | Unconfirmed / Needs Creation | RFQ and price negotiation records |
| `orders` | `orderService`, `requestsAndOrders.js` | Unconfirmed / Needs Creation | B2B orders with escrow & total amounts |
| `order_timeline` | `orderService`, `OrderDetailPage` | Unconfirmed / Needs Creation | Fulfillment milestone history per order |
| `shipments` | `logisticsService`, `logisticsData.js` | Unconfirmed / Needs Creation | Active freight tracking & distance metrics |
| `conversations` | `messageService`, `MessagesPage` | Unconfirmed / Needs Creation | Thread headers between buyer & seller companies |
| `messages` | `messageService`, `MessagesPage` | Unconfirmed / Needs Creation | Chat thread history |
| `impact_summaries` | `impactService`, `impactData.js` | Unconfirmed / Needs Creation | Scope 3 carbon reduction summaries |

---

## 3. REQUIRED COLUMNS

### 1. `companies`
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `type` (TEXT / ENUM: 'Manufacturer', 'Packaging Recycler', 'Retailer', 'Logistics Provider')
- `industry` (TEXT)
- `email` (TEXT, Unique, Required)
- `phone` (TEXT)
- `location` (TEXT)
- `address` (TEXT)
- `city` (TEXT)
- `state` (TEXT)
- `avatar_url` (TEXT)
- `is_verified` (BOOLEAN, Default: true)
- `rating` (NUMERIC(3,2), Default: 5.0)
- `sustainability_score` (INT, Default: 90)
- `diverted_tonnage` (NUMERIC(10,2), Default: 0.0)
- `description` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: now())

### 2. `profiles`
- `id` (UUID, Primary Key, References `auth.users(id)` ON DELETE CASCADE)
- `company_id` (UUID, References `companies(id)` ON DELETE SET NULL)
- `full_name` (TEXT, Required)
- `email` (TEXT, Unique, Required)
- `phone` (TEXT)
- `role` (TEXT, Default: 'Sustainability Director')
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: now())

### 3. `ref_materials`
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `category` (TEXT, Required)
- `default_unit` (TEXT, Default: 'kg')
- `co2_factor_per_unit` (NUMERIC(8,4), Default: 1.62)
- `typical_contamination` (TEXT)
- `recycling_process` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: now())

### 4. `listings`
- `id` (UUID, Primary Key)
- `company_id` (UUID, Required, References `companies(id)` ON DELETE CASCADE)
- `user_id` (UUID, References `auth.users(id)` ON DELETE SET NULL)
- `material_id` (UUID, References `ref_materials(id)` ON DELETE SET NULL)
- `title` (TEXT, Required)
- `category` (TEXT, Required)
- `material_subtype` (TEXT)
- `condition` (TEXT / ENUM: 'New', 'Good', 'Sorted & Baled', 'Regrind / Flake', 'Cleaned & Rinsed', 'Used')
- `price_per_unit` (NUMERIC(12,2), Required)
- `unit` (TEXT, Required, Default: 'ton')
- `currency` (TEXT, Default: 'USD')
- `total_quantity` (NUMERIC(12,2), Required)
- `available_quantity` (NUMERIC(12,2), Required)
- `min_order_quantity` (NUMERIC(12,2), Default: 1.0)
- `location` (TEXT)
- `city` (TEXT)
- `state` (TEXT)
- `dimensions` (TEXT)
- `weight_per_unit` (TEXT)
- `co2e_factor` (NUMERIC(8,4), Default: 1.62)
- `estimated_co2e_savings` (NUMERIC(10,2))
- `inspection_certificate` (TEXT)
- `contamination_rate` (TEXT)
- `pickup_type` (TEXT)
- `description` (TEXT)
- `status` (TEXT / ENUM: 'Active', 'Pending', 'Sold', 'Closed', 'Expired', Default: 'Active')
- `views_count` (INT, Default: 0)
- `requests_count` (INT, Default: 0)
- `created_at` (TIMESTAMPTZ, Default: now())

### 5. `listing_images`
- `id` (UUID, Primary Key)
- `listing_id` (UUID, Required, References `listings(id)` ON DELETE CASCADE)
- `image_url` (TEXT, Required)
- `display_order` (INT, Default: 0)
- `created_at` (TIMESTAMPTZ, Default: now())

### 6. `material_requests`
- `id` (UUID, Primary Key)
- `listing_id` (UUID, References `listings(id)` ON DELETE CASCADE)
- `buyer_company_id` (UUID, Required, References `companies(id)`)
- `seller_company_id` (UUID, Required, References `companies(id)`)
- `requested_quantity` (NUMERIC(12,2), Required)
- `unit` (TEXT, Required)
- `unit_price` (NUMERIC(12,2), Required)
- `total_price` (NUMERIC(12,2), Required)
- `pickup_date` (DATE)
- `logistics_type` (TEXT)
- `message` (TEXT)
- `status` (TEXT / ENUM: 'Pending', 'Accepted', 'Rejected', Default: 'Pending')
- `reject_reason` (TEXT)
- `created_at` (TIMESTAMPTZ, Default: now())

### 7. `orders`
- `id` (UUID, Primary Key)
- `order_number` (TEXT, Unique, Required)
- `listing_id` (UUID, References `listings(id)` ON DELETE SET NULL)
- `buyer_company_id` (UUID, Required, References `companies(id)`)
- `seller_company_id` (UUID, Required, References `companies(id)`)
- `quantity` (NUMERIC(12,2), Required)
- `unit` (TEXT, Required)
- `unit_price` (NUMERIC(12,2), Required)
- `total_amount` (NUMERIC(12,2), Required)
- `currency` (TEXT, Default: 'USD')
- `order_status` (TEXT / ENUM: 'Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled', Default: 'Processing')
- `payment_status` (TEXT / ENUM: 'Escrow Held', 'Disbursed', 'Refunded', Default: 'Escrow Held')
- `logistics_type` (TEXT)
- `co2e_avoided` (NUMERIC(10,2))
- `landfill_diverted` (NUMERIC(10,2))
- `estimated_delivery` (DATE)
- `created_at` (TIMESTAMPTZ, Default: now())

### 8. `order_timeline`
- `id` (UUID, Primary Key)
- `order_id` (UUID, Required, References `orders(id)` ON DELETE CASCADE)
- `title` (TEXT, Required)
- `description` (TEXT)
- `status` (TEXT)
- `completed` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMPTZ, Default: now())

### 9. `shipments`
- `id` (UUID, Primary Key)
- `order_id` (UUID, References `orders(id)` ON DELETE CASCADE)
- `tracking_code` (TEXT, Unique, Required)
- `buyer_company_id` (UUID, References `companies(id)`)
- `seller_company_id` (UUID, References `companies(id)`)
- `carrier_name` (TEXT)
- `material_name` (TEXT, Required)
- `quantity` (NUMERIC(12,2), Required)
- `unit` (TEXT, Required)
- `pickup_location` (TEXT, Required)
- `delivery_location` (TEXT, Required)
- `status` (TEXT / ENUM: 'Pickup Scheduled', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', Default: 'Pickup Scheduled')
- `eta` (DATE)
- `distance_km` (NUMERIC(8,2))
- `est_hours` (NUMERIC(6,2))
- `est_cost_inr` (NUMERIC(12,2))
- `created_at` (TIMESTAMPTZ, Default: now())

### 10. `conversations`
- `id` (UUID, Primary Key)
- `participant_a_company_id` (UUID, Required, References `companies(id)`)
- `participant_b_company_id` (UUID, Required, References `companies(id)`)
- `last_message` (TEXT)
- `last_message_at` (TIMESTAMPTZ, Default: now())
- `created_at` (TIMESTAMPTZ, Default: now())

### 11. `messages`
- `id` (UUID, Primary Key)
- `conversation_id` (UUID, Required, References `conversations(id)` ON DELETE CASCADE)
- `sender_company_id` (UUID, Required, References `companies(id)`)
- `text` (TEXT, Required)
- `created_at` (TIMESTAMPTZ, Default: now())

### 12. `impact_summaries`
- `id` (UUID, Primary Key)
- `company_id` (UUID, Unique, Required, References `companies(id)` ON DELETE CASCADE)
- `total_reused_tons` (NUMERIC(10,2), Default: 0)
- `waste_diverted_tons` (NUMERIC(10,2), Default: 0)
- `co2_avoided_tons` (NUMERIC(10,2), Default: 0)
- `business_savings_inr` (NUMERIC(14,2), Default: 0)
- `updated_at` (TIMESTAMPTZ, Default: now())

---

## 4. RELATIONSHIPS

- **`profiles.id` $\rightarrow$ `auth.users.id`** (1:1 link between Supabase Auth credentials and app user profile)
- **`profiles.company_id` $\rightarrow$ `companies.id`** (N:1 link associating employee to enterprise facility)
- **`listings.company_id` $\rightarrow$ `companies.id`** (N:1 link enforcing seller ownership)
- **`listings.material_id` $\rightarrow$ `ref_materials.id`** (N:1 optional reference catalog classification)
- **`listing_images.listing_id` $\rightarrow$ `listings.id`** (1:N listing photo attachment cascade)
- **`material_requests.listing_id` $\rightarrow$ `listings.id`** (N:1 RFQ link to targeted material lot)
- **`material_requests.buyer_company_id` $\rightarrow$ `companies.id`** & **`seller_company_id` $\rightarrow$ `companies.id`** (B2B request participants)
- **`orders.buyer_company_id` $\rightarrow$ `companies.id`** & **`seller_company_id` $\rightarrow$ `companies.id`** (B2B order contract)
- **`order_timeline.order_id` $\rightarrow$ `orders.id`** (Milestone progression history)
- **`shipments.order_id` $\rightarrow$ `orders.id`** (Logistics shipment contract)
- **`conversations.participant_a_company_id` / `participant_b_company_id` $\rightarrow$ `companies.id`** (B2B chat thread metadata)
- **`messages.conversation_id` $\rightarrow$ `conversations.id`** (Message thread sequence)
- **`impact_summaries.company_id` $\rightarrow$ `companies.id`** (1:1 facility circular metric summary)

---

## 5. STORAGE

Supabase Storage buckets required for file management:

1. **`listing-images`**:
   - **Public Access**: Enabled (Public Read)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
   - **File Size Limit**: 5 MB per image
   - **Path Pattern**: `listings/{listing_id}/{timestamp}_{filename}`
   - **Purpose**: Material listing photographs uploaded during listing creation.

2. **`company-avatars`**:
   - **Public Access**: Enabled (Public Read)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/svg+xml`, `image/webp`
   - **File Size Limit**: 2 MB per avatar
   - **Path Pattern**: `avatars/{company_id}/{timestamp}_{filename}`
   - **Purpose**: Company logo and user avatar upload management.

3. **`compliance-documents`**:
   - **Public Access**: Disabled (Authenticated Read Only)
   - **Allowed MIME types**: `application/pdf`, `image/jpeg`, `image/png`
   - **File Size Limit**: 10 MB per document
   - **Path Pattern**: `documents/{order_id}/{document_type}_{filename}`
   - **Purpose**: Inspection certificates, lab test reports (`CERT-OCC-2026-881`), and ESG compliance PDFs.

---

## 6. CURRENT LOCALSTORAGE USAGE

### Application Data (MUST Move to Supabase Database & Auth Session)
- **`circular_exchange_auth_user`** (`src/context/AuthContext.jsx`, `src/services/apiClient.js`):
  - *Current usage*: Caches full user profile, company profile, and mock session object.
  - *Target replacement*: Supabase Auth session token (`access_token`) stored securely or managed via HTTP headers, querying `/api/auth/me` on startup.
- **`token`** (`src/services/api.js`):
  - *Current usage*: Caches JWT bearer token string.
  - *Target replacement*: Express session / JWT validation against Supabase Auth.

### Harmless UI Preferences (May Remain Local)
- Active dark/light theme state (`class="dark"` on `<html>`).
- Local UI table sorting, column visibility, and filter drawer open/closed state.
- Unsaved draft inputs in list creation forms prior to submission.

---

## 7. FRONTEND/BACKEND CONTRACT

The Express backend API exposed under `/api/*` will handle all data operations for the frontend:

### Authentication & Profile
- `POST /api/auth/register` $\rightarrow$ Registers new user in Supabase Auth & creates `companies` + `profiles` records.
- `POST /api/auth/login` $\rightarrow$ Authenticates with Supabase Auth (`signInWithPassword`) and returns JWT token & user/company metadata.
- `GET /api/auth/me` $\rightarrow$ Returns active authenticated user profile & linked company.
- `POST /api/auth/logout` $\rightarrow$ Revokes session in Supabase Auth.
- `POST /api/auth/reset-password` $\rightarrow$ Sends password reset email via Supabase Auth.
- `GET /api/profile/:companyId` $\rightarrow$ Fetches company facility details, rating, & sustainability score.
- `PUT /api/profile/:companyId` $\rightarrow$ Updates company facility details (address, description, contact info).

### Reference Materials Catalog
- `GET /api/materials/categories` $\rightarrow$ Returns material category list & active counts.
- `GET /api/materials/baseline` $\rightarrow$ Returns reference material benchmarks (`ref_materials`).

### Listings Management
- `GET /api/listings` $\rightarrow$ Returns marketplace material listings (supports filter parameters: `category`, `condition`, `search`, `minPrice`, `maxPrice`).
- `GET /api/listings/:id` $\rightarrow$ Returns single listing detail joined with `listing_images` and seller `companies` record.
- `POST /api/listings` $\rightarrow$ Creates new material listing record.
- `PUT /api/listings/:id` $\rightarrow$ Updates existing material listing details.
- `PATCH /api/listings/:id/status` $\rightarrow$ Toggles listing status (`Active`, `Closed`, `Sold`).
- `DELETE /api/listings/:id` $\rightarrow$ Deletes/decommissions listing.
- `POST /api/listings/:id/images` $\rightarrow$ Handles multipart file upload, uploads file buffer to Supabase Storage bucket `listing-images`, and inserts record into `listing_images`.
- `GET /api/listings/my-listings` $\rightarrow$ Fetches listings owned by caller's company.

### Material Requests / RFQs
- `GET /api/requests/received` $\rightarrow$ Fetches incoming inquiries received by seller facility.
- `GET /api/requests/sent` $\rightarrow$ Fetches sent purchase RFQs submitted by buyer facility.
- `POST /api/requests` $\rightarrow$ Submits new purchase request / RFQ.
- `PATCH /api/requests/:id/accept` $\rightarrow$ Accepts request and initializes escrow order creation.
- `PATCH /api/requests/:id/reject` $\rightarrow$ Declines request with optional rejection reason.

### Orders & Lifecycle Management
- `GET /api/orders` $\rightarrow$ Returns B2B orders associated with caller's company (buyer or seller).
- `GET /api/orders/:id` $\rightarrow$ Returns single order details, `order_timeline`, and ESG certificate metrics.
- `POST /api/orders` $\rightarrow$ Creates purchase order from an accepted RFQ or direct buyout.
- `PATCH /api/orders/:id/status` $\rightarrow$ Advances order status (`Processing` $\rightarrow$ `In Transit` $\rightarrow$ `Delivered`) and payment status (`Escrow Held` $\rightarrow$ `Disbursed`).

### Logistics & Shipments
- `GET /api/logistics/active` $\rightarrow$ Returns active freight shipments.
- `GET /api/logistics/completed` $\rightarrow$ Returns delivered shipments history.
- `GET /api/logistics/optimization` $\rightarrow$ Returns route comparison metrics (origin, destination, distance, CO2 savings).
- `PATCH /api/logistics/shipments/:id/status` $\rightarrow$ Updates shipment tracking status and ETA.

### B2B Messaging
- `GET /api/messages/conversations` $\rightarrow$ Returns active chat threads for caller's company.
- `GET /api/messages/:conversationId` $\rightarrow$ Returns message history for thread.
- `POST /api/messages` $\rightarrow$ Sends chat message in thread (updates `conversations.last_message`).

### Impact & ESG Analytics
- `GET /api/impact/summary` $\rightarrow$ Computes & returns Scope 3 ESG metrics (reused tonnage, CO2e avoided, time-series data).

### Administration & Moderation
- `GET /api/admin/metrics` $\rightarrow$ Returns platform system KPIs.
- `GET /api/admin/businesses` $\rightarrow$ Returns enterprise business accounts list.
- `PATCH /api/admin/businesses/:id/status` $\rightarrow$ Approves or suspends enterprise accounts.

---

## 8. SECURITY

1. **Supabase Auth Integration**:
   - Authentication will be handled exclusively via Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`).
   - The Express backend validates incoming JWT access tokens sent in the `Authorization: Bearer <token>` header using `supabase.auth.getUser(token)`.
2. **Identification of Authenticated Users**:
   - The `requireAuth` Express middleware verifies the token and attaches `req.user = user` to the request context.
   - The caller's `company_id` is fetched from `public.profiles` matching `user.id`.
3. **Company Ownership Enforcement**:
   - All write/update/delete operations (`PUT /api/listings/:id`, `DELETE /api/listings/:id`, `PATCH /api/requests/:id/accept`) verify that `existing_record.company_id === req.user.company_id`.
   - Unauthorized attempts return `403 Forbidden`.
4. **Service Role Key Boundaries**:
   - `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to the Express backend `.env` file and server runtime.
   - It is used only by Express for administrative tasks or bypassing Row Level Security (RLS) when necessary.
5. **Secret Hygiene**:
   - `SUPABASE_SERVICE_ROLE_KEY`, database passwords, and JWT secret keys MUST NEVER be exposed to the React/Vite frontend bundle.
   - Frontend accesses ONLY public `VITE_API_URL`.

---

## 9. DATA PERSISTENCE

Step-by-step persistence flows for core operations:

1. **Facility Registration**:
   `React Register Form` $\rightarrow$ `POST /api/auth/register` $\rightarrow$ Express calls `supabase.auth.signUp()` $\rightarrow$ Inserts record in `companies` $\rightarrow$ Inserts record in `profiles` linking `company_id` & `user.id` $\rightarrow$ Returns user session & company profile to React.

2. **Listing Creation with Photo Upload**:
   `React List Material Page` $\rightarrow$ Calls `POST /api/listings` (multipart form-data) $\rightarrow$ Express `upload` middleware buffers file $\rightarrow$ Express inserts listing record into `listings` table $\rightarrow$ Express uploads file buffer to Supabase Storage `listing-images` bucket $\rightarrow$ Express inserts public URL into `listing_images` table $\rightarrow$ Returns complete created listing object to React.

3. **Purchase Request (RFQ) Submission**:
   `React Material Detail Page` $\rightarrow$ Calls `POST /api/requests` $\rightarrow$ Express inserts record into `material_requests` with `status: 'Pending'` $\rightarrow$ Express updates `listings.requests_count` $\rightarrow$ Returns created request record.

4. **RFQ Acceptance & Order Escrow Lock**:
   `React Requests Page` $\rightarrow$ Calls `PATCH /api/requests/:id/accept` $\rightarrow$ Express updates `material_requests.status = 'Accepted'` $\rightarrow$ Express inserts record into `orders` with `payment_status: 'Escrow Held'` $\rightarrow$ Express creates initial `order_timeline` record ("Escrow Funds Secured") $\rightarrow$ Express creates `shipments` record $\rightarrow$ Returns updated request & created order object.

5. **Real-time Messaging**:
   `React Messages Page` $\rightarrow$ Calls `POST /api/messages` $\rightarrow$ Express inserts record into `messages` table $\rightarrow$ Express updates `conversations.last_message` and `last_message_at` $\rightarrow$ Returns posted message object.

---

## 10. MIGRATION/REUSE DECISION

| Supabase Table | Decision | Detailed Action Plan |
| :--- | :--- | :--- |
| `auth.users` | **KEEP** | Standard Supabase Auth credentials table. Preserved without modification. |
| `companies` | **CREATE** | Primary B2B enterprise entity table storing corporate details and sustainability metrics. |
| `profiles` | **CREATE** | User account extension table linking Supabase Auth `auth.users.id` to `companies.id`. |
| `ref_materials` | **CREATE** | Reference catalog table seeded with standard material taxonomy and CO2e conversion metrics. |
| `listings` | **CREATE** | Material lots table storing title, category, quantity, pricing, condition, and status. |
| `listing_images` | **CREATE** | Image attachment table storing public URLs and display ordering for listings. |
| `material_requests` | **CREATE** | RFQ table tracking negotiation status between buyer and seller facilities. |
| `orders` | **CREATE** | Commercial transaction table managing order status, escrow state, and compliance numbers. |
| `order_timeline` | **CREATE** | Milestone audit log tracking step-by-step progress per order. |
| `shipments` | **CREATE** | Freight dispatch and route tracking table. |
| `conversations` | **CREATE** | B2B chat thread metadata header table. |
| `messages` | **CREATE** | Individual chat thread message table. |
| `impact_summaries` | **CREATE** | ESG Scope 3 aggregated carbon metrics summary table. |

---

AUDIT COMPLETE — WAITING FOR BACKEND IMPLEMENTATION
