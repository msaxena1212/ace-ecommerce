import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/dealers
 * Get all dealers (Admin only)
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Check admin authentication

        const searchParams = request.nextUrl.searchParams
        const level = searchParams.get('level')
        const isActive = searchParams.get('isActive')

        const where: any = {}
        if (level) where.level = level
        if (isActive !== null) where.isActive = isActive === 'true'

        const dealers = await prisma.dealer.findMany({
            where,
            orderBy: { performanceScore: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: dealers
        })
    } catch (error) {
        console.error('Error fetching dealers:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dealers' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/admin/dealers
 * Create a new dealer (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const dealer = await prisma.dealer.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                level: body.level,
                address: body.address,
                city: body.city,
                state: body.state,
                pincode: body.pincode,
                password: body.password, // Added password field
                servicePincodes: body.servicePincodes || [],
                isActive: body.isActive ?? true,
                performanceScore: 100,
                responseSLA: body.responseSLA || 120,
                totalOrders: 0,
                approvedOrders: 0,
                rejectedOrders: 0
            }
        })

        return NextResponse.json({
            success: true,
            data: dealer
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating dealer:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create dealer' },
            { status: 500 }
        )
    }
}
