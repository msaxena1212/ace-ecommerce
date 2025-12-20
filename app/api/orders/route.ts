import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET /api/orders
 * Get all orders for current user
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as any
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id

        try {
            const orders = await prisma.order.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

            return NextResponse.json({
                success: true,
                data: orders
            })
        } catch (dbError) {
            console.error('DB Error fetching orders, returning mock if applicable:', dbError)
            if (userId === 'mock-user-001') {
                return NextResponse.json({
                    success: true,
                    data: MOCK_ORDERS
                })
            }
            throw dbError
        }
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
 * Create a new order
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as any
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id
        const body = await request.json()
        const {
            deliveryAddress,
            paymentMethod,
            items // Now passing items directly from frontend to handle mock/cart flexibility
        } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'Order is empty' }, { status: 400 })
        }

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
        const shippingFee = 50
        const walletRedeem = 16
        const total = subtotal - walletRedeem + shippingFee

        const orderData = {
            orderNumber: `ORD-${Date.now()}`,
            userId,
            totalAmount: total,
            paymentMethod: paymentMethod === 'COD' ? 'COD' : 'ONLINE',
            deliveryAddress,
            items: {
                create: items.map((item: any) => ({
                    productId: item.id || item.productId,
                    quantity: item.quantity,
                    price: item.price,
                }))
            }
        }

        try {
            const order = await prisma.order.create({
                data: orderData as any,
                include: {
                    items: true
                }
            })

            return NextResponse.json({
                success: true,
                data: order
            }, { status: 201 })
        } catch (dbError) {
            console.warn('DB create order failed, returning success for mock user:', dbError)
            if (userId === 'mock-user-001') {
                return NextResponse.json({
                    success: true,
                    data: {
                        ...orderData,
                        id: `mock-order-${Date.now()}`,
                        status: 'PENDING',
                        createdAt: new Date().toISOString()
                    }
                }, { status: 201 })
            }
            throw dbError
        }
    } catch (error) {
        console.error('Error creating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        )
    }
}

const MOCK_ORDERS = [
    {
        id: 'mock-order-1',
        orderNumber: 'ORD-MOCK-001',
        status: 'DELIVERED',
        totalAmount: 53500,
        createdAt: new Date().toISOString(),
        items: []
    }
]
