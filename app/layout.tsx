import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import ChatWidget from '@/components/ChatWidget'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'ACE Cranes - Parts & Equipment',
    description: 'Official e-commerce platform for ACE Cranes parts and equipment',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Footer />
                    <ChatWidget />
                </Providers>
            </body>
        </html>
    )
}
