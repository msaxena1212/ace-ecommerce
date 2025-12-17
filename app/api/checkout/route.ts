import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { routeOrder } from '@/lib/services/orderRouting'
import { z } from 'zod'

const checkoutSchema = z.object({
    deliveryAddressId: z.string(),
    paymentMethod: z.enum(['ONLINE', 'COD', 'CREDIT']),
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = checkoutSchema.parse(body)

        // Get user's cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: { product: true },
        })

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            )
        }

        // Get delivery address
        const address = await prisma.address.findUnique({
            where: { id: validatedData.deliveryAddressId },
        })

        if (!address || address.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Invalid delivery address' },
                { status: 400 }
            )
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: session.user.id,
                status: 'PENDING',
                totalAmount,
                paymentMethod: validatedData.paymentMethod,
                paymentStatus: validatedData.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
                deliveryAddress: {
                    name: address.name,
                    phone: address.phone,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                },
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                        status: 'PENDING',
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        // Clear cart
        await prisma.cartItem.deleteMany({
            where: { userId: session.user.id },
        })

        // Route order to dealers
        await routeOrder(order.id, address.pincode)

        return NextResponse.json({
            message: 'Order placed successfully',
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Checkout error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
