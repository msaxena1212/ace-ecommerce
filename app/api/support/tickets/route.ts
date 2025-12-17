import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import {
    createSupportTicket,
    getCustomerTickets,
} from '@/lib/services/supportService'
import { z } from 'zod'

const createTicketSchema = z.object({
    customerMachineId: z.string().optional(),
    type: z.enum([
        'PART_INQUIRY',
        'CUSTOMIZATION_QUERY',
        'TECHNICAL_SUPPORT',
        'ORDER_ISSUE',
        'GENERAL',
    ]),
    subject: z.string().min(5),
    description: z.string().min(10),
    whatsappNumber: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})

// GET /api/support/tickets - Get customer's tickets
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const tickets = await getCustomerTickets(session.user.id)

        return NextResponse.json({ tickets })
    } catch (error) {
        console.error('Error fetching tickets:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/support/tickets - Create support ticket
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = createTicketSchema.parse(body)

        const ticket = await createSupportTicket({
            userId: session.user.id,
            ...validatedData,
        })

        return NextResponse.json(
            { message: 'Support ticket created successfully', ticket },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Error creating ticket:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
