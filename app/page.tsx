'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, User, Search, Package, Truck, MapPin, ChevronRight, Star } from 'lucide-react'

export default function HomePage() {
    const [searchType, setSearchType] = useState<'part' | 'machine' | 'order'>('part')
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchType === 'order') {
            window.location.href = `/track-order?id=${searchQuery}`
        } else if (searchType === 'machine') {
            window.location.href = `/products?machine=${searchQuery}`
        } else {
            window.location.href = `/products?search=${searchQuery}`
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="text-3xl font-bold text-primary-500">ACE</div>
                            <div className="text-sm text-gray-300">Cranes & Equipment</div>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/products" className="hover:text-primary-500 transition-colors font-medium">
                                Products
                            </Link>
                            <Link href="/routing-demo" className="hover:text-primary-500 transition-colors font-medium">
                                Order Routing
                            </Link>
                            <Link href="/dashboard" className="hover:text-primary-500 transition-colors font-medium">
                                Dashboard
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-6">
                            <Link href="/cart" className="relative hover:text-primary-500 transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 bg-primary-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                    0
                                </span>
                            </Link>
                            <Link href="/auth/login" className="flex items-center space-x-2 hover:text-primary-500 transition-colors">
                                <User className="h-6 w-6" />
                                <span className="hidden sm:inline font-medium">Login</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section with Advanced Search */}
            <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,203,5,.1) 35px, rgba(255,203,5,.1) 70px)',
                    }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Premium <span className="text-primary-500">Construction Parts</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Genuine ACE parts with intelligent routing. Same-day delivery available within 150km.
                        </p>
                    </div>

                    {/* Advanced Search Box */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-6">
                            {/* Search Type Tabs */}
                            <div className="flex space-x-2 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setSearchType('part')}
                                    className={`px-6 py-3 font-semibold transition-all ${searchType === 'part'
                                            ? 'text-black border-b-4 border-primary-500'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Package className="inline h-5 w-5 mr-2" />
                                    Search Parts
                                </button>
                                <button
                                    onClick={() => setSearchType('machine')}
                                    className={`px-6 py-3 font-semibold transition-all ${searchType === 'machine'
                                            ? 'text-black border-b-4 border-primary-500'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Truck className="inline h-5 w-5 mr-2" />
                                    By Machine
                                </button>
                                <button
                                    onClick={() => setSearchType('order')}
                                    className={`px-6 py-3 font-semibold transition-all ${searchType === 'order'
                                            ? 'text-black border-b-4 border-primary-500'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <MapPin className="inline h-5 w-5 mr-2" />
                                    Track Order
                                </button>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={
                                            searchType === 'part'
                                                ? 'Enter part number or name (e.g., HYD-CYL-FX14-001)'
                                                : searchType === 'machine'
                                                    ? 'Enter machine model (e.g., FX14 Mobile Crane)'
                                                    : 'Enter order number (e.g., ORD-2024-001)'
                                        }
                                        className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-black"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn-primary px-8 py-4 text-lg flex items-center space-x-2"
                                >
                                    <span>Search</span>
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </form>

                            {/* Quick Links */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-sm text-gray-600">Popular searches:</span>
                                <button onClick={() => { setSearchQuery('Hydraulic Cylinder'); setSearchType('part'); }} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    Hydraulic Cylinder
                                </button>
                                <span className="text-gray-300">•</span>
                                <button onClick={() => { setSearchQuery('FX14'); setSearchType('machine'); }} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    FX14 Crane
                                </button>
                                <span className="text-gray-300">•</span>
                                <button onClick={() => { setSearchQuery('Wire Rope'); setSearchType('part'); }} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    Wire Rope
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-12 flex justify-center space-x-4">
                        <Link href="/products" className="btn-primary px-8 py-4 text-lg">
                            Browse All Products
                        </Link>
                        <Link href="/dealer/login" className="btn-outline px-8 py-4 text-lg text-white border-white hover:bg-white hover:text-black">
                            Dealer Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-bold text-center mb-12">Why Choose ACE Parts?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-8 text-center hover:shadow-2xl transition-all">
                        <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Same-Day Delivery</h3>
                        <p className="text-gray-600 text-lg">
                            Order before 2 PM and get your parts delivered the same day within 150km radius.
                        </p>
                    </div>

                    <div className="card p-8 text-center hover:shadow-2xl transition-all">
                        <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">100% Genuine Parts</h3>
                        <p className="text-gray-600 text-lg">
                            All parts sourced directly from authorized ACE dealers and warehouses.
                        </p>
                    </div>

                    <div className="card p-8 text-center hover:shadow-2xl transition-all">
                        <div className="bg-primary-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Multiple Payment Options</h3>
                        <p className="text-gray-600 text-lg">
                            Pay online, COD, or use credit terms for registered dealers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-12">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Mobile Cranes', icon: '🏗️', count: '150+ parts' },
                            { name: 'Forklift Trucks', icon: '🚜', count: '120+ parts' },
                            { name: 'Tower Cranes', icon: '🏭', count: '200+ parts' },
                            { name: 'Backhoe Loaders', icon: '🚧', count: '180+ parts' },
                            { name: 'Hydraulic Parts', icon: '⚙️', count: '300+ parts' },
                            { name: 'Electrical Systems', icon: '⚡', count: '90+ parts' },
                            { name: 'Structural Parts', icon: '🔩', count: '250+ parts' },
                            { name: 'Filters & Oils', icon: '🛢️', count: '100+ parts' },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={`/products?category=${encodeURIComponent(category.name)}`}
                                className="card p-6 text-center hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                                    {category.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-600">{category.count}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-black text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold text-primary-500 mb-2">1000+</div>
                            <div className="text-gray-300 text-lg">Genuine Parts</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-primary-500 mb-2">15+</div>
                            <div className="text-gray-300 text-lg">Authorized Dealers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-primary-500 mb-2">24/7</div>
                            <div className="text-gray-300 text-lg">Customer Support</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-primary-500 mb-2">98%</div>
                            <div className="text-gray-300 text-lg">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-12 text-center text-black">
                    <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Browse our extensive catalog of genuine ACE parts and experience fast, reliable delivery.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/products" className="bg-black text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors">
                            Shop Now
                        </Link>
                        <Link href="/auth/register" className="bg-white text-black border-2 border-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-primary-500 mb-4">ACE</h3>
                            <p className="text-gray-400">
                                Premium construction equipment parts with intelligent routing and same-day delivery.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/products" className="hover:text-primary-500">Products</Link></li>
                                <li><Link href="/dashboard" className="hover:text-primary-500">Dashboard</Link></li>
                                <li><Link href="/routing-demo" className="hover:text-primary-500">Order Routing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">For Dealers</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/dealer/login" className="hover:text-primary-500">Dealer Login</Link></li>
                                <li><Link href="/dealer/dashboard" className="hover:text-primary-500">Dealer Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>Phone: 1800-1800-004</li>
                                <li>Email: support@ace-cranes.com</li>
                                <li>Hours: 9 AM - 6 PM</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 ACE Cranes & Equipment. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
