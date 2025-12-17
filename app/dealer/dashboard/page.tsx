'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, Clock, CheckCircle, XCircle, LogOut, Box, Truck, MapPin } from 'lucide-react'
import { mockOrders, mockProducts, mockDealers, mockUserAddresses } from '@/lib/mockData'

export default function DealerDashboardPage() {
    // --- STATE MANAGEMENT ---
    // These variables store the data that can change while the user interacts with the page.
    // 'activeTab' determines which tab (Pending, Approved, Rejected) is currently visible.
    const [activeTab, setActiveTab] = useState('pending')

    // 'itemApprovals' keeps track of which individual items the dealer has approved or rejected.
    // It's an object where the key is the item ID and the value is either 'approve' or 'reject'.
    const [itemApprovals, setItemApprovals] = useState<Record<string, 'approve' | 'reject'>>({})

    // 'dealerInventory' stores the list of products currently in the dealer's stock.
    const [dealerInventory, setDealerInventory] = useState<any[]>([])

    // Controls the visibility of the Delivery Manifest popup modal.
    const [showDeliveryManifest, setShowDeliveryManifest] = useState(false)

    // Stores the specific order that is currently being processed for delivery.
    const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<any>(null)

    // --- MANUAL SHIPPING SELECTION STATE ---
    // These store the user's manual choices for shipping address and partner.
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [selectedPartner, setSelectedPartner] = useState<string>('')

    // --- DATA PREPARATION ---
    // In a real app, this would come from a database or API. Here we use mock data.
    const currentDealer = mockDealers[0]

    // We filter the mock orders to simulate orders relevant to this specific dealer.
    const dealerOrders = [
        {
            ...mockOrders[0],
            status: 'ROUTING_L1', // Simulating an order that has been routed to this dealer
            routedAt: '2024-12-11T10:00:00Z'
        }
    ]

    // Categorize orders into buckets for the tabs
    const pendingOrders = dealerOrders.filter(o => o.status.includes('ROUTING'))
    const approvedOrders = dealerOrders.filter(o => o.status === 'CONFIRMED')
    const rejectedOrders: any[] = []

    // --- EVENT HANDLERS (ACTIONS) ---

    // Called when the dealer clicks "Approve" or "Reject" on a single line item.
    const handleItemApproval = (itemId: string, action: 'approve' | 'reject') => {
        // Updates the state object, preserving existing approvals (...prev) and adding the new one.
        setItemApprovals(prev => ({ ...prev, [itemId]: action }))
    }

    // Called when the dealer tries to finalize the approval for the entire order.
    const handleApproveOrder = (order: any) => {
        // 1. Validation: Ensure every item has been reviewed (marked as approved or rejected).
        const allDecided = order.items.every((item: any) => itemApprovals[item.id])

        if (!allDecided) {
            alert('Please approve or reject all items before submitting')
            return
        }

        // 2. Validation: Ensure at least one item is actually approved. 
        // We can't approve an order if everything is rejected (use Reject Order instead).
        const hasApprovedItems = order.items.some((item: any) => itemApprovals[item.id] === 'approve')
        if (!hasApprovedItems) {
            alert('No items approved. Please use "Reject Order" if you wish to reject all items.')
            return
        }

        // 3. Setup Defaults: Pre-select a default address and calculate the best delivery partner.
        // We do this here so the modal opens with smart defaults already selected.
        const defaultAddress = mockUserAddresses.find(addr => addr.isDefault) || mockUserAddresses[0]
        setSelectedAddressId(defaultAddress?.id || '')
        setSelectedPartner(calculateDeliveryPartner(order))

        // 4. Open Modal: Set the current order and show the popup.
        setSelectedOrderForDelivery(order)
        setShowDeliveryManifest(true)
    }

    // Called when the dealer rejects the entire order.
    const handleRejectOrder = (order: any) => {
        // Simple confirmation before rejection.
        if (confirm('Are you sure you want to reject this entire order?')) {
            // In a real app, we would send a request to the server here.
            alert(`Order ${order.orderNumber} rejected!`)
        }
    }

    // --- HELPER FUNCTIONS ---

    // Determines the best delivery partner based on the weight of APPROVED items.
    // Business Logic:
    // - Less than 50kg: Use local courier (PORTER)
    // - 50kg or more: Use national implementation (DELHIVERY)
    const calculateDeliveryPartner = (order: any) => {
        // Filter to only count items we are actually shipping (approved ones)
        const approvedItems = order.items.filter((item: any) => itemApprovals[item.id] === 'approve')

        const totalWeight = approvedItems.reduce((sum: number, item: any) => {
            const product = mockProducts.find(p => p.id === item.productId)
            // Parse weight from string (e.g. "12.5 kg") to number
            return sum + (product?.specifications?.weight ? parseFloat(product.specifications.weight) : 0)
        }, 0)

        // Return the partner code based on the threshold
        return totalWeight < 50 ? 'PORTER' : 'DELHIVERY'
    }

    // --- INITIALIZATION ---
    // This runs once when the page loads to generate some random inventory data for demo purposes.
    useEffect(() => {
        const inventory = mockProducts.map(product => ({
            ...product,
            dealerStock: Math.floor(Math.random() * 50), // Random stock 0-50
            reorderLevel: 10,
            lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }))
        setDealerInventory(inventory)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-black text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="text-3xl font-bold text-primary-500">ACE</div>
                            <div className="text-sm text-gray-300">Dealer Portal</div>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <div className="text-sm">
                                <span className="text-gray-400">Dealer:</span>
                                <span className="font-semibold ml-2">{currentDealer.name}</span>
                            </div>
                            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors">
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold mb-8">Dealer Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 text-sm font-medium">Pending Orders</h3>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{pendingOrders.length}</div>
                        <div className="text-sm text-gray-500 mt-1">Awaiting response</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 text-sm font-medium">Approved</h3>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">143</div>
                        <div className="text-sm text-green-600 mt-1">This month: 12</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 text-sm font-medium">Rejected</h3>
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">7</div>
                        <div className="text-sm text-gray-500 mt-1">This month: 1</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-600 text-sm font-medium">Performance</h3>
                            <TrendingUp className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{currentDealer.performanceScore}%</div>
                        <div className="text-sm text-green-600 mt-1">+2.3% from last month</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md">
                            {/* Tabs */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pending'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Pending ({pendingOrders.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('approved')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'approved'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Approved ({approvedOrders.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('rejected')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'rejected'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        Rejected ({rejectedOrders.length})
                                    </button>
                                </nav>
                            </div>

                            {/* Orders List */}
                            <div className="p-6">
                                {activeTab === 'pending' && (
                                    <div className="space-y-6">
                                        {pendingOrders.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending orders</h3>
                                                <p className="text-gray-600">All orders have been processed</p>
                                            </div>
                                        ) : (
                                            pendingOrders.map(order => (
                                                <div key={order.id} className="border-2 border-gray-200 rounded-lg p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-1">{order.orderNumber}</h3>
                                                            <div className="text-sm text-gray-600">
                                                                Routed: {new Date(order.routedAt || '').toLocaleString()}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Customer: {order.deliveryAddress?.name || 'N/A'}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-primary-600 mb-1">
                                                                ₹{order.totalAmount.toLocaleString('en-IN')}
                                                            </div>
                                                            <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                                Pending Review
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Order Items with Approve/Reject */}
                                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                        <h4 className="font-semibold mb-3">Order Items - Check Availability</h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item: any) => {
                                                                const product = mockProducts.find(p => p.id === item.productId)
                                                                const inventoryItem = dealerInventory.find(inv => inv.id === item.productId)
                                                                const approval = itemApprovals[item.id]
                                                                const isAvailable = inventoryItem && inventoryItem.dealerStock >= item.quantity

                                                                return (
                                                                    <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <div className="flex-1">
                                                                                <div className="font-medium">{product?.name}</div>
                                                                                <div className="text-sm text-gray-600">
                                                                                    Part #: {product?.partNumber}
                                                                                </div>
                                                                                <div className="text-sm text-gray-600 mt-1">
                                                                                    <span className="font-semibold">Requested Qty:</span> {item.quantity} units
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right ml-4">
                                                                                <div className="font-semibold">
                                                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                                                </div>
                                                                                <div className="text-sm mt-1">
                                                                                    {inventoryItem ? (
                                                                                        <span className={`font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                                                                            Stock: {inventoryItem.dealerStock}
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="text-gray-500">Loading...</span>
                                                                                    )}
                                                                                </div>
                                                                                {isAvailable ? (
                                                                                    <div className="text-xs text-green-600 font-semibold mt-1">
                                                                                        ✓ Available
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="text-xs text-red-600 font-semibold mt-1">
                                                                                        ✗ Insufficient Stock
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Item Action Buttons */}
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <button
                                                                                onClick={() => handleItemApproval(item.id, 'approve')}
                                                                                disabled={!isAvailable}
                                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${approval === 'approve'
                                                                                    ? 'bg-green-600 text-white'
                                                                                    : isAvailable
                                                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                                    }`}
                                                                            >
                                                                                ✓ Approve
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleItemApproval(item.id, 'reject')}
                                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${approval === 'reject'
                                                                                    ? 'bg-red-600 text-white'
                                                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                                    }`}
                                                                            >
                                                                                ✗ Reject
                                                                            </button>
                                                                        </div>

                                                                        {/* Status Badge */}
                                                                        {approval && (
                                                                            <div className="mt-2">
                                                                                {approval === 'approve' && (
                                                                                    <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                                                        ✓ Item approved
                                                                                    </span>
                                                                                )}
                                                                                {approval === 'reject' && (
                                                                                    <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                                                                        ✗ Item rejected
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Order Action Buttons */}
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleApproveOrder(order)}
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                            <span>Submit Approval</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectOrder(order)}
                                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                            <span>Reject Order</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'approved' && (
                                    <div className="text-center py-12">
                                        <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No approved orders to display</h3>
                                        <p className="text-gray-600">Approved orders will appear here</p>
                                    </div>
                                )}

                                {activeTab === 'rejected' && (
                                    <div className="text-center py-12">
                                        <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No rejected orders</h3>
                                        <p className="text-gray-600">Rejected orders will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Inventory Status */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <Box className="h-6 w-6 mr-2 text-primary-500" />
                                Inventory Status
                            </h2>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {dealerInventory.map(item => {
                                    const isLowStock = item.dealerStock <= item.reorderLevel
                                    const isOutOfStock = item.dealerStock === 0

                                    return (
                                        <div
                                            key={item.id}
                                            className={`border-2 rounded-lg p-3 ${isOutOfStock ? 'border-red-200 bg-red-50' :
                                                isLowStock ? 'border-yellow-200 bg-yellow-50' :
                                                    'border-green-200 bg-green-50'
                                                }`}
                                        >
                                            <div className="font-semibold text-sm mb-1 truncate">{item.name}</div>
                                            <div className="text-xs text-gray-600 mb-2">{item.partNumber}</div>

                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-gray-600">Stock:</span>
                                                <span className={`text-lg font-bold ${isOutOfStock ? 'text-red-600' :
                                                    isLowStock ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>
                                                    {item.dealerStock}
                                                </span>
                                            </div>

                                            {/* Stock Status Badge */}
                                            <div className="mb-2">
                                                {isOutOfStock && (
                                                    <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                                        ⚠ Out of Stock
                                                    </span>
                                                )}
                                                {isLowStock && !isOutOfStock && (
                                                    <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                                                        ⚠ Low Stock
                                                    </span>
                                                )}
                                                {!isLowStock && !isOutOfStock && (
                                                    <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                                        ✓ In Stock
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                Reorder at: {item.reorderLevel} units
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Manifest Modal */}
            {showDeliveryManifest && selectedOrderForDelivery && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-primary-500 text-black p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <Truck className="h-6 w-6 mr-2" />
                                    Delivery Manifest
                                </h2>
                                <button
                                    onClick={() => setShowDeliveryManifest(false)}
                                    className="text-black hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Order Details */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-3">Order Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Order Number:</span>
                                        <div className="font-semibold">{selectedOrderForDelivery.orderNumber}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Total Amount:</span>
                                        <div className="font-semibold text-primary-600">
                                            ₹{selectedOrderForDelivery.totalAmount.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Customer:</span>
                                        <div className="font-semibold">{selectedOrderForDelivery.deliveryAddress?.name}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 block mb-1">Delivery Partner:</span>
                                        <select
                                            value={selectedPartner}
                                            onChange={(e) => setSelectedPartner(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 font-semibold"
                                        >
                                            <option value="PORTER">PORTER (Local)</option>
                                            <option value="DELHIVERY">DELHIVERY (National)</option>
                                            <option value="BLUE-DART">BLUE DART</option>
                                            <option value="DHL">DHL Express</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-bold">Delivery Address</h3>
                                    <div className="flex items-center text-primary-600 text-sm">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>Change Address</span>
                                    </div>
                                </div>

                                <select
                                    value={selectedAddressId}
                                    onChange={(e) => setSelectedAddressId(e.target.value)}
                                    className="w-full mb-3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
                                >
                                    {mockUserAddresses.map(addr => (
                                        <option key={addr.id} value={addr.id}>
                                            {addr.name} - {addr.addressLine1}, {addr.city}
                                        </option>
                                    ))}
                                </select>

                                {selectedAddressId && (
                                    <div className="bg-gray-50 rounded-lg p-4 text-sm border border-gray-200">
                                        {(() => {
                                            const addr = mockUserAddresses.find(a => a.id === selectedAddressId)
                                            if (!addr) return null
                                            return (
                                                <>
                                                    <div className="font-semibold">{addr.name}</div>
                                                    <div className="text-gray-600 mt-1">{addr.addressLine1}</div>
                                                    <div className="text-gray-600">
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </div>
                                                    <div className="text-gray-600 mt-1">
                                                        Phone: {addr.phone}
                                                    </div>
                                                </>
                                            )
                                        })()}
                                    </div>
                                )}
                            </div>

                            {/* Items to Deliver */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-3">Items to Deliver</h3>
                                <div className="space-y-2">
                                    {selectedOrderForDelivery.items.filter((item: any) => itemApprovals[item.id] === 'approve').map((item: any) => {
                                        const product = mockProducts.find(p => p.id === item.productId)
                                        return (
                                            <div key={item.id} className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <div className="font-semibold">{product?.name}</div>
                                                        <div className="text-gray-600">{product?.partNumber}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">Qty: {item.quantity}</div>
                                                        <div className="text-gray-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        const addr = mockUserAddresses.find(a => a.id === selectedAddressId)
                                        alert(`Delivery manifest created!\n\nPartner: ${selectedPartner}\nAddress: ${addr?.addressLine1}, ${addr?.city}\n\nOrder approved and sent for delivery.`)
                                        setShowDeliveryManifest(false)
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Confirm & Create Delivery
                                </button>
                                <button
                                    onClick={() => setShowDeliveryManifest(false)}
                                    className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
