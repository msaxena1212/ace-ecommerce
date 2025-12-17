/**
 * Part Suggestion Service
 * Generates smart part suggestions based on machine compatibility and user behavior
 */

import { prisma } from '@/lib/prisma'

/**
 * Generate part suggestions for a customer based on their machines
 */
export async function generatePartSuggestions(userId: string) {
    // Get customer's machines
    const customerMachines = await prisma.customerMachine.findMany({
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
            customizations: true,
        },
    })

    const suggestions = []

    for (const customerMachine of customerMachines) {
        // 1. Compatible parts for this machine
        for (const compatibility of customerMachine.machine.compatibleParts) {
            // Check if already suggested
            const existing = await prisma.partSuggestion.findFirst({
                where: {
                    userId,
                    productId: compatibility.productId,
                    machineId: customerMachine.machineId,
                },
            })

            if (!existing) {
                suggestions.push({
                    userId,
                    productId: compatibility.productId,
                    machineId: customerMachine.machineId,
                    suggestionType: 'COMPATIBLE_PART',
                    reason: `Compatible with your ${customerMachine.machine.name}`,
                    relevanceScore: compatibility.priority * 10,
                })
            }
        }

        // 2. Parts for customizations
        if (customerMachine.hasCustomization) {
            const customizationIds = customerMachine.customizations.map(
                (c) => c.customizationId
            )

            const customParts = await prisma.partCompatibility.findMany({
                where: {
                    machineId: customerMachine.machineId,
                    isCustomPart: true,
                    customizationIds: {
                        hasSome: customizationIds,
                    },
                },
                include: {
                    product: true,
                },
            })

            for (const part of customParts) {
                suggestions.push({
                    userId,
                    productId: part.productId,
                    machineId: customerMachine.machineId,
                    suggestionType: 'CUSTOMIZATION_REQUIRED',
                    reason: 'Required for your machine customization',
                    relevanceScore: 90,
                })
            }
        }

        // 3. What similar machine owners buy
        const similarMachineOwners = await prisma.customerMachine.findMany({
            where: {
                machineId: customerMachine.machineId,
                userId: { not: userId },
                isActive: true,
            },
            include: {
                user: {
                    include: {
                        orders: {
                            include: {
                                items: {
                                    include: {
                                        product: true,
                                    },
                                },
                            },
                            where: {
                                status: 'DELIVERED',
                            },
                            take: 10,
                        },
                    },
                },
            },
            take: 20,
        })

        // Aggregate parts bought by similar machine owners
        const partFrequency: Record<string, number> = {}

        for (const similar of similarMachineOwners) {
            for (const order of similar.user.orders) {
                for (const item of order.items) {
                    partFrequency[item.productId] =
                        (partFrequency[item.productId] || 0) + 1
                }
            }
        }

        // Suggest top parts
        const topParts = Object.entries(partFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)

        for (const [productId, frequency] of topParts) {
            suggestions.push({
                userId,
                productId,
                machineId: customerMachine.machineId,
                suggestionType: 'SIMILAR_MACHINE_USERS',
                reason: `Popular among ${customerMachine.machine.name} owners`,
                relevanceScore: Math.min(frequency * 10, 100),
            })
        }
    }

    // Save suggestions
    for (const suggestion of suggestions) {
        await prisma.partSuggestion.create({
            data: suggestion as any,
        })
    }

    return suggestions
}

/**
 * Get part suggestions for a customer
 */
export async function getPartSuggestions(
    userId: string,
    limit: number = 10
) {
    const suggestions = await prisma.partSuggestion.findMany({
        where: {
            userId,
            isViewed: false,
        },
        include: {
            product: true,
        },
        orderBy: {
            relevanceScore: 'desc',
        },
        take: limit,
    })

    return suggestions
}

/**
 * Mark suggestion as viewed
 */
export async function markSuggestionViewed(suggestionId: string) {
    await prisma.partSuggestion.update({
        where: { id: suggestionId },
        data: { isViewed: true },
    })
}

/**
 * Mark suggestion as clicked
 */
export async function markSuggestionClicked(suggestionId: string) {
    await prisma.partSuggestion.update({
        where: { id: suggestionId },
        data: { isClicked: true },
    })
}

/**
 * Mark suggestion as purchased
 */
export async function markSuggestionPurchased(
    userId: string,
    productId: string
) {
    await prisma.partSuggestion.updateMany({
        where: {
            userId,
            productId,
            isPurchased: false,
        },
        data: { isPurchased: true },
    })
}

/**
 * Get frequently bought together parts
 */
export async function getFrequentlyBoughtTogether(productId: string) {
    // Find orders containing this product
    const orders = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    productId,
                },
            },
            status: 'DELIVERED',
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        take: 100,
    })

    // Count co-occurrences
    const coOccurrence: Record<string, number> = {}

    for (const order of orders) {
        for (const item of order.items) {
            if (item.productId !== productId) {
                coOccurrence[item.productId] =
                    (coOccurrence[item.productId] || 0) + 1
            }
        }
    }

    // Get top 5 frequently bought together
    const topProducts = Object.entries(coOccurrence)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id)

    const products = await prisma.product.findMany({
        where: {
            id: { in: topProducts },
            isActive: true,
        },
    })

    return products
}
