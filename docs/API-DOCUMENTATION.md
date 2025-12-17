# ACE E-commerce Platform - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All API endpoints (except public product browsing) require authentication via NextAuth.js session cookies.

---

## Products API

### GET /api/products
Get all products with optional filtering

**Query Parameters:**
- `category` (string) - Filter by category
- `search` (string) - Search in name, part number, description
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `isCustomPart` (boolean) - Filter custom parts

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-001",
      "partNumber": "HYD-CYL-FX14-001",
      "name": "Hydraulic Cylinder",
      "price": 45000,
      "stock": 25,
      "category": "Hydraulic Parts",
      "isCustomPart": false
    }
  ],
  "count": 1
}
```

### POST /api/products
Create a new product (Admin only)

**Request Body:**
```json
{
  "partNumber": "PART-001",
  "name": "Product Name",
  "description": "Description",
  "category": "Category",
  "price": 10000,
  "stock": 50,
  "specifications": {},
  "images": [],
  "isCustomPart": false,
  "compatibleMachines": []
}
```

---

## Cart API

### GET /api/cart
Get current user's cart

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart-001",
    "userId": "user-001",
    "items": [
      {
        "id": "item-001",
        "productId": "prod-001",
        "quantity": 2,
        "product": { ... }
      }
    ]
  }
}
```

### POST /api/cart
Add item to cart

**Request Body:**
```json
{
  "productId": "prod-001",
  "quantity": 2
}
```

### DELETE /api/cart
Clear entire cart

---

## Cart Items API

### PUT /api/cart/[id]
Update cart item quantity

**Request Body:**
```json
{
  "quantity": 5
}
```

### DELETE /api/cart/[id]
Remove item from cart

---

## Orders API

### GET /api/orders
Get all orders for current user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-001",
      "orderNumber": "ORD-2024-001",
      "status": "CONFIRMED",
      "totalAmount": 50000,
      "items": [...],
      "routing": [...]
    }
  ]
}
```

### POST /api/orders
Create order from cart

**Request Body:**
```json
{
  "deliveryAddress": {
    "name": "John Doe",
    "phone": "+91-9876543210",
    "addressLine1": "123 Street",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110020"
  },
  "paymentMethod": "ONLINE",
  "paymentDetails": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-001",
    "orderNumber": "ORD-2024-001",
    "status": "ROUTING_L1",
    "totalAmount": 50000
  }
}
```

### GET /api/orders/[id]
Get specific order details

### PATCH /api/orders/[id]
Update order status

**Request Body:**
```json
{
  "status": "DELIVERED",
  "trackingId": "TRACK123",
  "deliveryPartnerId": "partner-001"
}
```

---

## Dealer Orders API

### GET /api/dealer/orders
Get orders routed to current dealer

**Query Parameters:**
- `status` (string) - Filter by routing status (PENDING, APPROVED, REJECTED)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "order-001",
      "orderNumber": "ORD-2024-001",
      "status": "ROUTING_L1",
      "items": [...],
      "routing": [
        {
          "dealerId": "dealer-001",
          "status": "PENDING",
          "createdAt": "2024-12-11T10:00:00Z"
        }
      ],
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210"
      }
    }
  ]
}
```

### POST /api/dealer/orders/[id]/approve
Approve order (existing)

### POST /api/dealer/orders/[id]/reject
Reject order (existing)

---

## Admin Dealers API

### GET /api/admin/dealers
Get all dealers

**Query Parameters:**
- `level` (string) - Filter by level (L1, L2, L3, WAREHOUSE)
- `isActive` (boolean) - Filter active/inactive

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "dealer-001",
      "name": "ACE Delhi Central",
      "level": "L1",
      "performanceScore": 95.5,
      "totalOrders": 150,
      "approvedOrders": 143,
      "rejectedOrders": 7
    }
  ]
}
```

### POST /api/admin/dealers
Create new dealer

**Request Body:**
```json
{
  "name": "Dealer Name",
  "email": "dealer@example.com",
  "phone": "+91-9876543210",
  "level": "L1",
  "address": "Address",
  "city": "City",
  "state": "State",
  "pincode": "110001",
  "servicePincodes": ["110001", "110020"],
  "responseSLA": 120
}
```

### GET /api/admin/dealers/[id]
Get dealer details

### PATCH /api/admin/dealers/[id]
Update dealer

### DELETE /api/admin/dealers/[id]
Deactivate dealer

---

## Admin Orders API

### GET /api/admin/orders
Get all orders in system

**Query Parameters:**
- `status` (string) - Filter by status
- `dealerId` (string) - Filter by dealer

---

## Admin Analytics API

### GET /api/admin/analytics
Get platform analytics

**Query Parameters:**
- `startDate` (ISO date) - Start date for analytics
- `endDate` (ISO date) - End date for analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalOrders": 427,
      "totalRevenue": 15600000,
      "totalDealers": 15,
      "totalProducts": 250,
      "totalUsers": 1200
    },
    "ordersByStatus": [...],
    "revenueByMonth": [...],
    "dealerPerformance": [...]
  }
}
```

---

## User Machines API

### GET /api/user/machines
Get user's registered machines

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm-001",
      "machineId": "mach-001",
      "serialNumber": "ACE-FX14-2024-001",
      "nickname": "Main Crane",
      "purchaseDate": "2024-01-15",
      "hasCustomization": true,
      "machine": {...},
      "customizations": [...]
    }
  ]
}
```

### POST /api/user/machines
Register new machine

**Request Body:**
```json
{
  "machineId": "mach-001",
  "serialNumber": "ACE-FX14-2024-001",
  "nickname": "Main Crane",
  "purchaseDate": "2024-01-15",
  "hasCustomization": true,
  "customizations": ["cust-001", "cust-002"]
}
```

---

## User Profile API

### GET /api/user/profile
Get current user profile

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "role": "CUSTOMER",
    "_count": {
      "orders": 12,
      "machines": 3
    }
  }
}
```

### PATCH /api/user/profile
Update user profile

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91-9876543210"
}
```

---

## Machines API (Existing)

### GET /api/machines
Get all machine types

### GET /api/machines/[id]/compatible-parts
Get compatible parts for machine

---

## Support Tickets API (Existing)

### GET /api/support/tickets
Get user's support tickets

### POST /api/support/tickets
Create new support ticket

### POST /api/support/tickets/[id]/confirm-parts
Confirm parts for ticket (Admin/Support)

---

## Suggestions API (Existing)

### GET /api/suggestions
Get personalized part suggestions

---

## Authentication API (Existing)

### POST /api/auth/register
Register new user

### POST /api/auth/[...nextauth]
NextAuth.js authentication endpoints

---

## Checkout API (Existing)

### POST /api/checkout
Process checkout

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Order Statuses

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
- `CANCELLED` - Order cancelled
- `RETURNED` - Order returned

---

## Routing Statuses

- `PENDING` - Awaiting dealer response
- `APPROVED` - Dealer approved
- `REJECTED` - Dealer rejected
- `TIMEOUT` - Dealer didn't respond in SLA

---

## Implementation Notes

### Authentication
All routes currently use mock user IDs. Implement proper authentication:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const session = await getServerSession(authOptions)
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const userId = session.user.id
```

### Authorization
Add role-based access control:

```typescript
if (session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Validation
Add request validation using Zod or similar:

```typescript
import { z } from 'zod'

const schema = z.object({
  productId: z.string(),
  quantity: z.number().positive()
})

const validated = schema.parse(body)
```

### Rate Limiting
Implement rate limiting for API endpoints

### Caching
Add caching for frequently accessed data

### Pagination
Add pagination for list endpoints:

```typescript
const page = parseInt(searchParams.get('page') || '1')
const limit = parseInt(searchParams.get('limit') || '20')
const skip = (page - 1) * limit

const products = await prisma.product.findMany({
  skip,
  take: limit
})
```

---

## Testing

Use tools like Postman, Insomnia, or curl to test endpoints:

```bash
# Get products
curl http://localhost:3000/api/products

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"deliveryAddress": {...}, "paymentMethod": "ONLINE"}'
```

---

*Last Updated: December 11, 2024*
