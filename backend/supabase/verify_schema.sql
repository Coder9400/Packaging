-- ========================================================
-- SCHEMA VERIFICATION SCRIPT (READ-ONLY DIAGNOSTIC)
-- Synapse B2B Circular Packaging & Material Network
-- ========================================================

-- 1. Check Table Existence
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'companies', 'profiles', 'ref_materials', 'listings', 'listing_images',
    'material_requests', 'orders', 'order_timeline', 'shipments', 
    'conversations', 'messages', 'impact_summaries'
  )
ORDER BY table_name;

-- 2. Check Custom ENUM Types
SELECT typname, enumlabel 
FROM pg_enum 
JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
WHERE typname IN (
    'business_type_enum', 'material_condition_enum', 'listing_status_enum',
    'request_status_enum', 'order_status_enum', 'payment_status_enum', 'shipment_status_enum'
)
ORDER BY typname, enumsortorder;

-- 3. Check Order Sequence Existence
SELECT sequence_name, data_type, start_value, minimum_value, increment
FROM information_schema.sequences 
WHERE sequence_schema = 'public' AND sequence_name = 'order_number_seq';

-- 4. Check RPC Stored Function Existence
SELECT routine_name, routine_type, data_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name = 'accept_material_request';

-- 5. Check Foreign Key Constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 6. Check Custom Indexes
SELECT tablename, indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 7. Verify Seed Data Count
SELECT COUNT(*) AS ref_materials_count FROM public.ref_materials;
