-- ========================================================
-- MIGRATION 002: STORED PROCEDURES & ATOMIC TRANSACTIONS
-- Synapse B2B Circular Packaging & Material Network
-- ========================================================

/**
 * Accepts a material purchase request (RFQ) and generates a B2B Purchase Order.
 * Security: Validates that p_seller_company_id matches the seller_company_id of the request.
 * Atomicity: Locks request and listing rows, updates inventory, creates order, timeline events, and shipment in a single transaction.
 */
CREATE OR REPLACE FUNCTION accept_material_request(
    p_request_id UUID,
    p_seller_company_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_req RECORD;
    v_listing RECORD;
    v_order_id UUID;
    v_order_num TEXT;
    v_co2_avoided NUMERIC;
    v_tracking_code TEXT;
BEGIN
    -- 1. Select & lock material request
    SELECT * INTO v_req FROM public.material_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Material request % not found', p_request_id;
    END IF;

    -- 2. Security authorization check: Verify caller's company is the designated seller
    IF v_req.seller_company_id != p_seller_company_id THEN
        RAISE EXCEPTION 'Unauthorized: Only the designated seller company can accept this request';
    END IF;

    -- 3. Verify request is in Pending status
    IF v_req.status != 'Pending' THEN
        RAISE EXCEPTION 'Invalid request status: %. Only Pending requests can be accepted', v_req.status;
    END IF;

    -- 4. Select & lock target listing
    SELECT * INTO v_listing FROM public.listings WHERE id = v_req.listing_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Associated material listing % not found', v_req.listing_id;
    END IF;

    -- 5. Verify listing inventory sufficiency
    IF v_listing.available_quantity < v_req.requested_quantity THEN
        RAISE EXCEPTION 'Insufficient quantity available. Requested: %, Available: %', 
            v_req.requested_quantity, v_listing.available_quantity;
    END IF;

    -- 6. Update request status to Accepted
    UPDATE public.material_requests 
    SET status = 'Accepted' 
    WHERE id = p_request_id;

    -- 7. Decrease listing available quantity and update status if fully sold
    UPDATE public.listings 
    SET available_quantity = available_quantity - v_req.requested_quantity,
        status = CASE 
            WHEN (available_quantity - v_req.requested_quantity) <= 0 THEN 'Sold'::listing_status_enum 
            ELSE status 
        END
    WHERE id = v_req.listing_id;

    -- 8. Generate sequence-based order number & calculate CO2 avoided
    v_order_num := 'CE-2026-PO' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    v_co2_avoided := (v_req.requested_quantity * COALESCE(v_listing.co2e_factor, 1.62));

    -- 9. Create B2B Purchase Order
    INSERT INTO public.orders (
        order_number,
        listing_id,
        buyer_company_id,
        seller_company_id,
        quantity,
        unit,
        unit_price,
        total_amount,
        currency,
        order_status,
        payment_status,
        logistics_type,
        co2e_avoided,
        landfill_diverted,
        estimated_delivery
    ) VALUES (
        v_order_num,
        v_req.listing_id,
        v_req.buyer_company_id,
        v_req.seller_company_id,
        v_req.requested_quantity,
        v_req.unit,
        v_req.unit_price,
        v_req.total_price,
        'USD',
        'Processing',
        'Escrow Held',
        COALESCE(v_req.logistics_type, 'Standard Freight'),
        v_co2_avoided,
        v_req.requested_quantity,
        CURRENT_DATE + INTERVAL '5 days'
    ) RETURNING id INTO v_order_id;

    -- 10. Create Order Timeline Milestones
    INSERT INTO public.order_timeline (order_id, title, description, status, completed)
    VALUES 
    (v_order_id, 'Purchase Request Accepted', 'Seller accepted RFQ request. Escrow lock initialized.', 'Completed', true),
    (v_order_id, 'Escrow Funds Secured', 'Payment of $' || v_req.total_price || ' locked in escrow.', 'Processing', true);

    -- 11. Create Shipment Record
    v_tracking_code := 'TRK-' || UPPER(SUBSTRING(v_order_id::text FROM 1 FOR 8));
    INSERT INTO public.shipments (
        order_id,
        tracking_code,
        buyer_company_id,
        seller_company_id,
        carrier_name,
        material_name,
        quantity,
        unit,
        pickup_location,
        delivery_location,
        status,
        eta
    ) VALUES (
        v_order_id,
        v_tracking_code,
        v_req.buyer_company_id,
        v_req.seller_company_id,
        'EcoFreight Consolidated Lines',
        v_listing.title,
        v_req.requested_quantity,
        v_req.unit,
        COALESCE(v_listing.location, 'Seller Facility'),
        'Buyer Distribution Center',
        'Pickup Scheduled',
        CURRENT_DATE + INTERVAL '5 days'
    );

    -- 12. Return Success Payload
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_num,
        'request_id', p_request_id,
        'status', 'Accepted'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
