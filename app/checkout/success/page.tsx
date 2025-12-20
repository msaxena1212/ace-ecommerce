'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, ArrowRight, Truck, Package, Calendar } from 'lucide-react'
import Header from '@/components/Header'

export default function SuccessPage() {
    const [orderNumber, setOrderNumber] = useState('')

    useEffect(() => {
        // Generate or fetch order number
        setOrderNumber(`ORD-${Math.floor(100000 + Math.random() * 900000)}`)

        // Dynamic Title
        document.title = "Order Confirmed | ACE Cranes"
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">

                    {/* Upper Section: Celebration */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-12 text-center text-white relative">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                            {/* Abstract patterns can go here */}
                            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full animate-pulse" />
                            <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full opacity-50" />
                        </div>

                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-6 border-4 border-white/30">
                            <CheckCircle2 className="h-12 w-12 text-white" />
                        </div>

                        <h1 className="text-4xl font-black mb-2 tracking-tight">Order Confirmed!</h1>
                        <p className="text-green-50 opacity-90 font-medium">Thank you for choosing ACE Cranes.</p>
                    </div>

                    {/* Lower Section: Details */}
                    <div className="p-8 md:p-12 space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start space-x-4">
                                <div className="bg-primary-100 p-3 rounded-xl">
                                    <Package className="h-6 w-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Number</p>
                                    <p className="text-lg font-black text-gray-900">{orderNumber}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start space-x-4">
                                <div className="bg-orange-100 p-3 rounded-xl">
                                    <Calendar className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Delivery</p>
                                    <p className="text-lg font-black text-gray-900">Dec 24, 2024</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Tracker (Static) */}
                        <div className="relative pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Tracking Status</h3>
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Processing</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full flex overflow-hidden">
                                <div className="w-1/4 bg-green-500 h-full rounded-full" />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Confirmed</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase">Shipped</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase">Out for Delivery</span>
                                <span className="text-[10px] font-bold text-gray-300 uppercase">Arrived</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg shadow-gray-200"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                <span>Continue Shopping</span>
                            </Link>

                            <Link
                                href="/dashboard/orders"
                                className="flex-1 border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-95"
                            >
                                <span>View My Orders</span>
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">A confirmation email has been sent to your registered address.</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
