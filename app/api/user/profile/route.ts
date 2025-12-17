import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/user/profile
 * Get current user profile
 */
export async function GET(request: NextRequest) {
    try {
        const userId = 'user-001' // TODO: Get from session

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        orders: true,
                        machines: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: user
        })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

/**
 * PATCH /api/user/profile
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
    try {
        const userId = 'user-001' // TODO: Get from session
        const body = await request.json()

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: body.name,
                phone: body.phone,
                // Don't allow email or role changes via this endpoint
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true
            }
        })

        return NextResponse.json({
            success: true,
            data: user
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}
