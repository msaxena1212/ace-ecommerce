'use client'

import React from 'react'
import Link from 'next/link'
import { LogIn, UserPlus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function AuthPrompt() {
    return (
        <div className="bg-white rounded-2xl border-2 border-primary-100 shadow-xl p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-primary-600" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">Sign in to Checkout</h2>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    Log in to your ACE account for a faster checkout, order tracking, and loyalty rewards.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Link
                    href="/auth/login?callbackUrl=/checkout"
                    className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95 group"
                >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/auth/register?callbackUrl=/checkout"
                    className="flex items-center justify-center space-x-2 border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50 text-gray-700 py-4 rounded-xl font-bold transition-all active:scale-95"
                >
                    <UserPlus className="h-5 w-5 text-primary-600" />
                    <span>Register</span>
                </Link>
            </div>

            <div className="pt-4 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Secure checkout powered by ACE Cranes
                </p>
            </div>
        </div>
    )
}
