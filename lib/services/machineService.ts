/**
 * Machine Service
 * Handles machine registration, customization, and part compatibility
 */

import { prisma } from '@/lib/prisma'

/**
 * Register a machine for a customer
 */
export async function registerCustomerMachine(data: {
    userId: string
    machineId: string
    serialNumber?: string
    purchaseDate?: Date
    nickname?: string
    notes?: string
}) {
    const customerMachine = await prisma.customerMachine.create({
        data: {
            userId: data.userId,
            machineId: data.machineId,
            serialNumber: data.serialNumber,
            purchaseDate: data.purchaseDate,
            nickname: data.nickname,
            notes: data.notes,
        },
        include: {
            machine: true,
        },
    })

    return customerMachine
}

/**
 * Get all machines owned by a customer
 */
export async function getCustomerMachines(userId: string) {
    const machines = await prisma.customerMachine.findMany({
        where: {
            userId,
            isActive: true,
        },
        include: {
            machine: {
                include: {
                    compatibleParts: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
            customizations: {
                include: {
                    customization: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return machines
}

/**
 * Add customization to a customer's machine
 */
export async function addMachineCustomization(
    customerMachineId: string,
    customizationId: string,
    installedDate?: Date,
    notes?: string
) {
    // Update customer machine to mark it as customized
    await prisma.customerMachine.update({
        where: { id: customerMachineId },
        data: { hasCustomization: true },
    })

    // Add the customization
    const customization = await prisma.customerMachineCustomization.create({
        data: {
            customerMachineId,
            customizationId,
            installedDate,
            notes,
        },
        include: {
            customization: true,
        },
    })

    return customization
}

/**
 * Get compatible parts for a customer's machine
 * Includes both standard and custom parts based on customizations
 */
export async function getCompatibleParts(customerMachineId: string) {
    const customerMachine = await prisma.customerMachine.findUnique({
        where: { id: customerMachineId },
        include: {
            machine: true,
            customizations: {
                include: {
                    customization: true,
                },
            },
        },
    })

    if (!customerMachine) {
        throw new Error('Customer machine not found')
    }

    // Get all compatible parts for the base machine
    const compatibleParts = await prisma.partCompatibility.findMany({
        where: {
            machineId: customerMachine.machineId,
        },
        include: {
            product: true,
        },
        orderBy: {
            priority: 'desc',
        },
    })

    // Filter parts based on customizations
    const customizationIds = customerMachine.customizations.map(
        (c) => c.customizationId
    )

    const filteredParts = compatibleParts.filter((part) => {
        // Always include standard parts
        if (part.isStandardPart && !part.isCustomPart) {
            return true
        }

        // Include custom parts if machine has matching customization
        if (part.isCustomPart && part.customizationIds.length > 0) {
            return part.customizationIds.some((id) => customizationIds.includes(id))
        }

        return false
    })

    return filteredParts
}

/**
 * Get machines similar to a customer's machine
 * Used for finding what parts other similar machine owners buy
 */
export async function getSimilarMachines(customerMachineId: string) {
    const customerMachine = await prisma.customerMachine.findUnique({
        where: { id: customerMachineId },
        include: {
            machine: true,
            customizations: true,
        },
    })

    if (!customerMachine) {
        throw new Error('Customer machine not found')
    }

    // Find other customers with the same machine
    const similarMachines = await prisma.customerMachine.findMany({
        where: {
            machineId: customerMachine.machineId,
            id: { not: customerMachineId },
            isActive: true,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
            customizations: {
                include: {
                    customization: true,
                },
            },
        },
    })

    return similarMachines
}

/**
 * Create or update machine in repository
 */
export async function updateMachineRepository() {
    const [totalMachines, totalCustomers, totalParts, totalCustomizations] =
        await Promise.all([
            prisma.machine.count({ where: { isActive: true } }),
            prisma.customerMachine.count({ where: { isActive: true } }),
            prisma.product.count({ where: { isActive: true } }),
            prisma.machineCustomization.count({ where: { isActive: true } }),
        ])

    const repository = await prisma.machineRepository.upsert({
        where: { id: 'main-repository' },
        create: {
            id: 'main-repository',
            totalMachines,
            totalCustomers,
            totalParts,
            totalCustomizations,
            metadata: {
                lastUpdatedBy: 'system',
                version: '1.0',
            },
        },
        update: {
            totalMachines,
            totalCustomers,
            totalParts,
            totalCustomizations,
            lastSyncedAt: new Date(),
            metadata: {
                lastUpdatedBy: 'system',
                version: '1.0',
            },
        },
    })

    return repository
}
