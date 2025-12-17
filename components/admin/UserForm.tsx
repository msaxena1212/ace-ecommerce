
import { useState } from 'react'

interface UserFormProps {
    onSubmit: (user: any) => void
    onCancel: () => void
}

export default function UserForm({ onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'ADMIN', // Default and only allowed role for creation
        password: '' // Required for new users
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Enforce ADMIN role
        onSubmit({ ...formData, role: 'ADMIN' })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 mb-4">
                <strong>Note:</strong> You can only create Company Users (Admins) here. Dealers and Customers must register via their respective portals.
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        className="input-field w-full"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="input-field w-full"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. john@ace-cranes.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        className="input-field w-full"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="input-field w-full"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min. 8 characters"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                        disabled
                        className="input-field w-full bg-gray-100 cursor-not-allowed"
                        value={formData.role}
                    >
                        <option value="ADMIN">Company Admin</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                >
                    Create User
                </button>
            </div>
        </form>
    )
}
