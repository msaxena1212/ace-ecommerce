/**
 * Order Routing Service
 * Handles multi-level dealer routing: L1 → L2 → L3 → Warehouse
 */

import { prisma } from '@/lib/prisma'
import { DealerLevel, OrderStatus, RoutingStatus } from '@prisma/client'

interface RoutingResult {
    success: boolean
    dealerId?: string
    dealerLevel?: DealerLevel
    message: string
}

/**
 * Main function to route an order to appropriate dealer
 * Starts with L1 and escalates to L2, L3, then Warehouse
 */
export async function routeOrder(orderId: string, customerPincode: string): Promise<RoutingResult> {
    try {
        // Start with L1 dealers
        const l1Result = await routeToLevel(orderId, customerPincode, 'L1')
        if (l1Result.success) {
            return l1Result
        }

        // Escalate to L2
        const l2Result = await routeToLevel(orderId, customerPincode, 'L2')
        if (l2Result.success) {
            return l2Result
        }

        // Escalate to L3
        const l3Result = await routeToLevel(orderId, customerPincode, 'L3')
        if (l3Result.success) {
            return l3Result
        }

        // Final escalation to Warehouse
        const warehouseResult = await routeToLevel(orderId, customerPincode, 'WAREHOUSE')
        if (warehouseResult.success) {
            return warehouseResult
        }

        // All levels exhausted
        return {
            success: false,
            message: 'Item not available at any dealer or warehouse. Added to backorder queue.',
        }
    } catch (error) {
        console.error('Error routing order:', error)
        return {
            success: false,
            message: 'Error occurred while routing order',
        }
    }
}

/**
 * Route order to specific dealer level
 */
async function routeToLevel(
    orderId: string,
    customerPincode: string,
    level: DealerLevel
): Promise<RoutingResult> {
    // Find dealers at this level who service the customer's pincode
    const dealers = await prisma.dealer.findMany({
        where: {
            level,
            isActive: true,
            servicePincodes: {
                has: customerPincode,
            },
        },
        orderBy: {
            performanceScore: 'desc', // Prefer dealers with better performance
        },
    })

    if (dealers.length === 0) {
        // Try finding dealers at this level without pincode restriction
        const fallbackDealers = await prisma.dealer.findMany({
            where: {
                level,
                isActive: true,
            },
            orderBy: {
                performanceScore: 'desc',
            },
            take: 1,
        })

        if (fallbackDealers.length === 0) {
            return {
                success: false,
                message: `No ${level} dealers available`,
            }
        }

        dealers.push(...fallbackDealers)
    }

    // Get order items to check inventory
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    })

    if (!order) {
        return {
            success: false,
            message: 'Order not found',
        }
    }

    // Try each dealer until one accepts
    for (const dealer of dealers) {
        // Check if dealer has inventory for all items
        const hasInventory = await checkDealerInventory(dealer.id, order.items)

        if (hasInventory) {
            // Create routing record
            await prisma.orderRouting.create({
                data: {
                    orderId,
                    dealerId: dealer.id,
                    level,
                    status: 'PENDING',
                },
            })

            // Update order status
            const statusMap: Record<DealerLevel, OrderStatus> = {
                L1: 'ROUTING_L1',
                L2: 'ROUTING_L2',
                L3: 'ROUTING_L3',
                WAREHOUSE: 'ROUTING_WAREHOUSE',
            }

            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: statusMap[level],
                },
            })

            return {
                success: true,
                dealerId: dealer.id,
                dealerLevel: level,
                message: `Order routed to ${level} dealer: ${dealer.name}`,
            }
        }
    }

    return {
        success: false,
        message: `No ${level} dealers have inventory`,
    }
}

/**
 * Check if dealer has inventory for order items
 * This would integrate with DMS API in production
 */
async function checkDealerInventory(
    dealerId: string,
    orderItems: any[]
): Promise<boolean> {
    // TODO: Integrate with actual DMS API
    // For now, simulate inventory check

    try {
        // In production, call DMS API for each item
        // const dmsResponse = await fetch(`${process.env.DMS_API_URL}/inventory`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.DMS_API_KEY}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     dealerId,
        //     items: orderItems.map(item => ({
        //       partNumber: item.product.partNumber,
        //       quantity: item.quantity,
        //     })),
        //   }),
        // })

        // const inventory = await dmsResponse.json()
        // return inventory.available === true

        // Mock implementation: 70% chance of having inventory
        return Math.random() > 0.3
    } catch (error) {
        console.error('Error checking dealer inventory:', error)
        return false
    }
}

/**
 * Handle dealer approval of order
 */
export async function approveOrder(
    orderId: string,
    dealerId: string,
    notes?: string
): Promise<void> {
    // Update routing status
    await prisma.orderRouting.updateMany({
        where: {
            orderId,
            dealerId,
            status: 'PENDING',
        },
        data: {
            status: 'APPROVED',
            respondedAt: new Date(),
            response: notes || 'Order approved',
        },
    })

    // Update order status
    await prisma.order.update({
        where: { id: orderId },
        data: {
            status: 'CONFIRMED',
        },
    })

    // Update order items
    await prisma.orderItem.updateMany({
        where: { orderId },
        data: {
            status: 'CONFIRMED',
            fulfilledBy: dealerId,
        },
    })

    // Update dealer statistics
    await prisma.dealer.update({
        where: { id: dealerId },
        data: {
            totalOrders: { increment: 1 },
            approvedOrders: { increment: 1 },
        },
    })
}

/**
 * Handle dealer rejection of order
 */
export async function rejectOrder(
    orderId: string,
    dealerId: string,
    reason: string
): Promise<RoutingResult> {
    // Update routing status
    const routing = await prisma.orderRouting.findFirst({
        where: {
            orderId,
            dealerId,
            status: 'PENDING',
        },
    })

    if (!routing) {
        return {
            success: false,
            message: 'Routing record not found',
        }
    }

    await prisma.orderRouting.update({
        where: { id: routing.id },
        data: {
            status: 'REJECTED',
            respondedAt: new Date(),
            response: reason,
        },
    })

    // Update dealer statistics
    await prisma.dealer.update({
        where: { id: dealerId },
        data: {
            totalOrders: { increment: 1 },
            rejectedOrders: { increment: 1 },
            performanceScore: { decrement: 0.5 }, // Penalize for rejection
        },
    })

    // Get order to determine next routing level
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: true,
        },
    })

    if (!order) {
        return {
            success: false,
            message: 'Order not found',
        }
    }

    // Determine customer pincode from delivery address
    const deliveryAddress = order.deliveryAddress as any
    const customerPincode = deliveryAddress.pincode

    // Route to next level based on current level
    const currentLevel = routing.level
    let nextResult: RoutingResult

    switch (currentLevel) {
        case 'L1':
            nextResult = await routeToLevel(orderId, customerPincode, 'L2')
            break
        case 'L2':
            nextResult = await routeToLevel(orderId, customerPincode, 'L3')
            break
        case 'L3':
            nextResult = await routeToLevel(orderId, customerPincode, 'WAREHOUSE')
            break
        default:
            nextResult = {
                success: false,
                message: 'All dealers rejected. Item unavailable.',
            }
    }

    return nextResult
}

/**
 * Handle partial order approval
 */
export async function partialApproveOrder(
    orderId: string,
    dealerId: string,
    availableItems: { itemId: string; quantity: number }[],
    notes?: string
): Promise<void> {
    // Update routing for approved items
    await prisma.orderRouting.updateMany({
        where: {
            orderId,
            dealerId,
            status: 'PENDING',
        },
        data: {
            status: 'APPROVED',
            respondedAt: new Date(),
            response: notes || 'Partial approval',
        },
    })

    // Update approved items
    for (const item of availableItems) {
        await prisma.orderItem.update({
            where: { id: item.itemId },
            data: {
                status: 'CONFIRMED',
                fulfilledBy: dealerId,
                quantity: item.quantity,
            },
        })
    }

    // Get remaining items that need routing
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                where: {
                    status: 'PENDING',
                },
            },
        },
    })

    // Route remaining items to next level
    if (order && order.items.length > 0) {
        const deliveryAddress = order.deliveryAddress as any
        const customerPincode = deliveryAddress.pincode

        // Get current routing level
        const currentRouting = await prisma.orderRouting.findFirst({
            where: { orderId, dealerId },
        })

        if (currentRouting) {
            const nextLevel = getNextLevel(currentRouting.level)
            if (nextLevel) {
                await routeToLevel(orderId, customerPincode, nextLevel)
            }
        }
    }
}

/**
 * Get next dealer level for escalation
 */
function getNextLevel(currentLevel: DealerLevel): DealerLevel | null {
    const levelOrder: DealerLevel[] = ['L1', 'L2', 'L3', 'WAREHOUSE']
    const currentIndex = levelOrder.indexOf(currentLevel)

    if (currentIndex < levelOrder.length - 1) {
        return levelOrder[currentIndex + 1]
    }

    return null
}
