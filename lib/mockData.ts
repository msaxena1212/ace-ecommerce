// Mock data for the ACE E-commerce platform

export const mockProducts = [
    {
        id: 'prod-001',
        partNumber: 'HYD-CYL-FX14-001',
        name: 'Hydraulic Cylinder - FX14',
        description: 'Heavy-duty hydraulic cylinder designed for ACE FX14 Mobile Crane. High-pressure rated with corrosion-resistant coating.',
        category: 'Hydraulic Parts',
        price: 45000,
        images: ['/api/placeholder/400/400'],
        specifications: {
            pressure: '350 bar',
            stroke: '1200mm',
            bore: '100mm',
            weight: '45kg'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 15
    },
    {
        id: 'prod-002',
        partNumber: 'BOOM-EXT-KIT-001',
        name: 'Boom Extension Kit',
        description: 'Complete boom extension kit for mobile cranes. Includes all mounting hardware and hydraulic connections.',
        category: 'Structural Parts',
        price: 125000,
        images: ['/api/placeholder/400/400'],
        specifications: {
            length: '5m',
            capacity: '10 tons',
            material: 'High-strength steel',
            weight: '850kg'
        },
        isActive: true,
        isCustomPart: true,
        customizationRequired: ['custom-001'],
        stock: 5
    },
    {
        id: 'prod-003',
        partNumber: 'WIRE-ROPE-20MM',
        name: 'Wire Rope 20mm',
        description: 'High-tensile wire rope suitable for all ACE cranes. 6x36 construction with independent wire rope core.',
        category: 'Cables & Ropes',
        price: 8500,
        images: ['/api/placeholder/400/400'],
        specifications: {
            diameter: '20mm',
            breakingLoad: '30 tons',
            length: '100m',
            construction: '6x36 IWRC'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 50
    },
    {
        id: 'prod-004',
        partNumber: 'HYD-PUMP-ACE-500',
        name: 'Hydraulic Pump ACE-500',
        description: 'Variable displacement hydraulic pump for ACE construction equipment. High efficiency and reliability.',
        category: 'Hydraulic Parts',
        price: 95000,
        images: ['/api/placeholder/400/400'],
        specifications: {
            displacement: '500cc',
            maxPressure: '420 bar',
            flow: '250 L/min',
            weight: '125kg'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 8
    },
    {
        id: 'prod-005',
        partNumber: 'BRAKE-PAD-FL-001',
        name: 'Brake Pad Set - Forklift',
        description: 'Premium brake pad set for ACE forklift trucks. Long-lasting and reliable braking performance.',
        category: 'Brake System',
        price: 4500,
        images: ['/api/placeholder/400/400'],
        specifications: {
            material: 'Ceramic composite',
            thickness: '15mm',
            compatibility: 'All ACE forklifts',
            quantity: '4 pads'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 100
    },
    {
        id: 'prod-006',
        partNumber: 'FILTER-HYD-001',
        name: 'Hydraulic Filter Element',
        description: 'High-efficiency hydraulic filter element. Protects hydraulic system from contamination.',
        category: 'Filters',
        price: 2800,
        images: ['/api/placeholder/400/400'],
        specifications: {
            filtration: '10 micron',
            flowRate: '150 L/min',
            compatibility: 'Universal',
            lifespan: '1000 hours'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 200
    },
    {
        id: 'prod-007',
        partNumber: 'SLEW-BEARING-TC-001',
        name: 'Slew Bearing - Tower Crane',
        description: 'Heavy-duty slew bearing for tower cranes. Precision engineered for smooth rotation.',
        category: 'Bearings',
        price: 185000,
        images: ['/api/placeholder/400/400'],
        specifications: {
            diameter: '2500mm',
            loadCapacity: '150 tons',
            material: 'Hardened steel',
            weight: '1200kg'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 3
    },
    {
        id: 'prod-008',
        partNumber: 'CTRL-PANEL-MC-001',
        name: 'Control Panel - Mobile Crane',
        description: 'Advanced control panel with digital display for mobile cranes. User-friendly interface.',
        category: 'Electrical',
        price: 65000,
        images: ['/api/placeholder/400/400'],
        specifications: {
            voltage: '24V DC',
            display: '7" LCD touchscreen',
            features: 'Load monitoring, diagnostics',
            protection: 'IP65'
        },
        isActive: true,
        isCustomPart: false,
        customizationRequired: [],
        stock: 12
    }
];

export const mockMachines = [
    {
        id: 'machine-001',
        machineNumber: 'ACE-FX14-2024',
        name: 'FX 14 Mobile Crane',
        category: 'Mobile Cranes',
        model: 'FX 14',
        manufacturer: 'ACE',
        description: 'Versatile 14-ton mobile crane with telescopic boom. Ideal for construction and industrial applications.',
        specifications: {
            capacity: '14 tons',
            boomLength: '30m',
            maxHeight: '32m',
            enginePower: '180 HP'
        },
        images: ['/api/placeholder/600/400'],
        isCustomizable: true,
        isActive: true
    },
    {
        id: 'machine-002',
        machineNumber: 'ACE-FL5-2024',
        name: 'FL 5 Forklift Truck',
        category: 'Forklift Trucks',
        model: 'FL 5',
        manufacturer: 'ACE',
        description: '5-ton capacity diesel forklift. Robust and reliable for warehouse and logistics operations.',
        specifications: {
            capacity: '5 tons',
            liftHeight: '6m',
            engineType: 'Diesel',
            fuelCapacity: '80L'
        },
        images: ['/api/placeholder/600/400'],
        isCustomizable: false,
        isActive: true
    },
    {
        id: 'machine-003',
        machineNumber: 'ACE-TC100-2024',
        name: 'TC 100 Tower Crane',
        category: 'Tower Cranes',
        model: 'TC 100',
        manufacturer: 'ACE',
        description: 'High-capacity tower crane for large construction projects. Maximum reach and lifting capacity.',
        specifications: {
            capacity: '10 tons',
            jibLength: '60m',
            maxHeight: '80m',
            tipLoad: '2.5 tons'
        },
        images: ['/api/placeholder/600/400'],
        isCustomizable: true,
        isActive: true
    },
    {
        id: 'machine-004',
        machineNumber: 'ACE-BH8-2024',
        name: 'BH 8 Backhoe Loader',
        category: 'Backhoe Loaders',
        model: 'BH 8',
        manufacturer: 'ACE',
        description: 'Multi-purpose backhoe loader for excavation and loading. Powerful and efficient.',
        specifications: {
            digDepth: '4.5m',
            bucketCapacity: '1.2 m³',
            enginePower: '95 HP',
            operatingWeight: '8500 kg'
        },
        images: ['/api/placeholder/600/400'],
        isCustomizable: false,
        isActive: true
    }
];

export const mockCustomizations = [
    {
        id: 'custom-001',
        machineId: 'machine-001',
        name: 'Extended Boom',
        description: 'Extends the boom length by 10 meters for increased reach and height.',
        customizationType: 'Structural',
        affectedParts: ['boom-001', 'hyd-cyl-001'],
        additionalParts: ['boom-ext-kit-001', 'hyd-cyl-ext-001'],
        isActive: true
    },
    {
        id: 'custom-002',
        machineId: 'machine-001',
        name: 'Heavy Duty Hydraulics',
        description: 'Upgraded hydraulic system for increased lifting capacity.',
        customizationType: 'Hydraulic',
        affectedParts: ['hyd-pump-001', 'hyd-cyl-001'],
        additionalParts: ['hyd-pump-hd-001', 'hyd-valve-hd-001'],
        isActive: true
    },
    {
        id: 'custom-003',
        machineId: 'machine-003',
        name: 'Extended Jib',
        description: 'Extends tower crane jib for greater horizontal reach.',
        customizationType: 'Structural',
        affectedParts: ['jib-001'],
        additionalParts: ['jib-ext-001', 'counter-weight-001'],
        isActive: true
    }
];

export const mockDealers = [
    {
        id: 'dealer-001',
        name: 'ACE Delhi Central',
        email: 'delhi@acecranes.com',
        phone: '+91-11-12345678',
        level: 'L1',
        address: 'Plot 45, Okhla Industrial Area',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110020',
        servicePincodes: ['110001', '110020', '110030', '110040'],
        isActive: true,
        performanceScore: 95.5,
        totalOrders: 150,
        approvedOrders: 143,
        rejectedOrders: 7
    },
    {
        id: 'dealer-002',
        name: 'ACE Mumbai West',
        email: 'mumbai@acecranes.com',
        phone: '+91-22-87654321',
        level: 'L1',
        address: 'Godown 12, MIDC Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        servicePincodes: ['400001', '400053', '400070', '400080'],
        isActive: true,
        performanceScore: 92.3,
        totalOrders: 180,
        approvedOrders: 166,
        rejectedOrders: 14
    },
    {
        id: 'dealer-003',
        name: 'ACE Hyderabad Hub',
        email: 'hyderabad@acecranes.com',
        phone: '+91-40-98765432',
        level: 'L2',
        address: 'Plot 23, Hitachi City',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        servicePincodes: ['500001', '500081', '500082'],
        isActive: true,
        performanceScore: 88.7,
        totalOrders: 95,
        approvedOrders: 84,
        rejectedOrders: 11
    },
    {
        id: 'dealer-004',
        name: 'ACE Kolkata East',
        email: 'kolkata@acecranes.com',
        phone: '+91-33-12349876',
        level: 'L2',
        address: 'Sector 5, Salt Lake City',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700091',
        servicePincodes: ['700001', '700091', '700092'],
        isActive: true,
        performanceScore: 85.0,
        totalOrders: 70,
        approvedOrders: 65,
        rejectedOrders: 5
    },
    {
        id: 'dealer-005',
        name: 'ACE Chennai South',
        email: 'chennai@acecranes.com',
        phone: '+91-44-56781234',
        level: 'L1',
        address: 'Guindy Industrial Estate',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600032',
        servicePincodes: ['600001', '600032', '600033'],
        isActive: true,
        performanceScore: 91.5,
        totalOrders: 120,
        approvedOrders: 110,
        rejectedOrders: 10
    }
];

export const mockUsers = [
    {
        id: 'user-001',
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+91-9876543210',
        role: 'CUSTOMER'
    },
    {
        id: 'user-admin',
        email: 'admin@acecranes.com',
        name: 'System Administrator',
        phone: '+91-00-00000000',
        role: 'ADMIN'
    },
    {
        id: 'user-dealer-delhi',
        email: 'delhi@acecranes.com',
        name: 'ACE Delhi Manager',
        phone: '+91-11-12345678',
        role: 'DEALER'
    },
    {
        id: 'user-dealer-mumbai',
        email: 'mumbai@acecranes.com',
        name: 'ACE Mumbai Manager',
        phone: '+91-22-87654321',
        role: 'DEALER'
    },
    {
        id: 'user-dealer-hyd',
        email: 'hyderabad@acecranes.com',
        name: 'ACE Hyderabad Manager',
        phone: '+91-40-98765432',
        role: 'DEALER'
    },
    {
        id: 'user-dealer-kol',
        email: 'kolkata@acecranes.com',
        name: 'ACE Kolkata Manager',
        phone: '+91-33-12349876',
        role: 'DEALER'
    },
    {
        id: 'user-dealer-chn',
        email: 'chennai@acecranes.com',
        name: 'ACE Chennai Manager',
        phone: '+91-44-56781234',
        role: 'DEALER'
    }
];

export const mockUserAddresses = [
    {
        id: 'addr-001',
        userId: 'user-001',
        name: 'John Doe',
        phone: '+91-9876543210',
        addressLine1: '123 Construction Site',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110020',
        isDefault: true
    },
    {
        id: 'addr-002',
        userId: 'user-001',
        name: 'John Doe - Site B',
        phone: '+91-9876543210',
        addressLine1: 'Plot 45, Okhla Industrial Estate',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110020',
        isDefault: false
    },
    {
        id: 'addr-003',
        userId: 'user-001',
        name: 'John Doe - Warehouse',
        phone: '+91-9876543210',
        addressLine1: '789 Storage Facility, Sector 18',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001',
        isDefault: false
    }
];

export const mockCustomerMachines = [
    {
        id: 'cust-machine-001',
        userId: 'user-001',
        machineId: 'machine-001',
        serialNumber: 'FX14-2024-001',
        purchaseDate: '2024-01-15',
        hasCustomization: true,
        customizationDetails: {
            extendedBoom: true,
            heavyDutyHydraulics: true
        },
        nickname: 'Main Crane',
        notes: 'Primary crane for construction projects',
        isActive: true
    },
    {
        id: 'cust-machine-002',
        userId: 'user-001',
        machineId: 'machine-002',
        serialNumber: 'FL5-2024-045',
        purchaseDate: '2024-03-20',
        hasCustomization: false,
        customizationDetails: null,
        nickname: 'Warehouse Forklift',
        notes: 'Used for material handling',
        isActive: true
    }
];

export const mockSupportTickets = [
    {
        id: 'ticket-001',
        ticketNumber: 'SUPP-2024-001',
        userId: 'user-001',
        customerMachineId: 'cust-machine-001',
        type: 'PART_INQUIRY',
        status: 'PARTS_CONFIRMED',
        priority: 'HIGH',
        subject: 'Need hydraulic parts for FX14',
        description: 'Require replacement hydraulic cylinder for extended boom',
        whatsappNumber: '+91-9876543210',
        confirmedParts: [
            { productId: 'prod-001', quantity: 2, notes: 'For extended boom' },
            { productId: 'prod-002', quantity: 1, notes: 'Boom extension kit' }
        ],
        sharedCartLink: '/cart/add-from-support?token=SUPP-ABC123',
        createdAt: '2024-12-10T10:00:00Z'
    }
];

export const mockOrders = [
    {
        id: 'order-001',
        orderNumber: 'ORD-2024-001',
        userId: 'user-001',
        status: 'DELIVERED',
        totalAmount: 53500,
        paymentMethod: 'ONLINE',
        paymentStatus: 'SUCCESS',
        deliveryAddress: {
            name: 'John Doe',
            phone: '+91-9876543210',
            addressLine1: '123 Construction Site',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110020'
        },
        deliveryPartner: 'PORTER',
        trackingId: 'POR-123456',
        estimatedDelivery: '2024-12-11T18:00:00Z',
        actualDelivery: '2024-12-11T17:30:00Z',
        createdAt: '2024-12-10T14:00:00Z',
        items: [
            {
                id: 'item-001',
                productId: 'prod-001',
                quantity: 1,
                price: 45000,
                status: 'FULFILLED'
            },
            {
                id: 'item-002',
                productId: 'prod-005',
                quantity: 2,
                price: 4500,
                status: 'FULFILLED'
            }
        ]
    }
];

export const mockSuggestions = [
    {
        id: 'sugg-001',
        userId: 'user-001',
        productId: 'prod-001',
        machineId: 'machine-001',
        suggestionType: 'COMPATIBLE_PART',
        reason: 'Compatible with your FX 14 Mobile Crane',
        relevanceScore: 85,
        isViewed: false,
        isClicked: false,
        isPurchased: false
    },
    {
        id: 'sugg-002',
        userId: 'user-001',
        productId: 'prod-002',
        machineId: 'machine-001',
        suggestionType: 'CUSTOMIZATION_REQUIRED',
        reason: 'Required for your extended boom customization',
        relevanceScore: 95,
        isViewed: false,
        isClicked: false,
        isPurchased: false
    },
    {
        id: 'sugg-003',
        userId: 'user-001',
        productId: 'prod-003',
        machineId: 'machine-001',
        suggestionType: 'FREQUENTLY_BOUGHT',
        reason: 'Customers who bought hydraulic parts also bought this',
        relevanceScore: 70,
        isViewed: false,
        isClicked: false,
        isPurchased: false
    }
];
