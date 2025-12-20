'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'

const categories = [
    'Attachments & Tools',
    'Cab & Body',
    'Chassis & Undercarriage',
    'Electrical',
    'Filters & Fluids',
    'Hardware',
    'Hydraulics',
    'Powertrain'
]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
        }
    }

    return (
        <header className="w-full z-[100] relative">
            {/* Top Bar - Main Header */}
            <div className={`bg-white transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-md py-2' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo Group */}
                        <Link href="/" className="flex items-center space-x-2 md:space-x-4 shrink-0">
                            <img src="/assets/ace-logo.png" alt="ACE Cranes" className={`${isScrolled ? 'h-8' : 'h-10 md:h-12'} w-auto transition-all`} />
                            {!isScrolled && (
                                <img src="/assets/swadeshi-logo.png" alt="100% Swadeshi" className="h-10 md:h-14 w-auto hidden sm:block" />
                            )}
                        </Link>

                        {/* Sticky Pill Search Bar (Hidden when not scrolled) */}
                        <div className={`flex-1 max-w-2xl mx-12 transition-opacity duration-300 ${isScrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:hidden'}`}>
                            <form onSubmit={handleSearch} className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search by part name or number..."
                                    className="w-full bg-gray-100 border-none rounded-full py-2.5 px-6 pr-12 text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 bottom-1 bg-primary-500 text-black p-2 rounded-full hover:bg-primary-600 transition-colors"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </form>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-4 md:space-x-6 text-black">
                            <div className="hidden lg:flex flex-col items-end mr-2">
                                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Help Desk</span>
                                <span className="text-sm font-bold">+91 123 456 7890</span>
                            </div>

                            <Link href="/cart" className="relative group">
                                <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <span className="absolute -top-1 -right-1 bg-primary-500 text-black text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white shadow-sm font-sans">
                                    0
                                </span>
                            </Link>

                            <Link href="/auth/login" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors group">
                                <User className="h-6 w-6" />
                                <span className="hidden md:inline text-sm font-bold">Login / Account</span>
                            </Link>

                            <button
                                className="md:hidden p-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Navigation Bar (Yellow/Orange Strip) */}
            <nav className={`bg-primary-500 text-black transition-all duration-300 ${isScrolled ? 'fixed top-[52px] left-0 right-0 z-40 border-t border-primary-600 shadow-sm' : ''}`}>
                <div className="max-w-7xl mx-auto px-2">
                    <div className="hidden md:flex items-center justify-between overflow-x-auto no-scrollbar py-2 px-2">
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/products?category=${encodeURIComponent(cat)}`}
                                className="px-2 py-1 text-[11px] lg:text-[12px] font-bold uppercase tracking-tight hover:bg-black/10 rounded transition-all whitespace-nowrap"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-64 bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="font-bold text-lg">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categories</p>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/products?category=${encodeURIComponent(cat)}`}
                                    className="block py-2 text-sm font-medium hover:text-primary-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholder to prevent layout jump when header becomes fixed */}
            {isScrolled && <div className="h-[100px]" />}
        </header>
    )
}
