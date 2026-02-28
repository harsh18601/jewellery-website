import React from 'react'
import Link from 'next/link'
import { getProducts } from '@/actions/productActions'
import ProductGrid from '@/components/shop/ProductGrid'
import { fetchEntries } from '@/lib/contentful'

export default async function ShopPage({ searchParams }: { searchParams: { cat?: string, search?: string } }) {
    const { cat, search } = await searchParams

    // Fetch from Contentful
    let products = await fetchEntries('product') as any[]

    // Fallback to DB if Contentful is empty or errored
    if (!products || products.length === 0) {
        const query = {
            ...(cat ? { category: cat } : {}),
            ...(search ? { searchTerm: search } : {})
        }
        products = await getProducts(query)
    } else {
        // Map Contentful data to match our Product interface if needed
        products = products.map(item => ({
            id: item.sys.id,
            ...item.fields,
            images: item.fields.images?.map((img: any) => img.fields?.file?.url ? `https:${img.fields.file.url}` : '') || []
        }))

        // Filter if needed
        if (cat) {
            products = products.filter(p => p.category?.toLowerCase() === cat.toLowerCase())
        }
        if (search) {
            products = products.filter(p =>
                p.title?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase())
            )
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-primary/10 pb-8">
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">Our Collections</h1>
                    <p className="text-muted-foreground font-serif italic text-sm">Exquisite craftsmanship for the refined taste.</p>
                </div>

                <div className="flex flex-wrap gap-6 mt-6 md:mt-0 text-xs uppercase tracking-widest font-bold">
                    <Link href="/shop" className={`cursor-pointer hover:text-primary transition-colors border-b-2 ${!cat ? 'border-primary' : 'border-transparent'}`}>All</Link>
                    <Link href="/shop?cat=lab-grown" className={`cursor-pointer hover:text-primary transition-colors border-b-2 ${cat === 'lab-grown' ? 'border-primary' : 'border-transparent'}`}>Lab-Grown</Link>
                    <Link href="/shop?cat=silver" className={`cursor-pointer hover:text-primary transition-colors border-b-2 ${cat === 'silver' ? 'border-primary' : 'border-transparent'}`}>Silver</Link>
                    <Link href="/shop?cat=custom" className={`cursor-pointer hover:text-primary transition-colors border-b-2 ${cat === 'custom' ? 'border-primary' : 'border-transparent'}`}>Custom</Link>
                </div>
            </div>

            <ProductGrid products={products} />
        </div>
    )
}
