'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
    ArrowLeft,
    MapPin,
    Trash2,
    Plus,
    Minus,
    ChevronDown,
    Tag,
    Wallet,
    Truck,
    Calculator,
    CreditCard,
    MessageCircle,
    Loader2,
    CheckCircle2,
    Phone
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PaymentModal from '@/components/PaymentModal'
import AddressForm from '@/components/AddressForm'
import AuthPrompt from '@/components/AuthPrompt'

export default function CheckoutPage() {
    const { data: session, status } = useSession()
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
    const [addresses, setAddresses] = useState<any[]>([])
    const [selectedAddress, setSelectedAddress] = useState<any>(null)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const router = useRouter()

    // Mock Cart Data (in real app, this might come from DB/Context)
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'SVR XERIAL 50 CREAM 50ML #48064', price: 126, quantity: 1, image: '🔧' },
        { id: '2', name: 'BEXIDENT FRESH BREATH MOUTHWASH 500ML#BX005', price: 70, quantity: 1, image: '🧴' },
        { id: '3', name: 'ANTIPLEX 75MG TABLET 30\'S', price: 165, quantity: 1, image: '💊' }
    ])

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAddresses()
        }
    }, [status])

    const fetchAddresses = async () => {
        setIsLoadingAddresses(true)
        try {
            const res = await fetch('/api/user/addresses')
            const data = await res.json()
            setAddresses(data)
            const defaultAddr = data.find((a: any) => a.isDefault) || data[0]
            if (defaultAddr) setSelectedAddress(defaultAddr)
            else setShowAddressForm(true)
        } catch (error) {
            console.error('Failed to fetch addresses')
        } finally {
            setIsLoadingAddresses(false)
        }
    }

    const handleAddressSubmit = async (addressData: any) => {
        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                body: JSON.stringify(addressData),
                headers: { 'Content-Type': 'application/json' }
            })
            const newAddress = await res.json()
            setAddresses([...addresses, newAddress])
            setSelectedAddress(newAddress)
            setShowAddressForm(false)
        } catch (error) {
            console.error('Failed to save address')
        }
    }

    const handlePlaceOrder = async (paymentMethod: string) => {
        setIsPlacingOrder(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deliveryAddress: selectedAddress,
                    paymentMethod,
                    items: cartItems
                })
            })

            const result = await res.json()
            if (result.success) {
                router.push('/checkout/success')
            } else {
                alert(result.error || 'Failed to place order')
            }
        } catch (error) {
            console.error('Order Error:', error)
            alert('An error occurred while placing your order.')
        } finally {
            setIsPlacingOrder(false)
        }
    }

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ))
    }

    const removeItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id))
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const couponDiscount = 0
    const walletRedeem = 16
    const shippingFee = 50
    const grandTotal = subtotal - couponDiscount - walletRedeem + shippingFee

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Flow */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Auth Check */}
                        {status === 'unauthenticated' ? (
                            <AuthPrompt />
                        ) : (
                            <>
                                {/* Address Section */}
                                {showAddressForm ? (
                                    <AddressForm
                                        onSubmit={handleAddressSubmit}
                                        onCancel={addresses.length > 0 ? () => setShowAddressForm(false) : undefined}
                                    />
                                ) : (
                                    <div className="bg-white rounded-xl border-2 border-primary-50 shadow-sm overflow-hidden">
                                        <div className="p-4 flex items-start space-x-4 border-b border-gray-50 bg-primary-50/10">
                                            <div className="bg-primary-600 p-2 rounded-full mt-1">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">Deliver to:</h3>
                                                        <div className="text-gray-600 text-sm mt-1">
                                                            <p className="font-bold text-gray-900">{selectedAddress?.name}</p>
                                                            <p>{selectedAddress?.addressLine1}, {selectedAddress?.addressLine2}</p>
                                                            <p>{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}</p>
                                                            <p className="mt-1 font-semibold text-gray-800 flex items-center">
                                                                <Phone className="h-3 w-3 mr-1" /> {selectedAddress?.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <button
                                                            onClick={() => setShowAddressForm(true)}
                                                            className="text-primary-600 font-bold text-sm hover:underline"
                                                        >
                                                            Change Address
                                                        </button>
                                                        <div className="flex items-center space-x-1 text-green-600">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            <span className="text-[10px] font-bold uppercase">Confirmed</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-bold text-gray-800 text-sm">Billing address:</h3>
                                                <span className="text-gray-400 text-[10px] italic">Same as Shipping address</span>
                                                <input
                                                    type="checkbox"
                                                    checked={billingSameAsShipping}
                                                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Cart Items */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-black text-gray-800 pl-2">Review Items ({cartItems.length})</h2>
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex space-x-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center text-3xl border border-gray-100">
                                                {item.image}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 leading-tight uppercase text-[13px] pr-4">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 text-[10px] font-bold mt-1 hover:text-red-500 transition-colors uppercase"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">₹{item.price}</p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end items-center mt-2">
                                                    <div className="flex items-center bg-[#b8955d] text-white rounded-full px-1 py-1 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                                        >
                                                            {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                                        </button>
                                                        <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-4 space-y-4">

                        {/* Coupon Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <Tag className="h-5 w-5 text-green-600" />
                                <span className="font-bold text-gray-700">Available Coupon</span>
                            </div>
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Points Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div className="leading-tight">
                                    <h4 className="font-bold text-sm">Points 0 available</h4>
                                    <p className="text-[10px] text-gray-500">Redeem Points: 836</p>
                                </div>
                            </div>
                            <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm">
                                Remove
                            </button>
                        </div>

                        {/* Full Summary Card */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-6 space-y-4 relative overflow-hidden">
                            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Order Summary</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Calculator className="h-4 w-4" />
                                        <span className="text-sm">SubTotal</span>
                                    </div>
                                    <span className="font-bold text-gray-800">₹{subtotal}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Tag className="h-4 w-4" />
                                        <span className="text-sm">Coupon Discount</span>
                                    </div>
                                    <span className="font-bold text-gray-800 text-green-600">-₹{couponDiscount}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Wallet className="h-4 w-4" />
                                        <span className="text-sm">Wallet Redeem</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-green-600 font-bold block leading-none mb-1">(Points 836)</span>
                                        <span className="font-bold text-gray-800">₹{walletRedeem}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Truck className="h-4 w-4" />
                                        <span className="text-sm">Shipping Fee</span>
                                    </div>
                                    <span className="font-bold text-gray-800">₹{shippingFee}</span>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="font-extrabold text-lg text-gray-900">Grand Total</span>
                                    <span className="font-extrabold text-2xl text-primary-600">₹{grandTotal}</span>
                                </div>
                            </div>

                            {/* Loyalty Points Banner */}
                            <div className="bg-orange-50 rounded-xl p-3 flex items-center justify-between border border-orange-100">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                                        <img src="/assets/ace-logo.png" className="h-1.5 w-auto brightness-0" alt="ACE" />
                                    </div>
                                    <span className="text-[10px] font-bold text-orange-800 uppercase tracking-tighter">ACE Rewards</span>
                                </div>
                                <span className="text-[11px] font-semibold text-orange-900">You will earn <span className="font-bold text-orange-600">32</span> Points</span>
                            </div>

                            <div className="py-2">
                                <button className="w-full flex items-center justify-between text-gray-700 font-bold border-b border-gray-50 pb-2 hover:bg-gray-50 transition-all rounded-t-lg px-2">
                                    <span className="text-sm">Delivery Instruction</span>
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Payment Button */}
                            {status === 'authenticated' && selectedAddress ? (
                                <button
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    disabled={isPlacingOrder}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] animate-in fade-in slide-in-from-bottom-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPlacingOrder ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Select Payment Method</span>
                                    )}
                                </button>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        Complete Identity & Shipping to Pay
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating WhatsApp */}
            <a
                href="https://wa.me/911234567890"
                target="_blank"
                className="fixed bottom-24 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
            >
                <div className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-100">
                    Need Help? Chat with us
                </div>
                <MessageCircle className="h-7 w-7" />
            </a>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSelect={(method) => handlePlaceOrder(method)}
                points={836}
            />
        </div>
    )
}
