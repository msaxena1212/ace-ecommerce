'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, XCircle, Package, MapPin } from 'lucide-react'

// Mock data for demonstration
const mockProducts = [
    { id: 'prod-001', partNumber: 'HYD-CYL-FX14-001', name: 'Hydraulic Cylinder - FX14', price: 45000 },
    { id: 'prod-002', partNumber: 'BOOM-EXT-KIT-001', name: 'Boom Extension Kit', price: 125000 },
    { id: 'prod-003', partNumber: 'WIRE-ROPE-20MM', name: 'Wire Rope 20mm', price: 8500 },
]

const dealerInventory: Record<string, Record<string, number>> = {
    'dealer-001': { 'HYD-CYL-FX14-001': 10, 'WIRE-ROPE-20MM': 30 },
    'dealer-002': { 'HYD-CYL-FX14-001': 8, 'BOOM-EXT-KIT-001': 3 },
    'dealer-003': { 'HYD-CYL-FX14-001': 15, 'BOOM-EXT-KIT-001': 5, 'WIRE-ROPE-20MM': 40 },
}

const dealers = [
    { id: 'dealer-001', name: 'ACE Delhi Central', level: 'L1', pincodes: ['110001', '110020', '110030', '110040'] },
    { id: 'dealer-002', name: 'ACE Mumbai West', level: 'L1', pincodes: ['400001', '400053', '400070', '400080'] },
    { id: 'dealer-003', name: 'ACE Bangalore Hub', level: 'L2', pincodes: ['560001', '560058', '560100'] },
]

export default function OrderRoutingDemoPage() {
    const [pincode, setPincode] = useState('110020')
    const [selectedItems, setSelectedItems] = useState<Array<{ productId: string, quantity: number }>>([
        { productId: 'prod-001', quantity: 5 }
    ])
    const [routingResult, setRoutingResult] = useState<any>(null)

    const routeOrder = () => {
        const results: any[] = []

        for (const item of selectedItems) {
            const product = mockProducts.find(p => p.id === item.productId)!
            let routed = false

            // Try L1 dealers
            for (const dealer of dealers.filter(d => d.level === 'L1' && d.pincodes.includes(pincode))) {
                const inventory = dealerInventory[dealer.id] || {}
                const available = inventory[product.partNumber] || 0

                if (available >= item.quantity) {
                    results.push({
                        product: product.name,
                        quantity: item.quantity,
                        dealer: dealer.name,
                        level: 'L1',
                        status: 'success',
                        available,
                        message: `✓ Routed to ${dealer.name} (L1) - ${available} units available`
                    })
                    routed = true
                    break
                }
            }

            // Try L2 if not routed
            if (!routed) {
                for (const dealer of dealers.filter(d => d.level === 'L2')) {
                    const inventory = dealerInventory[dealer.id] || {}
                    const available = inventory[product.partNumber] || 0

                    if (available >= item.quantity) {
                        results.push({
                            product: product.name,
                            quantity: item.quantity,
                            dealer: dealer.name,
                            level: 'L2',
                            status: 'success',
                            available,
                            message: `✓ Escalated to ${dealer.name} (L2) - ${available} units available`
                        })
                        routed = true
                        break
                    }
                }
            }

            // Not available
            if (!routed) {
                results.push({
                    product: product.name,
                    quantity: item.quantity,
                    dealer: 'None',
                    level: 'N/A',
                    status: 'failed',
                    available: 0,
                    message: `✗ Out of stock - Required: ${item.quantity} units`
                })
            }
        }

        setRoutingResult(results)
    }

    const updateQuantity = (productId: string, quantity: number) => {
        setSelectedItems(items =>
            items.map(item =>
                item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold text-primary-600">ACE</div>
                            <div className="text-sm text-gray-600">Order Routing Demo</div>
                        </Link>
                        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold mb-2">Order Routing Logic Demo</h1>
                <p className="text-gray-600 mb-8">Test the L1 → L2 → L3 → Warehouse routing system</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Pincode Input */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <MapPin className="h-5 w-5 text-primary-600" />
                                <h2 className="text-xl font-bold">Customer Pincode</h2>
                            </div>
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="input-field"
                                placeholder="Enter pincode"
                            />
                            <div className="mt-3 text-sm text-gray-600">
                                <div className="font-semibold mb-1">Available Pincodes:</div>
                                <div>L1 Delhi: 110001, 110020, 110030, 110040</div>
                                <div>L1 Mumbai: 400001, 400053, 400070, 400080</div>
                                <div>L2 Bangalore: 560001, 560058, 560100</div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Package className="h-5 w-5 text-primary-600" />
                                <h2 className="text-xl font-bold">Order Items</h2>
                            </div>
                            <div className="space-y-4">
                                {selectedItems.map((item, idx) => {
                                    const product = mockProducts.find(p => p.id === item.productId)!
                                    return (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                            <div className="font-semibold mb-2">{product.name}</div>
                                            <div className="text-sm text-gray-600 mb-2">Part: {product.partNumber}</div>
                                            <div className="flex items-center space-x-3">
                                                <label className="text-sm font-medium">Quantity:</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button
                                onClick={routeOrder}
                                className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Route Order</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Dealer Inventory Reference */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-bold mb-3">Dealer Inventory Reference</h3>
                            <div className="space-y-3 text-sm">
                                {dealers.map(dealer => (
                                    <div key={dealer.id} className="border-b pb-2">
                                        <div className="font-semibold">{dealer.name} ({dealer.level})</div>
                                        <div className="text-gray-600">
                                            {Object.entries(dealerInventory[dealer.id] || {}).map(([part, qty]) => (
                                                <div key={part}>{part}: {qty} units</div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">Routing Results</h2>

                            {!routingResult ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                    <p>Click "Route Order" to see routing results</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {routingResult.map((result: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`border-2 rounded-lg p-4 ${result.status === 'success'
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-red-200 bg-red-50'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                {result.status === 'success' ? (
                                                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-semibold mb-1">{result.product}</div>
                                                    <div className="text-sm mb-2">
                                                        Quantity Required: <span className="font-semibold">{result.quantity}</span>
                                                    </div>
                                                    {result.status === 'success' && (
                                                        <>
                                                            <div className="text-sm mb-1">
                                                                Dealer: <span className="font-semibold">{result.dealer}</span>
                                                            </div>
                                                            <div className="text-sm mb-1">
                                                                Level: <span className="font-semibold">{result.level}</span>
                                                            </div>
                                                            <div className="text-sm">
                                                                Available: <span className="font-semibold">{result.available} units</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className={`mt-2 text-sm font-medium ${result.status === 'success' ? 'text-green-700' : 'text-red-700'
                                                        }`}>
                                                        {result.message}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Routing Flow Diagram */}
                        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                            <h3 className="font-bold mb-4">Routing Flow</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                    <div>
                                        <div className="font-semibold">L1 Dealers (Pincode Match)</div>
                                        <div className="text-sm text-gray-600">Check local dealers serving customer pincode</div>
                                    </div>
                                </div>
                                <div className="ml-4 border-l-2 border-gray-300 h-6"></div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                    <div>
                                        <div className="font-semibold">L2 Dealers (Regional)</div>
                                        <div className="text-sm text-gray-600">Escalate to regional dealers if L1 unavailable</div>
                                    </div>
                                </div>
                                <div className="ml-4 border-l-2 border-gray-300 h-6"></div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                    <div>
                                        <div className="font-semibold">L3 Dealers (State Level)</div>
                                        <div className="text-sm text-gray-600">Further escalation to state-level dealers</div>
                                    </div>
                                </div>
                                <div className="ml-4 border-l-2 border-gray-300 h-6"></div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                                    <div>
                                        <div className="font-semibold">Central Warehouse</div>
                                        <div className="text-sm text-gray-600">Final fallback to central inventory</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
