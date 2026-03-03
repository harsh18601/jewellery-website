import React from 'react'
import Link from 'next/link'
import { getProducts } from '@/actions/productActions'
import ProductGrid from '@/components/shop/ProductGrid'
import { fetchEntries } from '@/lib/contentful'
import { ShieldCheck, Truck, BadgeCheck, Gem } from 'lucide-react'

type CategoryOption = {
    label: string
    value: string
    subtitle?: string
    description?: string
    image?: string
}

type MetalOption = {
    label: string
    value: string
}

export default async function ShopPage({
    searchParams
}: {
    searchParams: {
        cat?: string
        search?: string
        sort?: string
        metal?: string
        price?: string
    }
}) {
    const { cat, search, sort, metal, price } = await searchParams
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

    const defaultCategoryOptions: CategoryOption[] = [
        { label: 'Rings', value: 'rings', subtitle: '', description: '', image: '' },
        { label: 'Earrings', value: 'earrings', subtitle: '', description: '', image: '' },
        { label: 'Necklaces', value: 'necklaces', subtitle: '', description: '', image: '' },
        { label: 'Fine Jewellery', value: 'fine-jewellery', subtitle: '', description: '', image: '' },
        { label: 'Bracelets', value: 'bracelets', subtitle: '', description: '', image: '' },
    ]

    const defaultMetalOptions: MetalOption[] = [
        { label: 'Yellow Gold', value: 'yellow-gold' },
        { label: 'White Gold', value: 'white-gold' },
        { label: 'Rose Gold', value: 'rose-gold' },
        { label: 'Platinum', value: 'platinum' },
        { label: 'Silver', value: 'silver' },
    ]

    const priceOptions = [
        { label: 'Rs 10,000 - Rs 25,000', value: '10000-25000' },
        { label: 'Rs 25,000 - Rs 50,000', value: '25000-50000' },
        { label: 'Rs 50,000+', value: '50000-plus' },
    ]

    const sortOptions = [
        { label: 'Popular', value: 'popular' },
        { label: 'Newest', value: 'new-arrivals' },
        { label: 'Price Low to High', value: 'price-low-high' },
        { label: 'Price High to Low', value: 'price-high-low' },
        { label: 'Best Selling', value: 'best-selling' },
        { label: 'Highest Rated', value: 'customer-rating' },
    ]

    const resolveText = (value: unknown): string => {
        if (typeof value === 'string') return value
        if (typeof value === 'number' || typeof value === 'boolean') return String(value)
        if (Array.isArray(value)) return value.map(resolveText).filter(Boolean).join(', ')
        if (!value || typeof value !== 'object') return ''
        const fields = (value as any).fields || {}
        return String(fields.name || fields.title || fields.label || fields.slug || '')
    }

    const resolveTextList = (value: unknown): string[] => {
        if (Array.isArray(value)) return value.map(resolveText).map((v) => v.trim()).filter(Boolean)
        const single = resolveText(value).trim()
        return single ? [single] : []
    }

    const getFieldValue = (fields: Record<string, any>, keys: string[]) => {
        for (const key of keys) {
            if (fields[key] !== undefined && fields[key] !== null) return fields[key]
        }
        return undefined
    }

    const toSlug = (value: string) =>
        value
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    const toLabelFromSlug = (value: string) =>
        value
            .split('-')
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')

    const getCategoryEmoji = (label: string) => {
        const normalized = label.toLowerCase()
        if (normalized.includes('ring')) return '💍'
        if (normalized.includes('diamond')) return '💎'
        if (normalized.includes('custom')) return '✨'
        if (normalized.includes('silver')) return '🪙'
        if (normalized.includes('necklace')) return '📿'
        if (normalized.includes('earring')) return '🪄'
        return '💠'
    }

    const buildShopHref = (next: { cat?: string, sort?: string, metal?: string, price?: string, search?: string, clearAll?: boolean }) => {
        const params = new URLSearchParams()
        if (next.clearAll) {
            if (search) params.set('search', search)
            const query = params.toString()
            return query ? `/shop?${query}` : '/shop'
        }

        const nextCat = next.cat !== undefined ? next.cat : cat
        const nextSort = next.sort !== undefined ? next.sort : sort
        const nextMetal = next.metal !== undefined ? next.metal : metal
        const nextPrice = next.price !== undefined ? next.price : price
        const nextSearch = next.search !== undefined ? next.search : search

        if (nextCat) params.set('cat', nextCat)
        if (nextSort) params.set('sort', nextSort)
        if (nextMetal) params.set('metal', nextMetal)
        if (nextPrice) params.set('price', nextPrice)
        if (nextSearch) params.set('search', nextSearch)

        const query = params.toString()
        return query ? `/shop?${query}` : '/shop'
    }

    const getPriceLabel = (value?: string) => priceOptions.find((option) => option.value === value)?.label || value || ''
    const getCategoryLabel = (value?: string) => categoryOptions.find((option) => option.value === value)?.label || value || ''

    const [productEntries, categoryEntries] = await Promise.all([
        fetchEntries('product') as Promise<any[]>,
        fetchEntries('category') as Promise<any[]>,
    ])

    let products = productEntries

    const cmsCategoryOptions: CategoryOption[] = (categoryEntries || []).map((entry: any) => {
        const slug = entry?.fields?.slug || normalizeCategory(entry?.fields?.name)
        return {
            label: entry?.fields?.name || 'Category',
            value: slug,
            subtitle: entry?.fields?.subtitle || '',
            description: entry?.fields?.description || '',
            image: entry?.fields?.image?.fields?.file?.url ? `https:${entry.fields.image.fields.file.url}` : '',
        }
    }).filter((entry: CategoryOption) => Boolean(entry.value))

    const categoryOptions: CategoryOption[] = cmsCategoryOptions.length > 0 ? cmsCategoryOptions : defaultCategoryOptions
    const selectedCategory = categoryOptions.find((option: CategoryOption) => option.value === cat)

    if (!products || products.length === 0) {
        const query = {
            ...(search ? { searchTerm: search } : {})
        }
        products = await getProducts(query)
    } else {
        products = products.map((item: any) => {
            const fields = item.fields || {}
            const categoryValue = getFieldValue(fields, ['category', 'categories'])
            const categoryList = resolveTextList(categoryValue)
            const metalType = resolveText(getFieldValue(fields, ['metalType', 'metal']))
            const stoneType = resolveText(getFieldValue(fields, ['stoneType', 'stoneShape']))
            const caratWeight = resolveText(getFieldValue(fields, ['totalCaratWeight', 'caratWeight', 'carat', 'carats']))
            const certificationType = resolveText(getFieldValue(fields, ['certificationType', 'certification']))
            const deliveryTime = resolveText(getFieldValue(fields, ['deliveryTime', 'deliveryDays']))
            const images = Array.isArray(fields.images)
                ? fields.images.map((img: any) => img?.fields?.file?.url ? `https:${img.fields.file.url}` : '').filter(Boolean)
                : []

            return {
                id: item.sys.id,
                title: resolveText(getFieldValue(fields, ['title'])),
                price: Number(getFieldValue(fields, ['price']) || 0),
                description: getFieldValue(fields, ['description']),
                images,
                stoneType,
                stoneShape: resolveText(getFieldValue(fields, ['stoneShape'])),
                isFeatured: Boolean(getFieldValue(fields, ['isFeatured'])),
                ratings: Number(getFieldValue(fields, ['ratings', 'rating']) || 0),
                slug: resolveText(getFieldValue(fields, ['slug'])),
                sku: resolveText(getFieldValue(fields, ['sku'])),
                category: categoryList[0] || '',
                categoryList,
                metal: metalType,
                metalType,
                metalPurity: resolveText(getFieldValue(fields, ['metalPurity'])),
                metalWeight: Number(getFieldValue(fields, ['metalWeight']) || 0),
                caratWeight,
                totalCaratWeight: caratWeight,
                certification: certificationType,
                certificationType,
                deliveryDays: deliveryTime,
                deliveryTime,
                compareAtPrice: Number(getFieldValue(fields, ['compareAtPrice', 'originalPrice', 'mrp']) || 0) || undefined,
                sales: Number(getFieldValue(fields, ['sales']) || 0),
                soldCount: Number(getFieldValue(fields, ['soldCount']) || 0),
                isNew: Boolean(getFieldValue(fields, ['isNew'])),
            }
        })
    }

    const cmsMetalMap = new Map<string, string>()
    products.forEach((product: any) => {
        const raw = resolveText(product?.metalType || product?.metal).trim()
        if (!raw) return
        const slug = toSlug(raw)
        if (!cmsMetalMap.has(slug)) {
            cmsMetalMap.set(slug, raw)
        }
    })
    const cmsMetalOptions: MetalOption[] = Array.from(cmsMetalMap.entries()).map(([slug, label]) => ({
        value: slug,
        label: label || toLabelFromSlug(slug),
    }))
    const metalOptions = cmsMetalOptions.length > 0 ? cmsMetalOptions : defaultMetalOptions
    const getMetalLabel = (value?: string) => metalOptions.find((option) => option.value === value)?.label || value || ''

    let filteredProducts = [...products]

    const categoryMatches = (product: any, optionValue: string, optionLabel?: string) => {
        const categoryPool = Array.isArray(product?.categoryList) && product.categoryList.length > 0
            ? product.categoryList
            : [product?.category]
        const normalizedPool = categoryPool.map((entry: any) => normalizeCategory(entry))
        if (normalizedPool.includes(optionValue)) return true

        const categoryText = toSearchableText(categoryPool)
        const optionFromValue = optionValue.replace(/-/g, ' ')
        const optionFromLabel = toSearchableText(optionLabel || '')
        return categoryText.includes(optionFromValue) || (optionFromLabel ? categoryText.includes(optionFromLabel) : false)
    }

    if (metal) {
        filteredProducts = filteredProducts.filter((p) => toSlug(resolveText(p.metalType || p.metal)) === metal)
    }

    if (price) {
        filteredProducts = filteredProducts.filter((p) => {
            const amount = Number(p.price || 0)
            if (price === '10000-25000') return amount >= 10000 && amount <= 25000
            if (price === '25000-50000') return amount >= 25000 && amount <= 50000
            if (price === '50000-plus') return amount >= 50000
            return true
        })
    }

    if (normalizedSearch) {
        filteredProducts = filteredProducts.filter(p =>
            toSearchableText(p.title).includes(normalizedSearch) ||
            toSearchableText(p.category).includes(normalizedSearch) ||
            toSearchableText(p.description).includes(normalizedSearch) ||
            toSearchableText(p.stoneType).includes(normalizedSearch)
        )
    }

    const categoryCounts = categoryOptions.reduce((acc: Record<string, number>, option: any) => {
        acc[option.value] = filteredProducts.filter((product: any) => categoryMatches(product, option.value, option.label)).length
        return acc
    }, {})

    if (cat) {
        const selected = categoryOptions.find((option: any) => option.value === cat)
        filteredProducts = filteredProducts.filter((p) => categoryMatches(p, cat, selected?.label))
    }

    if (sort === 'popular') {
        filteredProducts = [...filteredProducts].sort((a, b) => {
            const aScore = Number(a.sales || a.soldCount || 0) + Number(a.ratings || a.rating || 0)
            const bScore = Number(b.sales || b.soldCount || 0) + Number(b.ratings || b.rating || 0)
            return bScore - aScore
        })
    } else if (sort === 'price-low-high') {
        filteredProducts = [...filteredProducts].sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    } else if (sort === 'price-high-low') {
        filteredProducts = [...filteredProducts].sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    } else if (sort === 'best-selling') {
        filteredProducts = [...filteredProducts].sort((a, b) => Number(b.sales || b.soldCount || 0) - Number(a.sales || a.soldCount || 0))
    } else if (sort === 'customer-rating') {
        filteredProducts = [...filteredProducts].sort((a, b) => Number(b.ratings || b.rating || 0) - Number(a.ratings || a.rating || 0))
    } else {
        filteredProducts = [...filteredProducts].sort((a, b) => {
            const aDate = new Date(a.createdAt || a.sys?.createdAt || 0).getTime()
            const bDate = new Date(b.createdAt || b.sys?.createdAt || 0).getTime()
            return bDate - aDate
        })
    }

    const emptyMessage = "No jewellery found. Try adjusting filters."
    const totalResults = filteredProducts.length
    const recommendedProducts = [...products]
        .sort((a: any, b: any) => {
            const aScore = (a.isFeatured ? 2 : 0) + Number(a.ratings || a.rating || 0)
            const bScore = (b.isFeatured ? 2 : 0) + Number(b.ratings || b.rating || 0)
            return bScore - aScore
        })
        .slice(0, 4)

    return (
        <>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6 border-b border-primary/10 pb-5">
                <h1 className="text-4xl font-bold tracking-tighter mb-2 gold-text">Our Collections</h1>
                <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-bold mb-1.5">Shop Our Collection</p>
                <p className="text-muted-foreground font-serif italic text-sm">
                    {selectedCategory?.description || selectedCategory?.subtitle || 'Exquisite craftsmanship for the refined taste.'}
                </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2.5">
                <Link
                    href={buildShopHref({ cat: '' })}
                    className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold border transition-all ${!cat ? 'bg-gradient-to-r from-primary to-primary/85 text-black border-primary shadow-[0_0_18px_rgba(201,162,39,0.35)]' : 'border-primary/35 hover:border-primary/70 hover:shadow-[0_0_10px_rgba(201,162,39,0.12)]'}`}
                >
                    All ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
                </Link>
                {categoryOptions.map((option) => (
                    <Link
                        key={option.value}
                        href={buildShopHref({ cat: option.value })}
                        className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold border transition-all inline-flex items-center gap-2 ${cat === option.value ? 'bg-gradient-to-r from-primary to-primary/85 text-black border-primary shadow-[0_0_18px_rgba(201,162,39,0.35)]' : 'border-primary/35 hover:border-primary/70 hover:shadow-[0_0_10px_rgba(201,162,39,0.12)]'}`}
                    >
                        {option.image
                            ? <img src={option.image} alt={option.label} className="h-6 w-6 rounded-full object-cover border border-primary/30" />
                            : <span className="text-sm leading-none">{getCategoryEmoji(option.label)}</span>}
                        {option.label} ({categoryCounts[option.value] || 0})
                    </Link>
                ))}
            </div>

            <div className="mb-3 bg-muted/10 border border-primary/20 px-4 py-3 overflow-hidden">
                <div className="trust-marquee">
                    <div className="trust-marquee-track text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
                        <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free Shipping Across India</span>
                        <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> BIS Hallmarked Jewellery</span>
                        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Certified Diamonds</span>
                        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure Checkout</span>
                    </div>
                    <div className="trust-marquee-track trust-marquee-track-alt text-[11px] uppercase tracking-widest text-muted-foreground font-bold" aria-hidden="true">
                        <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free Shipping Across India</span>
                        <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> BIS Hallmarked Jewellery</span>
                        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Certified Diamonds</span>
                        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure Checkout</span>
                    </div>
                </div>
            </div>

            <details className="lg:hidden mb-4 border border-primary/20 bg-muted/5 px-4 py-3">
                <summary className="text-xs uppercase tracking-widest font-bold cursor-pointer">Filters</summary>
                <div className="mt-4 space-y-5">
                    <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Price Range</p>
                        <div className="flex flex-wrap gap-2">
                            {priceOptions.map((option) => (
                                <Link
                                    key={option.value}
                                    href={buildShopHref({ price: option.value })}
                                    className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${price === option.value ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/30 hover:border-primary/65'}`}
                                >
                                    {option.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Metal Type</p>
                        <div className="flex flex-wrap gap-2">
                            {metalOptions.map((option) => (
                                <Link
                                    key={option.value}
                                    href={buildShopHref({ metal: option.value })}
                                    className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${metal === option.value ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/30 hover:border-primary/65'}`}
                                >
                                    {option.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Link href={buildShopHref({ clearAll: true })} className="inline-block text-[10px] uppercase tracking-widest font-bold border-b border-primary/40">
                        Clear Filters
                    </Link>
                </div>
            </details>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                <aside className="hidden lg:block lg:sticky lg:top-24 lg:h-fit bg-muted/5 border border-primary/15 p-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm uppercase tracking-widest font-bold">Filters</h2>
                        <Link
                            href={buildShopHref({ clearAll: true })}
                            className="text-[10px] uppercase tracking-widest font-bold border-b border-primary/35 hover:border-primary text-muted-foreground hover:text-primary transition-colors"
                        >
                            Reset
                        </Link>
                    </div>

                    <div className="space-y-3 pt-1 border-t border-primary/10">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Price Range</p>
                        <div className="flex flex-wrap gap-2.5">
                            {priceOptions.map((option) => (
                                <Link
                                    key={option.value}
                                    href={buildShopHref({ price: option.value })}
                                    className={`px-3.5 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${price === option.value ? 'border-primary bg-primary text-black shadow-[0_0_14px_rgba(201,162,39,0.25)]' : 'border-primary/30 hover:border-primary/65 hover:shadow-[0_0_12px_rgba(201,162,39,0.14)]'}`}
                                >
                                    {option.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-primary/10">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Metal Type</p>
                        <div className="flex flex-wrap gap-2.5">
                            {metalOptions.map((option) => (
                                <Link
                                    key={option.value}
                                    href={buildShopHref({ metal: option.value })}
                                    className={`px-3.5 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${metal === option.value ? 'border-primary bg-primary text-black shadow-[0_0_14px_rgba(201,162,39,0.25)]' : 'border-primary/30 hover:border-primary/65 hover:shadow-[0_0_12px_rgba(201,162,39,0.14)]'}`}
                                >
                                    {option.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="lg:border-l lg:border-primary/15 lg:pl-6">
                    <div className="relative z-30 mb-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-background/90 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                            {totalResults === 0 ? '0 Results Found' : `Showing ${totalResults} of ${products.length} designs`}
                        </p>
                        <div className="flex items-center gap-2">
                            <Link
                                href={buildShopHref({ clearAll: true })}
                                className="h-9 px-3 inline-flex items-center text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60 transition-colors"
                            >
                                Reset Filters
                            </Link>
                            <form method="get" className="flex items-center gap-2">
                            {cat ? <input type="hidden" name="cat" value={cat} /> : null}
                            {metal ? <input type="hidden" name="metal" value={metal} /> : null}
                            {price ? <input type="hidden" name="price" value={price} /> : null}
                            {search ? <input type="hidden" name="search" value={search} /> : null}
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Sort By</label>
                            <select
                                name="sort"
                                defaultValue={sort || 'new-arrivals'}
                                disabled={totalResults === 0}
                                className={`h-9 px-3 text-[10px] uppercase tracking-widest font-bold border border-primary/30 bg-background text-foreground focus:border-primary outline-none ${totalResults === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-white text-black">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={totalResults === 0}
                                className={`h-9 px-3 text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60 transition-colors ${totalResults === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Apply
                            </button>
                            </form>
                        </div>
                    </div>
                    {(cat || metal || price || normalizedSearch) && (
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mr-1">Filters Applied:</span>
                            {cat && (
                                <Link
                                    href={buildShopHref({ cat: '' })}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
                                >
                                    Category: {getCategoryLabel(cat)} x
                                </Link>
                            )}
                            {price && (
                                <Link
                                    href={buildShopHref({ price: '' })}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
                                >
                                    Price: {getPriceLabel(price)} x
                                </Link>
                            )}
                            {metal && (
                                <Link
                                    href={buildShopHref({ metal: '' })}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
                                >
                                    Metal: {getMetalLabel(metal)} x
                                </Link>
                            )}
                            {normalizedSearch && (
                                <Link
                                    href={buildShopHref({ search: '' })}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
                                >
                                    Search: {search} x
                                </Link>
                            )}
                        </div>
                    )}

                    {totalResults > 0 ? (
                        <ProductGrid products={filteredProducts} emptyMessage={emptyMessage} />
                    ) : (
                        <div className="space-y-8">
                            <div className="border border-primary/15 bg-muted/5 px-6 py-12 text-center">
                                <div className="mx-auto max-w-3xl text-center">
                                <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                                    <Gem className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold gold-text mb-2 !text-center">No Designs Match Your Filters</h3>
                                <p className="text-sm text-muted-foreground font-serif italic mb-6">
                                    Try removing some filters or explore our collections.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3 mb-6">
                                    <Link
                                        href={buildShopHref({ clearAll: true })}
                                        className="px-5 py-3 text-xs uppercase tracking-widest font-bold border border-primary/40 hover:border-primary/70"
                                    >
                                        Clear Filters
                                    </Link>
                                    <Link
                                        href="/shop"
                                        className="px-5 py-3 text-xs uppercase tracking-widest font-bold bg-primary text-black border border-primary"
                                    >
                                        View All Jewellery
                                    </Link>
                                </div>
                                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Popular Categories</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {categoryOptions.slice(0, 4).map((option) => (
                                        <Link
                                            key={option.value}
                                            href={buildShopHref({ cat: option.value, price: '', metal: '' })}
                                            className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-primary/25 hover:border-primary/60"
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                </div>
                                </div>
                            </div>
                            {recommendedProducts.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-lg font-bold uppercase tracking-widest">You may also like</h4>
                                    <ProductGrid products={recommendedProducts} />
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
        </>
    )
}
