import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/dealers/[id]
 * Get specific dealer details
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const dealer = await prisma.dealer.findUnique({
            where: { id: params.id },
            include: {
                routing: {
                    include: {
                        order: {
                            select: {
                                id: true,
                                orderNumber: true,
                                totalAmount: true,
                                status: true,
                                createdAt: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        })

        if (!dealer) {
            return NextResponse.json(
                { success: false, error: 'Dealer not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: dealer
        })
    } catch (error) {
        console.error('Error fetching dealer:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch dealer' },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/admin/dealers/[id]
 * Update dealer details
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const dealer = await prisma.dealer.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json({
            success: true,
            data: dealer
        })
    } catch (error) {
        console.error('Error updating dealer:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update dealer' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/admin/dealers/[id]
 * Deactivate dealer
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Soft delete - just deactivate
        const dealer = await prisma.dealer.update({
            where: { id: params.id },
            data: { isActive: false }
        })

        return NextResponse.json({
            success: true,
            data: dealer
        })
    } catch (error) {
        console.error('Error deactivating dealer:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to deactivate dealer' },
            { status: 500 }
        )
    }
}
