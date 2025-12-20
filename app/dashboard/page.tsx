'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Settings, LogOut, ShoppingBag, Wrench, HeadphonesIcon, TrendingUp } from 'lucide-react'
import { mockCustomerMachines, mockOrders, mockSuggestions, mockProducts, mockMachines } from '@/lib/mockData'
import Header from '@/components/Header'

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview')

    const customerMachines = mockCustomerMachines
    const recentOrders = mockOrders
    const suggestions = mockSuggestions.slice(0, 3)

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
                    <p className="text-gray-600">Manage your orders, machines, and account settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview'
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <Package className="h-5 w-5" />
                                    <span>Overview</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders'
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>My Orders</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('machines')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'machines'
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <Wrench className="h-5 w-5" />
                                    <span>My Products</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('support')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'support'
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <HeadphonesIcon className="h-5 w-5" />
                                    <span>Support</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings'
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <Settings className="h-5 w-5" />
                                    <span>Settings</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
                                            <ShoppingBag className="h-8 w-8 text-primary-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">12</div>
                                        <div className="text-sm text-green-600 mt-1">+2 this month</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">My Machines</h3>
                                            <Wrench className="h-8 w-8 text-primary-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{customerMachines.length}</div>
                                        <div className="text-sm text-gray-500 mt-1">Active machines</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">Total Spent</h3>
                                            <TrendingUp className="h-8 w-8 text-primary-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">₹5.2L</div>
                                        <div className="text-sm text-gray-500 mt-1">Lifetime value</div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                                    <div className="space-y-4">
                                        {recentOrders.map(order => (
                                            <div key={order.id} className="border-b border-gray-200 pb-4 last:border-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-semibold">{order.orderNumber}</div>
                                                        <div className="text-sm text-gray-600">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-primary-600">
                                                            ₹{order.totalAmount.toLocaleString('en-IN')}
                                                        </div>
                                                        <div className="text-sm">
                                                            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/dashboard?tab=orders" className="block text-center text-primary-600 hover:text-primary-700 mt-4 font-medium">
                                        View All Orders →
                                    </Link>
                                </div>

                                {/* Suggested Parts */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {suggestions.map(suggestion => {
                                            const product = mockProducts.find(p => p.id === suggestion.productId)
                                            if (!product) return null
                                            return (
                                                <Link
                                                    key={suggestion.id}
                                                    href={`/products/${product.id}`}
                                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all group"
                                                >
                                                    <div className="aspect-square bg-white border border-gray-100 rounded-lg flex items-center justify-center mb-3 p-2 group-hover:bg-primary-50 transition-colors">
                                                        <img
                                                            src={
                                                                product.category === 'Mobile Cranes' ? '/assets/cat-mobile-crane.png' :
                                                                    product.category === 'Forklift Trucks' ? '/assets/cat-forklift.png' :
                                                                        product.category === 'Backhoe Loaders' ? '/assets/cat-backhoe.png' :
                                                                            product.category === 'Hydraulic Parts' ? '/assets/part-hydraulic.png' :
                                                                                product.category === 'Filters' ? '/assets/part-filter.png' :
                                                                                    '/assets/cat-mobile-crane.png' // Fallback
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <h3 className="font-semibold mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <div className="text-sm text-gray-600 mb-2">{suggestion.reason}</div>
                                                    <div className="font-bold text-primary-600">
                                                        ₹{product.price.toLocaleString('en-IN')}
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                                <div className="space-y-6">
                                    {recentOrders.map(order => (
                                        <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-1">{order.orderNumber}</h3>
                                                    <div className="text-sm text-gray-600">
                                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary-600 mb-1">
                                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                                    </div>
                                                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {order.items.map(item => {
                                                    const product = mockProducts.find(p => p.id === item.productId)
                                                    return (
                                                        <div key={item.id} className="flex justify-between text-sm">
                                                            <span>{product?.name} × {item.quantity}</span>
                                                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {order.trackingId && (
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="text-sm text-gray-600">
                                                        Tracking ID: <span className="font-mono font-semibold">{order.trackingId}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'machines' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">My Products</h2>
                                <div className="space-y-6">
                                    {customerMachines.map(custMachine => {
                                        const machine = mockMachines.find(m => m.id === custMachine.machineId)
                                        if (!machine) return null
                                        return (
                                            <div key={custMachine.id} className="border border-gray-200 rounded-lg p-6">
                                                <div className="flex gap-6">
                                                    <div className="w-32 h-32 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                                                        <img
                                                            src={
                                                                machine.name.includes('Forklift') ? '/assets/cat-forklift.png' :
                                                                    machine.name.includes('Backhoe') ? '/assets/cat-backhoe.png' :
                                                                        '/assets/cat-mobile-crane.png'
                                                            }
                                                            alt={machine.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold mb-2">{machine.name}</h3>
                                                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                                                            <div>Serial: <span className="font-mono font-semibold">{custMachine.serialNumber}</span></div>
                                                            <div>Nickname: {custMachine.nickname}</div>
                                                            <div>Purchase Date: {new Date(custMachine.purchaseDate || '').toLocaleDateString()}</div>
                                                            {custMachine.hasCustomization && (
                                                                <div className="inline-block bg-accent-100 text-accent-700 px-2 py-1 rounded-full text-xs font-semibold mt-2">
                                                                    Customized
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/machines/${custMachine.id}/compatible-parts`}
                                                            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            View Compatible Parts
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Support Tickets</h2>
                                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                        New Ticket
                                    </button>
                                </div>
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🎫</div>
                                    <h3 className="text-xl font-semibold mb-2">No support tickets</h3>
                                    <p className="text-gray-600">Create a ticket to get help from our support team</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Name</label>
                                        <input type="text" defaultValue="John Doe" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Email</label>
                                        <input type="email" defaultValue="john.doe@example.com" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Phone</label>
                                        <input type="tel" defaultValue="+91-9876543210" className="input-field" />
                                    </div>
                                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
