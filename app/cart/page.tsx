'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { mockProducts } from '@/lib/mockData'

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { product: mockProducts[0], quantity: 2 },
        { product: mockProducts[4], quantity: 1 }
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold text-primary-600">ACE</div>
                            <div className="text-sm text-gray-600">Cranes & Equipment</div>
                        </Link>
                        <nav className="flex items-center space-x-6">
                            <Link href="/products" className="hover:text-primary-600 transition-colors">
                                Products
                            </Link>
                            <Link href="/auth/login" className="hover:text-primary-600 transition-colors">
                                Login
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Add some products to get started</p>
                        <Link
                            href="/products"
                            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.product.id} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <div className="text-4xl">🔧</div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <Link
                                                        href={`/products/${item.product.id}`}
                                                        className="font-semibold text-lg hover:text-primary-600 transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <div className="text-sm text-gray-500">{item.product.partNumber}</div>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <div className="text-sm text-gray-600 mb-4">{item.product.category}</div>

                                            <div className="flex items-center justify-between">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary-600">
                                                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ₹{item.product.price.toLocaleString('en-IN')} each
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tax (18%)</span>
                                        <span>₹{tax.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-primary-600">₹{total.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-700">
                                        Add ₹{(50000 - subtotal).toLocaleString('en-IN')} more for free shipping!
                                    </div>
                                )}

                                <Link
                                    href="/checkout"
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 group"
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/products"
                                    className="block text-center text-primary-600 hover:text-primary-700 mt-4 font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
