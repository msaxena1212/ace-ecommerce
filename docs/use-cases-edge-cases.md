# ACE E-commerce Platform - Use Cases & Edge Cases

## Table of Contents
1. [User Use Cases](#user-use-cases)
2. [Dealer Use Cases](#dealer-use-cases)
3. [Inventory Management Use Cases](#inventory-management-use-cases)
4. [Delivery Use Cases](#delivery-use-cases)
5. [Edge Cases](#edge-cases)

---

## User Use Cases

### UC-U01: Guest User Browsing
**Actor**: Unregistered User  
**Precondition**: User visits ACE e-commerce website  
**Flow**:
1. User lands on homepage
2. User browses product categories (Mobile Cranes, Forklift Trucks, etc.)
3. User views product details, specifications, images
4. User can filter/search products
5. User adds items to cart (cart stored in session/localStorage)

**Postcondition**: Cart is populated with items  
**Alternative Flow**: User can continue browsing without adding to cart

---

### UC-U02: Guest User Forced Login at Checkout
**Actor**: Unregistered User  
**Precondition**: User has items in cart and clicks "Checkout"  
**Flow**:
1. User clicks "Proceed to Checkout"
2. System detects user is not logged in
3. System displays login/register modal with message: "Please login or register to complete your purchase"
4. User chooses to:
   - **Option A**: Login with existing credentials
   - **Option B**: Register new account
5. After successful authentication, user is redirected to checkout page
6. Cart items are preserved

**Postcondition**: User is authenticated and on checkout page  
**Exception**: Login fails → Show error message, allow retry

---

### UC-U03: Registered User Quick Checkout
**Actor**: Registered User  
**Precondition**: User is logged in  
**Flow**:
1. User adds items to cart
2. User clicks "Proceed to Checkout"
3. System displays saved addresses
4. User selects delivery address or adds new one
5. User enters pincode
6. System calculates delivery options based on time and distance:
   - Before 2 PM + ≤150km → Porter (Same Day)
   - After 2 PM or >150km → Delhivery (24hrs)
7. User reviews order summary
8. User selects payment method
9. User places order
10. System generates order ID and confirmation

**Postcondition**: Order is placed and routed to L1 dealer  
**Alternative Flow**: User can edit address, change quantities, or cancel

---

### UC-U04: User Order Tracking
**Actor**: Registered User  
**Precondition**: User has placed an order  
**Flow**:
1. User navigates to "My Orders"
2. User views list of all orders with statuses:
   - Pending Dealer Approval
   - Confirmed by [L1/L2/L3/Warehouse]
   - Out for Pickup
   - In Transit
   - Out for Delivery
   - Delivered
   - Cancelled/Rejected
3. User clicks on specific order
4. User views detailed timeline and tracking information
5. User can download invoice

**Postcondition**: User is informed of order status  
**Alternative Flow**: User can initiate return if eligible

---

### UC-U05: User Initiates Return
**Actor**: Registered User  
**Precondition**: Order delivered within return window (e.g., 7 days)  
**Flow**:
1. User goes to "My Orders"
2. User selects delivered order
3. User clicks "Return Item"
4. User selects return reason:
   - Defective/Damaged
   - Wrong item received
   - Not as described
   - Changed mind
5. User uploads photos (if defective/wrong item)
6. System validates return eligibility
7. System generates return request
8. Admin/Dealer approves return
9. System schedules pickup via delivery partner
10. Item is picked up and returned to dealer/warehouse
11. Quality check performed
12. Refund processed

**Postcondition**: Refund initiated  
**Exception**: Return denied if outside window or item not eligible

---

## Dealer Use Cases

### UC-D01: Dealer Receives Order Notification
**Actor**: L1/L2/L3 Dealer  
**Precondition**: Customer places order  
**Flow**:
1. Order is routed to L1 dealer based on customer location
2. Dealer receives notification (email, SMS, dashboard alert)
3. Dealer logs into dealer portal
4. Dealer views order details:
   - Customer information
   - Item details (part number, quantity)
   - Delivery address
   - Expected delivery time
5. Dealer has 2 hours to respond (configurable SLA)

**Postcondition**: Dealer is aware of pending order  
**Alternative Flow**: If dealer doesn't respond in time, auto-route to next level

---

### UC-D02: Dealer Approves Order
**Actor**: L1/L2/L3 Dealer  
**Precondition**: Dealer has received order notification  
**Flow**:
1. Dealer checks DMS for inventory
2. DMS shows item is available
3. Dealer physically verifies stock
4. Stock is available
5. Dealer clicks "Approve Order"
6. Dealer confirms pickup details:
   - Pickup address
   - Available time slots
   - Contact person
7. System creates manifest
8. System notifies delivery partner
9. System updates customer with confirmation

**Postcondition**: Order confirmed, manifest created  
**Alternative Flow**: None

---

### UC-D03: Dealer Rejects Order (DMS Mismatch)
**Actor**: L1 Dealer  
**Precondition**: DMS shows item available but physical stock is not  
**Flow**:
1. Dealer checks DMS → Shows available
2. Dealer checks physical stock → Not available (sold but not updated)
3. Dealer immediately updates DMS to reflect actual stock
4. Dealer clicks "Reject Order - Out of Stock"
5. Dealer adds notes: "Item sold, DMS not updated"
6. System automatically routes order to L2 dealer
7. System logs DMS discrepancy for audit
8. System sends alert to inventory manager

**Postcondition**: Order routed to L2, DMS corrected  
**Alternative Flow**: Dealer can suggest alternative part

---

### UC-D04: Dealer Partial Approval
**Actor**: L2 Dealer  
**Precondition**: Order quantity is 10 units, dealer has only 6 units  
**Flow**:
1. Dealer checks inventory
2. Dealer has 6 out of 10 units
3. Dealer selects "Partial Approval"
4. Dealer confirms 6 units
5. System asks dealer: "Fulfill partial or reject entire order?"
6. Dealer chooses "Fulfill 6 units"
7. System routes remaining 4 units to L3 dealer
8. System notifies customer of split shipment
9. Customer can accept or cancel

**Postcondition**: Partial order confirmed, remaining routed  
**Alternative Flow**: Dealer rejects entire order, routes all 10 to L3

---

### UC-D05: Dealer Handover to Delivery Partner
**Actor**: L1/L2/L3 Dealer  
**Precondition**: Order approved, delivery partner assigned  
**Flow**:
1. Dealer receives pickup notification with time slot
2. Dealer prepares package:
   - Proper packaging
   - Labels with order ID, customer details
   - Invoice/packing slip
3. Delivery partner arrives
4. Dealer verifies delivery partner identity
5. Dealer hands over package
6. Dealer scans/enters tracking code in system
7. System updates order status to "In Transit"
8. Customer receives notification

**Postcondition**: Package in transit  
**Exception**: Delivery partner doesn't arrive → Dealer contacts support

---

## Inventory Management Use Cases

### UC-I01: L1 → L2 → L3 → Warehouse Routing
**Actor**: System  
**Precondition**: Customer places order  
**Flow**:
1. System identifies customer location (pincode)
2. System assigns nearest L1 dealer
3. System checks L1 DMS via API
4. **If L1 has stock**:
   - Route to L1 dealer for approval
5. **If L1 doesn't have stock**:
   - System routes to L2 dealer
   - Checks L2 DMS
6. **If L2 doesn't have stock**:
   - System routes to L3 dealer
   - Checks L3 DMS
7. **If L3 doesn't have stock**:
   - System routes to central warehouse
   - Checks warehouse inventory
8. **If warehouse has stock**:
   - Warehouse fulfills order
9. **If warehouse doesn't have stock**:
   - System notifies customer: "Out of Stock"
   - Offers backorder or alternative parts

**Postcondition**: Order routed to available source  
**Alternative Flow**: All levels out of stock → Backorder queue

---

### UC-I02: Multi-Item Order with Split Fulfillment
**Actor**: System  
**Precondition**: Order has 3 different parts  
**Flow**:
1. Customer orders:
   - Part A (Qty: 5)
   - Part B (Qty: 2)
   - Part C (Qty: 1)
2. System routes each item independently:
   - **Part A**: L1 has 5 → L1 confirms
   - **Part B**: L1 has 0 → Routes to L2 → L2 has 2 → L2 confirms
   - **Part C**: L1 has 0 → L2 has 0 → L3 has 1 → L3 confirms
3. System creates 3 separate manifests:
   - Manifest 1: L1 → Customer (Part A)
   - Manifest 2: L2 → Customer (Part B)
   - Manifest 3: L3 → Customer (Part C)
4. System notifies customer of multiple shipments
5. System coordinates delivery:
   - **Option A**: Consolidate at hub, single delivery
   - **Option B**: Direct delivery from each source

**Postcondition**: All items confirmed, multiple manifests created  
**Alternative Flow**: One item unavailable → Partial order handling

---

### UC-I03: DMS Real-Time Sync
**Actor**: DMS Integration Service  
**Precondition**: Dealer sells item through offline channel  
**Flow**:
1. Dealer sells item at physical store
2. Dealer updates DMS immediately
3. DMS sends webhook to e-commerce platform
4. E-commerce platform updates inventory cache
5. Product availability reflects in real-time on website

**Postcondition**: Inventory synchronized  
**Exception**: DMS API down → Use cached data with warning

---

## Delivery Use Cases

### UC-DL01: Porter Same-Day Delivery
**Actor**: System, Porter API  
**Precondition**: Order placed before 2 PM, distance ≤150km  
**Flow**:
1. Order confirmed by dealer at 11:00 AM
2. Customer location: 80km from dealer
3. System selects Porter for same-day delivery
4. System calls Porter API with manifest:
   - Pickup address: Dealer location
   - Delivery address: Customer location
   - Package details: Weight, dimensions
   - Preferred pickup time: 1:00 PM
5. Porter API returns:
   - Confirmation
   - Tracking ID
   - Estimated delivery: 6:00 PM same day
6. System updates order status
7. System sends SMS/email to customer with tracking link
8. Porter picks up at 1:00 PM
9. Porter delivers by 6:00 PM
10. Customer receives OTP for delivery confirmation
11. System marks order as "Delivered"

**Postcondition**: Same-day delivery completed  
**Exception**: Porter unavailable → Fallback to Delhivery

---

### UC-DL02: Delhivery 24-Hour Delivery
**Actor**: System, Delhivery API  
**Precondition**: Order placed after 2 PM or distance >150km  
**Flow**:
1. Order confirmed by dealer at 3:00 PM
2. Customer location: 250km from dealer
3. System selects Delhivery for 24-hour delivery
4. System calls Delhivery API with manifest
5. Delhivery schedules pickup for next morning
6. Delhivery picks up at 9:00 AM next day
7. Delhivery delivers within 24 hours
8. Customer receives delivery

**Postcondition**: Delivery within 24 hours  
**Alternative Flow**: Express delivery option for urgent orders

---

### UC-DL03: Multi-Source Consolidation
**Actor**: System  
**Precondition**: Order has items from L1, L2, and Warehouse  
**Flow**:
1. System creates 3 pickup manifests
2. System identifies consolidation hub (nearest to customer)
3. System schedules:
   - Pickup from L1 → Hub
   - Pickup from L2 → Hub
   - Pickup from Warehouse → Hub
4. All items reach hub by 5:00 PM
5. Hub consolidates into single package
6. Final delivery to customer next day
7. Customer receives single shipment

**Postcondition**: Consolidated delivery  
**Alternative Flow**: Direct delivery if consolidation not feasible

---

## Edge Cases

### EC-01: All Dealers Reject, Warehouse Out of Stock
**Scenario**: High-demand item, all sources depleted  
**Flow**:
1. L1 rejects → L2 rejects → L3 rejects → Warehouse out of stock
2. System notifies customer: "Item currently unavailable"
3. System offers options:
   - **Backorder**: Reserve item, fulfill when restocked
   - **Alternative Parts**: Suggest compatible parts
   - **Cancel Order**: Full refund
4. Customer chooses backorder
5. System adds to backorder queue
6. When restocked, system auto-fulfills oldest backorders first
7. Customer notified when item ships

**Resolution**: Backorder management  

---

### EC-02: Dealer Approves but Item Sold Before Pickup
**Scenario**: Dealer approves order, but item sold at physical store before delivery partner arrives  
**Flow**:
1. Dealer approves order at 10:00 AM
2. Delivery partner scheduled for 2:00 PM pickup
3. At 12:00 PM, dealer sells item to walk-in customer
4. Dealer realizes mistake at 1:00 PM
5. Dealer immediately updates DMS
6. Dealer contacts e-commerce support
7. System routes order to L2 dealer
8. System notifies customer of delay
9. System flags dealer for repeated violations

**Resolution**: Order re-routed, dealer penalized  

---

### EC-03: Customer Cancels After Dealer Approval
**Scenario**: Customer cancels order after dealer has prepared package  
**Flow**:
1. Dealer approves and packages item
2. Customer cancels order before pickup
3. System checks cancellation policy:
   - **Before pickup**: Full refund, no penalty
   - **After pickup**: Cancellation fee or no refund
4. System notifies dealer to halt shipment
5. Dealer returns item to inventory
6. Dealer updates DMS
7. System processes refund (minus cancellation fee if applicable)

**Resolution**: Refund processed, item returned to inventory  

---

### EC-04: Delivery Partner API Down
**Scenario**: Porter API unavailable during manifest creation  
**Flow**:
1. System attempts Porter API call
2. API returns 503 Service Unavailable
3. System retries 3 times with exponential backoff
4. All retries fail
5. System automatically switches to Delhivery
6. Delhivery API call succeeds
7. System logs Porter failure for monitoring
8. Customer receives delivery via Delhivery (may not be same-day)

**Resolution**: Fallback to alternative delivery partner  

---

### EC-05: Wrong Item Delivered
**Scenario**: Dealer ships wrong part  
**Flow**:
1. Customer receives package
2. Customer opens and finds wrong part
3. Customer initiates return via portal
4. Customer uploads photos of wrong item
5. System auto-approves return (wrong item = dealer error)
6. System schedules return pickup
7. System immediately ships correct item from same/different dealer
8. Customer receives correct item
9. Dealer receives wrong item back
10. System audits dealer for error

**Resolution**: Correct item shipped, dealer accountable  

---

### EC-06: Partial Delivery Accepted
**Scenario**: Customer orders 10 units, only 7 available across all sources  
**Flow**:
1. L1 has 3, L2 has 4, L3 has 0, Warehouse has 0
2. System notifies customer: "Only 7 units available. Accept partial delivery?"
3. Customer accepts 7 units
4. System creates 2 manifests (L1: 3 units, L2: 4 units)
5. System adjusts order total and refunds difference
6. Customer receives 7 units
7. Remaining 3 units added to backorder
8. When restocked, system auto-ships remaining 3 units

**Resolution**: Partial fulfillment with backorder  

---

### EC-07: DMS API Timeout
**Scenario**: DMS doesn't respond within timeout period  
**Flow**:
1. System queries L1 DMS for inventory
2. DMS API times out after 10 seconds
3. System retries once
4. Second attempt times out
5. System uses cached inventory data (if available)
6. System displays warning to dealer: "Using cached data, verify stock"
7. Dealer manually confirms availability
8. System logs DMS timeout for IT team

**Resolution**: Cached data with manual verification  

---

### EC-08: Customer Address Unserviceable
**Scenario**: Customer's pincode not covered by Porter or Delhivery  
**Flow**:
1. Customer enters pincode during checkout
2. System checks Porter serviceability → Not serviceable
3. System checks Delhivery serviceability → Not serviceable
4. System displays: "Delivery not available to your location"
5. System offers:
   - **Self-pickup**: Customer picks up from nearest dealer
   - **Alternative address**: Ship to serviceable location
6. Customer chooses self-pickup
7. Order routed to nearest dealer
8. Customer notified when ready for pickup

**Resolution**: Self-pickup option  

---

### EC-09: Payment Gateway Failure
**Scenario**: Payment gateway down during checkout  
**Flow**:
1. Customer clicks "Pay Now"
2. Payment gateway API returns error
3. System retries payment
4. Second attempt fails
5. System offers alternative payment methods:
   - Different payment gateway
   - UPI
   - Net banking
   - COD (if eligible)
6. Customer selects COD
7. Order placed successfully

**Resolution**: Alternative payment method  

---

### EC-10: Manifest Creation Failure
**Scenario**: System fails to create manifest due to data validation error  
**Flow**:
1. Dealer approves order
2. System attempts to create manifest
3. Validation error: Missing package weight
4. System prompts dealer: "Please enter package weight"
5. Dealer enters weight
6. System creates manifest successfully
7. Delivery partner notified

**Resolution**: Manual data entry  

---

### EC-11: Customer Not Available for Delivery
**Scenario**: Delivery partner arrives but customer not available  
**Flow**:
1. Delivery partner arrives at customer location
2. Customer not available
3. Delivery partner attempts contact (call, SMS)
4. No response
5. Delivery partner marks "Delivery attempted"
6. System notifies customer
7. System reschedules delivery for next day
8. After 3 failed attempts:
   - System contacts customer
   - If no response, order returned to dealer
   - Refund processed minus return shipping

**Resolution**: Rescheduled delivery or return  

---

### EC-12: Dealer Closed/Unavailable for Pickup
**Scenario**: Delivery partner arrives but dealer closed  
**Flow**:
1. Delivery partner arrives at dealer location
2. Dealer closed (holiday, emergency)
3. Delivery partner contacts dealer
4. No response
5. System reschedules pickup
6. System notifies customer of delay
7. If dealer unavailable for 2+ days:
   - System routes order to next level dealer
   - Original dealer penalized

**Resolution**: Rescheduled or re-routed  

---

### EC-13: Inventory Discrepancy During Audit
**Scenario**: Physical audit reveals DMS inaccuracies  
**Flow**:
1. Monthly inventory audit conducted
2. Auditor finds discrepancies:
   - DMS shows 50 units
   - Physical count: 42 units
3. Auditor updates DMS to 42 units
4. System checks for pending orders using this part
5. System finds 2 orders (5 units each) routed to this dealer
6. System validates: 42 - 10 = 32 units remaining (OK)
7. If insufficient, system re-routes orders
8. System logs discrepancy for dealer performance review

**Resolution**: DMS corrected, orders validated  

---

### EC-14: Bulk Order Exceeds Single Dealer Capacity
**Scenario**: Customer orders 100 units, no single dealer has that many  
**Flow**:
1. Customer orders 100 units
2. L1 has 30, L2 has 25, L3 has 20, Warehouse has 30
3. System calculates: 30 + 25 + 20 + 30 = 105 units (sufficient)
4. System creates multi-source order:
   - L1: 30 units
   - L2: 25 units
   - L3: 20 units
   - Warehouse: 25 units
5. System offers customer:
   - **Consolidated delivery**: All items to hub, then single delivery (2-3 days)
   - **Staggered delivery**: Items shipped as available (faster)
6. Customer chooses consolidated
7. All items consolidated and delivered together

**Resolution**: Multi-source fulfillment  

---

### EC-15: Return Item Damaged in Transit Back to Dealer
**Scenario**: Customer returns item, but it's damaged during return shipment  
**Flow**:
1. Customer initiates return (defective item)
2. Delivery partner picks up item
3. Item damaged during return transit
4. Dealer receives damaged package
5. Dealer documents damage with photos
6. Dealer files claim with delivery partner
7. System investigates:
   - Was item already damaged? (Customer's photos)
   - Damaged in transit? (Delivery partner's fault)
8. If damaged in transit:
   - Delivery partner compensates
   - Customer receives full refund
9. If already damaged:
   - Customer receives refund as per policy

**Resolution**: Claim investigation and resolution  

---

## Summary

This document covers:
- **5 User Use Cases**: Browsing, checkout, tracking, returns
- **5 Dealer Use Cases**: Order approval, rejection, partial fulfillment, handover
- **3 Inventory Use Cases**: Multi-level routing, split fulfillment, DMS sync
- **3 Delivery Use Cases**: Porter, Delhivery, consolidation
- **15 Edge Cases**: Stock issues, API failures, delivery problems, data discrepancies

All scenarios include detailed flows, preconditions, postconditions, and resolution strategies.
