import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/user/machines
 * Get all machines owned by current user
 */
export async function GET(request: NextRequest) {
    try {
        const userId = 'user-001' // TODO: Get from session

        const machines = await prisma.customerMachine.findMany({
            where: { userId },
            include: {
                machine: true,
                customizations: {
                    include: {
                        customization: true
                    }
                }
            },
            orderBy: { purchaseDate: 'desc' }
        })

        return NextResponse.json({
            success: true,
            data: machines
        })
    } catch (error) {
        console.error('Error fetching machines:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch machines' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/user/machines
 * Register a new machine for current user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const userId = 'user-001' // TODO: Get from session

        const machine = await prisma.customerMachine.create({
            data: {
                userId,
                machineId: body.machineId,
                serialNumber: body.serialNumber,
                nickname: body.nickname,
                purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : new Date(),
                hasCustomization: body.hasCustomization || false,
                customizationDetails: body.customizationDetails || {}
            },
            include: {
                machine: true
            }
        })

        // Add customizations if provided
        if (body.customizations && body.customizations.length > 0) {
            await prisma.customerMachineCustomization.createMany({
                data: body.customizations.map((custId: string) => ({
                    customerMachineId: machine.id,
                    customizationId: custId
                }))
            })
        }

        return NextResponse.json({
            success: true,
            data: machine
        }, { status: 201 })
    } catch (error) {
        console.error('Error registering machine:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to register machine' },
            { status: 500 }
        )
    }
}
