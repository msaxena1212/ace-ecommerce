# Order Routing Logic - Implementation Guide

## Overview

The ACE E-commerce platform implements a sophisticated multi-level order routing system that automatically routes orders to the most appropriate dealer based on:
1. **Customer Pincode** - Geographic proximity
2. **Dealer Level** - L1 (Local) → L2 (Regional) → L3 (State) → Warehouse (Central)
3. **Inventory Availability** - Actual stock quantities

## Routing Hierarchy

```
Customer Order
    ↓
┌─────────────────────────────────────────┐
│ L1 Dealers (Local - Pincode Match)     │
│ - Fastest delivery                      │
│ - Lowest shipping cost                  │
│ - Best customer experience              │
└─────────────────────────────────────────┘
    ↓ (If unavailable or rejected)
┌─────────────────────────────────────────┐
│ L2 Dealers (Regional)                   │
│ - Broader coverage                      │
│ - Backup for L1                         │
│ - Still relatively fast delivery        │
└─────────────────────────────────────────┘
    ↓ (If unavailable or rejected)
┌─────────────────────────────────────────┐
│ L3 Dealers (State Level)                │
│ - State-wide coverage                   │
│ - Backup for L1 and L2                  │
│ - Longer delivery time                  │
└─────────────────────────────────────────┘
    ↓ (If unavailable or rejected)
┌─────────────────────────────────────────┐
│ Central Warehouse (Final Fallback)      │
│ - Complete inventory                    │
│ - Ships anywhere                        │
│ - Longest delivery time                 │
└─────────────────────────────────────────┘
    ↓ (If unavailable)
┌─────────────────────────────────────────┐
│ Backorder / Out of Stock                │
└─────────────────────────────────────────┘
```

## How It Works

### Step 1: Customer Places Order

When a customer places an order, they provide:
- **Delivery Address** (including pincode)
- **Order Items** (products and quantities)

### Step 2: Pincode-Based Dealer Selection

The system identifies dealers who service the customer's pincode:

```typescript
function findDealersByPincode(pincode: string, level: 'L1' | 'L2' | 'L3') {
    return dealers.filter(dealer => 
        dealer.level === level && 
        dealer.isActive && 
        dealer.servicePincodes.includes(pincode)
    )
}
```

**Example:**
- Customer pincode: `110020` (Delhi)
- L1 dealers serving 110020: `ACE Delhi Central`

### Step 3: Inventory Checking

For each dealer, the system checks if they have sufficient inventory:

```typescript
function checkDealerInventory(dealerId: string, productId: string, requiredQuantity: number) {
    const inventory = dealerInventory[dealerId]
    const item = inventory.find(inv => inv.productId === productId)
    
    const actualAvailable = item.availableQuantity - item.reservedQuantity
    
    return {
        available: actualAvailable > 0,
        availableQuantity: actualAvailable,
        canFulfill: actualAvailable >= requiredQuantity
    }
}
```

**Example:**
- Product: Hydraulic Cylinder (HYD-CYL-FX14-001)
- Required: 5 units
- ACE Delhi Central inventory: 10 units available
- Result: ✓ Can fulfill

### Step 4: Routing Decision

The system makes routing decisions based on inventory:

#### Scenario A: Full Availability
```
Required: 5 units
Available at L1: 10 units
→ Route to L1 dealer
→ Order confirmed
```

#### Scenario B: Partial Availability
```
Required: 15 units
Available at L1: 8 units
→ Partial fulfillment by L1 (8 units)
→ Remaining 7 units escalated to L2
```

#### Scenario C: No Availability at L1
```
Required: 5 units
Available at L1: 0 units
→ Escalate to L2 dealers
→ Check L2 inventory
```

#### Scenario D: Multi-Source Order
```
Item 1: Available at L1 Delhi
Item 2: Available at L2 Bangalore
→ Multi-source order
→ Create separate manifests
→ Coordinate deliveries
```

## Implementation Details

### Dealer Inventory Structure

```typescript
const dealerInventory = {
    'dealer-001': [ // ACE Delhi Central (L1)
        {
            productId: 'prod-001',
            partNumber: 'HYD-CYL-FX14-001',
            availableQuantity: 10,
            reservedQuantity: 2,  // Already allocated to other orders
            location: 'Warehouse A'
        }
    ]
}
```

### Routing Algorithm

```typescript
export function routeOrderItem(pincode: string, orderItem: OrderItem): RoutingResult {
    // Step 1: Try L1 dealers
    const l1Dealers = findDealersByPincode(pincode, 'L1')
    for (const dealer of l1Dealers) {
        const inventory = checkDealerInventory(dealer.id, orderItem.productId, orderItem.quantity)
        if (inventory.canFulfill) {
            return { success: true, dealerId: dealer.id, level: 'L1' }
        }
    }
    
    // Step 2: Escalate to L2
    const l2Dealers = findDealersByPincode(pincode, 'L2')
    for (const dealer of l2Dealers) {
        const inventory = checkDealerInventory(dealer.id, orderItem.productId, orderItem.quantity)
        if (inventory.canFulfill) {
            return { success: true, dealerId: dealer.id, level: 'L2' }
        }
    }
    
    // Step 3: Escalate to L3
    // Step 4: Fallback to Warehouse
    // Step 5: Out of stock
}
```

## Demo Page

An interactive demo is available at `/routing-demo` that allows you to:

1. **Enter Customer Pincode** - Test different pincodes
2. **Select Products and Quantities** - Configure order items
3. **See Routing Results** - Visual representation of routing decisions
4. **View Dealer Inventory** - Reference for available stock

### Available Test Pincodes

**L1 Delhi:**
- 110001, 110020, 110030, 110040

**L1 Mumbai:**
- 400001, 400053, 400070, 400080

**L2 Bangalore:**
- 560001, 560058, 560100

### Sample Inventory

**ACE Delhi Central (L1):**
- HYD-CYL-FX14-001: 10 units
- WIRE-ROPE-20MM: 30 units

**ACE Mumbai West (L1):**
- HYD-CYL-FX14-001: 8 units
- BOOM-EXT-KIT-001: 3 units

**ACE Bangalore Hub (L2):**
- HYD-CYL-FX14-001: 15 units
- BOOM-EXT-KIT-001: 5 units
- WIRE-ROPE-20MM: 40 units

## Real-World Integration

### DMS Integration

In production, the inventory check integrates with the Dealer Management System (DMS):

```typescript
async function checkDealerInventory(dealerId: string, orderItems: any[]) {
    const dmsResponse = await fetch(`${process.env.DMS_API_URL}/inventory`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.DMS_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dealerId,
            items: orderItems.map(item => ({
                partNumber: item.product.partNumber,
                quantity: item.quantity,
            })),
        }),
    })
    
    const inventory = await dmsResponse.json()
    return inventory.available === true
}
```

### Dealer Response Workflow

1. **Order Routed** → Dealer receives notification
2. **Dealer Reviews** → Checks actual inventory in DMS
3. **Dealer Responds** → Approve, Reject, or Partial Approve

**Approve:**
```typescript
await approveOrder(orderId, dealerId, "Order confirmed, ready for pickup")
```

**Reject:**
```typescript
await rejectOrder(orderId, dealerId, "Item out of stock")
// System automatically escalates to next level
```

**Partial Approve:**
```typescript
await partialApproveOrder(orderId, dealerId, [
    { itemId: 'item-001', quantity: 5 }  // Can fulfill 5 out of 10
])
// Remaining quantity escalates to next level
```

## Performance Optimization

### Dealer Priority Scoring

Dealers are sorted by priority before routing:

```typescript
function getDealerPriority(dealerId: string): number {
    const dealer = dealers.find(d => d.id === dealerId)
    const approvalRate = (dealer.approvedOrders / dealer.totalOrders) * 100
    
    // 60% performance score + 40% approval rate
    return (dealer.performanceScore * 0.6) + (approvalRate * 0.4)
}
```

Higher priority dealers get orders first, incentivizing:
- Fast response times
- High approval rates
- Good customer service

## Edge Cases Handled

### 1. No Dealers Serve Pincode
- System finds nearest dealers at same level
- Falls back to higher levels
- Ensures order is never lost

### 2. Partial Inventory
- Splits order across multiple dealers
- Creates separate manifests
- Coordinates delivery

### 3. All Dealers Reject
- Escalates through all levels
- Final fallback to warehouse
- Backorder if warehouse also out of stock

### 4. Multi-Item Orders
- Routes each item independently
- May result in multi-source fulfillment
- Optimizes for fastest overall delivery

## Benefits

### For Customers
✓ Fastest possible delivery
✓ Automatic routing to nearest dealer
✓ No manual dealer selection needed
✓ Transparent tracking

### For Dealers
✓ Orders automatically routed based on capability
✓ Performance-based prioritization
✓ Clear SLA expectations
✓ Inventory integration

### For Business
✓ Optimized fulfillment costs
✓ Better inventory utilization
✓ Reduced delivery times
✓ Data-driven dealer management

## Testing the System

Visit `/routing-demo` to test the routing logic interactively:

1. Enter a pincode (e.g., `110020` for Delhi)
2. Select products and quantities
3. Click "Route Order"
4. See which dealer gets the order and why

The demo shows:
- Which dealer level was selected (L1, L2, L3, Warehouse)
- Available inventory at that dealer
- Routing decision explanation
- Visual flow diagram

## Next Steps

1. **DMS Integration** - Connect to real inventory system
2. **Real-Time Updates** - WebSocket for live inventory
3. **Predictive Routing** - ML-based dealer selection
4. **Dynamic Pricing** - Distance-based shipping costs
5. **Smart Consolidation** - Combine nearby orders
