'use client'

import { useState } from 'react'
import { MapPin, Phone, User, Landmark, Building2, Globe } from 'lucide-react'

interface AddressFormProps {
    onSubmit: (address: any) => void
    onCancel?: () => void
    initialData?: any
}

export default function AddressForm({ onSubmit, onCancel, initialData }: AddressFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        pincode: initialData?.pincode || '',
        isDefault: initialData?.isDefault || false
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span>Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Recipient Name"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="+91-XXXXXXXXXX"
                        />
                    </div>
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address Line 1</label>
                    <div className="relative">
                        < Landmark className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            required
                            value={formData.addressLine1}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Flat/House No., Building, Apartment"
                        />
                    </div>
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address Line 2 (Optional)</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.addressLine2}
                            onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Area, Street, Sector, Village"
                        />
                    </div>
                </div>

                {/* City */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="New Delhi"
                    />
                </div>

                {/* State */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                    <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="Delhi"
                    />
                </div>

                {/* Pincode */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pincode</label>
                    <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                        placeholder="110001"
                    />
                </div>

                {/* Default Toggle */}
                <div className="flex items-center space-x-2 pt-4">
                    <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-semibold text-gray-700">Make this my default address</label>
                </div>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-50">
                <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/10 active:scale-[0.98]"
                >
                    Save & Confirm Address
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}
