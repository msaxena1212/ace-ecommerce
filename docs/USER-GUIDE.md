# ACE E-commerce Platform - Complete User Guide

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Customer Guide](#customer-guide)
5. [Dealer Guide](#dealer-guide)
6. [Admin Guide](#admin-guide)
7. [Order Routing Logic](#order-routing-logic)
8. [Machine Customization](#machine-customization)
9. [Support System](#support-system)
10. [Troubleshooting](#troubleshooting)

---

## Platform Overview

The ACE E-commerce Platform is a comprehensive system for ordering construction equipment parts with intelligent order routing, machine customization support, and multi-level dealer management.

### Key Features

- **Smart Product Catalog** - Browse and search thousands of genuine ACE parts
- **Intelligent Order Routing** - Automatic routing to nearest dealer with inventory
- **Machine Management** - Track your equipment and get compatible part suggestions
- **Multi-Level Dealers** - L1 (Local) → L2 (Regional) → L3 (State) → Warehouse
- **Support System** - WhatsApp-integrated customer support
- **Multiple Payment Options** - Online, COD, Credit terms

---

## Getting Started

### For New Customers

#### Step 1: Browse Products (No Login Required)
1. Visit the homepage at `http://localhost:3000`
2. Click "Browse Products" or navigate to `/products`
3. Use filters to find parts by category or price
4. Search by part number or name

#### Step 2: Create an Account
1. Click "Login" in the header
2. Select "Create one" to register
3. Fill in your details:
   - Full Name
   - Email Address
   - Phone Number
   - Password
4. Click "Create Account"

#### Step 3: Complete Your Profile
1. After registration, you'll be redirected to your dashboard
2. Add delivery addresses in Settings
3. Register your machines (optional but recommended)

### Quick Start Checklist

- [ ] Create account
- [ ] Add delivery address
- [ ] Register your machines (for better recommendations)
- [ ] Browse products
- [ ] Place first order

---

## User Roles

### 1. Customer
**Access:** `/dashboard`

**Capabilities:**
- Browse and purchase products
- Track orders
- Manage machines
- Create support tickets
- View order history

### 2. Dealer
**Access:** `/dealer/dashboard`

**Capabilities:**
- View routed orders
- Approve/reject orders
- Check inventory
- Manage performance metrics
- View manifests

### 3. Admin
**Access:** `/admin/dashboard`

**Capabilities:**
- Manage all dealers
- View all orders
- Product management
- Machine repository
- Support ticket oversight
- Analytics and reporting

---

## Customer Guide

### How to Shop

#### 1. Finding Products

**Browse by Category:**
```
Homepage → Shop by Category → Select Category
```

Available categories:
- Mobile Cranes
- Forklift Trucks
- Tower Cranes
- Backhoe Loaders
- Concrete Placing
- Piling Rigs
- Road Equipment
- Spare Parts

**Search by Part Number:**
```
Products Page → Search Bar → Enter part number (e.g., "HYD-CYL-FX14-001")
```

**Filter by Price:**
```
Products Page → Price Range Filter → Select range
```

#### 2. Viewing Product Details

Click any product to see:
- **Specifications** - Technical details
- **Price** - Current pricing
- **Stock Status** - Availability
- **Part Number** - For reference
- **Category** - Product classification
- **Related Products** - Similar items

#### 3. Adding to Cart

**From Product Page:**
1. Select quantity using +/- buttons
2. Click "Add to Cart"
3. See confirmation message
4. Continue shopping or go to cart

**Cart Management:**
- View cart by clicking cart icon (top right)
- Update quantities
- Remove items
- See price breakdown (subtotal, shipping, tax)

#### 4. Checkout Process

**Step 1: Delivery Address**
```
Cart → Proceed to Checkout → Enter Address
```

Required information:
- Full Name
- Phone Number
- Address Line 1
- Address Line 2 (optional)
- City
- State
- **Pincode** (important for routing!)

**Step 2: Payment Method**

Choose from:
- **Online Payment** - UPI, Card, Net Banking
- **Cash on Delivery** - Pay when you receive
- **Credit Terms** - For registered dealers only

**Step 3: Review Order**
- Verify delivery address
- Confirm payment method
- Review order items
- Click "Place Order"

#### 5. Order Confirmation

After placing order:
- Order number generated (e.g., ORD-2024-001)
- Confirmation email sent
- Order routed to nearest dealer
- Estimated delivery date provided

### Order Tracking

**View Order Status:**
```
Dashboard → My Orders → Select Order
```

**Order Statuses:**
- `PENDING` - Order received, routing in progress
- `ROUTING_L1` - Routed to L1 dealer
- `ROUTING_L2` - Escalated to L2 dealer
- `ROUTING_L3` - Escalated to L3 dealer
- `ROUTING_WAREHOUSE` - Routed to central warehouse
- `CONFIRMED` - Dealer approved order
- `PREPARING` - Order being prepared
- `READY_FOR_PICKUP` - Ready for delivery partner
- `PICKED_UP` - Picked up by delivery partner
- `IN_TRANSIT` - On the way
- `OUT_FOR_DELIVERY` - Out for delivery
- `DELIVERED` - Successfully delivered

**Tracking Information:**
- Tracking ID (for Porter or Delhivery)
- Estimated delivery date
- Actual delivery date (when delivered)
- Delivery partner details

### Managing Your Machines

#### Registering a Machine

**Why Register?**
- Get compatible part recommendations
- Track machine history
- Faster support for custom machines
- Personalized suggestions

**How to Register:**
```
Dashboard → My Products → Add Machine
```

Required information:
- Machine type (e.g., FX 14 Mobile Crane)
- Serial number
- Purchase date
- Nickname (optional, e.g., "Main Crane")
- Customizations (if any)

#### Viewing Compatible Parts

```
Dashboard → My Products → Select Machine → View Compatible Parts
```

This shows:
- Standard parts for your machine
- Custom parts (if machine is customized)
- Frequently bought parts
- Recommended maintenance items

### Getting Support

#### Creating a Support Ticket

**For Custom Machine Parts:**
```
Dashboard → Support → New Ticket
```

1. Select ticket type (Part Inquiry, Technical Support, etc.)
2. Choose your machine (if applicable)
3. Describe your issue
4. Provide WhatsApp number for quick response
5. Submit ticket

**Support Response:**
- Support team reviews your request
- Confirms compatible parts
- Sends cart link via WhatsApp
- You click link to add parts to cart
- Complete checkout normally

#### WhatsApp Support Flow

```
You → WhatsApp Support
    ↓
Support creates ticket
    ↓
Support confirms parts
    ↓
You receive cart link via WhatsApp
    ↓
Click link → Parts added to cart
    ↓
Review and checkout
```

---

## Dealer Guide

### Accessing Dealer Portal

**Login:**
```
/dealer/login → Enter credentials
```

### Dashboard Overview

**Key Metrics:**
- Pending Orders - Orders awaiting your response
- Approved Orders - Orders you've confirmed
- Rejected Orders - Orders you couldn't fulfill
- Performance Score - Your rating (0-100%)

### Managing Orders

#### Viewing Pending Orders

```
Dealer Dashboard → Pending Tab
```

Each order shows:
- Order number
- Customer details
- Order items with quantities
- Total amount
- Routing time

#### Checking Inventory

**Before Approving:**
1. Review order items
2. Check your DMS/inventory system
3. Verify you have all items in required quantities
4. Check part numbers carefully

#### Approving an Order

**Full Approval:**
```
Pending Order → Review Items → Approve Order
```

This means:
- You have all items in stock
- You can fulfill complete order
- Order moves to "Preparing" status
- Manifest will be created

**Partial Approval:**
```
Pending Order → Partial Approval → Select available items
```

Use when:
- You have some items but not all
- You can fulfill partial quantities
- Remaining items escalate to next level

**Example:**
```
Order: 10 units of HYD-CYL-FX14-001
Your stock: 6 units
→ Partial approve 6 units
→ Remaining 4 units route to L2
```

#### Rejecting an Order

**When to Reject:**
- Item out of stock
- Cannot fulfill in time
- Part discontinued
- Other valid reason

**How to Reject:**
```
Pending Order → Reject Order → Enter reason
```

**What Happens:**
- Order automatically escalates to next level (L2 → L3 → Warehouse)
- Your performance score decreases slightly
- Customer is notified of delay

### Performance Metrics

**Performance Score Calculation:**
```
Performance Score = (Approval Rate × 0.6) + (Response Time × 0.4)
```

**Tips to Improve:**
- Respond quickly to orders
- Maintain accurate inventory
- Approve orders when possible
- Use partial approval instead of rejection
- Keep DMS updated

### Best Practices

1. **Check Orders Regularly** - At least 3 times per day
2. **Respond Within SLA** - Default 2 hours
3. **Keep Inventory Updated** - Sync with DMS daily
4. **Use Partial Approval** - Better than full rejection
5. **Communicate Issues** - Contact support if problems

---

## Admin Guide

### Dashboard Overview

**Access:** `/admin/dashboard`

**Main Sections:**
- Overview - Analytics and metrics
- Orders - All platform orders
- Dealers - Dealer management
- Products - Catalog management
- Machines - Machine repository
- Support - Ticket management

### Managing Dealers

#### Adding a New Dealer

```
Admin Dashboard → Dealers → Add Dealer
```

Required information:
- Dealer name
- Email and password
- Phone number
- **Dealer Level** (L1, L2, L3, or WAREHOUSE)
- Address details
- **Service Pincodes** (critical for routing!)
- Response SLA (default 120 minutes)

**Service Pincodes:**
```
Example for Delhi L1 dealer:
110001, 110020, 110030, 110040, 110050
```

#### Monitoring Dealer Performance

**Key Metrics:**
- Total Orders
- Approved Orders
- Rejected Orders
- Approval Rate (%)
- Performance Score
- Average Response Time

**Performance Actions:**
- Review low-performing dealers
- Provide training/support
- Adjust service areas
- Update SLA requirements

### Managing Products

#### Adding Products

```
Admin Dashboard → Products → Add Product
```

Required fields:
- Part Number (unique)
- Product Name
- Description
- Category
- Price
- Specifications (JSON)
- Stock level
- Images

**For Custom Parts:**
- Mark as "Custom Part"
- Specify required customizations
- Link to compatible machines

### Machine Repository

**Purpose:**
- Central database of all ACE machines
- Customization options
- Part compatibility mapping

**Adding a Machine:**
```
Admin Dashboard → Machines → Add Machine
```

Information needed:
- Machine number (e.g., ACE-FX14-2024)
- Name and model
- Category
- Specifications
- Is customizable?
- Compatible parts list

### Support Ticket Management

**Viewing Tickets:**
```
Admin Dashboard → Support
```

**Ticket Workflow:**
1. Customer creates ticket
2. Admin reviews request
3. Admin confirms compatible parts
4. System generates cart link
5. Link sent to customer via WhatsApp
6. Customer completes purchase
7. Ticket marked as resolved

**Confirming Parts:**
```
Support Ticket → Confirm Parts → Select products → Generate Cart Link
```

---

## Order Routing Logic

### How Orders Are Routed

When a customer places an order, the system automatically routes it based on:

1. **Customer Pincode** - Geographic location
2. **Dealer Level** - L1 (closest) to Warehouse (farthest)
3. **Inventory Availability** - Actual stock quantities

### Routing Hierarchy

```
Customer Order (Pincode: 110020)
    ↓
Check L1 Dealers serving 110020
    ↓
ACE Delhi Central (L1) - Has inventory?
    ├─ YES → Route to ACE Delhi Central ✓
    └─ NO → Escalate to L2
        ↓
    Check L2 Dealers
        ↓
    ACE Regional Hub (L2) - Has inventory?
        ├─ YES → Route to ACE Regional Hub ✓
        └─ NO → Escalate to L3
            ↓
        Check L3 Dealers
            ↓
        ACE State Warehouse (L3) - Has inventory?
            ├─ YES → Route to ACE State Warehouse ✓
            └─ NO → Escalate to Central Warehouse
                ↓
            Central Warehouse - Has inventory?
                ├─ YES → Route to Central Warehouse ✓
                └─ NO → Backorder/Out of Stock
```

### Example Scenarios

#### Scenario 1: Simple Order
```
Customer: Delhi (110020)
Order: 5 units of Hydraulic Cylinder
L1 Dealer (Delhi): 10 units available
→ Routed to L1 Delhi
→ Delivered same day
```

#### Scenario 2: Escalation
```
Customer: Delhi (110020)
Order: 15 units of Hydraulic Cylinder
L1 Dealer (Delhi): 0 units available
L2 Dealer (Regional): 20 units available
→ Escalated to L2
→ Delivered in 24 hours
```

#### Scenario 3: Partial Fulfillment
```
Customer: Delhi (110020)
Order: 15 units of Hydraulic Cylinder
L1 Dealer (Delhi): 8 units available
→ L1 fulfills 8 units
→ Remaining 7 units escalate to L2
→ Two separate deliveries
```

#### Scenario 4: Multi-Item Order
```
Customer: Delhi (110020)
Order:
  - Item A: Available at L1 Delhi
  - Item B: Available at L2 Regional
→ Multi-source order
→ Two manifests created
→ Coordinated delivery
```

### Testing Routing Logic

**Interactive Demo:**
```
Visit: /routing-demo
```

1. Enter customer pincode
2. Select products and quantities
3. Click "Route Order"
4. See routing results in real-time

**Test Pincodes:**
- **Delhi L1:** 110001, 110020, 110030, 110040
- **Mumbai L1:** 400001, 400053, 400070, 400080
- **Bangalore L2:** 560001, 560058, 560100

---

## Machine Customization

### Understanding Customizations

**What are Customizations?**
- Modifications to standard machines
- Examples: Extended boom, heavy-duty hydraulics
- Require specific parts different from standard

**Why It Matters:**
- Custom machines need custom parts
- Standard parts may not fit
- System filters parts automatically

### Registering Customized Machines

**Step 1: Register Base Machine**
```
Dashboard → My Products → Add Machine
```

**Step 2: Add Customizations**
```
Select Machine → Add Customization
```

Common customizations:
- Extended Boom
- Heavy Duty Hydraulics
- Upgraded Electrical System
- Reinforced Structure

**Step 3: Get Custom Part Recommendations**
```
My Products → Select Machine → View Compatible Parts
```

System shows:
- ✓ Standard parts (work with all versions)
- ✓ Custom parts (required for your customization)
- ✗ Incompatible parts (filtered out)

### Support for Custom Parts

**If You Need Help:**
```
Dashboard → Support → New Ticket
→ Select "Part Inquiry"
→ Choose your customized machine
→ Describe what you need
```

**Support Process:**
1. Support team reviews your machine
2. Confirms compatible custom parts
3. Sends cart link via WhatsApp
4. You complete purchase

---

## Support System

### Creating Support Tickets

**When to Create a Ticket:**
- Need help finding parts for custom machine
- Technical questions about compatibility
- Order issues
- General inquiries

**How to Create:**
```
Dashboard → Support → New Ticket
```

**Ticket Types:**
- **Part Inquiry** - Finding the right parts
- **Customization Query** - Questions about customizations
- **Technical Support** - Technical issues
- **Order Issue** - Problems with orders
- **General** - Other questions

### WhatsApp Integration

**How It Works:**
1. Create ticket with WhatsApp number
2. Support team reviews
3. Confirms parts/solution
4. Sends response via WhatsApp
5. For parts: Receive cart link
6. Click link → Parts added to cart
7. Complete checkout

**Benefits:**
- Fast response
- Convenient communication
- Direct cart link
- No need to search again

### Ticket Status

- `OPEN` - Just created
- `IN_PROGRESS` - Support team working on it
- `WAITING_CUSTOMER` - Waiting for your response
- `PARTS_CONFIRMED` - Parts identified, cart link sent
- `RESOLVED` - Issue resolved
- `CLOSED` - Ticket closed

---

## Troubleshooting

### Common Issues

#### 1. Cannot Find Part

**Problem:** Can't find the part I need

**Solutions:**
- Search by exact part number
- Check category filters
- Use support ticket system
- Contact support via WhatsApp

#### 2. Order Stuck in Routing

**Problem:** Order status shows "ROUTING_L1" for long time

**Possible Causes:**
- Dealer hasn't responded yet (SLA: 2 hours)
- Item out of stock at L1, escalating
- System routing to next level

**What to Do:**
- Wait for SLA period
- Check order details for updates
- Contact support if > 4 hours

#### 3. Wrong Delivery Address

**Problem:** Entered wrong address

**Solution:**
- Contact support immediately
- Provide order number
- New address details
- Note: Can only change before "CONFIRMED" status

#### 4. Part Not Compatible

**Problem:** Ordered part doesn't fit my machine

**Prevention:**
- Register your machine first
- Use "Compatible Parts" feature
- Check specifications carefully
- Contact support if unsure

**If Already Ordered:**
- Initiate return
- Provide photos
- Get refund/replacement

#### 5. Payment Failed

**Problem:** Payment didn't go through

**Solutions:**
- Try different payment method
- Check card/account balance
- Use COD option
- Contact payment support

### Getting Help

**Support Channels:**
1. **Support Tickets** - Dashboard → Support
2. **WhatsApp** - Provided in ticket
3. **Email** - helpdesk@ace-cranes.com
4. **Phone** - 1800-1800-004

**Response Times:**
- Support Tickets: 2-4 hours
- WhatsApp: 1-2 hours
- Email: 24 hours
- Phone: Immediate

---

## Delivery Information

### Delivery Partners

**Porter (Same-Day):**
- Orders before 2 PM
- Within 150km radius
- Same-day delivery
- Real-time tracking

**Delhivery (24-Hour):**
- Orders after 2 PM
- Beyond 150km
- 24-hour delivery
- Tracking via waybill

### Delivery Process

1. **Order Confirmed** - Dealer approves
2. **Manifest Created** - Pickup details generated
3. **Pickup Scheduled** - Delivery partner assigned
4. **Picked Up** - Collected from dealer
5. **In Transit** - On the way
6. **Out for Delivery** - Final delivery
7. **Delivered** - OTP-based confirmation

### Tracking Your Delivery

**Get Tracking ID:**
```
Dashboard → My Orders → Select Order → View Tracking ID
```

**Track on Partner Site:**
- Porter: Use tracking ID on porter.in
- Delhivery: Use waybill on delhivery.com

---

## Best Practices

### For Customers

1. **Register Your Machines** - Get better recommendations
2. **Keep Profile Updated** - Accurate delivery addresses
3. **Order Before 2 PM** - For same-day delivery
4. **Use Part Numbers** - More accurate search
5. **Check Compatibility** - Before ordering
6. **Save Addresses** - Faster checkout
7. **Track Orders** - Stay informed

### For Dealers

1. **Respond Quickly** - Within SLA
2. **Keep Inventory Updated** - Accurate stock levels
3. **Use Partial Approval** - Better than rejection
4. **Maintain Performance** - High approval rates
5. **Sync with DMS** - Real-time inventory
6. **Communicate Issues** - Proactive support

### For Admins

1. **Monitor Performance** - Regular dealer reviews
2. **Update Catalog** - Keep products current
3. **Manage Pincodes** - Accurate service areas
4. **Review Tickets** - Quick resolution
5. **Analyze Data** - Improve routing
6. **Train Dealers** - Better performance

---

## Frequently Asked Questions

### General

**Q: Do I need an account to browse?**
A: No, but you need one to checkout.

**Q: What payment methods are accepted?**
A: Online payment, COD, and Credit terms (for dealers).

**Q: How long does delivery take?**
A: Same-day (before 2PM, <150km) or 24 hours.

### Orders

**Q: Can I cancel my order?**
A: Yes, before "CONFIRMED" status. Contact support.

**Q: What if item is out of stock?**
A: System automatically escalates to next dealer level.

**Q: Can I track my order?**
A: Yes, tracking ID provided after pickup.

### Parts

**Q: How do I know if a part fits my machine?**
A: Register your machine and use "Compatible Parts" feature.

**Q: What if I have a customized machine?**
A: Create a support ticket for custom part assistance.

**Q: Are parts genuine?**
A: Yes, all parts from authorized ACE dealers.

### Support

**Q: How do I contact support?**
A: Support tickets, WhatsApp, email, or phone.

**Q: How long for support response?**
A: 2-4 hours for tickets, 1-2 hours for WhatsApp.

**Q: Can support help me find parts?**
A: Yes, especially for customized machines.

---

## Glossary

**DMS** - Dealer Management System (inventory system)

**L1/L2/L3** - Dealer levels (Local/Regional/State)

**Manifest** - Delivery document with pickup/delivery details

**Part Number** - Unique identifier for each part (e.g., HYD-CYL-FX14-001)

**Pincode** - Postal code used for routing

**Routing** - Process of assigning order to dealer

**SLA** - Service Level Agreement (response time)

**Escalation** - Moving order to next dealer level

**Multi-Source** - Order fulfilled by multiple dealers

**Partial Approval** - Dealer fulfills some items, not all

---

## Contact Information

**Customer Support:**
- Phone: 1800-1800-004
- Email: helpdesk@ace-cranes.com
- WhatsApp: Available via support tickets

**Dealer Support:**
- Email: dealer-support@ace-cranes.com
- Phone: 1800-1800-005

**Admin Support:**
- Email: admin@ace-cranes.com

**Business Hours:**
- Monday - Saturday: 9:00 AM - 6:00 PM
- Sunday: Closed

---

## Version Information

**Platform Version:** 1.0.0
**Last Updated:** December 11, 2024
**Documentation Version:** 1.0

---

*This guide is regularly updated. For the latest information, visit the platform or contact support.*
