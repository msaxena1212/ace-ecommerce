import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { routeOrder } from '@/lib/services/orderRouting'

/**
 * GET /api/orders
 * Get all orders for current user
 */
export async function GET(request: NextRequest) {
    try {
        const userId = 'user-001' // TODO: Get from session

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                routing: {
                    include: {
                        dealer: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/orders
 * Create a new order from cart
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            deliveryAddress,
            paymentMethod,
            paymentDetails
        } = body

        const userId = 'user-001' // TODO: Get from session

        // Get cart items
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Cart is empty' },
                { status: 400 }
            )
        }

        // Calculate totals
        const subtotal = cart.items.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        )
        const shipping = subtotal > 50000 ? 0 : 500
        const tax = subtotal * 0.18
        const total = subtotal + shipping + tax

        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                orderNumber: `ORD-${Date.now()}`,
                status: 'PENDING',
                subtotal,
                shippingCost: shipping,
                tax,
                totalAmount: total,
                deliveryAddress,
                paymentMethod,
                paymentDetails,
                items: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                        status: 'PENDING'
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        // Route order to dealers
        const customerPincode = deliveryAddress.pincode
        await routeOrder(order.id, customerPincode)

        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        })

        return NextResponse.json({
            success: true,
            data: order
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
