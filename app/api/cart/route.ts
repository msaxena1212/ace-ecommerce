import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/cart
 * Get cart items for current user
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Get user from session
        // const session = await getServerSession()
        // const userId = session?.user?.id

        const userId = 'user-001' // Mock for now

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

        return NextResponse.json({
            success: true,
            data: cart || { items: [] }
        })
    } catch (error) {
        console.error('Error fetching cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cart' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { productId, quantity } = body

        // TODO: Get user from session
        const userId = 'user-001' // Mock for now

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            })
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        })

        if (existingItem) {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity
                }
            })
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            })
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedCart
        })
    } catch (error) {
        console.error('Error adding to cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to add to cart' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/cart
 * Clear entire cart
 */
export async function DELETE(request: NextRequest) {
    try {
        const userId = 'user-001' // Mock for now

        await prisma.cartItem.deleteMany({
            where: {
                cart: {
                    userId
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Cart cleared'
        })
    } catch (error) {
        console.error('Error clearing cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to clear cart' },
            { status: 500 }
        )
    }
}
