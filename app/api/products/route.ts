import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getCategories } from '@/lib/services/dataService'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category') || undefined
        const searchQuery = searchParams.get('search') || undefined
        const priceRange = searchParams.get('priceRange') || undefined

        const products = await getProducts({
            category,
            searchQuery,
            priceRange
        })

        const categories = await getCategories()

        return NextResponse.json({
            products,
            count: products.length,
            categories
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}
