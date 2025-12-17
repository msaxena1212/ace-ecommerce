import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getCompatibleParts } from '@/lib/services/machineService'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const customerMachineId = params.id

        const compatibleParts = await getCompatibleParts(customerMachineId)

        return NextResponse.json({ parts: compatibleParts })
    } catch (error) {
        console.error('Error fetching compatible parts:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
