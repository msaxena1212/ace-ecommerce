'use client'

import Link from 'next/link'
import { Check, Package, Truck } from 'lucide-react'
import Header from '@/components/Header'

export default function OrderConfirmationPage() {
    const orderNumber = 'ORD-2024-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const estimatedDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-xl text-gray-600">Thank you for your purchase</p>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                    <div className="border-b pb-6 mb-6">
                        <div className="text-sm text-gray-600 mb-1">Order Number</div>
                        <div className="text-2xl font-bold text-primary-600">{orderNumber}</div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Order Processing</h3>
                                <p className="text-sm text-gray-600">
                                    Your order is being processed and will be routed to the nearest dealer for fulfillment.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Truck className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Estimated Delivery</h3>
                                <p className="text-sm text-gray-600">{estimatedDelivery}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard"
                        className="bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors text-center"
                    >
                        View Order Details
                    </Link>
                    <Link
                        href="/products"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors text-center"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* Email Notification */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>A confirmation email has been sent to your registered email address.</p>
                    <p className="mt-2">You can track your order from your dashboard.</p>
                </div>
            </div>
        </div>
    )
}
