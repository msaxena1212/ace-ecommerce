
import { useState } from 'react'

interface MachineFormProps {
    initialData?: any
    onSubmit: (machine: any) => void
    onCancel: () => void
}

export default function MachineForm({ initialData, onSubmit, onCancel }: MachineFormProps) {
    const [formData, setFormData] = useState(initialData || {
        machineNumber: '', name: '', category: '', model: '',
        description: '', isCustomizable: false, images: [] as string[]
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = [...(formData.images || [])]
            if (newImages.length < 2) {
                newImages.push(URL.createObjectURL(e.target.files[0]))
                setFormData({ ...formData, images: newImages })
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ ...formData, id: initialData?.id })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Machine Number</label>
                    <input type="text" required className="input-field w-full" placeholder="e.g. ACE-FX14-2024"
                        value={formData.machineNumber} onChange={e => setFormData({ ...formData, machineNumber: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Machine Name</label>
                    <input type="text" required className="input-field w-full"
                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input type="text" required className="input-field w-full"
                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input type="text" required className="input-field w-full"
                        value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea className="input-field w-full" rows={3}
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Machine Images (Max 2)</label>
                    <div className="flex space-x-4">
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={formData.images?.length >= 2} className="text-sm text-gray-500" />
                    </div>
                    <div className="flex space-x-2 mt-2">
                        {formData.images?.map((img: string, idx: number) => (
                            <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                                <img src={img} alt="Machine" className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600 rounded"
                            checked={formData.isCustomizable}
                            onChange={e => setFormData({ ...formData, isCustomizable: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-gray-700">This machine supports customization</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm">Save Machine</button>
            </div>
        </form>
    )
}
