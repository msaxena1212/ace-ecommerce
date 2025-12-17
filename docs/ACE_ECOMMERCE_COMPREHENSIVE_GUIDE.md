# ACE E-commerce Platform - Comprehensive User & Developer Guide

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [User Roles & Workflows](#user-roles--workflows)
3. [Order Routing Logic](#order-routing-logic)
4. [Calculation Logics](#calculation-logics)
5. [Customized Machines & Support](#customized-machines--support)
6. [API Documentation](#api-documentation)
7. [Use Cases & Edge Cases](#use-cases--edge-cases)

---

# Platform Overview

The ACE E-commerce Platform is a comprehensive system for ordering construction equipment parts with intelligent order routing, machine customization support, and multi-level dealer management.

### Key Features
- **Smart Product Catalog**: Browse and search thousands of genuine ACE parts.
- **Intelligent Order Routing**: Automatic routing to the nearest dealer with inventory.
- **Machine Management**: Track equipment and get compatible part suggestions.
- **Multi-Level Dealers**: L1 (Local) → L2 (Regional) → L3 (State) → Warehouse.
- **Support System**: WhatsApp-integrated customer support for custom parts.

---

# User Roles & Workflows

## 1. Customer
**Access**: `/dashboard`
- **Browse & Buy**: Search parts by category or machine model.
- **My Machines**: Register machines (e.g., FX 14 Mobile Crane) to see specific compatible parts.
- **Support**: Open tickets for "Custom Part Inquiries" and receive cart links via WhatsApp.
- **Order Tracking**: Real-time status updates (Routing -> Confirmed -> Delivered).

## 2. Dealer
**Access**: `/dealer/dashboard`
- **Order Management**: View orders routed to your pincode.
- **Inventory Check**: Verify stock in DMS before approving.
- **Actions**:
    - **Approve**: Confirm full availability.
    - **Partial Approve**: Fulfill what you have; remainder escalates to next level.
    - **Reject**: Item out of stock; order escalates.
- **Performance**: Track your "Dealer Score" based on approval rates and response time.

## 3. Admin
**Access**: `/admin/dashboard`
- **Management**: Add/Edit Dealers, Products, and Machines.
- **Analytics**: View revenue, order status distribution, and dealer performance.
- **Support**: Resolve part inquiries and generate cart links.

---

# Order Routing Logic

The platform uses a sophisticated multi-level routing system to ensure fastest delivery.

### Routing Hierarchy
1.  **L1 Dealers (Local)**: Matches Customer Pincode. Fastest delivery.
2.  **L2 Dealers (Regional)**: Backup for L1.
3.  **L3 Dealers (State)**: Backup for L2.
4.  **Central Warehouse**: Final fallback.

### Routing Algorithm Steps
1.  **Pincode Match**: System identifies L1 dealers serving the customer's pincode.
2.  **Inventory Check**: Checks availability (simulated DMS check).
    - If **Available**: Order routed to L1 Dealer.
    - If **Unavailable/Rejected**: Escalates to L2 -> L3 -> Warehouse.
3.  **Partial Fulfillment**: If L1 has 5/10 units, it fulfills 5. Remaining 5 route to L2.
4.  **Multi-Source**: Different items in one order can be fulfilled by different dealers.

---

# Calculation Logics

## Dealer Performance Score
This score (0-100) determines a dealer's reliability and priority in routing.

**Formula:**
```math
Performance Score = (Approval Rate × 0.6) + (Compliance Score × 0.2) + (Response Time Score × 0.2)
```

**Components:**
1.  **Approval Rate (60%)**:
    - `(Total Approved Orders / Total Orders Routed) * 100`
    - *Goal*: High acceptance of routed orders.
2.  **Compliance Score (20%)**:
    - Based on successful deliveries vs returns/complaints.
    - `100 - (Return Rate %)`
3.  **Response Time Score (20%)**:
    - `(SLA Time - Actual Response Time) / SLA Time` normalized.
    - *Goal*: Respond within 2 hours.

## Delivery Estimation
- **Same Day**: If `Distance < 150km` AND `Order Time < 2 PM`. (Via Porter)
- **Next Day (24hr)**: If `Distance > 150km` OR `Order Time > 2 PM`. (Via Delhivery)

---

# Customized Machines & Support

### The Challenge
Customized machines (e.g., "FX14 with Extended Boom") require specific parts that differ from standard models.

### Solution: Machine Repository & Compatibility Engine
1.  **Registration**: Customer registers machine with `serialNumber` and selects `customizations` (e.g., "Extended Boom").
2.  **Filtering**: System automatically filters parts.
    - *Standard Machine*: Shows standard hydraulic cylinder.
    - *Custom Machine*: Shows "Heavy Duty Cylinder" compatible with Extended Boom.

### Support Workflow (WhatsApp)
1.  **Inquiry**: Customer asks "Need cylinder for my custom crane" via Support Ticket.
2.  **Resolution**: Admin identifies correct custom part.
3.  **Cart Link**: Admin generates a unique link: `ace.com/cart/load?items=...`
4.  **WhatsApp**: Link sent to customer's WhatsApp.
5.  **Purchase**: Customer clicks link -> Cart pre-filled -> Checkout.

---

# API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Most endpoints require NextAuth session. Headers: `Cookie: next-auth.session-token=...`

## Key Endpoints

### 1. Products
- **GET** `/api/products`: List products. Query: `?category=Cranes&search=Boom`
- **POST** `/api/products` (Admin): Create product.

### 2. Orders & Cart
- **GET** `/api/orders`: User's order history.
- **POST** `/api/orders`: Place order (triggers routing).
- **POST** `/api/cart`: Add item to cart.

### 3. Dealers (Admin)
- **GET** `/api/admin/dealers`: List all dealers with performance scores.
- **POST** `/api/admin/dealers`: Onboard new dealer.
    - Payload: `{ name, level: "L1", servicePincodes: ["110020"], ... }`

### 4. Machine Repository
- **GET** `/api/machines`: List standard machine types.
- **GET** `/api/user/machines`: List logged-in user's registered machines.
- **POST** `/api/user/machines`: Register a customer machine.

### 5. Suggestions
- **GET** `/api/suggestions`: Returns `COMPATIBLE_PART`, `FREQUENTLY_BOUGHT` recommendations based on user's registered machines.

---

# Use Cases & Edge Cases

## Common Use Cases
1.  **Guest Browsing**: User views products, added to local cart. Forced login at checkout.
2.  **Quick Re-order**: User goes to "My Orders", clicks "Reorder" (adds items to cart).
3.  **Dealer Approval**: Dealer receives SMS, logs in, checks stock, clicks "Approve".

## Critical Edge Cases
1.  **All Dealers Reject**:
    - *Scenario*: L1, L2, L3 all reject order.
    - *Result*: Order backordered at Warehouse level or cancelled with user notification.
2.  **Partial Inventory**:
    - *Scenario*: Customer wants 10. L1 has 4.
    - *Result*: L1 ships 4. Remaining 6 auto-routed to L2. Customer receives 2 shipments.
3.  **DMS Mismatch**:
    - *Scenario*: Dealer approves but physically out of stock.
    - *Result*: Dealer must "Reject" with reason "Inventory Error". Penalized in Performance Score. Order re-routed.
4.  **Delivery Partner Fail**:
    - *Scenario*: Porter API down.
    - *Result*: System fails over to Delhivery API automatically.

---
*Generated for ACE E-commerce Platform | 2024*
