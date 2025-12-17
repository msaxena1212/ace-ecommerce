import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { rejectOrder } from '@/lib/services/orderRouting'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const rejectSchema = z.object({
    reason: z.string().min(10),
})

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'DEALER') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const orderId = params.id
        const body = await request.json()
        const validatedData = rejectSchema.parse(body)

        // Get dealer info
        const dealer = await prisma.dealer.findUnique({
            where: { email: session.user.email },
        })

        if (!dealer) {
            return NextResponse.json(
                { error: 'Dealer not found' },
                { status: 404 }
            )
        }

        // Reject order and route to next level
        const result = await rejectOrder(orderId, dealer.id, validatedData.reason)

        return NextResponse.json({
            message: 'Order rejected successfully',
            nextLevel: result.dealerLevel || 'None',
            routingMessage: result.message,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Order rejection error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
