import { PrismaClient } from '@prisma/client'
import {
    mockProducts,
    mockMachines,
    mockDealers,
    mockUsers,
    mockUserAddresses,
    mockCustomerMachines,
    mockCustomizations,
    mockSupportTickets,
    mockOrders,
    mockSuggestions
} from '../lib/mockData'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Clear existing data
    await prisma.partSuggestion.deleteMany()
    await prisma.supportMessage.deleteMany()
    await prisma.supportTicket.deleteMany()
    await prisma.customerMachineCustomization.deleteMany()
    await prisma.machineCustomization.deleteMany()
    await prisma.customerMachine.deleteMany()
    await prisma.partCompatibility.deleteMany()
    await prisma.orderRouting.deleteMany()
    await prisma.manifest.deleteMany()
    await prisma.return.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.wishlistItem.deleteMany()
    await prisma.product.deleteMany()
    await prisma.dealer.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
    await prisma.machine.deleteMany()
    await prisma.machineRepository.deleteMany()

    console.log('Cleaned up existing data')

    // 1. Users
    for (const user of mockUsers) {
        await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                password: 'hashed_password_placeholder', // In a real app, use bcrypt
            }
        })
    }
    console.log('Seeded users')

    // 2. Addresses
    for (const addr of mockUserAddresses) {
        await prisma.address.create({
            data: {
                id: addr.id,
                userId: addr.userId,
                name: addr.name,
                phone: addr.phone,
                addressLine1: addr.addressLine1,
                city: addr.city,
                state: addr.state,
                pincode: addr.pincode,
                isDefault: addr.isDefault
            }
        })
    }
    console.log('Seeded addresses')

    // 3. Products
    for (const prod of mockProducts) {
        await prisma.product.create({
            data: {
                id: prod.id,
                partNumber: prod.partNumber,
                name: prod.name,
                description: prod.description,
                category: prod.category,
                price: prod.price,
                images: JSON.stringify(prod.images),
                specifications: JSON.stringify(prod.specifications),
                isActive: prod.isActive,
                isCustomPart: prod.isCustomPart,
                customizationRequired: JSON.stringify(prod.customizationRequired),
            }
        })
    }
    console.log('Seeded products')

    // 4. Machines
    for (const mac of mockMachines) {
        await prisma.machine.create({
            data: {
                id: mac.id,
                machineNumber: mac.machineNumber,
                name: mac.name,
                category: mac.category,
                model: mac.model,
                manufacturer: mac.manufacturer,
                description: mac.description,
                specifications: JSON.stringify(mac.specifications),
                images: JSON.stringify(mac.images),
                isCustomizable: mac.isCustomizable,
                isActive: mac.isActive
            }
        })
    }
    console.log('Seeded machines')

    // 5. Dealers
    for (const dealer of mockDealers) {
        await prisma.dealer.create({
            data: {
                id: dealer.id,
                name: dealer.name,
                email: dealer.email,
                password: 'hashed_password_placeholder',
                phone: dealer.phone,
                level: dealer.level,
                address: dealer.address,
                city: dealer.city,
                state: dealer.state,
                pincode: dealer.pincode,
                servicePincodes: JSON.stringify(dealer.servicePincodes),
                isActive: dealer.isActive,
                performanceScore: dealer.performanceScore,
                totalOrders: dealer.totalOrders,
                approvedOrders: dealer.approvedOrders,
                rejectedOrders: dealer.rejectedOrders
            }
        })
    }
    console.log('Seeded dealers')

    // 6. Machine Customizations
    for (const custom of mockCustomizations) {
        await prisma.machineCustomization.create({
            data: {
                id: custom.id,
                machineId: custom.machineId,
                name: custom.name,
                description: custom.description,
                customizationType: custom.customizationType,
                affectedParts: JSON.stringify(custom.affectedParts),
                additionalParts: JSON.stringify(custom.additionalParts),
                isActive: custom.isActive
            }
        })
    }
    console.log('Seeded machine customizations')

    // 7. Customer Machines
    for (const cm of mockCustomerMachines) {
        await prisma.customerMachine.create({
            data: {
                id: cm.id,
                userId: cm.userId,
                machineId: cm.machineId,
                serialNumber: cm.serialNumber,
                purchaseDate: new Date(cm.purchaseDate),
                hasCustomization: cm.hasCustomization,
                customizationDetails: cm.customizationDetails ? JSON.stringify(cm.customizationDetails) : null,
                nickname: cm.nickname,
                notes: cm.notes,
                isActive: cm.isActive
            }
        })
    }
    console.log('Seeded customer machines')

    // 8. Support Tickets
    for (const ticket of mockSupportTickets) {
        await prisma.supportTicket.create({
            data: {
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                userId: ticket.userId,
                customerMachineId: ticket.customerMachineId,
                type: ticket.type,
                status: ticket.status,
                priority: ticket.priority,
                subject: ticket.subject,
                description: ticket.description,
                whatsappNumber: ticket.whatsappNumber,
                confirmedParts: JSON.stringify(ticket.confirmedParts),
                sharedCartLink: ticket.sharedCartLink,
                createdAt: new Date(ticket.createdAt)
            }
        })
    }
    console.log('Seeded support tickets')

    // 9. Orders
    for (const order of mockOrders) {
        const createdOrder = await prisma.order.create({
            data: {
                id: order.id,
                orderNumber: order.orderNumber,
                userId: order.userId,
                status: order.status,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                deliveryAddress: JSON.stringify(order.deliveryAddress),
                deliveryPartner: order.deliveryPartner,
                trackingId: order.trackingId,
                estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : null,
                actualDelivery: order.actualDelivery ? new Date(order.actualDelivery) : null,
                createdAt: new Date(order.createdAt)
            }
        })

        for (const item of order.items) {
            await prisma.orderItem.create({
                data: {
                    id: item.id,
                    orderId: createdOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    status: item.status
                }
            })
        }
    }
    console.log('Seeded orders & items')

    // 10. Suggestions
    for (const sugg of mockSuggestions) {
        await prisma.partSuggestion.create({
            data: {
                id: sugg.id,
                userId: sugg.userId,
                productId: sugg.productId,
                machineId: sugg.machineId,
                suggestionType: sugg.suggestionType,
                reason: sugg.reason,
                relevanceScore: sugg.relevanceScore,
                isViewed: sugg.isViewed,
                isClicked: sugg.isClicked,
                isPurchased: sugg.isPurchased
            }
        })
    }
    console.log('Seeded suggestions')

    // 11. Machine Repository (Initial Sync)
    await prisma.machineRepository.create({
        data: {
            id: 'repo-001',
            totalMachines: mockMachines.length,
            totalCustomers: mockUsers.length,
            totalParts: mockProducts.length,
            totalCustomizations: mockCustomizations.length,
            metadata: JSON.stringify({ version: '1.0', lastUpdate: new Date().toISOString() })
        }
    })
    console.log('Seeded machine repository')

    console.log('Seeding finished successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
