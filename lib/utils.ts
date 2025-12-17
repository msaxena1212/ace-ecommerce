import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount)
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 7)
    return `ACE-${timestamp}-${random}`.toUpperCase()
}

export function generateManifestNumber(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 7)
    return `MAN-${timestamp}-${random}`.toUpperCase()
}
