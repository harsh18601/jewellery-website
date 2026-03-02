import React from 'react'
import Link from 'next/link'
import { getProducts } from '@/actions/productActions'
import ProductGrid from '@/components/shop/ProductGrid'
import { fetchEntries } from '@/lib/contentful'

export default async function ShopPage({ searchParams }: { searchParams: { cat?: string, search?: string, shape?: string } }) {
    const { cat, search, shape } = await searchParams
    const normalizedSearch = search?.trim().toLowerCase() || ''
    const toSearchableText = (value: unknown): string => {
        if (typeof value === 'string') return value.toLowerCase()
        if (typeof value === 'number' || typeof value === 'boolean') return String(value).toLowerCase()
        if (Array.isArray(value)) return value.map(toSearchableText).join(' ')
        if (value && typeof value === 'object') {
            try {
                return JSON.stringify(value).toLowerCase()
            } catch {
                return ''
            }
        }
        return ''
    }
    const normalizeCategory = (value: unknown): string =>
        toSearchableText(value)
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    const categoryOptions = [
        { label: 'Rings', value: 'rings' },
        { label: 'Earrings', value: 'earrings' },
        { label: 'Necklace', value: 'necklace' },
        { label: 'Fine Jewellery', value: 'fine-jewellery' },
        { label: 'Bracelets', value: 'bracelets' },
    ]

    const shapeOptions = [
        { label: 'Round', value: 'round', icon: 'round' },
        { label: 'Oval', value: 'oval', icon: 'oval' },
        { label: 'Cushion', value: 'cushion', icon: 'cushion' },
        { label: 'Pear', value: 'pear', icon: 'pear' },
        { label: 'Emerald', value: 'emerald', icon: 'emerald' },
        { label: 'Radiant', value: 'radiant', icon: 'radiant' },
        { label: 'Princess', value: 'princess', icon: 'princess' },
        { label: 'All Shapes', value: '' as const, icon: 'all' },
    ]

    const renderShapeIcon = (shape: string, isActive: boolean) => {
        const iconClass = isActive ? 'text-primary' : 'text-foreground/80'
        switch (shape) {
            case 'round':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="7" /><path d="M12 5v14M5 12h14M7.5 7.5l9 9M16.5 7.5l-9 9" /></svg>
            case 'oval':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="12" cy="12" rx="5.5" ry="8" /><path d="M12 4v16M8 12h8" /></svg>
            case 'cushion':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="5" width="14" height="14" rx="4" /><path d="M12 5v14M5 12h14M7 7l10 10M17 7L7 17" /></svg>
            case 'pear':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4c2.5 2.8 4.2 4.8 4.2 8a4.2 4.2 0 1 1-8.4 0c0-3.2 1.7-5.2 4.2-8Z" /><path d="M12 8v8" /></svg>
            case 'emerald':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="4.5" width="12" height="15" rx="2" /><rect x="8.5" y="7" width="7" height="10" rx="1" /></svg>
            case 'radiant':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="6" width="12" height="12" rx="2.5" transform="rotate(45 12 12)" /><path d="M12 6v12M6 12h12" /></svg>
            case 'princess':
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="6" width="12" height="12" /><path d="M6 6l12 12M18 6L6 18M12 6v12M6 12h12" /></svg>
            default:
                return <svg viewBox="0 0 24 24" className={`h-6 w-6 ${iconClass}`} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><circle cx="8" cy="16" r="3" /><circle cx="16" cy="16" r="3" /></svg>
        }
    }

    const buildShopHref = (next: { cat?: string, shape?: string }) => {
        const params = new URLSearchParams()
        const nextCat = next.cat !== undefined ? next.cat : cat
        const nextShape = next.shape !== undefined ? next.shape : shape
        if (nextCat) params.set('cat', nextCat)
        if (nextShape) params.set('shape', nextShape)
        if (search) params.set('search', search)
        const query = params.toString()
        return query ? `/shop?${query}` : '/shop'
    }

    // Fetch from Contentful
    let products = await fetchEntries('product') as any[]

    // Fallback to DB if Contentful is empty or errored
    if (!products || products.length === 0) {
        const query = {
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
    }

    // Filter if needed
    if (cat) {
        const normalizedCat = normalizeCategory(cat)
        products = products.filter((p) => normalizeCategory(p.category) === normalizedCat)
    }
    if (shape) {
        const normalizedShape = shape.toLowerCase()
        products = products.filter((p) =>
            toSearchableText(p.stoneType).includes(normalizedShape) ||
            toSearchableText(p.title).includes(normalizedShape)
        )
    }
    if (normalizedSearch) {
        products = products.filter(p =>
            toSearchableText(p.title).includes(normalizedSearch) ||
            toSearchableText(p.category).includes(normalizedSearch) ||
            toSearchableText(p.description).includes(normalizedSearch) ||
            toSearchableText(p.stoneType).includes(normalizedSearch)
        )
    }

    const emptyMessage = normalizedSearch ? "No search result found" : "No products available."
    const isNoSearchResults = normalizedSearch.length > 0 && products.length === 0

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {!isNoSearchResults && (
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-primary/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter mb-2 gold-text">Our Collections</h1>
                        <p className="text-muted-foreground font-serif italic text-sm">Exquisite craftsmanship for the refined taste.</p>
                    </div>

                    <div className="flex flex-wrap gap-6 mt-6 md:mt-0 text-xs uppercase tracking-widest font-bold">
                        <Link href={buildShopHref({ cat: '' })} className={`cursor-pointer hover:text-primary transition-colors border-b-2 ${!cat ? 'border-primary' : 'border-transparent'}`}>All</Link>
                        {categoryOptions.map((option) => (
                            <Link
                                key={option.value}
                                href={buildShopHref({ cat: option.value })}
                                className={`cursor-pointer hover:text-primary transition-colors border-b-2 ${cat === option.value ? 'border-primary' : 'border-transparent'}`}
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {!isNoSearchResults && (
                <div className="mb-12 p-6 md:p-8 border border-primary/15 bg-muted/5">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-bold mb-6">Filter by diamond shape</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                        {shapeOptions.map((shapeOption) => {
                            const isActive = (shape || '') === shapeOption.value
                            return (
                                <Link
                                    key={`${shapeOption.label}-${shapeOption.value || 'all'}`}
                                    href={buildShopHref({ shape: shapeOption.value })}
                                    className={`min-h-24 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${isActive ? 'border-primary text-primary bg-primary/5' : 'border-primary/20 text-foreground/80 hover:border-primary/50'}`}
                                >
                                    <span>{renderShapeIcon(shapeOption.icon, isActive)}</span>
                                    <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-center">{shapeOption.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            <ProductGrid products={products} emptyMessage={emptyMessage} />
        </div>
    )
}
