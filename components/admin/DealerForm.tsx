
import { useState } from 'react'

interface DealerFormProps {
    initialData?: any
    onSubmit: (dealer: any) => void
    onCancel: () => void
}

export default function DealerForm({ initialData, onSubmit, onCancel }: DealerFormProps) {
    const [formData, setFormData] = useState(initialData ? {
        ...initialData,
        servicePincodes: Array.isArray(initialData.servicePincodes) ? initialData.servicePincodes.join(', ') : initialData.servicePincodes
    } : {
        name: '', email: '', phone: '', password: '',
        gstin: '', level: 'L3', servicePincodes: '',
        contactPerson: '', address: '', city: '', state: '', pincode: '',
        country: 'India'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            id: initialData?.id,
            servicePincodes: typeof formData.servicePincodes === 'string' ? formData.servicePincodes.split(',').map((s: string) => s.trim()) : formData.servicePincodes
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dealer / Business Name</label>
                        <input type="text" required className="input-field w-full" placeholder="Enterprise Name"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN / Tax ID</label>
                        <input type="text" className="input-field w-full" placeholder="GSTIN"
                            value={formData.gstin || ''} onChange={e => setFormData({ ...formData, gstin: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Level</label>
                        <select className="input-field w-full" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })}>
                            <option value="L1">L1 (Regional Hub)</option>
                            <option value="L2">L2 (City Distributor)</option>
                            <option value="L3">L3 (Retail Partner)</option>
                            <option value="WAREHOUSE">WAREHOUSE (Company Owned)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Pincodes</label>
                        <input type="text" className="input-field w-full" placeholder="Comma-separated (e.g. 110001, 110002)"
                            value={formData.servicePincodes} onChange={e => setFormData({ ...formData, servicePincodes: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input type="text" className="input-field w-full" placeholder="Name"
                            value={formData.contactPerson || ''} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" required className="input-field w-full" placeholder="Email"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input type="tel" required className="input-field w-full" placeholder="Phone"
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" required={!initialData} className="input-field w-full" placeholder={initialData ? "Leave blank to keep unchanged" : "Login Password"}
                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <textarea className="input-field w-full" rows={2} placeholder="Address"
                            value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input type="text" required className="input-field w-full" placeholder="City"
                            value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input type="text" required className="input-field w-full" placeholder="State"
                            value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input type="text" required className="input-field w-full" placeholder="Pincode"
                            value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm">
                    {initialData ? 'Update Dealer' : 'Save Dealer'}
                </button>
            </div>
        </form>
    )
}
