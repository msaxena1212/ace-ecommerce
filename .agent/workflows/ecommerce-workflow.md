---
description: ACE E-commerce Platform - Complete User and System Workflows
---

# ACE E-commerce Platform Workflows

## 1. User Journey Workflows

### 1.1 Unregistered User Flow

```mermaid
flowchart TD
    A[User Visits Website] --> B{Browse Products}
    B --> C[View Product Details]
    C --> D[Add to Cart]
    D --> E{Continue Shopping?}
    E -->|Yes| B
    E -->|No| F[Proceed to Checkout]
    F --> G{User Logged In?}
    G -->|No| H[Login/Register Prompt]
    H --> I{Choose Action}
    I -->|Login| J[Login Form]
    I -->|Register| K[Registration Form]
    J --> L[Verify Credentials]
    K --> M[Create Account]
    L --> N[Checkout Page]
    M --> N
    G -->|Yes| N
    N --> O[Enter Delivery Address]
    O --> P[Select Delivery Option]
    P --> Q[Review Order]
    Q --> R[Place Order]
    R --> S[Order Confirmation]
```

### 1.2 Registered User Flow

```mermaid
flowchart TD
    A[User Logs In] --> B[Browse Products]
    B --> C[View Product Details]
    C --> D{Action}
    D -->|Add to Cart| E[Shopping Cart]
    D -->|Add to Wishlist| F[Wishlist]
    D -->|Continue Browsing| B
    E --> G{Proceed to Checkout?}
    G -->|Yes| H[Checkout Page]
    G -->|No| B
    H --> I{Saved Addresses?}
    I -->|Yes| J[Select Address]
    I -->|No| K[Enter New Address]
    J --> L[Select Delivery Option]
    K --> L
    L --> M[Review Order]
    M --> N[Place Order]
    N --> O[Order Confirmation]
```

## 2. Inventory & Dealer Workflow

### 2.1 Order Routing & Approval Flow

```mermaid
flowchart TD
    A[Order Placed] --> B[Check L1 Dealer DMS]
    B --> C{Item Available at L1?}
    C -->|Yes| D[L1 Dealer Reviews Order]
    C -->|No| E[Route to L2 Dealer]
    D --> F{L1 Approves?}
    F -->|Yes| G[L1 Confirms Order]
    F -->|No - Out of Stock| E
    F -->|No - Rejected| H[Order Cancelled/Refunded]
    E --> I[Check L2 Dealer DMS]
    I --> J{Item Available at L2?}
    J -->|Yes| K[L2 Dealer Reviews Order]
    J -->|No| L[Route to L3 Dealer]
    K --> M{L2 Approves?}
    M -->|Yes| N[L2 Confirms Order]
    M -->|No - Out of Stock| L
    M -->|No - Rejected| H
    L --> O[Check L3 Dealer DMS]
    O --> P{Item Available at L3?}
    P -->|Yes| Q[L3 Dealer Reviews Order]
    P -->|No| R[Route to Warehouse]
    Q --> S{L3 Approves?}
    S -->|Yes| T[L3 Confirms Order]
    S -->|No - Out of Stock| R
    S -->|No - Rejected| H
    R --> U[Check Warehouse Inventory]
    U --> V{Item Available?}
    V -->|Yes| W[Warehouse Confirms]
    V -->|No| X[Notify Customer - Out of Stock]
    X --> Y[Offer Alternatives/Backorder]
    G --> Z[Create Manifest]
    N --> Z
    T --> Z
    W --> Z
```

### 2.2 Multi-Item Order Routing

```mermaid
flowchart TD
    A[Order with Multiple Items] --> B[Split Order by Item]
    B --> C[Item 1 Routing]
    B --> D[Item 2 Routing]
    B --> E[Item N Routing]
    C --> F[Check L1→L2→L3→Warehouse]
    D --> G[Check L1→L2→L3→Warehouse]
    E --> H[Check L1→L2→L3→Warehouse]
    F --> I{Item 1 Confirmed?}
    G --> J{Item 2 Confirmed?}
    H --> K{Item N Confirmed?}
    I -->|Yes| L[Dealer/Warehouse A]
    J -->|Yes| M[Dealer/Warehouse B]
    K -->|Yes| N[Dealer/Warehouse C]
    L --> O{All Items Confirmed?}
    M --> O
    N --> O
    O -->|Yes| P[Create Multi-Source Manifest]
    O -->|No| Q[Partial Order Handling]
    Q --> R{User Decision}
    R -->|Accept Partial| S[Create Manifest for Available Items]
    R -->|Wait for All| T[Hold Order Until Complete]
    R -->|Cancel| U[Refund Order]
```

## 3. Delivery Workflow

### 3.1 Delivery Partner Selection

```mermaid
flowchart TD
    A[Order Confirmed by Dealer/Warehouse] --> B{Check Order Time}
    B -->|Before 2 PM| C{Distance ≤ 150km?}
    B -->|After 2 PM| D[Delhivery - 24hr Delivery]
    C -->|Yes| E[Porter - Same Day Delivery]
    C -->|No| D
    E --> F[Create Porter Manifest]
    D --> G[Create Delhivery Manifest]
    F --> H[API Call to Porter]
    G --> I[API Call to Delhivery]
    H --> J{Porter Accepts?}
    I --> K{Delhivery Accepts?}
    J -->|Yes| L[Porter Pickup Scheduled]
    J -->|No| M[Fallback to Delhivery]
    K -->|Yes| N[Delhivery Pickup Scheduled]
    K -->|No| O[Manual Intervention Required]
    L --> P[Notify Dealer/Warehouse]
    N --> P
    M --> N
    P --> Q[Notify Customer]
```

### 3.2 Manifest Creation & Pickup

```mermaid
flowchart TD
    A[All Items Confirmed] --> B{Single or Multiple Sources?}
    B -->|Single Source| C[Create Single Manifest]
    B -->|Multiple Sources| D[Create Multi-Pickup Manifest]
    C --> E[Manifest Details]
    D --> F[Multiple Manifest Details]
    E --> G[Pickup Location: Dealer/Warehouse]
    E --> H[Delivery Location: Customer]
    E --> I[Item Details & Quantity]
    E --> J[Packaging Requirements]
    F --> K[Pickup 1: Dealer A]
    F --> L[Pickup 2: Dealer B]
    F --> M[Pickup N: Warehouse]
    K --> N[Consolidation Point?]
    L --> N
    M --> N
    N -->|Yes| O[Consolidate at Hub]
    N -->|No| P[Direct Delivery to Customer]
    O --> P
    G --> Q[Send to Delivery Partner API]
    H --> Q
    I --> Q
    J --> Q
    P --> Q
    Q --> R[Track Shipment]
    R --> S[Update Customer]
```

## 4. Payment Workflow

### 4.1 Payment Processing

```mermaid
flowchart TD
    A[User Places Order] --> B{Payment Method}
    B -->|Online Payment| C[Payment Gateway]
    B -->|COD| D[Cash on Delivery]
    B -->|Credit Terms| E[Check Credit Limit]
    C --> F{Payment Success?}
    F -->|Yes| G[Payment Confirmed]
    F -->|No| H[Payment Failed]
    H --> I{Retry?}
    I -->|Yes| C
    I -->|No| J[Order Cancelled]
    E --> K{Credit Approved?}
    K -->|Yes| L[Order on Credit]
    K -->|No| M[Request Different Payment]
    D --> N[Order Confirmed - COD]
    G --> O[Start Order Processing]
    L --> O
    N --> O
```

## 5. Dealer Dashboard Workflow

### 5.1 Dealer Order Management

```mermaid
flowchart TD
    A[Dealer Logs In] --> B[View Pending Orders]
    B --> C[Select Order]
    C --> D[Check DMS Inventory]
    D --> E{Physical Stock Available?}
    E -->|Yes| F{DMS Shows Available?}
    E -->|No| G{DMS Shows Available?}
    F -->|Yes| H[Approve Order]
    F -->|No| I[Update DMS First]
    I --> H
    G -->|Yes| J[Update DMS - Out of Stock]
    G -->|No| K[Reject Order]
    J --> K
    K --> L[Order Routes to Next Level]
    H --> M[Confirm Pickup Details]
    M --> N[Wait for Delivery Partner]
    N --> O[Prepare Package]
    O --> P[Handover to Delivery Partner]
    P --> Q[Update Order Status]
```

## 6. Edge Case Workflows

### 6.1 DMS Inventory Mismatch

```mermaid
flowchart TD
    A[Dealer Receives Order] --> B[Check DMS]
    B --> C{DMS Shows Available}
    C --> D[Check Physical Stock]
    D --> E{Physical Stock Available?}
    E -->|No - Sold but not updated| F[Update DMS Immediately]
    F --> G[Reject Order]
    G --> H[Route to Next Level]
    E -->|Yes| I[Approve Order]
```

### 6.2 Partial Availability

```mermaid
flowchart TD
    A[Order: 10 Units] --> B[L1 Has: 5 Units]
    B --> C{Accept Partial?}
    C -->|Yes - Split Order| D[L1 Confirms 5 Units]
    C -->|No - All or Nothing| E[Route Entire Order to L2]
    D --> F[Remaining 5 to L2]
    F --> G[L2 Processing]
    E --> H[L2 Processing]
```

### 6.3 All Dealers Reject

```mermaid
flowchart TD
    A[L1 Rejects] --> B[L2 Rejects]
    B --> C[L3 Rejects]
    C --> D[Warehouse Check]
    D --> E{Warehouse Has Stock?}
    E -->|Yes| F[Warehouse Fulfills]
    E -->|No| G[Notify Customer]
    G --> H{Customer Options}
    H -->|Backorder| I[Add to Backorder Queue]
    H -->|Alternative Product| J[Suggest Alternatives]
    H -->|Cancel| K[Process Refund]
```

### 6.4 Delivery Partner Unavailable

```mermaid
flowchart TD
    A[Porter API Call] --> B{Porter Available?}
    B -->|No| C[Try Delhivery]
    C --> D{Delhivery Available?}
    D -->|No| E[Manual Logistics Arrangement]
    E --> F[Notify Operations Team]
    F --> G[Contact Customer]
    G --> H[Arrange Alternative Delivery]
```

## 7. Return & Refund Workflow

### 7.1 Return Process

```mermaid
flowchart TD
    A[Customer Initiates Return] --> B{Return Reason}
    B -->|Defective| C[Approve Return]
    B -->|Wrong Item| C
    B -->|Changed Mind| D{Within Return Window?}
    D -->|Yes| C
    D -->|No| E[Return Denied]
    C --> F[Generate Return Manifest]
    F --> G[Schedule Pickup]
    G --> H[Item Picked Up]
    H --> I[Return to Original Dealer/Warehouse]
    I --> J[Quality Check]
    J --> K{Item Condition OK?}
    K -->|Yes| L[Process Refund]
    K -->|No| M[Contact Customer]
    M --> N{Resolution}
    N -->|Partial Refund| O[Process Partial Refund]
    N -->|No Refund| P[Return Item to Customer]
```

## Workflow Summary

This document covers:
1. **User Journeys**: Registered and unregistered user flows
2. **Inventory Management**: L1→L2→L3→Warehouse routing
3. **Dealer Workflows**: Order approval and fulfillment
4. **Delivery Integration**: Porter and Delhivery selection logic
5. **Manifest Creation**: Single and multi-source pickups
6. **Edge Cases**: DMS mismatches, partial availability, rejections
7. **Payment Processing**: Multiple payment methods
8. **Returns**: Complete return and refund process
