import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/dealer/orders
 * Get orders routed to current dealer
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Get dealer from session
        const dealerId = 'dealer-001' // Mock for now

        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')

        const where: any = {
            routing: {
                some: {
                    dealerId,
                    status: status || undefined
                }
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
                    where: { dealerId },
                    include: {
                        dealer: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
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
        console.error('Error fetching dealer orders:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch orders' },
            { status: 500 }
        )
    }
}
