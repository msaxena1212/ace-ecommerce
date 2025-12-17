import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/analytics
 * Get platform analytics (Admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // Get date range from query params
        const searchParams = request.nextUrl.searchParams
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        const dateFilter = {
            createdAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined
            }
        }

        // Get counts
        const [
            totalOrders,
            totalRevenue,
            totalDealers,
            totalProducts,
            totalUsers,
            ordersByStatus,
            revenueByMonth
        ] = await Promise.all([
            prisma.order.count({ where: dateFilter }),
            prisma.order.aggregate({
                where: dateFilter,
                _sum: { totalAmount: true }
            }),
            prisma.dealer.count({ where: { isActive: true } }),
            prisma.product.count(),
            prisma.user.count(),
            prisma.order.groupBy({
                by: ['status'],
                where: dateFilter,
                _count: true
            }),
            prisma.$queryRaw`
                SELECT 
                    DATE_TRUNC('month', "createdAt") as month,
                    SUM("totalAmount") as revenue,
                    COUNT(*) as orders
                FROM "Order"
                WHERE "createdAt" >= COALESCE(${startDate}::timestamp, '1970-01-01')
                  AND "createdAt" <= COALESCE(${endDate}::timestamp, NOW())
                GROUP BY DATE_TRUNC('month', "createdAt")
                ORDER BY month DESC
                LIMIT 12
            `
        ])

        // Dealer performance
        const dealerPerformance = await prisma.dealer.findMany({
            select: {
                id: true,
                name: true,
                level: true,
                performanceScore: true,
                totalOrders: true,
                approvedOrders: true,
                rejectedOrders: true
            },
            orderBy: { performanceScore: 'desc' },
            take: 10
        })

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalOrders,
                    totalRevenue: totalRevenue._sum.totalAmount || 0,
                    totalDealers,
                    totalProducts,
                    totalUsers
                },
                ordersByStatus,
                revenueByMonth,
                dealerPerformance
            }
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
