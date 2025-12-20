import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/orders/[id]
 * Get specific order details
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { id },
                    { orderNumber: id }
                ]
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json(
                { success: false, error: 'Order not found' },
                { status: 404 }
            )
        }

        // Parse JSON strings for SQLite
        try {
            if (typeof order.deliveryAddress === 'string') {
                (order as any).deliveryAddress = JSON.parse(order.deliveryAddress)
            }
            order.items.forEach((item: any) => {
                if (item.product) {
                    if (typeof item.product.images === 'string') {
                        item.product.images = JSON.parse(item.product.images)
                    }
                    if (typeof item.product.specifications === 'string') {
                        item.product.specifications = JSON.parse(item.product.specifications)
                    }
                }
            })
        } catch (e) {
            console.error('JSON Parse error in Order API:', e)
        }

        return NextResponse.json({
            success: true,
            data: order
        })
    } catch (error) {
        console.error('Error fetching order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch order' },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/orders/[id]
 * Update order status
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()
        const { status, trackingId, deliveryPartnerId } = body

        const updateData: any = {}
        if (status) updateData.status = status
        if (trackingId) updateData.trackingId = trackingId
        if (deliveryPartnerId) updateData.deliveryPartnerId = deliveryPartnerId

        const order = await prisma.order.update({
            where: { id: params.id },
            data: updateData,
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
            data: order
        })
    } catch (error) {
        console.error('Error updating order:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update order' },
            { status: 500 }
        )
    }
}
