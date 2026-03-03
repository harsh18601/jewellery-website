import React from 'react'
import { notFound } from 'next/navigation'
import { getProductById, getProducts } from '@/actions/productActions'
import { contentfulClient } from '@/lib/contentful'
import ProductDetailClient from '@/components/shop/ProductDetailClient'

const resolveText = (value: any): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) return value.map(resolveText).filter(Boolean).join(', ')
    if (!value || typeof value !== 'object') return ''
    const fields = value.fields || {}
    return String(
        fields.name ||
        fields.title ||
        fields.label ||
        fields.slug ||
        ''
    )
}

const resolveTextList = (value: any): string[] => {
    if (Array.isArray(value)) return value.map(resolveText).map((v) => v.trim()).filter(Boolean)
    const single = resolveText(value).trim()
    return single ? [single] : []
}

const resolveImageUrl = (asset: any): string => {
    const raw = asset?.fields?.file?.url || ''
    if (!raw) return ''
    return raw.startsWith('http') ? raw : `https:${raw}`
}

const getFieldValue = (fields: Record<string, any>, keys: string[]) => {
    for (const key of keys) {
        if (fields[key] !== undefined && fields[key] !== null) return fields[key]
    }
    return undefined
}

const mapContentfulProduct = (entry: any) => {
    const fields = entry?.fields || {}
    const categoryValue = getFieldValue(fields, ['category', 'categories'])
    const categoryList = resolveTextList(categoryValue)
    const metalType = resolveText(getFieldValue(fields, ['metalType', 'metal']))
    const stoneType = resolveText(getFieldValue(fields, ['stoneType', 'stoneShape']))
    const caratWeight = resolveText(getFieldValue(fields, ['totalCaratWeight', 'caratWeight', 'carat', 'carats']))
    const certificationType = resolveText(getFieldValue(fields, ['certificationType', 'certification']))
    const deliveryTime = resolveText(getFieldValue(fields, ['deliveryTime', 'deliveryDays']))
    return {
        id: entry?.sys?.id || '',
        title: resolveText(getFieldValue(fields, ['title'])),
        price: Number(getFieldValue(fields, ['price']) || 0),
        category: categoryList[0] || '',
        categoryList,
        description: getFieldValue(fields, ['description']),
        images: Array.isArray(fields.images) ? fields.images.map(resolveImageUrl).filter(Boolean) : [],
        stoneType,
        stoneShape: resolveText(getFieldValue(fields, ['stoneShape'])),
        metal: metalType,
        metalType,
        metalPurity: resolveText(getFieldValue(fields, ['metalPurity'])),
        metalWeight: Number(getFieldValue(fields, ['metalWeight']) || 0),
        ratings: Number(getFieldValue(fields, ['ratings', 'rating']) || 0),
        isFeatured: Boolean(getFieldValue(fields, ['isFeatured'])),
        certification: certificationType,
        certificationType,
        deliveryDays: deliveryTime,
        deliveryTime,
        compareAtPrice: Number(getFieldValue(fields, ['compareAtPrice', 'originalPrice', 'mrp']) || 0) || undefined,
        emiMonthly: Number(getFieldValue(fields, ['emiMonthly']) || 0) || undefined,
        caratWeight,
        totalCaratWeight: caratWeight,
        isNew: Boolean(getFieldValue(fields, ['isNew'])),
        soldCount: Number(getFieldValue(fields, ['soldCount']) || 0),
        sales: Number(getFieldValue(fields, ['sales']) || 0),
        slug: resolveText(getFieldValue(fields, ['slug'])),
        sku: resolveText(getFieldValue(fields, ['sku'])),
        tagline: resolveText(getFieldValue(fields, ['tagline'])),
    }
}

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
                product = mapContentfulProduct(entry)

                const entries = await contentfulClient.getEntries({ content_type: 'product', limit: 200 })
                allProducts = entries.items.map((item: any) => mapContentfulProduct(item))
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
