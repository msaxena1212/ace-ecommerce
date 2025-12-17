'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Users, Package, TrendingUp, Settings, LogOut, ShoppingBag, Wrench, HeadphonesIcon,
    Plus, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle, BarChart3, Search, Archive, Upload, Image as ImageIcon
} from 'lucide-react'
import { mockDealers as initialDealers, mockOrders, mockProducts as initialProducts, mockMachines as initialMachines, mockSupportTickets, mockUsers as initialUsers } from '@/lib/mockData'
import Modal from '@/components/ui/Modal'
import UserForm from '@/components/admin/UserForm'
import DealerForm from '@/components/admin/DealerForm'
import ProductForm from '@/components/admin/ProductForm'
import MachineForm from '@/components/admin/MachineForm'
import RevenueChart from '@/components/admin/charts/RevenueChart'
import OrderStatusChart from '@/components/admin/charts/OrderStatusChart'
import DealerPerformanceChart from '@/components/admin/charts/DealerPerformanceChart'
import RecentActivity from '@/components/admin/RecentActivity'

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('overview')

    // Data State
    const [dealers, setDealers] = useState(initialDealers)
    const [products, setProducts] = useState(initialProducts)
    const [machines, setMachines] = useState(initialMachines)
    const [users, setUsers] = useState(initialUsers)

    // Modal State
    const [isDealerModalOpen, setIsDealerModalOpen] = useState(false)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [isMachineModalOpen, setIsMachineModalOpen] = useState(false)
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    // Edit State
    const [editingItem, setEditingItem] = useState<any>(null)

    // Filter State
    const [searchTerm, setSearchTerm] = useState('')

    // Derived State
    const filteredOrders = mockOrders.filter(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || o.status.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredDealers = dealers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.city.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredMachines = machines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.model.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))

    // Handlers
    // --- USER ---
    const handleAddUser = (newUser: any) => {
        setUsers([...users, { ...newUser, id: `user-${Date.now()}` }])
        setIsUserModalOpen(false)
    }
    const handleArchiveUser = (userId: string) => {
        if (confirm('Are you sure you want to archive this user?')) {
            setUsers(users.map(u => u.id === userId ? { ...u, isArchived: true } : u)) // Simulate archive logic
        }
    }

    // --- DEALER ---
    const handleSaveDealer = (dealerData: any) => {
        if (dealerData.id) {
            setDealers(dealers.map(d => d.id === dealerData.id ? { ...d, ...dealerData } : d))
        } else {
            setDealers([...dealers, { ...dealerData, id: `dealer-${Date.now()}`, performanceScore: 100, totalOrders: 0, approvedOrders: 0, rejectedOrders: 0, isActive: true }])
        }
        setIsDealerModalOpen(false)
        setEditingItem(null)
    }
    const handleEditDealer = (dealer: any) => {
        setEditingItem(dealer)
        setIsDealerModalOpen(true)
    }
    const handleDeactivateDealer = (id: string, currentStatus: boolean) => {
        if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this dealer?`)) {
            setDealers(dealers.map(d => d.id === id ? { ...d, isActive: !currentStatus } : d))
        }
    }

    // --- PRODUCT ---
    const handleSaveProduct = (productData: any) => {
        if (productData.id) {
            setProducts(products.map(p => p.id === productData.id ? { ...p, ...productData } : p))
        } else {
            setProducts([...products, { ...productData, id: `prod-${Date.now()}`, isActive: true }])
        }
        setIsProductModalOpen(false)
        setEditingItem(null)
    }
    const handleEditProduct = (product: any) => {
        setEditingItem({ ...product, compatibleMachines: product.compatibleMachines || [] }) // Sanitize if needed
        setIsProductModalOpen(true)
    }
    const handleDeactivateProduct = (id: string, currentStatus: boolean) => {
        if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this product?`)) {
            setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p))
        }
    }

    // --- MACHINE ---
    const handleSaveMachine = (machineData: any) => {
        if (machineData.id) {
            setMachines(machines.map(m => m.id === machineData.id ? { ...m, ...machineData } : m))
        } else {
            setMachines([...machines, { ...machineData, id: `machine-${Date.now()}`, isActive: true }])
        }
        setIsMachineModalOpen(false)
        setEditingItem(null)
    }
    const handleEditMachine = (machine: any) => {
        setEditingItem(machine)
        setIsMachineModalOpen(true)
    }
    const handleDeactivateMachine = (id: string, currentStatus: boolean) => {
        if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this machine?`)) {
            setMachines(machines.map(m => m.id === id ? { ...m, isActive: !currentStatus } : m))
        }
    }


    // Statistics (Same as before)
    const orderStats = {
        total: mockOrders.length,
        approved: mockOrders.filter(o => o.status === 'CONFIRMED' || o.status === 'DELIVERED').length,
        partialApproval: mockOrders.filter(o => o.items.some((item: any) => item.status === 'PARTIAL')).length,
        rejected: mockOrders.filter(o => o.status === 'CANCELLED').length,
        pending: mockOrders.filter(o => o.status.includes('ROUTING')).length,
    }
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Modal Close Wrapper to clear editing state
    const closeModals = () => {
        setIsDealerModalOpen(false)
        setIsProductModalOpen(false)
        setIsMachineModalOpen(false)
        setIsUserModalOpen(false)
        setEditingItem(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-black text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="text-3xl font-bold text-primary-500">ACE</div>
                            <div className="text-sm text-gray-300">Admin Portal</div>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <div className="text-sm">
                                <span className="text-gray-400">Admin:</span>
                                <span className="font-semibold ml-2">Super Admin</span>
                            </div>
                            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-primary-500 transition-colors">
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <nav className="space-y-2">
                                {[
                                    { id: 'overview', icon: TrendingUp, label: 'Overview' },
                                    { id: 'orders', icon: ShoppingBag, label: 'Orders' },
                                    { id: 'dealers', icon: Users, label: 'Dealers' },
                                    { id: 'products', icon: Package, label: 'Products' },
                                    { id: 'users', icon: Users, label: 'Company Users' },
                                    { id: 'customers', icon: Users, label: 'Customers' },
                                    { id: 'machines', icon: Wrench, label: 'Machines' },
                                    { id: 'support', icon: HeadphonesIcon, label: 'Support' },
                                    { id: 'settings', icon: Settings, label: 'Settings' },
                                ].map(({ id, icon: Icon, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => { setActiveTab(id); setSearchTerm('') }}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === id
                                            ? 'bg-primary-500 text-black font-semibold shadow-md'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-6">
                        {/* Global Filter Bar (except overview) */}
                        {activeTab !== 'overview' && activeTab !== 'settings' && activeTab !== 'support' && (
                            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab}...`}
                                        className="pl-10 input-field w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats content same as before ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
                                            <ShoppingBag className="h-8 w-8 text-primary-500" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{orderStats.total}</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
                                            <TrendingUp className="h-8 w-8 text-green-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">₹{(totalRevenue / 1000000).toFixed(1)}M</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">Active Dealers</h3>
                                            <Users className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{dealers.length}</div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-600 text-sm font-medium">Products</h3>
                                            <Package className="h-8 w-8 text-purple-600" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">{products.length}</div>
                                    </div>
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <RevenueChart />
                                    <OrderStatusChart />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <DealerPerformanceChart />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <RecentActivity />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dealers Tab */}
                        {activeTab === 'dealers' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Dealer Management</h2>
                                    <button onClick={() => { setEditingItem(null); setIsDealerModalOpen(true) }} className="btn-primary flex items-center space-x-2">
                                        <Plus className="h-5 w-5" />
                                        <span>Add Dealer</span>
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {filteredDealers.map(dealer => (
                                        <div key={dealer.id} className={`border-2 rounded-lg p-6 transition-all ${!dealer.isActive ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-primary-500'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-xl font-bold">{dealer.name}</h3>
                                                        {!dealer.isActive && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">INACTIVE</span>}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                                                        <div><span className="font-semibold">Level:</span> <span className="badge-yellow">{dealer.level}</span></div>
                                                        <div><span className="font-semibold">Location:</span> {dealer.city}, {dealer.state}</div>
                                                        <div><span className="font-semibold">Email:</span> {dealer.email}</div>
                                                        <div><span className="font-semibold">Phone:</span> {dealer.phone}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-6">
                                                    <div className="text-3xl font-bold text-primary-600 mb-1">{dealer.performanceScore}%</div>
                                                    <div className="text-sm text-gray-600">Performance</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                                                <button onClick={() => handleEditDealer(dealer)} className="flex items-center space-x-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                    <span>Edit</span>
                                                </button>
                                                <button onClick={() => handleDeactivateDealer(dealer.id, dealer.isActive)} className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${dealer.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                                    {dealer.isActive ? <Trash2 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                    <span>{dealer.isActive ? 'Deactivate' : 'Activate'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products Tab */}
                        {activeTab === 'products' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Product Management</h2>
                                    <button onClick={() => { setEditingItem(null); setIsProductModalOpen(true) }} className="btn-primary flex items-center space-x-2">
                                        <Plus className="h-5 w-5" />
                                        <span>Add Product</span>
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {filteredProducts.map(product => (
                                        <div key={product.id} className={`border-2 rounded-lg p-6 transition-all ${!product.isActive ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-primary-500'}`}>
                                            <div className="flex gap-4 mb-4">
                                                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> : <div className="text-3xl">🔧</div>}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                                        {!product.isActive && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">INACTIVE</span>}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">{product.partNumber}</div>
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-bold text-primary-600 text-xl">₹{product.price.toLocaleString('en-IN')}</div>
                                                        <div className={`text-sm font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                                            Total Stock: {product.stock}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-4 pt-4 border-t">
                                                <button onClick={() => handleEditProduct(product)} className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">Edit Product</button>
                                                <button onClick={() => handleDeactivateProduct(product.id, product.isActive)} className={`flex-1 px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 ${product.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {product.isActive ? 'Deactivate Product' : 'Activate Product'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Machines Tab */}
                        {activeTab === 'machines' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Machine Repository</h2>
                                    <button onClick={() => { setEditingItem(null); setIsMachineModalOpen(true) }} className="btn-primary flex items-center space-x-2">
                                        <Plus className="h-5 w-5" />
                                        <span>Add Machine</span>
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {filteredMachines.map(machine => (
                                        <div key={machine.id} className={`border-2 rounded-lg p-6 ${!machine.isActive ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                                            <div className="flex gap-4 mb-4">
                                                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {machine.images?.[0] ? <img src={machine.images[0]} alt={machine.name} className="w-full h-full object-cover" /> : <div className="text-5xl">🏗️</div>}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="text-2xl font-bold mb-2">{machine.name}</h3>
                                                        {!machine.isActive && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">INACTIVE</span>}
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <div><span className="font-semibold">Model:</span> {machine.model}</div>
                                                        <div><span className="font-semibold">Category:</span> {machine.category}</div>
                                                        {machine.isCustomizable && (
                                                            <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                                                                ✨ Customizable
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 mt-4 pt-4 border-t">
                                                <button onClick={() => handleEditMachine(machine)} className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">Edit Machine</button>
                                                <button onClick={() => handleDeactivateMachine(machine.id, machine.isActive)} className={`flex-1 px-4 py-2 rounded-lg font-medium hover:bg-opacity-80 ${machine.isActive ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {machine.isActive ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Company Users Tab */}
                        {activeTab === 'users' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Company Users</h2>
                                    <button onClick={() => setIsUserModalOpen(true)} className="btn-primary flex items-center space-x-2">
                                        <Plus className="h-5 w-5" />
                                        <span>Add Company User</span>
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    {/* Table code same as before but filtering archived */}
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Info</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.filter(u => (u.role === 'ADMIN' || u.role === 'DEALER') && !u.isArchived).map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-blue-100 text-blue-800'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <button className="text-indigo-600 hover:text-indigo-900 font-semibold">Edit Role</button>
                                                        <button
                                                            onClick={() => handleArchiveUser(user.id)}
                                                            className="text-red-600 hover:text-red-900 font-semibold flex items-center justify-end space-x-1 float-right"
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                            <span>Archive</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Customers Tab - NEW */}
                        {activeTab === 'customers' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">Registered Customers</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.filter(u => u.role === 'CUSTOMER' && !u.isArchived).map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                                                    {user.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleArchiveUser(user.id)}
                                                            className="text-gray-500 hover:text-red-700 flex items-center justify-end space-x-1 float-right"
                                                        >
                                                            <Archive className="h-4 w-4" />
                                                            <span className="sr-only">Archive</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab (Same as before) */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-2xl font-bold mb-6">All Orders</h2>
                                <div className="space-y-4">
                                    {filteredOrders.map(order => (
                                        <div key={order.id} className="border-2 border-gray-200 rounded-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary-600">
                                                        ₹{order.totalAmount.toLocaleString('en-IN')}
                                                    </div>
                                                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {order.items.length} item(s)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isUserModalOpen} onClose={closeModals} title="Add Company User" maxWidth="md">
                <UserForm onSubmit={handleAddUser} onCancel={closeModals} />
            </Modal>

            <Modal isOpen={isDealerModalOpen} onClose={closeModals} title={editingItem ? "Edit Dealer" : "Add New Dealer"} maxWidth="2xl">
                <DealerForm initialData={editingItem} onSubmit={handleSaveDealer} onCancel={closeModals} />
            </Modal>

            <Modal isOpen={isProductModalOpen} onClose={closeModals} title={editingItem ? "Edit Product" : "Add New Product"} maxWidth="2xl">
                <ProductForm initialData={editingItem} onSubmit={handleSaveProduct} onCancel={closeModals} />
            </Modal>

            <Modal isOpen={isMachineModalOpen} onClose={closeModals} title={editingItem ? "Edit Machine" : "Add New Machine"} maxWidth="2xl">
                <MachineForm initialData={editingItem} onSubmit={handleSaveMachine} onCancel={closeModals} />
            </Modal>
        </div>
    )
}
