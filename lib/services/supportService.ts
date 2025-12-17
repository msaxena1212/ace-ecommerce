/**
 * Support Service
 * Handles customer support tickets and WhatsApp integration
 */

import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

/**
 * Create a support ticket for part inquiry
 */
export async function createSupportTicket(data: {
    userId: string
    customerMachineId?: string
    type: string
    subject: string
    description: string
    whatsappNumber?: string
    priority?: string
}) {
    const ticket = await prisma.supportTicket.create({
        data: {
            ticketNumber: `SUPP-${generateOrderNumber()}`,
            userId: data.userId,
            customerMachineId: data.customerMachineId,
            type: data.type as any,
            subject: data.subject,
            description: data.description,
            whatsappNumber: data.whatsappNumber,
            priority: (data.priority as any) || 'MEDIUM',
            status: 'OPEN',
        },
        include: {
            user: true,
            customerMachine: {
                include: {
                    machine: true,
                },
            },
        },
    })

    return ticket
}

/**
 * Add message to support ticket
 */
export async function addSupportMessage(
    ticketId: string,
    senderId: string,
    senderType: 'CUSTOMER' | 'SUPPORT',
    message: string,
    attachments?: string[],
    isWhatsApp?: boolean
) {
    const supportMessage = await prisma.supportMessage.create({
        data: {
            ticketId,
            senderId,
            senderType,
            message,
            attachments: attachments || [],
            isWhatsApp: isWhatsApp || false,
        },
    })

    // Update ticket status
    await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            status: senderType === 'SUPPORT' ? 'IN_PROGRESS' : 'WAITING_CUSTOMER',
            updatedAt: new Date(),
        },
    })

    return supportMessage
}

/**
 * Confirm parts for a support ticket
 * Support agent confirms which parts customer needs
 */
export async function confirmTicketParts(
    ticketId: string,
    confirmedParts: Array<{
        productId: string
        quantity: number
        notes?: string
    }>
) {
    // Generate a unique cart link
    const cartToken = generateOrderNumber()
    const cartLink = `/cart/add-from-support?token=${cartToken}`

    // Update ticket with confirmed parts
    const ticket = await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            confirmedParts,
            sharedCartLink: cartLink,
            status: 'PARTS_CONFIRMED',
        },
        include: {
            user: true,
        },
    })

    // TODO: Send WhatsApp message with cart link
    // await sendWhatsAppMessage(ticket.whatsappNumber, cartLink)

    return { ticket, cartLink }
}

/**
 * Add confirmed parts to customer's cart
 */
export async function addConfirmedPartsToCart(
    userId: string,
    ticketId: string,
    token: string
) {
    const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
    })

    if (!ticket || ticket.userId !== userId) {
        throw new Error('Invalid ticket or unauthorized')
    }

    if (!ticket.confirmedParts) {
        throw new Error('No confirmed parts in ticket')
    }

    const confirmedParts = ticket.confirmedParts as Array<{
        productId: string
        quantity: number
    }>

    // Add each part to cart
    for (const part of confirmedParts) {
        await prisma.cartItem.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId: part.productId,
                },
            },
            create: {
                userId,
                productId: part.productId,
                quantity: part.quantity,
            },
            update: {
                quantity: { increment: part.quantity },
            },
        })
    }

    return confirmedParts
}

/**
 * Resolve support ticket
 */
export async function resolveSupportTicket(
    ticketId: string,
    resolution: string
) {
    const ticket = await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            status: 'RESOLVED',
            resolution,
            resolvedAt: new Date(),
        },
    })

    return ticket
}

/**
 * Get customer's support tickets
 */
export async function getCustomerTickets(userId: string) {
    const tickets = await prisma.supportTicket.findMany({
        where: { userId },
        include: {
            customerMachine: {
                include: {
                    machine: true,
                },
            },
            messages: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return tickets
}

/**
 * Get open support tickets for support team
 */
export async function getOpenTickets(assignedTo?: string) {
    const where: any = {
        status: {
            in: ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER'],
        },
    }

    if (assignedTo) {
        where.assignedTo = assignedTo
    }

    const tickets = await prisma.supportTicket.findMany({
        where,
        include: {
            user: true,
            customerMachine: {
                include: {
                    machine: true,
                },
            },
            messages: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 3,
            },
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    })

    return tickets
}

/**
 * Assign ticket to support agent
 */
export async function assignTicket(ticketId: string, agentId: string) {
    const ticket = await prisma.supportTicket.update({
        where: { id: ticketId },
        data: {
            assignedTo: agentId,
            status: 'IN_PROGRESS',
        },
    })

    return ticket
}
