import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { approveOrder } from '@/lib/services/orderRouting'
import { createManifest } from '@/lib/services/manifestService'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const approveSchema = z.object({
    notes: z.string().optional(),
    pickupAddress: z.object({
        addressLine1: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
        phone: z.string(),
    }),
    pickupTimeSlot: z.string(),
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
        const validatedData = approveSchema.parse(body)

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

        // Approve order
        await approveOrder(orderId, dealer.id, validatedData.notes)

        // Get order details for manifest creation
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // Create manifest
        const manifest = await createManifest({
            orderId,
            dealerId: dealer.id,
            items: order.items.map(item => ({
                partNumber: item.product.partNumber,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
            })),
            pickupAddress: validatedData.pickupAddress,
            deliveryAddress: order.deliveryAddress,
            distance: 100, // TODO: Calculate actual distance
        })

        return NextResponse.json({
            message: 'Order approved successfully',
            manifest: {
                manifestNumber: manifest.manifestNumber,
                trackingId: manifest.trackingId,
                deliveryPartner: manifest.deliveryPartner,
            },
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.errors },
                { status: 400 }
            )
        }

        console.error('Order approval error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
