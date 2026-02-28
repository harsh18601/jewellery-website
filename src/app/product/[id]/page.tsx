import React from 'react'
import { notFound } from 'next/navigation'
import { getProductById } from '@/actions/productActions'
import { contentfulClient } from '@/lib/contentful'
import ProductDetailClient from '@/components/shop/ProductDetailClient'

export default async function ProductPage({ params }: { params: { id: string } }) {
    const { id } = await params
    let product: any = null

    try {
        // Try fetching from Contentful first
        const entry = await contentfulClient.getEntry(id)
        if (entry) {
            product = {
                id: entry.sys.id,
                ...entry.fields,
                images: (entry.fields.images as any[])?.map((img: any) => img.fields?.file?.url ? `https:${img.fields.file.url}` : '') || []
            }
        }
    } catch (error) {
        // Fallback to DB
        product = await getProductById(id)
    }

    if (!product) {
        return notFound()
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ProductDetailClient product={product} />
        </div>
    )
}
