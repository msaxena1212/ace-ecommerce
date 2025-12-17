
import { useState } from 'react'

interface ProductFormProps {
    initialData?: any
    onSubmit: (product: any) => void
    onCancel: () => void
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState(initialData || {
        partNumber: '', name: '', category: '',
        price: '', stock: '', weight: '',
        description: '', compatibleMachines: '',
        images: [] as string[]
    })

    // Mock image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // In a real app, upload to server. Here we just mock it.
            const newImages = [...(formData.images || [])]
            if (newImages.length < 2) {
                newImages.push(URL.createObjectURL(e.target.files[0]))
                setFormData({ ...formData, images: newImages })
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            id: initialData?.id, // Keep ID if editing
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            compatibleMachines: typeof formData.compatibleMachines === 'string' ? formData.compatibleMachines.split(',').map((s: string) => s.trim()) : formData.compatibleMachines
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                    <input type="text" required className="input-field w-full"
                        value={formData.partNumber} onChange={e => setFormData({ ...formData, partNumber: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input type="text" required className="input-field w-full"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="input-field w-full" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option value="">Select Category</option>
                        <option value="Hydraulic Parts">Hydraulic Parts</option>
                        <option value="Electrical Systems">Electrical Systems</option>
                        <option value="Structural Parts">Structural Parts</option>
                        <option value="Filters & Oils">Filters & Oils</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" required className="input-field w-full"
                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input type="number" required className="input-field w-full"
                        value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input type="text" className="input-field w-full"
                        value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="input-field w-full" rows={3}
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Max 2)</label>
                    <div className="flex space-x-4">
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={formData.images?.length >= 2} className="text-sm text-gray-500" />
                    </div>
                    <div className="flex space-x-2 mt-2">
                        {formData.images?.map((img: string, idx: number) => (
                            <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                                <img src={img} alt="Product" className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compatible Machines</label>
                    <input type="text" className="input-field w-full" placeholder="Comma-separated IDs"
                        value={formData.compatibleMachines} onChange={e => setFormData({ ...formData, compatibleMachines: e.target.value })} />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm">Save Product</button>
            </div>
        </form>
    )
}
