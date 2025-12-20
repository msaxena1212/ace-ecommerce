'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, Wrench, ShoppingCart, AlertCircle } from 'lucide-react'
import { mockMachines, mockProducts, mockCustomerMachines } from '@/lib/mockData'
import Header from '@/components/Header'

export default function MachineCompatiblePartsPage({ params }: { params: { machineId: string } }) {
    // State to hold the IDs of parts currently added to the cart
    const [cart, setCart] = useState<string[]>([])

    // Get the machineId from the URL parameters
    const machineId = params.machineId

    // --- DATA LOOKUP ---
    // 1. Find the customer's specific machine (e.g., "My Ace Crane")
    const customerMachine = mockCustomerMachines.find(m => m.id === machineId)
    // 2. Find the generic machine definition (e.g., "ACE FX 250") to get specs
    const machine = mockMachines.find(m => m.id === customerMachine?.machineId)

    // Validation: If data isn't found, show an error screen
    if (!customerMachine || !machine) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Machine Not Found</h1>
                    <p className="text-gray-600 mb-4">The requested machine could not be found.</p>
                    <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    // --- PART FILTERING ---
    // Find all products in our catalog that list this machine's ID in their 'compatibleMachines' list
    const allCompatibleParts = mockProducts.filter(p =>
        (p as any).compatibleMachines?.includes(machine.id)
    )

    // Split parts into two categories for display:
    // 1. Basic Parts: General maintenance items (filters, oils, standard parts)
    const basicParts = allCompatibleParts.filter(p => !p.isCustomPart)

    // 2. Customized Parts: Special parts made specifically for this customer's customized machine
    const customizedParts = allCompatibleParts.filter(p => p.isCustomPart)

    // --- MOCK DATA FALLBACK ---
    // If our main mock data doesn't have parts for this specific machine, 
    // we generate some sample parts on the fly so the UI isn't empty during demos.

    const sampleBasicParts = basicParts.length > 0 ? basicParts : [
        {
            id: 'sample-basic-1',
            partNumber: 'HYD-CYL-001',
            name: 'Hydraulic Cylinder',
            price: 45000,
            stock: 15,
            category: 'Hydraulic Parts',
            description: 'Heavy-duty hydraulic cylinder',
            isCustomPart: false
        },
        // ... (other sample parts omitted for brevity)
        {
            id: 'sample-basic-2',
            partNumber: 'WIRE-ROPE-20MM',
            name: 'Wire Rope 20mm',
            price: 8500,
            stock: 50,
            category: 'Cables & Ropes',
            description: 'High-tensile wire rope',
            isCustomPart: false
        },
        {
            id: 'sample-basic-3',
            partNumber: 'FILTER-HYD-001',
            name: 'Hydraulic Filter Element',
            price: 2800,
            stock: 200,
            category: 'Filters',
            description: 'High-efficiency hydraulic filter',
            isCustomPart: false
        },
        {
            id: 'sample-basic-4',
            partNumber: 'BRAKE-PAD-001',
            name: 'Brake Pad Set',
            price: 4500,
            stock: 100,
            category: 'Brake System',
            description: 'Premium brake pad set',
            isCustomPart: false
        }
    ]

    const sampleCustomParts = customizedParts.length > 0 ? customizedParts : [
        {
            id: 'sample-custom-1',
            partNumber: 'BOOM-EXT-KIT-001',
            name: 'Boom Extension Kit',
            price: 125000,
            stock: 5,
            category: 'Structural Parts',
            description: 'Complete boom extension kit',
            isCustomPart: true
        },
        {
            id: 'sample-custom-2',
            partNumber: 'HYD-UPGRADE-001',
            name: 'Heavy Duty Hydraulic Upgrade',
            price: 95000,
            stock: 8,
            category: 'Hydraulic Parts',
            description: 'Upgraded hydraulic system',
            isCustomPart: true
        }
    ]

    const handleToggleCart = (partId: string) => {
        if (cart.includes(partId)) {
            setCart(cart.filter(id => id !== partId))
        } else {
            setCart([...cart, partId])
        }
    }

    const handleAddToCart = () => {
        const selectedCount = cart.length
        if (selectedCount === 0) {
            alert('Please select at least one part to add to cart')
            return
        }
        alert(`Added ${selectedCount} part(s) to cart!`)
    }

    const totalAmount = cart.reduce((sum, partId) => {
        const part = [...sampleBasicParts, ...sampleCustomParts].find(p => p.id === partId)
        return sum + (part?.price || 0)
    }, 0)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-6">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to My Machines
                </Link>

                {/* Machine Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="text-6xl">🏗️</div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{machine.name}</h1>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Model:</span>
                                    <span className="font-semibold ml-2">{machine.model}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Serial Number:</span>
                                    <span className="font-semibold ml-2">{customerMachine.serialNumber}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Category:</span>
                                    <span className="font-semibold ml-2">{machine.category}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Nickname:</span>
                                    <span className="font-semibold ml-2">{customerMachine.nickname}</span>
                                </div>
                            </div>
                            {customerMachine.hasCustomization && (
                                <div className="mt-3">
                                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        ⚙️ Customized Machine
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Required Parts */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center mb-6">
                        <Package className="h-6 w-6 text-green-600 mr-2" />
                        <h2 className="text-2xl font-bold">Basic Required Parts</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sampleBasicParts.map(part => (
                            <div key={part.id} className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{part.name}</h3>
                                        <div className="text-sm text-gray-600">{part.partNumber}</div>
                                        <div className="text-sm text-gray-600 mt-1">{part.description}</div>
                                    </div>
                                    <span className="inline-block bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold ml-2">
                                        BASIC
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mb-3">
                                    <div className="text-xl font-bold text-primary-600">
                                        ₹{part.price.toLocaleString('en-IN')}
                                    </div>
                                    <div className={`text-sm font-semibold ${part.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                        Stock: {part.stock}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleToggleCart(part.id)}
                                    disabled={part.stock === 0}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${cart.includes(part.id)
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : part.stock > 0
                                            ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {cart.includes(part.id) ? '✓ Remove from Cart' : '🛒 Add to Cart'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customized Parts */}
                {customerMachine.hasCustomization && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex items-center mb-6">
                            <Wrench className="h-6 w-6 text-purple-600 mr-2" />
                            <h2 className="text-2xl font-bold">Customized Parts</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sampleCustomParts.map(part => (
                                <div key={part.id} className="border-2 border-purple-200 bg-purple-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{part.name}</h3>
                                            <div className="text-sm text-gray-600">{part.partNumber}</div>
                                            <div className="text-sm text-gray-600 mt-1">{part.description}</div>
                                        </div>
                                        <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold ml-2">
                                            CUSTOM
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-xl font-bold text-primary-600">
                                            ₹{part.price.toLocaleString('en-IN')}
                                        </div>
                                        <div className={`text-sm font-semibold ${part.stock > 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            Stock: {part.stock}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleToggleCart(part.id)}
                                        disabled={part.stock === 0}
                                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${cart.includes(part.id)
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : part.stock > 0
                                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {cart.includes(part.id) ? '✓ Remove from Cart' : '🛒 Add to Cart'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cart Summary */}
                {cart.length > 0 && (
                    <div className="bg-primary-50 border-2 border-primary-200 rounded-xl shadow-md p-6 sticky bottom-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-600">Selected Parts: {cart.length}</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    Total: ₹{totalAmount.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
