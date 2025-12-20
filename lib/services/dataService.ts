import { prisma } from '../prisma'

export interface Product {
    id: string
    partNumber: string
    name: string
    description: string
    category: string
    price: number
    images: string[]
    specifications: Record<string, any>
    isActive: boolean
    isCustomPart: boolean
    customizationRequired: string[]
    createdAt: Date
    updatedAt: Date
}

export const getProducts = async (filters?: {
    category?: string
    searchQuery?: string
    priceRange?: string
}): Promise<Product[]> => {
    const where: any = { isActive: true }

    if (filters?.category && filters.category !== 'All') {
        where.category = filters.category
    }

    if (filters?.searchQuery) {
        where.OR = [
            { name: { contains: filters.searchQuery } },
            { partNumber: { contains: filters.searchQuery } },
            { description: { contains: filters.searchQuery } }
        ]
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })

    return products.map(p => ({
        ...p,
        images: JSON.parse(p.images as any),
        specifications: JSON.parse(p.specifications as any),
        customizationRequired: JSON.parse(p.customizationRequired as any)
    }))
}

export const getProductById = async (id: string): Promise<Product | null> => {
    const p = await prisma.product.findUnique({
        where: { id }
    })

    if (!p) return null

    return {
        ...p,
        images: JSON.parse(p.images as any),
        specifications: JSON.parse(p.specifications as any),
        customizationRequired: JSON.parse(p.customizationRequired as any)
    }
}

export const getCategories = async (): Promise<string[]> => {
    const categories = await prisma.product.groupBy({
        by: ['category'],
        where: { isActive: true }
    })
    return ['All', ...categories.map(c => c.category)]
}

export const getTrendingProducts = async (limit = 4): Promise<Product[]> => {
    const products = await prisma.product.findMany({
        where: { isActive: true },
        take: limit,
        orderBy: { createdAt: 'desc' }
    })

    return products.map(p => ({
        ...p,
        images: JSON.parse(p.images as any),
        specifications: JSON.parse(p.specifications as any),
        customizationRequired: JSON.parse(p.customizationRequired as any)
    }))
}

export const getMachines = async () => {
    const machines = await prisma.machine.findMany({
        where: { isActive: true }
    })

    return machines.map(m => ({
        ...m,
        specifications: JSON.parse(m.specifications as any),
        images: JSON.parse(m.images as any)
    }))
}
