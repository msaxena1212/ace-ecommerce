import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { confirmTicketParts } from '@/lib/services/supportService'
import { z } from 'zod'

const confirmPartsSchema = z.object({
    parts: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().min(1),
            notes: z.string().optional(),
        })
    ),
})

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            )
        }

        const ticketId = params.id
        const body = await request.json()
        const validatedData = confirmPartsSchema.parse(body)

        const { ticket, cartLink } = await confirmTicketParts(
            ticketId,
            validatedData.parts
        )

        return NextResponse.json({
            message: 'Parts confirmed successfully',
            ticket,
            cartLink,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Error confirming parts:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
