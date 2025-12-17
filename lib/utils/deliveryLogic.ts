/**
 * Delivery Logic Utilities
 * Determines delivery partner based on order time and distance
 */

export interface DeliveryOption {
    partner: 'PORTER' | 'DELHIVERY'
    estimatedDelivery: string
    description: string
}

/**
 * Calculate delivery partner based on order time and distance
 * Rules:
 * - Before 2 PM + ≤150km → Porter (Same Day)
 * - After 2 PM or >150km → Delhivery (24hrs)
 */
export function calculateDeliveryPartner(
    orderTime: Date,
    distanceKm: number
): DeliveryOption {
    const hour = orderTime.getHours()
    const isBefore2PM = hour < 14

    if (isBefore2PM && distanceKm <= 150) {
        return {
            partner: 'PORTER',
            estimatedDelivery: 'Same Day Delivery',
            description: 'Your order will be delivered today by 8 PM',
        }
    }

    return {
        partner: 'DELHIVERY',
        estimatedDelivery: '24 Hours Delivery',
        description: 'Your order will be delivered within 24 hours',
    }
}

/**
 * Calculate distance between two pincodes (simplified)
 * In production, use Google Maps Distance Matrix API or similar
 */
export async function calculateDistance(
    pincode1: string,
    pincode2: string
): Promise<number> {
    // TODO: Integrate with actual distance calculation API
    // For now, return a mock distance based on pincode difference
    const diff = Math.abs(parseInt(pincode1) - parseInt(pincode2))
    return Math.min(diff / 100, 500) // Mock calculation
}

/**
 * Check if a pincode is serviceable by delivery partners
 */
export async function checkServiceability(
    pincode: string,
    partner: 'PORTER' | 'DELHIVERY'
): Promise<boolean> {
    // TODO: Integrate with actual serviceability APIs
    // For now, assume all pincodes are serviceable
    return true
}
