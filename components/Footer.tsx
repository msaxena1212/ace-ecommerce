'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Footer() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // slower parallax speed
            setOffset(window.scrollY * 0.1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className="bg-gray-900 text-white pt-12 md:pt-16 pb-0 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

                    {/* Column 1: About */}
                    <div className="space-y-4">
                        <div className="bg-white p-2 w-fit rounded">
                            <img src="/assets/ace-logo.png" alt="ACE Cranes" className="h-8 md:h-10 w-auto" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            India's leading Material Handling and Construction Equipment manufacturing company with a majority market share in Mobile Cranes and Tower Cranes segment.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-primary-500 pl-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
                            <li><Link href="/products" className="hover:text-primary-500 transition-colors">Products</Link></li>
                            <li><Link href="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Contact</Link></li>
                            <li><Link href="/support" className="hover:text-primary-500 transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Products */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-primary-500 pl-3">Our Products</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/products?category=Cranes" className="hover:text-primary-500 transition-colors">Mobile Cranes</Link></li>
                            <li><Link href="/products?category=Construction" className="hover:text-primary-500 transition-colors">Construction Equipment</Link></li>
                            <li><Link href="/products?category=Agriculture" className="hover:text-primary-500 transition-colors">Agri Equipment</Link></li>
                            <li><Link href="/products?category=Forklifts" className="hover:text-primary-500 transition-colors">Forklifts</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-l-4 border-primary-500 pl-3">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                                <span>Dudhola Link Road, Dudhola, Distt. Palwal - 121102, Haryana, India</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                                <a href="tel:+911234567890" className="hover:text-primary-500">+91 123 456 7890</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                                <a href="mailto:info@ace-cranes.com" className="hover:text-primary-500">info@ace-cranes.com</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Scrolling Crane Animation */}
            <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-0 pointer-events-none">
                <div
                    className="w-[200%] md:w-full h-auto min-h-[100px] md:min-h-[200px] opacity-100"
                    style={{
                        transform: `translateX(-${offset}px)`,
                        transition: 'transform 0.1s linear'
                    }}
                >
                    {/* Using the user uploaded image */}
                    <img
                        src="/images/footer-cranes.png"
                        alt="ACE Equipment Lineup"
                        className="w-auto h-24 md:h-48 lg:h-64 object-cover md:object-contain object-bottom mx-auto"
                    />
                </div>
                {/* Gradient Overlay for smooth blend */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-gray-800 bg-black/50 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Action Construction Equipment Ltd. All rights reserved.</p>
                    <div className="flex space-x-6 mt-2 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary-500">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary-500">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
