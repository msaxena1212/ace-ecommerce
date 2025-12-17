
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/users - List users (Admin only)
export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            where: { isArchived: false },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, name: true, email: true, phone: true, role: true, createdAt: true
            }
        })
        return NextResponse.json({ success: true, data: users })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
    }
}

// POST /api/users - Create User (Admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Enforce Company User creation restriction
        if (body.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Only Company Users (Admin) can be created here.' }, { status: 403 })
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password, // Should be hashed in production
                phone: body.phone,
                role: 'ADMIN', // Explicitly set
                isArchived: false
            }
        })
        return NextResponse.json({ success: true, data: user })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
    }
}

// PUT /api/users - Update User Role
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, role } = body

        const user = await prisma.user.update({
            where: { id },
            data: { role }
        })
        return NextResponse.json({ success: true, data: user })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 })
    }
}

// DELETE /api/users - Archive User
export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url)
        const id = url.searchParams.get('id')

        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })

        const user = await prisma.user.update({
            where: { id },
            data: { isArchived: true }
        })
        return NextResponse.json({ success: true, msg: 'User archived' })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to archive user' }, { status: 500 })
    }
}
