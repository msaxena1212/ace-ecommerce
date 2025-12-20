import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/cart
 * Get cart items for current user
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: true, data: { items: [], total: 0, subtotal: 0, tax: 0 } },
                { status: 200 }
            )
        }

        const userId = session.user.id

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                sku: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        })

        if (!cart) {
            // Create new cart if doesn't exist
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    image: true,
                                    sku: true,
                                    stock: true,
                                },
                            },
                        },
                    },
                },
            })
        }

        // Calculate totals
        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )
        const tax = Math.round(subtotal * 0.18 * 100) / 100 // 18% GST
        const total = subtotal + tax

        return NextResponse.json({
            success: true,
            data: {
                id: cart.id,
                userId: cart.userId,
                items: cart.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    product: item.product,
                    itemTotal: item.product.price * item.quantity,
                })),
                subtotal,
                tax,
                total,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
            },
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
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId, quantity } = body

        if (!productId || !quantity || quantity < 1) {
            return NextResponse.json(
                { success: false, error: 'Invalid product or quantity' },
                { status: 400 }
            )
        }

        const userId = session.user.id

        // Verify product exists and has stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { id: true, stock: true, price: true },
        })

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }

        if (product.stock < quantity) {
            return NextResponse.json(
                { success: false, error: 'Insufficient stock' },
                { status: 400 }
            )
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId },
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            })
        }

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
            },
        })

        if (existingItem) {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            })
        } else {
            // Add new item
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            })
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                sku: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        })

        const subtotal = updatedCart!.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )
        const tax = Math.round(subtotal * 0.18 * 100) / 100
        const total = subtotal + tax

        return NextResponse.json({
            success: true,
            data: {
                id: updatedCart!.id,
                userId: updatedCart!.userId,
                items: updatedCart!.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    product: item.product,
                    itemTotal: item.product.price * item.quantity,
                })),
                subtotal,
                tax,
                total,
                itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0),
            },
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
 * PUT /api/cart
 * Update cart item quantity
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { productId, quantity } = body

        if (!productId || quantity < 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid input' },
                { status: 400 }
            )
        }

        const userId = session.user.id

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        })

        if (!cart) {
            return NextResponse.json(
                { success: false, error: 'Cart not found' },
                { status: 404 }
            )
        }

        const cartItem = cart.items.find((item) => item.productId === productId)

        if (!cartItem) {
            return NextResponse.json(
                { success: false, error: 'Item not in cart' },
                { status: 404 }
            )
        }

        if (quantity === 0) {
            // Delete item
            await prisma.cartItem.delete({
                where: { id: cartItem.id },
            })
        } else {
            // Update quantity
            await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity },
            })
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                sku: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        })

        const subtotal = updatedCart!.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        )
        const tax = Math.round(subtotal * 0.18 * 100) / 100
        const total = subtotal + tax

        return NextResponse.json({
            success: true,
            data: {
                id: updatedCart!.id,
                userId: updatedCart!.userId,
                items: updatedCart!.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    product: item.product,
                    itemTotal: item.product.price * item.quantity,
                })),
                subtotal,
                tax,
                total,
                itemCount: updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0),
            },
        })
    } catch (error) {
        console.error('Error updating cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update cart' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/cart
 * Clear entire cart or remove single item
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const userId = session.user.id
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        })

        if (!cart) {
            return NextResponse.json(
                { success: false, error: 'Cart not found' },
                { status: 404 }
            )
        }

        if (productId) {
            // Remove single item
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                    productId,
                },
            })
        } else {
            // Clear entire cart
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            })
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                image: true,
                                sku: true,
                                stock: true,
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Cart updated',
            data: {
                id: updatedCart!.id,
                userId: updatedCart!.userId,
                items: updatedCart!.items,
            },
        })
    } catch (error) {
        console.error('Error clearing cart:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to clear cart' },
            { status: 500 }
        )
    }
}
