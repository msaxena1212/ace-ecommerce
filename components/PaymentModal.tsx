'use client'

import React from 'react'
import { X, CreditCard, Banknote, Smartphone, CheckBox } from 'lucide-react'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (method: string) => void
    points: number
}

const paymentMethods = [
    { id: 'COD', name: 'Cash On Delivery', icon: <Banknote className="h-5 w-5" /> },
    { id: 'CREDIT', name: 'Credit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'DEBIT', name: 'Debit Card', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'CARD_ON_DELIVERY', name: 'Card On Delivery', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'GPAY', name: 'GPay', icon: <Smartphone className="h-5 w-5" /> },
]

export default function PaymentModal({ isOpen, onClose, onSelect, points }: PaymentModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-end bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Select Payment Method</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Points Banner */}
                    <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Points {points} available</h3>
                                <p className="text-[10px] text-gray-500">Redeem Points: {points}</p>
                            </div>
                        </div>
                        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors">
                            Remove
                        </button>
                    </div>

                    {/* Payment Options */}
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    onSelect(method.id)
                                    onClose()
                                }}
                                className="w-full flex items-center p-4 border rounded-xl hover:border-primary-500 hover:bg-primary-50/10 transition-all group text-left"
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-primary-500 mr-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-primary-500 transition-colors"></div>
                                </div>
                                <span className="font-semibold text-gray-700 flex-1">{method.name}</span>
                                <div className="text-gray-400 group-hover:text-primary-500">
                                    {method.icon}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Section (If needed) */}
                <div className="p-6 bg-gray-50 border-t">
                    <p className="text-[11px] text-gray-500 text-center">
                        By proceeding, you agree to our Terms & Conditions and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}
