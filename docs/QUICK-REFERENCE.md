# ACE Platform - Quick Reference

## 🔗 Quick Links

### Customer
- **Homepage**: `/`
- **Products**: `/products`
- **Cart**: `/cart`
- **Checkout**: `/checkout`
- **Dashboard**: `/dashboard`
- **Login**: `/auth/login`
- **Register**: `/auth/register`

### Dealer
- **Login**: `/dealer/login`
- **Dashboard**: `/dealer/dashboard`

### Admin
- **Dashboard**: `/admin/dashboard`

### Demo & Testing
- **Routing Demo**: `/routing-demo`

---

## 📋 Common Workflows

### Customer: Place an Order

```
1. Browse products → /products
2. Add to cart
3. Go to cart → /cart
4. Proceed to checkout → /checkout
5. Enter delivery address (with pincode)
6. Select payment method
7. Review and place order
8. Get order confirmation
```

### Dealer: Approve Order

```
1. Login → /dealer/login
2. View pending orders
3. Check inventory
4. Approve/Reject/Partial approve
5. Order moves to next status
```

### Admin: Add Dealer

```
1. Login → /admin/dashboard
2. Go to Dealers section
3. Click "Add Dealer"
4. Fill details (name, level, service pincodes)
5. Save dealer
```

---

## 🎯 Order Routing Quick Guide

### Routing Levels
1. **L1** - Local dealers (fastest)
2. **L2** - Regional dealers
3. **L3** - State dealers
4. **Warehouse** - Central warehouse (slowest)

### How It Works
```
Customer Order (Pincode: 110020)
    ↓
L1 Dealers serving 110020
    ↓ (if no inventory)
L2 Regional Dealers
    ↓ (if no inventory)
L3 State Dealers
    ↓ (if no inventory)
Central Warehouse
```

### Test Pincodes
- **Delhi L1**: 110001, 110020, 110030, 110040
- **Mumbai L1**: 400001, 400053, 400070, 400080
- **Bangalore L2**: 560001, 560058, 560100

---

## 📊 Order Statuses

| Status | Meaning |
|--------|---------|
| `PENDING` | Order received |
| `ROUTING_L1` | Routed to L1 dealer |
| `ROUTING_L2` | Escalated to L2 |
| `ROUTING_L3` | Escalated to L3 |
| `ROUTING_WAREHOUSE` | At warehouse |
| `CONFIRMED` | Dealer approved |
| `PREPARING` | Being prepared |
| `READY_FOR_PICKUP` | Ready for delivery |
| `PICKED_UP` | Picked up |
| `IN_TRANSIT` | On the way |
| `OUT_FOR_DELIVERY` | Out for delivery |
| `DELIVERED` | Delivered |

---

## 🛠️ Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# DMS Integration
DMS_API_URL="https://dms.example.com"
DMS_API_KEY="your-api-key"

# Delivery Partners
PORTER_API_KEY="your-porter-key"
DELHIVERY_API_KEY="your-delhivery-key"

# WhatsApp
WHATSAPP_API_KEY="your-whatsapp-key"
WHATSAPP_PHONE_ID="your-phone-id"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

---

## 🧪 Testing Checklist

### Customer Flow
- [ ] Browse products without login
- [ ] Search and filter products
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Checkout with address
- [ ] Place order
- [ ] View order in dashboard
- [ ] Track order status

### Dealer Flow
- [ ] Login as dealer
- [ ] View pending orders
- [ ] Approve order
- [ ] Reject order
- [ ] Partial approve order
- [ ] View performance metrics

### Admin Flow
- [ ] Login as admin
- [ ] View all orders
- [ ] Manage dealers
- [ ] Manage products
- [ ] View support tickets

### Routing Logic
- [ ] Test L1 routing (pincode match)
- [ ] Test L2 escalation (L1 no inventory)
- [ ] Test L3 escalation
- [ ] Test warehouse fallback
- [ ] Test partial fulfillment
- [ ] Test multi-source orders

---

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Database
npx prisma migrate dev
npx prisma studio
npx prisma generate

# Seed data
npm run seed

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 📞 Support

- **User Guide**: `docs/USER-GUIDE.md`
- **Routing Logic**: `docs/order-routing-logic.md`
- **Customizations**: `docs/customized-machines.md`

---

## 🎨 UI Components

### Colors
- **Primary**: Blue (#2563eb)
- **Accent**: Red (#dc2626)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#eab308)

### Key Pages
- Homepage with hero section
- Product listing with filters
- Product detail with specs
- Shopping cart with summary
- Multi-step checkout
- User dashboard (tabbed)
- Dealer dashboard
- Admin dashboard

---

## 📦 Mock Data

Available in `lib/mockData.ts`:
- 8 Products
- 4 Machines
- 3 Dealers (L1, L2, L3)
- Sample orders
- Support tickets
- Part suggestions

---

## 🚨 Troubleshooting

### Server won't start
```bash
# Check port 3000 is free
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <pid> /F

# Restart
npm run dev
```

### Database errors
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### Build errors
```bash
# Clear cache
rm -rf .next
npm run build
```

---

*Last Updated: December 11, 2024*
