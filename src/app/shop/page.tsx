import React from 'react'
import Link from 'next/link'
import { getProducts } from '@/actions/productActions'
import ProductGrid from '@/components/shop/ProductGrid'
import VisibleResultsCount from '@/components/shop/VisibleResultsCount'
import CurrencyPriceText from '@/components/shop/CurrencyPriceText'
import BackButton from '@/components/common/BackButton'
import { fetchEntries } from '@/lib/contentful'
import { ShieldCheck, Truck, BadgeCheck, Gem, ChevronDown, SlidersHorizontal } from 'lucide-react'

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
        stone?: string
        price?: string
        max?: string
    }
}) {
    const { cat, search, sort, metal, stone, price, max } = await searchParams
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
    const defaultStoneOptions: MetalOption[] = [
        { label: 'Round', value: 'round' },
        { label: 'Oval', value: 'oval' },
        { label: 'Cushion', value: 'cushion' },
        { label: 'Pear', value: 'pear' },
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

    const buildShopHref = (next: { cat?: string, sort?: string, metal?: string, stone?: string, price?: string, max?: string, search?: string, clearAll?: boolean }) => {
        const params = new URLSearchParams()
        if (next.clearAll) {
            if (search) params.set('search', search)
            const query = params.toString()
            return query ? `/shop?${query}` : '/shop'
        }

        const nextCat = next.cat !== undefined ? next.cat : cat
        const nextSort = next.sort !== undefined ? next.sort : sort
        const nextMetal = next.metal !== undefined ? next.metal : metal
        const nextStone = next.stone !== undefined ? next.stone : stone
        const nextPrice = next.price !== undefined ? next.price : price
        const nextMax = next.max !== undefined ? next.max : max
        const nextSearch = next.search !== undefined ? next.search : search

        if (nextCat) params.set('cat', nextCat)
        if (nextSort) params.set('sort', nextSort)
        if (nextMetal) params.set('metal', nextMetal)
        if (nextStone) params.set('stone', nextStone)
        if (nextPrice) params.set('price', nextPrice)
        if (nextMax) params.set('max', nextMax)
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
    const cmsStoneMap = new Map<string, string>()
    products.forEach((product: any) => {
        const raw = resolveText(product?.stoneShape || product?.stoneType).trim()
        if (!raw) return
        const slug = toSlug(raw)
        if (!cmsStoneMap.has(slug)) cmsStoneMap.set(slug, raw)
    })
    const cmsStoneOptions: MetalOption[] = Array.from(cmsStoneMap.entries()).map(([slug, label]) => ({
        value: slug,
        label: label || toLabelFromSlug(slug),
    }))
    const stoneOptions = cmsStoneOptions.length > 0 ? cmsStoneOptions : defaultStoneOptions
    const getStoneLabel = (value?: string) => stoneOptions.find((option) => option.value === value)?.label || value || ''
    const maxProductPrice = Math.max(50000, ...products.map((p: any) => Number(p.price || 0)))
    const selectedMaxPrice = Math.max(10000, Math.min(maxProductPrice, Number(max || maxProductPrice)))

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

    if (stone) {
        filteredProducts = filteredProducts.filter((p) => toSlug(resolveText(p.stoneShape || p.stoneType)) === stone)
    }

    if (max) {
        const maxPrice = Number(max)
        if (Number.isFinite(maxPrice) && maxPrice > 0) {
            filteredProducts = filteredProducts.filter((p) => Number(p.price || 0) <= maxPrice)
        }
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
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 sm:pb-10">
            <div className="mb-4">
                <BackButton fallbackHref="/" />
            </div>

            <div className="mb-6">
                <div className="overflow-x-auto no-scrollbar pb-2">
                <div className="inline-flex min-w-max items-center gap-3">
                    <Link
                        href={buildShopHref({ cat: '' })}
                        className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs uppercase tracking-widest font-bold border transition-all ${!cat ? 'bg-gradient-to-r from-primary to-primary/90 text-black border-primary shadow-[0_0_24px_rgba(201,162,39,0.45)]' : 'border-primary/35 hover:border-primary/70 hover:shadow-[0_0_10px_rgba(201,162,39,0.12)]'}`}
                    >
                        All ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
                    </Link>
                    {categoryOptions.map((option) => (
                        <Link
                            key={option.value}
                            href={buildShopHref({ cat: option.value })}
                            className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs uppercase tracking-widest font-bold border transition-all inline-flex items-center gap-2 sm:gap-2.5 ${cat === option.value ? 'bg-gradient-to-r from-primary to-primary/90 text-black border-primary shadow-[0_0_24px_rgba(201,162,39,0.45)]' : 'border-primary/35 hover:border-primary/70 hover:shadow-[0_0_10px_rgba(201,162,39,0.12)]'}`}
                        >
                            {option.image
                                ? <img src={option.image} alt={option.label} className="h-5 w-5 sm:h-7 sm:w-7 rounded-full object-cover border border-primary/30" />
                                : <span className="h-5 w-5 sm:h-7 sm:w-7 rounded-full border border-primary/30 inline-flex items-center justify-center text-[10px] font-bold">{option.label.charAt(0)}</span>}
                            {option.label} ({categoryCounts[option.value] || 0})
                        </Link>
                    ))}
                </div>
                </div>
            </div>

            <div className="mb-4 bg-muted/10 border border-primary/20 px-4 py-3.5">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
                    <span className="inline-flex items-center gap-2.5"><BadgeCheck className="h-4 w-4 text-primary" /> BIS Hallmarked</span>
                    <span className="inline-flex items-center gap-2.5"><Truck className="h-4 w-4 text-primary" /> Free Shipping</span>
                    <span className="inline-flex items-center gap-2.5"><Gem className="h-4 w-4 text-primary" /> Certified Diamonds</span>
                    <span className="inline-flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-primary" /> Secure Checkout</span>
                </div>
            </div>

            <details id="shop-mobile-filters" className="lg:hidden mb-4 border border-primary/20 bg-muted/5 px-4 py-3">
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
                    <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Stone Type</p>
                        <div className="flex flex-wrap gap-2">
                            {stoneOptions.map((option) => (
                                <Link
                                    key={option.value}
                                    href={buildShopHref({ stone: option.value })}
                                    className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${stone === option.value ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/30 hover:border-primary/65'}`}
                                >
                                    {option.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <form method="get" className="space-y-2 border-t border-primary/10 pt-4">
                        {cat ? <input type="hidden" name="cat" value={cat} /> : null}
                        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
                        {metal ? <input type="hidden" name="metal" value={metal} /> : null}
                        {stone ? <input type="hidden" name="stone" value={stone} /> : null}
                        {price ? <input type="hidden" name="price" value={price} /> : null}
                        {search ? <input type="hidden" name="search" value={search} /> : null}
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Max Price: <CurrencyPriceText amountInInr={selectedMaxPrice} /></p>
                        <input type="range" name="max" min="10000" max={maxProductPrice} step="5000" defaultValue={selectedMaxPrice} className="w-full accent-[var(--color-primary)]" />
                        <button type="submit" className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60">
                            Apply Max Price
                        </button>
                    </form>
                    <Link href={buildShopHref({ clearAll: true })} className="inline-block text-[10px] uppercase tracking-widest font-bold border-b border-primary/40">
                        Clear Filters
                    </Link>
                </div>
            </details>
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-0 border-t border-primary/30 bg-background/95 backdrop-blur">
                <a href="#shop-mobile-filters" className="h-14 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 border-r border-primary/25">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </a>
                <a href="#shop-sort-controls" className="h-14 bg-background text-foreground text-[10px] uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Sort
                </a>
            </div>

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
                    <div className="space-y-3 pt-3 border-t border-primary/10">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Stone Type</p>
                        <div className="flex flex-wrap gap-2.5">
                            {stoneOptions.map((option) => (
                                <Link
                                    key={option.value}
                                    href={buildShopHref({ stone: option.value })}
                                    className={`px-3.5 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${stone === option.value ? 'border-primary bg-primary text-black shadow-[0_0_14px_rgba(201,162,39,0.25)]' : 'border-primary/30 hover:border-primary/65 hover:shadow-[0_0_12px_rgba(201,162,39,0.14)]'}`}
                                >
                                    {option.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <form method="get" className="space-y-2 pt-3 border-t border-primary/10">
                        {cat ? <input type="hidden" name="cat" value={cat} /> : null}
                        {sort ? <input type="hidden" name="sort" value={sort} /> : null}
                        {metal ? <input type="hidden" name="metal" value={metal} /> : null}
                        {stone ? <input type="hidden" name="stone" value={stone} /> : null}
                        {price ? <input type="hidden" name="price" value={price} /> : null}
                        {search ? <input type="hidden" name="search" value={search} /> : null}
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Max Price: <CurrencyPriceText amountInInr={selectedMaxPrice} /></p>
                        <input type="range" name="max" min="10000" max={maxProductPrice} step="5000" defaultValue={selectedMaxPrice} className="w-full accent-[var(--color-primary)]" />
                        <button type="submit" className="w-full px-3 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60">
                            Apply Max Price
                        </button>
                    </form>
                </aside>

                <main className="lg:border-l lg:border-primary/15 lg:pl-6">
                    <div id="shop-sort-controls" className="relative z-30 mb-2.5 grid grid-cols-1 xl:grid-cols-[auto_1fr_auto] items-center gap-2.5 bg-background/90 backdrop-blur-sm">
                        <div className="hidden xl:flex items-center">
                            <Link
                                href={buildShopHref({ clearAll: true })}
                                className="h-9 px-3 inline-flex items-center text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60 transition-colors"
                            >
                                Filters: Reset
                            </Link>
                        </div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold xl:text-center">
                            <VisibleResultsCount total={totalResults} />
                        </p>
                        <form method="get" className="sm:hidden flex items-center gap-2">
                            {cat ? <input type="hidden" name="cat" value={cat} /> : null}
                            {metal ? <input type="hidden" name="metal" value={metal} /> : null}
                            {stone ? <input type="hidden" name="stone" value={stone} /> : null}
                            {price ? <input type="hidden" name="price" value={price} /> : null}
                            {max ? <input type="hidden" name="max" value={max} /> : null}
                            {search ? <input type="hidden" name="search" value={search} /> : null}
                            <div className={`relative flex-1 ${totalResults === 0 ? 'opacity-50' : ''}`}>
                                <select
                                    name="sort"
                                    defaultValue={sort || 'new-arrivals'}
                                    disabled={totalResults === 0}
                                    style={{ colorScheme: 'dark' }}
                                    className={`h-10 w-full appearance-none pl-3.5 pr-10 text-[10px] uppercase tracking-widest font-bold border border-primary/30 bg-background text-foreground focus:border-primary transition-colors outline-none ${totalResults === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-secondary text-foreground">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/75" />
                            </div>
                            <button
                                type="submit"
                                disabled={totalResults === 0}
                                className={`h-10 px-3 text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60 transition-colors ${totalResults === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Apply
                            </button>
                        </form>
                        <div className="hidden sm:flex items-center gap-2 xl:justify-end">
                            <Link
                                href={buildShopHref({ clearAll: true })}
                                className="h-9 px-3 inline-flex items-center text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60 transition-colors xl:hidden"
                            >
                                Reset Filters
                            </Link>
                            <form method="get" className="flex items-center gap-2">
                            {cat ? <input type="hidden" name="cat" value={cat} /> : null}
                            {metal ? <input type="hidden" name="metal" value={metal} /> : null}
                            {stone ? <input type="hidden" name="stone" value={stone} /> : null}
                            {price ? <input type="hidden" name="price" value={price} /> : null}
                            {max ? <input type="hidden" name="max" value={max} /> : null}
                            {search ? <input type="hidden" name="search" value={search} /> : null}
                            <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Sort By</label>
                            <div className={`relative ${totalResults === 0 ? 'opacity-50' : ''}`}>
                                <select
                                    name="sort"
                                    defaultValue={sort || 'new-arrivals'}
                                    disabled={totalResults === 0}
                                    style={{ colorScheme: 'dark' }}
                                    className={`h-9 min-w-[200px] appearance-none pl-3.5 pr-10 text-[10px] uppercase tracking-widest font-bold border border-primary/30 bg-background text-foreground focus:border-primary hover:border-primary/70 hover:bg-primary/5 transition-colors outline-none ${totalResults === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-secondary text-foreground">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/75" />
                            </div>
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
                    {(cat || metal || stone || price || max || normalizedSearch) && (
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
                            {stone && (
                                <Link
                                    href={buildShopHref({ stone: '' })}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
                                >
                                    Stone: {getStoneLabel(stone)} x
                                </Link>
                            )}
                            {max && (
                                <Link
                                    href={buildShopHref({ max: '' })}
                                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25"
                                >
                                    Max: <CurrencyPriceText amountInInr={Number(max)} /> x
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

