# SUPABASE STORAGE BUCKET CONFIGURATION SETUP

**Platform:** Supabase Storage  
**Project:** Synapse B2B Circular Packaging & Material Network  

---

## 1. Storage Bucket Specifications

| Bucket Name | Visibility | Max File Size | Allowed MIME Types | Target Table / Column |
| :--- | :--- | :--- | :--- | :--- |
| `listing-images` | **Public** | **5 MB** | `image/jpeg`, `image/png`, `image/webp` | `listing_images.image_url` |

---

## 2. File Path & Naming Convention

All photographs uploaded for material listings MUST adhere to the following path structure:

```
listings/{listing_id}/{timestamp}_{sanitized_filename}
```

**Example Path:**
```
listings/b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/1726123456789_baled_occ_front.jpg
```

**Public Access URL Format:**
```
https://<PROJECT_ID>.supabase.co/storage/v1/object/public/listing-images/listings/{listing_id}/{timestamp}_{filename}
```

---

## 3. Storage Setup via Supabase Dashboard (Manual Steps)

1. Open your **Supabase Dashboard** $\rightarrow$ **Storage** $\rightarrow$ **Buckets**.
2. Click **New bucket**.
3. Set **Bucket Name**: `listing-images`.
4. Toggle **Public bucket**: `ON` (Allows direct HTTP GET access to listing photos without requiring signed URLs).
5. Set **File size limit**: `5242880` (5 MB).
6. Under **Allowed MIME types**, enter:
   - `image/jpeg`
   - `image/png`
   - `image/webp`
7. Click **Save bucket**.

---

## 4. Storage Access Security & RLS Policy

Since all uploads are routed through the Express Backend API using the `SUPABASE_SERVICE_ROLE_KEY`, the server bypasses client storage RLS restrictions.

For public read access by any frontend client:
- **Policy Name:** Public Read Access for Listing Images
- **Allowed Operations:** `SELECT`
- **Target Roles:** `anon`, `authenticated`
- **Definition:** `bucket_id = 'listing-images'`
