# ACE E-commerce Platform

A comprehensive e-commerce platform for ACE Cranes with multi-level dealer inventory routing, real-time DMS integration, and smart delivery partner selection.

## 📚 Documentation

- **[Complete User Guide](docs/USER-GUIDE.md)** - Comprehensive guide for all users
- **[Order Routing Logic](docs/order-routing-logic.md)** - Detailed routing system explanation
- **[Customized Machines](docs/customized-machines.md)** - Machine customization features
- **[Use Cases & Edge Cases](docs/use-cases-edge-cases.md)** - Scenarios and handling
- **[Walkthrough](../brain/9ee23f28-d04a-45f1-8d5d-38b22f06d1f0/walkthrough.md)** - Prototype walkthrough

## 🚀 Quick Start

### For Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### For Testing

**Customer Flow:**
1. Browse products at `/products`
2. Add items to cart
3. Checkout at `/checkout`
4. View dashboard at `/dashboard`

**Dealer Flow:**
1. Login at `/dealer/login`
2. View pending orders at `/dealer/dashboard`
3. Approve/reject orders

**Admin Flow:**
1. Access admin portal at `/admin/dashboard`
2. Manage dealers, products, and orders

**Routing Demo:**
- Visit `/routing-demo` to test the L1→L2→L3 routing logic

## 🚀 Features

### Customer Features
- **Guest Browsing**: Browse products without registration
- **Forced Login at Checkout**: Unregistered users must login/register before completing purchase
- **Product Catalog**: Browse by category, search, filter
- **Shopping Cart**: Add items, adjust quantities
- **Multiple Payment Methods**: Online payment, COD, Credit terms
- **Order Tracking**: Real-time order status and tracking
- **Returns Management**: Easy return initiation with photo upload
- **My Products**: Machine ownership history and management
- **Customized Machine Support**: WhatsApp-based support for custom parts
- **Smart Part Suggestions**: AI-powered recommendations based on machines

### Dealer Features
- **Order Management**: View and manage routed orders
- **DMS Integration**: Real-time inventory checking
- **Approve/Reject Orders**: With reason tracking
- **Partial Approval**: Fulfill partial quantities
- **Performance Metrics**: Track approval rates and performance scores
- **Manifest Management**: View and manage delivery manifests

### Admin Features
- **Dashboard**: Overview of all orders and dealers
- **Dealer Management**: Add, edit, configure dealers (L1/L2/L3)
- **Order Routing Override**: Manual intervention when needed
- **Analytics**: Dealer performance, routing efficiency
- **Support Ticket Management**: Handle customer inquiries
- **Machine Repository**: Comprehensive database of all machines and parts

### Core System Features
- **Multi-Level Routing**: L1 → L2 → L3 → Warehouse escalation
- **Smart Delivery**: Porter (same-day ≤150km before 2PM) or Delhivery (24hrs)
- **Multi-Source Orders**: Consolidate items from multiple dealers
- **DMS Sync**: Real-time inventory synchronization
- **Manifest Generation**: Automatic delivery manifest creation
- **Webhook Support**: DMS and delivery partner webhooks
- **Part Compatibility Engine**: Automatic filtering based on machine customizations
- **Intelligent Suggestions**: ML-like recommendations based on user behavior

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **APIs**: RESTful API routes

### Database Schema
- Users & Authentication
- Products & Catalog
- Orders & Order Items
- Dealers (L1, L2, L3, Warehouse)
- Order Routing
- Manifests
- Returns
- **Machines & Customizations** (NEW)
- **Customer Machines** (NEW)
- **Part Compatibility** (NEW)
- **Support Tickets** (NEW)
- **Part Suggestions** (NEW)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- DMS API access (optional)
- Porter API credentials (optional)
- Delhivery API credentials (optional)

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ace_ecommerce"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Add DMS and delivery partner credentials
DMS_API_URL="https://dms-api.example.com"
DMS_API_KEY="your-dms-api-key"
PORTER_API_KEY="your-porter-key"
DELHIVERY_API_KEY="your-delhivery-key"
```

3. **Setup Database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔄 Order Flow

### 1. Customer Places Order
- Customer adds items to cart
- Proceeds to checkout (forced login if guest)
- Selects delivery address
- Chooses payment method
- Places order

### 2. Order Routing
```
Order Created
    ↓
Route to L1 Dealer (based on customer pincode)
    ↓
L1 Checks DMS Inventory
    ↓
┌─────────────┬─────────────┬─────────────┐
│ L1 Approves │ L1 Rejects  │ L1 Partial  │
└─────────────┴─────────────┴─────────────┘
      ↓              ↓              ↓
  Confirmed    Route to L2    Split Order
                     ↓              ↓
              L2 Checks DMS   L1 fulfills partial
                     ↓         Remaining → L2
              ┌──────┴──────┐
              │ L2 Approves │ L2 Rejects
              └─────────────┴─────────────
                    ↓              ↓
                Confirmed    Route to L3
                                   ↓
                            L3 Checks DMS
                                   ↓
                            ┌──────┴──────┐
                            │ L3 Approves │ L3 Rejects
                            └─────────────┴─────────────
                                  ↓              ↓
                              Confirmed    Route to Warehouse
                                                 ↓
                                          Warehouse Check
                                                 ↓
                                          ┌──────┴──────┐
                                          │  Available  │ Out of Stock
                                          └─────────────┴─────────────
                                                ↓              ↓
                                            Confirmed    Backorder/Cancel
```

### 3. Manifest Creation
- System creates manifest with pickup and delivery details
- Selects delivery partner:
  - **Porter**: Before 2 PM + ≤150km → Same-day delivery
  - **Delhivery**: After 2 PM or >150km → 24-hour delivery
- Calls delivery partner API
- Updates order with tracking ID

### 4. Delivery
- Delivery partner picks up from dealer/warehouse
- Real-time tracking updates via webhooks
- Customer receives notifications
- OTP-based delivery confirmation

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products
- `GET /api/products` - List products (with filters, search, pagination)
- `GET /api/products/[id]` - Get product details

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove from cart

### Orders
- `POST /api/checkout` - Create order from cart
- `GET /api/orders` - List user's orders
- `GET /api/orders/[id]` - Get order details

### Dealer APIs
- `GET /api/dealer/orders` - List orders routed to dealer
- `POST /api/dealer/orders/[id]/approve` - Approve order
- `POST /api/dealer/orders/[id]/reject` - Reject order
- `GET /api/dealer/inventory` - Get dealer inventory from DMS

### Machine Management (NEW)
- `GET /api/machines` - Get customer's machines
- `POST /api/machines` - Register new machine
- `GET /api/machines/[id]/compatible-parts` - Get compatible parts

### Support (NEW)
- `GET /api/support/tickets` - Get customer's tickets
- `POST /api/support/tickets` - Create support ticket
- `POST /api/support/tickets/[id]/confirm-parts` - Confirm parts (Admin)

### Suggestions (NEW)
- `GET /api/suggestions` - Get personalized part suggestions

## 🔌 Integrations

### DMS (Dealer Management System)
Located in `lib/services/dmsService.ts`

- `checkDMSInventory()` - Check item availability
- `updateDMSInventory()` - Update stock levels
- `syncDealerInventory()` - Full inventory sync
- `handleDMSWebhook()` - Process DMS updates

### Porter Integration
Located in `lib/services/manifestService.ts`

- Same-day delivery for orders before 2 PM within 150km
- API integration for shipment creation
- Real-time tracking

### Delhivery Integration
Located in `lib/services/manifestService.ts`

- 24-hour delivery for all other orders
- Waybill generation
- Tracking and status updates

## 📊 Dealer Levels

### L1 Dealers
- First priority for order fulfillment
- Serve specific pincodes
- Fastest delivery to customers

### L2 Dealers
- Second priority
- Broader service area
- Backup for L1 dealers

### L3 Dealers
- Third priority
- Regional coverage
- Backup for L1 and L2

### Warehouse
- Final fallback
- Central inventory
- Ships anywhere

## 🎯 Key Services

### Order Routing Service
`lib/services/orderRouting.ts`

- `routeOrder()` - Main routing function
- `approveOrder()` - Handle dealer approval
- `rejectOrder()` - Handle rejection and escalation
- `partialApproveOrder()` - Handle partial fulfillment

### Manifest Service
`lib/services/manifestService.ts`

- `createManifest()` - Single manifest creation
- `createMultiSourceManifests()` - Multi-dealer orders
- `updateManifestStatus()` - Webhook handler

### Delivery Logic
`lib/utils/deliveryLogic.ts`

- `calculateDeliveryPartner()` - Porter vs Delhivery selection
- `calculateDistance()` - Distance calculation
- `checkServiceability()` - Pincode serviceability

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run E2E tests
npm run test:e2e
```

## 📝 Workflows

Detailed workflows are available in `.agent/workflows/ecommerce-workflow.md`:
- User journeys (registered/unregistered)
- Dealer approval workflows
- Inventory routing
- Delivery partner selection
- Multi-source order handling
- Edge cases and error handling

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (Customer, Dealer, Admin)
- API route protection
- Input validation with Zod

## 🚧 Development Status

### ✅ Completed
- Project structure and configuration
- Database schema with Prisma (17 models)
- Order routing system (L1→L2→L3→Warehouse)
- DMS integration service
- Manifest generation
- Delivery partner integration
- Authentication system
- Core API endpoints
- **Customized machine support** (NEW)
- **Machine registration and history** (NEW)
- **Part compatibility engine** (NEW)
- **Support ticket system with WhatsApp** (NEW)
- **Smart part suggestions** (NEW)
- **Comprehensive repository** (NEW)

### 🚧 In Progress
- Frontend pages (products, cart, checkout)
- Dealer dashboard
- Admin dashboard

### 📋 Planned
- Payment gateway integration
- Email notifications
- SMS notifications
- Advanced analytics
- Mobile app
- WhatsApp Business API integration

## 📄 License

Copyright © 2024 ACE Cranes. All rights reserved.

## 🤝 Support

For support, email helpdesk@ace-cranes.com or call 1800-1800-004.
