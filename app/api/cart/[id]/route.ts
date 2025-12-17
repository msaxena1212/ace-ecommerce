import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PUT /api/cart/[id]
 * Update cart item quantity
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { quantity } = body

        if (quantity <= 0) {
            // Delete item if quantity is 0
            await prisma.cartItem.delete({
                where: { id: params.id }
            })

            return NextResponse.json({
                success: true,
                message: 'Item removed from cart'
            })
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: params.id },
            data: { quantity },
            include: {
                product: true
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedItem
        })
    } catch (error) {
        console.error('Error updating cart item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update cart item' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/cart/[id]
 * Remove item from cart
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.cartItem.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            success: true,
            message: 'Item removed from cart'
        })
    } catch (error) {
        console.error('Error removing cart item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to remove cart item' },
            { status: 500 }
        )
    }
}
