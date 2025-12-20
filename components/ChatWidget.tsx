'use client'

import React, { useState } from 'react'
import { MessageSquare, X, Send, Phone, MessageCircle } from 'lucide-react'

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: 'Namaste! Welcome to ACE Cranes Support. How can we help you today?' }
    ])

    const toggleChat = () => setIsOpen(!isOpen)

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        // Add user message
        const newHistory = [...chatHistory, { type: 'user', text: message }]
        setChatHistory(newHistory)
        setMessage('')

        // Simulate bot reply
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                type: 'bot',
                text: 'Thank you for your message. An ACE support specialist will be with you shortly. For immediate assistance, you can also reach us on WhatsApp.'
            }])
        }, 1000)
    }

    return (
        <div className="fixed bottom-6 right-6 z-[200] font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <img src="/assets/ace-logo.png" alt="ACE" className="h-4 w-auto brightness-0 invert" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">ACE Support</h3>
                                <p className="text-[10px] text-primary-100">Online | Average reply: 5 mins</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {chatHistory.map((chat, idx) => (
                            <div key={idx} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${chat.type === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {chat.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick WhatsApp Link */}
                    <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center justify-between">
                        <span className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Fast Track via WhatsApp</span>
                        <a
                            href="https://wa.me/911234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white p-1.5 rounded-full hover:bg-green-600 transition-colors"
                        >
                            <MessageCircle className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex space-x-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-all shadow-md active:scale-95"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className={`flex items-center space-x-2 p-4 rounded-full shadow-2xl transition-all duration-300 transform active:scale-95 ${isOpen ? 'bg-gray-100 text-gray-600 scale-90' : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105'
                    }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                {!isOpen && <span className="font-bold text-sm pr-2 hidden md:inline">Support Chat</span>}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold animate-bounce">
                        1
                    </span>
                )}
            </button>
        </div>
    )
}
