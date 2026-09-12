# SYNAPSE SUPABASE MIGRATION & DATABASE GUIDE

**Project:** Synapse (Circular Exchange B2B Packaging & Material Network)  
**Database:** Supabase PostgreSQL  
**Directory:** `backend/supabase/`  

---

## 1. Migration Execution Order

Migrations MUST be executed in exact sequential order in the **Supabase Dashboard SQL Editor**:

| Step | File | Description / Purpose |
| :--- | :--- | :--- |
| **1** | [`migrations/001_initial_schema.sql`](file:///c:/Users/Pratham/Desktop/Synapse/backend/supabase/migrations/001_initial_schema.sql) | Creates all 7 ENUM types, `order_number_seq` sequence, and 12 relational core tables with CHECK constraints. |
| **2** | [`migrations/002_functions.sql`](file:///c:/Users/Pratham/Desktop/Synapse/backend/supabase/migrations/002_functions.sql) | Creates the atomic `accept_material_request` stored procedure with seller security verification. |
| **3** | [`migrations/003_indexes.sql`](file:///c:/Users/Pratham/Desktop/Synapse/backend/supabase/migrations/003_indexes.sql) | Creates performance B-Tree indexes across all foreign keys, status flags, and timestamps. |
| **4** | [`migrations/004_seed_reference_materials.sql`](file:///c:/Users/Pratham/Desktop/Synapse/backend/supabase/migrations/004_seed_reference_materials.sql) | Seeds 10 benchmark reference materials and Scope 3 CO2e avoided conversion metrics. |

---

## 2. Summary of Created Database Objects

### Relational Tables (12 Total)
1. **`companies`**: B2B enterprise / facility entity profile.
2. **`profiles`**: User profile extending Supabase Auth `auth.users(id)`, mapping to `company_id`.
3. **`ref_materials`**: Benchmark material taxonomy and CO2e avoided conversion benchmarks.
4. **`listings`**: Active marketplace material lots.
5. **`listing_images`**: Public photo attachments for listings.
6. **`material_requests`**: B2B purchase requests / RFQs.
7. **`orders`**: Formally executed commercial purchase orders with escrow tracking and sequential order numbers (`CE-2026-PO000001`).
8. **`order_timeline`**: Milestone progress audit log per order.
9. **`shipments`**: Active freight tracking, carrier dispatches, and transit metrics.
10. **`conversations`**: B2B chat thread metadata header enforcing normalized participant ID ordering (`participant_a_company_id < participant_b_company_id`).
11. **`messages`**: Thread chat message history.
12. **`impact_summaries`**: Aggregated circular ESG metrics per company.

### Stored Functions / RPC (1 Total)
- **`accept_material_request(p_request_id UUID, p_seller_company_id UUID)`**:
  - Validates caller seller company authorization (`seller_company_id == p_seller_company_id`).
  - Atomically locks request and listing rows (`FOR UPDATE`).
  - Verifies available inventory.
  - Updates request status to `Accepted`.
  - Decreases listing available quantity (marks `Sold` if zero).
  - Inserts order record with unique `CE-2026-PO00000X` order number.
  - Inserts timeline events and shipment dispatch records.

---

## 3. Storage Setup Notes

Refer to [`STORAGE_SETUP.md`](file:///c:/Users/Pratham/Desktop/Synapse/backend/supabase/STORAGE_SETUP.md) for manual creation of the `listing-images` bucket (Public Read, 5 MB file size limit, JPEG/PNG/WebP).

---

## 4. RLS & Security Architecture

- The Node.js Express backend API uses the `SUPABASE_SERVICE_ROLE_KEY` to perform authorized database operations on behalf of validated JWT users.
- The `SUPABASE_SERVICE_ROLE_KEY` is maintained strictly inside `backend/.env` and is NEVER exposed to client browser builds.
- Seller authorization checks (e.g. verifying that only the seller company can accept an RFQ or delete a listing) are enforced in both Express middleware and the `accept_material_request` PostgreSQL RPC function.

---

## 5. How to Run Migrations Manually in Supabase

1. Log into your **Supabase Dashboard** $\rightarrow$ Select project.
2. Click **SQL Editor** in the left sidebar.
3. Click **New Query**.
4. Open each migration file in order (`001`, `002`, `003`, `004`), copy contents into the editor, and click **RUN**.
5. Open [`verify_schema.sql`](file:///c:/Users/Pratham/Desktop/Synapse/backend/supabase/verify_schema.sql), paste into SQL Editor, and click **RUN** to verify that all 12 tables, indexes, RPC, and seed data exist.

---

## 6. Rollback Considerations

These migrations are non-destructive and use `IF NOT EXISTS` / `CREATE OR REPLACE` clauses. No existing data is deleted or altered. In the event a full reset is needed during development, table teardown should be performed in reverse foreign-key order:
```sql
DROP FUNCTION IF EXISTS accept_material_request(UUID, UUID);
DROP TABLE IF EXISTS impact_summaries, messages, conversations, shipments, order_timeline, orders, material_requests, listing_images, listings, ref_materials, profiles, companies CASCADE;
DROP SEQUENCE IF EXISTS order_number_seq;
```
