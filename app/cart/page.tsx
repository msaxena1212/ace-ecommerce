'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { mockProducts } from '@/lib/mockData'
import Header from '@/components/Header'

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { product: mockProducts[0], quantity: 2, image: '🔧' },
        { product: mockProducts[4], quantity: 1, image: '🧴' }
    ])

    const updateQuantity = (productId: string, newQuantity: number) => {
        setCartItems(items =>
            items.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, newQuantity)) }
                    : item
            )
        )
    }

    const removeItem = (productId: string) => {
        setCartItems(items => items.filter(item => item.product.id !== productId))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shipping = subtotal > 50000 ? 0 : 500
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="bg-primary-500 p-3 rounded-2xl shadow-lg shadow-primary-500/20">
                        <ShoppingBag className="h-8 w-8 text-black" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-12 text-center border border-gray-100">
                        <div className="text-8xl mb-6 animate-bounce">🛒</div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">Your cart feels lonely...</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any genuine ACE parts yet. Start browsing our catalog to keep your machines running at peak performance.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-primary-500/40"
                        >
                            <span>Browse Catalog</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex space-x-6">
                                    {/* Product Image Capsule */}
                                    <div className="w-28 h-28 bg-gray-50 rounded-2xl flex items-center justify-center text-5xl border border-gray-50 flex-shrink-0">
                                        {item.image || '🔧'}
                                    </div>

                                    {/* Item Content */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                    className="font-bold text-lg text-gray-900 hover:text-primary-600 transition-colors line-clamp-1 uppercase"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{item.product.partNumber}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                                                <div className="text-[10px] font-bold text-gray-400">₹{item.product.price.toLocaleString('en-IN')} / unit</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors font-bold text-sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Remove</span>
                                            </button>

                                            {/* Quantity Pill - Same as Checkout */}
                                            <div className="flex items-center bg-[#b8955d] text-white rounded-full p-1 shadow-lg shadow-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                                >
                                                    <Minus className="h-5 w-5" />
                                                </button>
                                                <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Sticky Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 sticky top-24 border border-gray-50">
                                <h2 className="text-2xl font-black mb-8 text-gray-900 border-b border-gray-50 pb-4">Order Summary</h2>

                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <span>Estimated Shipping</span>
                                        <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900'}>
                                            {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-bold">
                                        <span>Tax (18%)</span>
                                        <span className="text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                                    </div>

                                    <div className="pt-5 border-t border-gray-50">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
                                            <span className="text-3xl font-black text-primary-600 leading-none">₹{total.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-primary-50 border-2 border-primary-200 border-dashed rounded-2xl p-4 mb-8">
                                        <p className="text-xs font-bold text-primary-800 text-center leading-relaxed">
                                            Add <span className="text-primary-900 text-sm">₹{(50000 - subtotal).toLocaleString('en-IN')}</span> more to unlock <span className="uppercase text-primary-900">Free Express Delivery</span>
                                        </p>
                                    </div>
                                )}

                                <Link
                                    href="/checkout"
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center space-x-3 shadow-xl hover:shadow-primary-500/30 active:scale-[0.98] group"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/products"
                                    className="block text-center text-gray-400 hover:text-gray-600 mt-6 font-bold text-sm transition-colors uppercase tracking-widest"
                                >
                                    ← Keep Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
