import { NextRequest, NextResponse } from 'next/server'
import { getProductById, getProducts } from '@/lib/services/dataService'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await getProductById(params.id)

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Fetch related products (same category)
        const related = await getProducts({ category: product.category })
        const relatedProducts = related.filter(p => p.id !== product.id).slice(0, 4)

        return NextResponse.json({
            product,
            relatedProducts
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}
