'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, User, Search, Package, Truck, MapPin, ChevronRight, Star, Mail, ShieldCheck, Clock, Headphones, CreditCard } from 'lucide-react'
import Header from '@/components/Header'

export default function HomePage() {
    const [searchType, setSearchType] = useState<'part' | 'machine' | 'order'>('part')
    const [searchQuery, setSearchQuery] = useState('')
    const [trendingProducts, setTrendingProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [recentOrders, setRecentOrders] = useState<any[]>([])

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await fetch('/api/products')
                const data = await res.json()
                if (data.products) {
                    setTrendingProducts(data.products.slice(0, 4))
                }
                if (data.categories) {
                    // Create formatted categories for the UI
                    const formattedCategories = data.categories
                        .filter((cat: string) => cat !== 'All')
                        .map((cat: string) => ({
                            name: cat,
                            image: cat.includes('Hydraulic') ? '/assets/part-hydraulic.png' :
                                cat.includes('Crane') ? '/assets/cat-mobile-crane-premium.png' :
                                    cat.includes('Forklift') ? '/assets/cat-forklift.png' :
                                        cat.includes('Backhoe') ? '/assets/cat-backhoe.png' :
                                            cat.includes('Filter') ? '/assets/part-filter.png' :
                                                cat.includes('Powertrain') ? '/assets/cat-backhoe.png' :
                                                    cat.includes('Cooling') ? '/assets/cat-mobile-crane.png' :
                                                        cat.includes('Bearing') ? '/assets/cat-mobile-crane.png' :
                                                            cat.includes('Tires') || cat.includes('Wheel') ? '/assets/cat-forklift.png' :
                                                                '/assets/part-filter.png',
                            count: 'Browse collection'
                        }))
                    setCategories(formattedCategories)
                }
                try {
                    const orderRes = await fetch('/api/orders') // Need to implement this or use mock
                    // For now, let's just fetch the last 3 orders from mock/db if possible
                    // Since I don't have a simple /api/orders, I'll mock it for the demo
                    // using the ones I seeded
                    setRecentOrders([
                        { id: 'ORD-2024-001', status: 'DELIVERED', date: '2024-12-10' },
                        { id: 'ORD-2024-002', status: 'SHIPPED', date: '2024-12-20' }
                    ])
                } catch (e) {
                    console.error('Failed to fetch orders:', e)
                }
            } catch (error) {
                console.error('Failed to fetch initial data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInitialData()
    }, [])

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
            <Header />

            {/* Hero Section with Clean Search */}
            <section className="relative h-[550px] flex items-center justify-center text-white overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img src="/assets/hero-crane.png" alt="ACE Cranes Hero" className="w-full h-full object-cover brightness-[0.4]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                            GENUINE <span className="text-primary-500">ACE</span> PARTS
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-medium leading-relaxed">
                            Ensuring your machines run at peak performance with authentic components delivered to your doorstep.
                        </p>
                    </div>

                    {/* Simplified Search Bar (Pill Shaped) */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white p-2 rounded-full shadow-2xl flex items-center group focus-within:ring-4 focus-within:ring-primary-500/30 transition-all">
                            <form onSubmit={handleSearch} className="flex flex-1 items-center">
                                <div className="pl-6 pr-4">
                                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter part number (e.g., HYD-CYL-01) or name..."
                                    className="flex-1 py-4 text-lg border-none focus:ring-0 outline-none text-black placeholder-gray-500 bg-transparent font-medium"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary-500 text-black hover:bg-primary-600 px-8 py-4 text-lg font-bold rounded-full uppercase tracking-wider transition-all transform active:scale-95 shadow-lg"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        {/* Support Info */}
                        <div className="mt-8 text-center text-gray-300 text-sm md:text-base font-medium">
                            Can't find your part? Use our support chat below or call 1800-ACE-HELP
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Track Your Orders */}
            {/* <section className="bg-gray-900 border-t border-white/10 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-500 p-3 rounded-full">
                                <Package className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Quick Track Recent Orders</h3>
                                <p className="text-gray-400 text-sm">See the status of your latest purchases</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {recentOrders.map(order => (
                                <Link
                                    key={order.id}
                                    href={`/track-order?id=${order.id}`}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-4 transition-all"
                                >
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">{order.id}</div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                            <span className="text-white text-sm font-semibold">{order.status}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-600" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}
            <section className="bg-primary-500 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black text-black mb-6 uppercase leading-tight">
                                Why Buy Genuine<br />ACE parts?
                            </h2>
                            <p className="text-lg text-black/80 mb-8 max-w-xl font-medium leading-relaxed">
                                When it comes to keeping your ACE machine performing at its best, only ACE genuine parts will do. Designed to fit perfectly, tested to the highest standards, and backed by years of engineering expertise.
                            </p>
                            <Link href="/about-genuine-parts" className="inline-block text-black font-bold text-lg border-b-2 border-black pb-1 hover:border-black/50 transition-colors">
                                Know more
                            </Link>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: 'Fast Track Delivery', desc: 'Swift, Secure, Reliable', icon: <Truck className="h-8 w-8 text-white" /> },
                                { title: '100% Secure Payment', desc: 'Guaranteed secure payment', icon: <ShieldCheck className="h-8 w-8 text-white" /> },
                                { title: 'Dedicated Support', desc: 'Anywhere & Anytime', icon: <Headphones className="h-8 w-8 text-white" /> },
                                { title: 'Pay As You Want', desc: 'Making payments simple', icon: <CreditCard className="h-8 w-8 text-white" /> },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-black p-8 rounded-xl text-white hover:bg-black/90 transition-all border border-white/5">
                                    <div className="mb-4">{item.icon}</div>
                                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sign Up for Offers Section */}
            <section className="py-12 bg-[#fef3e6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white border-2 border-primary-100 rounded-2xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-black mb-2 flex items-center">
                                <Mail className="h-8 w-8 mr-3 text-primary-500" />
                                Sign up now to unlock exclusive offers and deals
                            </h3>
                            <p className="text-gray-600 text-lg">
                                Join our mailing list for access to special discounts tailored just for you!
                            </p>
                        </div>
                        <Link
                            href="/auth/register"
                            className="w-full md:w-auto bg-black text-white hover:bg-gray-800 px-10 py-5 rounded-xl font-bold text-lg text-center transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Shop by Category</h2>
                            <div className="h-1 w-20 bg-primary-500 mt-4"></div>
                        </div>
                        <Link href="/products" className="text-primary-600 hover:text-primary-700 font-bold flex items-center">
                            View All Categories <ChevronRight className="h-5 w-5 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={`/products?category=${encodeURIComponent(category.name)}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-b-4 border-transparent hover:border-primary-500"
                            >
                                <div className="aspect-square p-6 flex items-center justify-center bg-white group-hover:bg-primary-50 transition-colors">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4 text-center border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors uppercase text-sm md:text-base">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium">{category.count}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Offers Section */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight relative inline-block">
                            Trending Offers
                            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-500"></span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {trendingProducts.map((product, idx) => (
                            <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group relative">
                                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    TRENDING
                                </div>
                                <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden">
                                    <img
                                        src={
                                            product.images && product.images.length > 0 && !product.images[0].includes('cat-mobile-crane.png')
                                                ? product.images[0]
                                                : product.category.includes('Hydraulic') ? '/assets/part-hydraulic.png' :
                                                    product.category.includes('Crane') ? '/assets/cat-mobile-crane-premium.png' :
                                                        product.category.includes('Forklift') ? '/assets/cat-forklift.png' :
                                                            product.category.includes('Backhoe') ? '/assets/cat-backhoe.png' :
                                                                '/assets/part-filter.png'
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Link href={`/products/${product.id}`} className="bg-white text-black font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg hover:bg-primary-500 border-none">
                                            Quick View
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mb-3">{product.partNumber}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-xl">₹{product.price.toLocaleString('en-IN')}</span>
                                        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm border-b-2 border-primary-500 pb-0.5">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banners Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Banner 1: Bulk Orders */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-80 md:h-96">
                            <div className="absolute inset-0 bg-black">
                                <img
                                    src="/assets/hero-crane.png"
                                    alt="Bulk Orders"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-105"
                                />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 uppercase leading-tight">
                                    Bulk Order<br /><span className="text-primary-500">Big Savings</span>
                                </h3>
                                <p className="text-lg text-gray-200 mb-8 max-w-sm">
                                    Get exclusive discounts on large volume orders for your fleet maintenance.
                                </p>
                                <div>
                                    <Link href="/products" className="inline-block bg-primary-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-white transition-colors">
                                        Enquire Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Banner 2: Dealer Network */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-80 md:h-96">
                            <div className="absolute inset-0 bg-primary-900">
                                <img
                                    src="/assets/cat-backhoe.png"
                                    alt="Dealer Network"
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Star className="h-6 w-6 text-primary-500 fill-current" />
                                    <span className="font-bold text-primary-500 tracking-wider text-sm uppercase">Join The Network</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 uppercase leading-tight">
                                    Become an<br />ACE Dealer
                                </h3>
                                <p className="text-lg text-gray-300 mb-8 max-w-sm">
                                    Partner with India's leading construction equipment manufacturer.
                                </p>
                                <div>
                                    <Link href="/dealer/login" className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition-colors">
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                            <img src="/assets/ace-logo.png" alt="ACE Cranes" className="h-8 w-auto mb-4" />
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
