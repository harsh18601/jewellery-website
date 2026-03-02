import React from 'react'
import { notFound } from 'next/navigation'
import { getProductById, getProducts } from '@/actions/productActions'
import { contentfulClient } from '@/lib/contentful'
import ProductDetailClient from '@/components/shop/ProductDetailClient'

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    let product: any = null
    let allProducts: any[] = []
    let isContentfulProduct = false

    try {
        // Try fetching from Contentful first
        if (contentfulClient) {
            const entry = await contentfulClient.getEntry(id)
            if (entry) {
                isContentfulProduct = true
                product = {
                    id: entry.sys.id,
                    ...entry.fields,
                    images: (entry.fields.images as any[])?.map((img: any) => img.fields?.file?.url ? `https:${img.fields.file.url}` : '') || []
                }

                const entries = await contentfulClient.getEntries({ content_type: 'product', limit: 200 })
                allProducts = entries.items.map((item: any) => ({
                    id: item.sys.id,
                    ...item.fields,
                    images: (item.fields.images as any[])?.map((img: any) => img.fields?.file?.url ? `https:${img.fields.file.url}` : '') || []
                }))
            }
        }
    } catch {
        // Fallback to DB
        product = await getProductById(id)
    }

    if (!isContentfulProduct && product) {
        allProducts = await getProducts()
    }

    if (!product) {
        return notFound()
    }

    const currentId = String(product.id || product._id || '')
    const currentPrice = Number(product.price || 0)
    const currentCategory = String(product.category || '').toLowerCase()
    const currentMetal = String(product.metal || '').toLowerCase()

    const relatedProducts = allProducts
        .filter((item) => String(item.id || item._id) !== currentId)
        .map((item) => {
            const category = String(item.category || '').toLowerCase()
            const metal = String(item.metal || '').toLowerCase()
            const price = Number(item.price || 0)
            const priceDelta = Math.abs(price - currentPrice)
            const inSamePriceRange = currentPrice > 0 ? priceDelta <= currentPrice * 0.2 : false

            let score = 0
            if (category && category === currentCategory) score += 3
            if (currentCategory.includes('ring') && category.includes('ring')) score += 2
            if (metal && currentMetal && metal === currentMetal) score += 2
            if (inSamePriceRange) score += 1

            return { ...item, __score: score, __priceDelta: priceDelta }
        })
        .sort((a, b) => {
            if (b.__score !== a.__score) return b.__score - a.__score
            return a.__priceDelta - b.__priceDelta
        })
        .slice(0, 4)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </div>
    )
}
