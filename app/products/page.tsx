'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, ShoppingCart } from 'lucide-react'
import { mockProducts } from '@/lib/mockData'

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [priceRange, setPriceRange] = useState('All')

    const categories = ['All', 'Hydraulic Parts', 'Structural Parts', 'Cables & Ropes', 'Brake System', 'Filters', 'Bearings', 'Electrical']
    const priceRanges = ['All', 'Under ₹10,000', '₹10,000 - ₹50,000', '₹50,000 - ₹100,000', 'Above ₹100,000']

    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory

        let matchesPrice = true
        if (priceRange === 'Under ₹10,000') matchesPrice = product.price < 10000
        else if (priceRange === '₹10,000 - ₹50,000') matchesPrice = product.price >= 10000 && product.price < 50000
        else if (priceRange === '₹50,000 - ₹100,000') matchesPrice = product.price >= 50000 && product.price < 100000
        else if (priceRange === 'Above ₹100,000') matchesPrice = product.price >= 100000

        return matchesSearch && matchesCategory && matchesPrice
    })

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
                            <Link href="/cart" className="relative hover:text-primary-600 transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </Link>
                            <Link href="/auth/login" className="hover:text-primary-600 transition-colors">
                                Login
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
                    <p className="text-gray-600">Browse our complete catalog of genuine ACE parts and equipment</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <div className="flex items-center space-x-2 mb-6">
                                <Filter className="h-5 w-5 text-primary-600" />
                                <h2 className="text-lg font-semibold">Filters</h2>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-900">Category</h3>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label key={category} className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === category}
                                                onChange={() => setSelectedCategory(category)}
                                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-600">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h3 className="font-semibold mb-3 text-gray-900">Price Range</h3>
                                <div className="space-y-2">
                                    {priceRanges.map(range => (
                                        <label key={range} className="flex items-center cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={priceRange === range}
                                                onChange={() => setPriceRange(range)}
                                                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-600">
                                                {range}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('All')
                                    setPriceRange('All')
                                    setSearchQuery('')
                                }}
                                className="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by part number or name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {filteredProducts.length} of {mockProducts.length} products
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                                            <div className="text-6xl">🔧</div>
                                        </div>
                                        {product.isCustomPart && (
                                            <div className="absolute top-3 right-3 bg-accent-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                                Custom Part
                                            </div>
                                        )}
                                        {product.stock < 10 && (
                                            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                                Low Stock
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="text-xs text-gray-500 mb-1">{product.partNumber}</div>
                                        <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-primary-600">
                                                    ₹{product.price.toLocaleString('en-IN')}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Stock: {product.stock} units
                                                </div>
                                            </div>
                                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600">Try adjusting your filters or search query</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
