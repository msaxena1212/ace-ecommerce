import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { registerCustomerMachine, getCustomerMachines } from '@/lib/services/machineService'
import { z } from 'zod'

const registerMachineSchema = z.object({
    machineId: z.string(),
    serialNumber: z.string().optional(),
    purchaseDate: z.string().optional(),
    nickname: z.string().optional(),
    notes: z.string().optional(),
})

// GET /api/machines - Get customer's machines
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const machines = await getCustomerMachines(session.user.id)

        return NextResponse.json({ machines })
    } catch (error) {
        console.error('Error fetching machines:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/machines - Register a new machine
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
        const validatedData = registerMachineSchema.parse(body)

        const machine = await registerCustomerMachine({
            userId: session.user.id,
            machineId: validatedData.machineId,
            serialNumber: validatedData.serialNumber,
            purchaseDate: validatedData.purchaseDate
                ? new Date(validatedData.purchaseDate)
                : undefined,
            nickname: validatedData.nickname,
            notes: validatedData.notes,
        })

        return NextResponse.json(
            { message: 'Machine registered successfully', machine },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Error registering machine:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
