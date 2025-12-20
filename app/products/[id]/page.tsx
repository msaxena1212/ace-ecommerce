'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ShoppingCart, ArrowLeft, Plus, Minus, Check, Info, Loader2 } from 'lucide-react'
import Header from '@/components/Header'

export default function ProductDetailPage() {
    const params = useParams()
    const productId = params.id as string
    const [product, setProduct] = useState<any>(null)
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/products/${productId}`)
                const data = await res.json()
                if (data.product) {
                    setProduct(data.product)
                }
                if (data.relatedProducts) {
                    setRelatedProducts(data.relatedProducts)
                }
            } catch (error) {
                console.error('Failed to fetch product:', error)
            } finally {
                setLoading(false)
            }
        }
        if (productId) fetchProductData()
    }, [productId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900">Product not found</h1>
                    <Link href="/products" className="text-primary-600 hover:text-primary-700 font-semibold px-6 py-3 bg-white rounded-lg shadow-sm">
                        Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    const handleAddToCart = () => {
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="aspect-square bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : '/assets/cat-mobile-crane.png'}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[400px]"
                            />
                            {product.isCustomPart && (
                                <div className="absolute top-4 right-4 bg-accent-500 text-white px-4 py-2 rounded-full font-semibold shadow-md">
                                    Custom Part
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="text-sm text-gray-500 mb-2">{product.partNumber}</div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className="text-4xl font-bold text-primary-600">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                            {/* Specifications */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="font-medium text-gray-900">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <span className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                                    {product.category}
                                </span>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-2">Quantity</label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                        className="w-20 text-center border-2 border-gray-300 rounded-lg px-4 py-2 font-semibold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-primary-500 flex items-center justify-center transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {product.stock} available
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${addedToCart
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="h-6 w-6" />
                                        <span>Added to Cart!</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-6 w-6" />
                                        <span>Add to Cart</span>
                                    </>
                                )}
                            </button>

                            {/* Additional Info */}
                            {product.isCustomPart && (
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900 mb-1">Custom Part</h4>
                                        <p className="text-sm text-blue-700">
                                            This part is designed for customized machines. Please verify compatibility with your machine configuration.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-8">Related Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(relatedProduct => (
                            <Link
                                key={relatedProduct.id}
                                href={`/products/${relatedProduct.id}`}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="aspect-square bg-white p-4 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                    <img
                                        src={relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : '/assets/cat-mobile-crane.png'}
                                        alt={relatedProduct.name}
                                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {relatedProduct.name}
                                    </h3>
                                    <div className="text-lg font-bold text-primary-600">
                                        ₹{relatedProduct.price.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
