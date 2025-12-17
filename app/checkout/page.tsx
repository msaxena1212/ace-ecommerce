'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, MapPin, Check } from 'lucide-react'
import { mockProducts } from '@/lib/mockData'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'ONLINE'
    })

    const cartItems = [
        { product: mockProducts[0], quantity: 2 },
        { product: mockProducts[4], quantity: 1 }
    ]

    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shipping = subtotal > 50000 ? 0 : 500
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (step < 3) {
            setStep(step + 1)
        } else {
            // Place order
            router.push('/order-confirmation')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold text-primary-600">ACE</div>
                            <div className="text-sm text-gray-600">Cranes & Equipment</div>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link href="/cart" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Cart
                </Link>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                                }`}>
                                {step > 1 ? <Check className="h-6 w-6" /> : '1'}
                            </div>
                            <span className="ml-2 font-medium">Delivery</span>
                        </div>
                        <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                                }`}>
                                {step > 2 ? <Check className="h-6 w-6" /> : '2'}
                            </div>
                            <span className="ml-2 font-medium">Payment</span>
                        </div>
                        <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                                }`}>
                                {step > 3 ? <Check className="h-6 w-6" /> : '3'}
                            </div>
                            <span className="ml-2 font-medium">Review</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <form onSubmit={handleSubmit}>
                                {step === 1 && (
                                    <div>
                                        <div className="flex items-center space-x-3 mb-6">
                                            <MapPin className="h-6 w-6 text-primary-600" />
                                            <h2 className="text-2xl font-bold">Delivery Address</h2>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="input-field"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="input-field"
                                                        placeholder="+91-9876543210"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Address Line 1</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.addressLine1}
                                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Street address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Address Line 2</label>
                                                <input
                                                    type="text"
                                                    value={formData.addressLine2}
                                                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                                                    className="input-field"
                                                    placeholder="Apartment, suite, etc. (optional)"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">City</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="input-field"
                                                        placeholder="New Delhi"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">State</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.state}
                                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                        className="input-field"
                                                        placeholder="Delhi"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold mb-2">Pincode</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.pincode}
                                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                        className="input-field"
                                                        placeholder="110020"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div>
                                        <div className="flex items-center space-x-3 mb-6">
                                            <CreditCard className="h-6 w-6 text-primary-600" />
                                            <h2 className="text-2xl font-bold">Payment Method</h2>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="ONLINE"
                                                    checked={formData.paymentMethod === 'ONLINE'}
                                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                    className="w-5 h-5 text-primary-600"
                                                />
                                                <div className="ml-4">
                                                    <div className="font-semibold">Online Payment</div>
                                                    <div className="text-sm text-gray-600">Pay securely using UPI, Card, or Net Banking</div>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="COD"
                                                    checked={formData.paymentMethod === 'COD'}
                                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                    className="w-5 h-5 text-primary-600"
                                                />
                                                <div className="ml-4">
                                                    <div className="font-semibold">Cash on Delivery</div>
                                                    <div className="text-sm text-gray-600">Pay when you receive the order</div>
                                                </div>
                                            </label>
                                            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="CREDIT"
                                                    checked={formData.paymentMethod === 'CREDIT'}
                                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                                    className="w-5 h-5 text-primary-600"
                                                />
                                                <div className="ml-4">
                                                    <div className="font-semibold">Credit Terms</div>
                                                    <div className="text-sm text-gray-600">For registered dealers only</div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div>
                                        <div className="flex items-center space-x-3 mb-6">
                                            <Check className="h-6 w-6 text-primary-600" />
                                            <h2 className="text-2xl font-bold">Review Order</h2>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold mb-2">Delivery Address</h3>
                                                <div className="text-sm text-gray-700">
                                                    <div>{formData.name}</div>
                                                    <div>{formData.phone}</div>
                                                    <div>{formData.addressLine1}</div>
                                                    {formData.addressLine2 && <div>{formData.addressLine2}</div>}
                                                    <div>{formData.city}, {formData.state} - {formData.pincode}</div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="font-semibold mb-2">Payment Method</h3>
                                                <div className="text-sm text-gray-700">
                                                    {formData.paymentMethod === 'ONLINE' && 'Online Payment'}
                                                    {formData.paymentMethod === 'COD' && 'Cash on Delivery'}
                                                    {formData.paymentMethod === 'CREDIT' && 'Credit Terms'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 mt-8">
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(step - 1)}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        {step === 3 ? 'Place Order' : 'Continue'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cartItems.map(item => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <div className="text-2xl">🔧</div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm line-clamp-2">{item.product.name}</div>
                                            <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                                            <div className="font-semibold text-primary-600">
                                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Tax (18%)</span>
                                    <span>₹{tax.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary-600">₹{total.toLocaleString('en-IN')}</span>
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
