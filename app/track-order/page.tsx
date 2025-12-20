'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, MapPin, Search, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'

export default function TrackOrderPage() {
    const searchParams = useSearchParams()
    const [orderId, setOrderId] = useState(searchParams.get('id') || '')
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!orderId) return

        setLoading(true)
        setError('')
        setOrder(null)

        try {
            // In a real app, we would fetch from /api/orders/[id]
            // For this prototype, we'll fetch from a new endpoint or mock it
            // Let's use the api/products endpoint to at least get something or create a dedicated one
            const res = await fetch(`/api/orders/${orderId}`)
            const result = await res.json()
            if (!res.ok || !result.success) {
                throw new Error(result.error || 'Order not found')
            }
            setOrder(result.data)
        } catch (err: any) {
            setError(err.message || 'Failed to find order. Please check the ID and try again.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (orderId) {
            handleSearch()
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-primary-600 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
                        <p className="opacity-90 text-sm">Enter your order ID or tracking number to see current status</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter Order ID (e.g., ORD-2024-001)"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !orderId}
                                className="bg-secondary-500 hover:bg-secondary-600 text-black px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Track'}
                            </button>
                        </form>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8 text-red-700">
                                {error}
                            </div>
                        )}

                        {order && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Order Status Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="mb-4 md:mb-0">
                                        <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Status</div>
                                        <div className="text-2xl font-bold text-gray-900 flex items-center">
                                            <span className={`inline-block w-3 h-3 rounded-full mr-3 ${order.status === 'DELIVERED' ? 'bg-green-500' :
                                                order.status === 'SHIPPED' ? 'bg-blue-500' : 'bg-yellow-500'
                                                }`}></span>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Estimated Delivery</div>
                                        <div className="text-xl font-bold text-gray-900">
                                            {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            }) : 'TBD'}
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="relative py-4">
                                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                    <div className="space-y-12 relative">
                                        {/* Placed */}
                                        <div className="flex items-start">
                                            <div className="w-16 flex justify-center mt-1">
                                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white z-10 shadow-lg">
                                                    <CheckCircle className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="font-bold text-gray-900">Order Placed</h3>
                                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                                <p className="text-gray-600 mt-1">Your order was successfully placed and is being processed.</p>
                                            </div>
                                        </div>

                                        {/* Processing */}
                                        <div className="flex items-start">
                                            <div className="w-16 flex justify-center mt-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 shadow-lg ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}>
                                                    {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className={`font-bold ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-gray-900' : 'text-gray-400'}`}>Processing</h3>
                                                <p className="text-gray-600 mt-1">Order verified and parts being picked from inventory.</p>
                                            </div>
                                        </div>

                                        {/* Shipped */}
                                        <div className="flex items-start">
                                            <div className="w-16 flex justify-center mt-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 shadow-lg ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}>
                                                    {['SHIPPED', 'DELIVERED'].includes(order.status) ? <CheckCircle className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className={`font-bold ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-gray-900' : 'text-gray-400'}`}>Shipped</h3>
                                                {order.trackingId && (
                                                    <p className="text-sm text-primary-600 font-semibold mb-1">ID: {order.trackingId} via {order.deliveryPartner}</p>
                                                )}
                                                <p className="text-gray-600 mt-1">Order has been handed over to our delivery partner.</p>
                                            </div>
                                        </div>

                                        {/* Delivered */}
                                        <div className="flex items-start">
                                            <div className="w-16 flex justify-center mt-1">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 shadow-lg ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}>
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className={`font-bold ${order.status === 'DELIVERED' ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</h3>
                                                {order.actualDelivery && (
                                                    <p className="text-sm text-gray-500">at {new Date(order.actualDelivery).toLocaleString()}</p>
                                                )}
                                                <p className="text-gray-600 mt-1">Order successfully delivered to your primary address.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 mt-8 pt-8">
                                    <h3 className="text-lg font-bold mb-4">Order Items</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                                <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1">
                                                    <img src={item.product?.images?.[0] || '/assets/part-filter.png'} alt={item.product?.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{item.product?.name}</div>
                                                    <div className="text-xs text-gray-500">{item.product?.partNumber}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</div>
                                                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                                        <div className="text-lg font-bold">Total Amount</div>
                                        <div className="text-2xl font-bold text-primary-600">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!order && !loading && !error && !orderId && (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-6xl mb-4">📦</div>
                                <p>Ready to track your order? Enter your ID above.</p>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
                                        <div className="font-bold text-gray-900 mb-1">Where is my order ID?</div>
                                        <p className="text-xs">Check your confirmation email or your dashboard under "My Orders".</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
                                        <div className="font-bold text-gray-900 mb-1">Sample Order for Demo</div>
                                        <p className="text-xs font-mono">ORD-2024-001</p>
                                        <p className="text-xs font-mono">ORD-2024-002</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
