import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/orders
 * Get all orders (Admin only)
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const dealerId = searchParams.get('dealerId')

        const where: any = {}
        if (status) where.status = status
        if (dealerId) {
            where.routing = {
                some: { dealerId }
            }
        }

        const orders = await prisma.order.findMany({
            where,
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
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: orders,
            count: orders.length
        })
    } catch (error) {
        console.error('Error fetching orders:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
