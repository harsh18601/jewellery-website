"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, CheckCircle2, X, ChevronLeft, ChevronRight, Scale, ShoppingBag, Plus, Check } from 'lucide-react'
import { useWishlist } from '@/components/providers/WishlistContext'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCurrency } from '@/components/providers/CurrencyContext'
import { useCart } from '@/components/providers/CartContext'

const ProductGrid = ({ products, emptyMessage }: { products: any[], emptyMessage?: string }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const { addToCart } = useCart()
    const { formatPrice } = useCurrency()
    const { data: session } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const wishlistAuthMessage = 'You must login or register to add items to your wishlist.'
    const [wishlistPulse, setWishlistPulse] = useState<Record<string, boolean>>({})
    const [visibleCount, setVisibleCount] = useState(8)
    const [toastMessage, setToastMessage] = useState('')
    const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null)
    const [quickViewImageIndex, setQuickViewImageIndex] = useState(0)
    const [compareItems, setCompareItems] = useState<any[]>([])
    const [compareModalOpen, setCompareModalOpen] = useState(false)
    const [comparePickerOpen, setComparePickerOpen] = useState(false)
    const [comparePickerCategoryKey, setComparePickerCategoryKey] = useState('')
    const [comparePickerCategoryLabel, setComparePickerCategoryLabel] = useState('Jewellery')

    const showToast = (message: string) => {
        setToastMessage(message)
        setTimeout(() => setToastMessage(''), 1400)
    }

    const toTitleCase = (value: string) =>
        value
            .split(' ')
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
            .join(' ')

    const normalizeCategory = (value: any): string =>
        String(value || '')
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    const getProductCategory = (product: any) => {
        const firstCategory = Array.isArray(product?.categoryList) ? product.categoryList[0] : ''
        return normalizeCategory(firstCategory || product?.category || '')
    }

    const toCompareItem = (product: any) => {
        const id = String(product._id || product.id || product?.sys?.id || '')
        const category = getProductCategory(product)
        return {
            id,
            title: product.title || 'Product',
            image: product.images?.[0] || '',
            price: Number(product.price || 0),
            ratings: Number(product.ratings || product.rating || 0),
            categoryKey: category,
            categoryLabel: String(product.category || product.categoryList?.[0] || 'Jewellery'),
            metalType: String(product.metalType || product.metal || '--'),
            stoneShape: String(product.stoneShape || product.stoneType || '--'),
            caratWeight: String(product.totalCaratWeight || product.caratWeight || '--'),
            deliveryTime: String(product.deliveryTime || product.deliveryDays || '--'),
            certification: String(product.certification || product.certificationType || 'BIS Hallmarked'),
        }
    }

    const handleCompareClick = (product: any) => {
        const firstCategory = getProductCategory(product)
        const firstLabel = String(product.category || product.categoryList?.[0] || 'Jewellery')
        const firstItem = toCompareItem(product)
        if (!firstItem.id) return

        if (compareItems.length > 0 && compareItems[0].categoryKey !== firstCategory) {
            setCompareItems([firstItem])
            showToast('Compare reset to selected category')
        } else if (!compareItems.some((item) => item.id === firstItem.id)) {
            setCompareItems((prev) => {
                if (prev.length >= 3) return prev
                return [...prev, firstItem]
            })
        }
        setComparePickerCategoryKey(firstCategory)
        setComparePickerCategoryLabel(firstLabel)
        setComparePickerOpen(true)
    }

    const handleCompareAdd = (product: any) => {
        const nextItem = toCompareItem(product)
        if (!nextItem.id) return
        if (!comparePickerCategoryKey || nextItem.categoryKey !== comparePickerCategoryKey) {
            showToast('Compare is allowed only within same category')
            return
        }

        if (compareItems.some((item) => item.id === nextItem.id)) {
            setCompareItems((prev) => prev.filter((item) => item.id !== nextItem.id))
            showToast('Removed from Compare')
            return
        }

        if (compareItems.length >= 3) {
            showToast('You can compare up to 3 items')
            return
        }

        setCompareItems((prev) => [...prev, nextItem])
        showToast('Added to Compare')
    }

    const extractNodeText = (node: any): string => {
        if (!node) return ''
        if (typeof node === 'string') return node
        if (Array.isArray(node)) {
            return node
                .map((child) => extractNodeText(child))
                .filter(Boolean)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim()
        }
        if (typeof node === 'object') {
            const valueText = typeof node.value === 'string' ? node.value : ''
            const contentText = extractNodeText(node.content)
            return [valueText, contentText]
                .filter(Boolean)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim()
        }
        return ''
    }

    const toPlainText = (value: any): string => {
        if (typeof value === 'string') return value
        if (!value) return ''
        const extractedText = extractNodeText(value)
        if (extractedText) return extractedText
        try {
            return JSON.stringify(value)
        } catch {
            return ''
        }
    }

    const handleWishlistAuthRedirect = () => {
        const query = searchParams.toString()
        const callbackUrl = query ? `${pathname}?${query}` : pathname
        router.push(
            `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&message=${encodeURIComponent(wishlistAuthMessage)}`
        )
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        window.dispatchEvent(new CustomEvent('shop-visible-count', {
            detail: { visibleCount: Math.min(visibleCount, products.length) }
        }))
    }, [visibleCount, products.length])

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-foreground font-serif italic">{emptyMessage || "No products available."}</p>
            </div>
        )
    }

    const visibleProducts = products.slice(0, visibleCount)
    const hasMore = visibleCount < products.length

    return (
        <div className="space-y-8">
            <motion.div
                key={products.length}
                initial={{ opacity: 0.5, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10"
            >
                {visibleProducts.map((product, i) => {
                    const productId = product._id || product.id || (product.sys && product.sys.id)
                    const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
                    const lifestyleImageUrl = product.images?.[1] || imageUrl
                    const amount = Number(product.price)
                    const displayPrice = Number.isFinite(amount) ? formatPrice(amount) : null
                    const originalPriceRaw = Number(product.originalPrice || product.compareAtPrice || product.mrp || 0)
                    const hasDiscount = Number.isFinite(originalPriceRaw) && originalPriceRaw > amount && amount > 0
                    const savePercent = hasDiscount ? Math.round(((originalPriceRaw - amount) / originalPriceRaw) * 100) : 0
                    const rating = Number(product.ratings || product.rating || 0)
                    const certificationText = typeof product.certification === 'string' && product.certification.trim()
                        ? product.certification
                        : 'BIS Hallmarked'
                    const isCustomisable = String(product.category || '').toLowerCase().includes('custom') ||
                        String(product.description || '').toLowerCase().includes('engraving') ||
                        String(product.description || '').toLowerCase().includes('custom')
                    const isBestSeller = Number(product.sales || product.soldCount || 0) > 20 || rating >= 4.7
                    const isNew = Boolean(product.isNew)
                    const isFeatured = Boolean(product.isFeatured)
                    const metalType = product.metalType || product.metal || ''
                    const stoneShape = product.stoneShape || product.stoneType || ''
                    const caratWeight = product.totalCaratWeight || product.caratWeight || product.carat || product.carats || ''
                    const deliveryPromise = product.deliveryTime || product.deliveryDays || '3-5'
                    const detailSummary = [metalType ? toTitleCase(String(metalType)) : '', stoneShape ? `${toTitleCase(String(stoneShape))} Cut` : '', caratWeight ? `${caratWeight} Carat` : ''].filter(Boolean).join(' • ')
                    const badgeLabel = isFeatured ? 'Premium' : isNew ? 'New Arrival' : isBestSeller ? 'Trending' : 'Best Value'
                    const reviewCount = Number(product.reviewCount || product.reviewsCount || product.ratingsCount || 0)

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={productId}
                            whileHover={{ scale: 1.02, y: -2 }}
                            onClick={() => router.push(`/product/${productId}`)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    router.push(`/product/${productId}`)
                                }
                            }}
                            role="link"
                            tabIndex={0}
                            className="group h-full cursor-pointer active:scale-[0.98] luxury-card bg-background p-3 sm:p-4 border border-primary/10 hover:border-primary/50 shadow-[0_12px_22px_rgba(0,0,0,0.16)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.22)] transition-all"
                        >
                            <div className="block h-full">
                                <div className="relative aspect-[4/5] overflow-hidden mb-4 sm:mb-5 bg-secondary">
                                    <img
                                        src={imageUrl}
                                        alt={product.title || 'Jewellery product'}
                                        className="w-full h-full object-cover transition-all duration-600 opacity-100 group-hover:opacity-0 group-hover:scale-110"
                                    />
                                    <img
                                        src={lifestyleImageUrl}
                                        alt={`${product.title || 'Jewellery product'} lifestyle`}
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-600 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] font-bold border border-primary/50 bg-primary/20 backdrop-blur text-primary">
                                        {badgeLabel}
                                    </span>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            if (!session) {
                                                handleWishlistAuthRedirect()
                                                return
                                            }
                                            const item = {
                                                id: productId,
                                                title: product.title,
                                                price: product.price,
                                                image: imageUrl,
                                                category: product.category
                                            }
                                            if (isInWishlist(productId)) {
                                                removeFromWishlist(productId)
                                                showToast('Removed from Wishlist')
                                            } else {
                                                addToWishlist(item)
                                                showToast('Added to Wishlist ❤️')
                                            }
                                            setWishlistPulse((prev) => ({ ...prev, [String(productId)]: true }))
                                            setTimeout(() => {
                                                setWishlistPulse((prev) => ({ ...prev, [String(productId)]: false }))
                                            }, 260)
                                        }}
                                        className="absolute top-4 right-4 z-10 p-2 rounded-full border border-primary/25 bg-background/65 backdrop-blur-md shadow-sm shadow-black/20 hover:bg-background/85 hover:border-primary/45 transition-all group/heart"
                                    >
                                        <Heart
                                            className={`h-4 w-4 transition-all duration-200 ${wishlistPulse[String(productId)] ? 'scale-125' : 'scale-100'} ${isInWishlist(productId) ? 'fill-primary text-primary' : 'text-foreground/70 group-hover/heart:text-primary'}`}
                                        />
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setQuickViewProduct(product)
                                                setQuickViewImageIndex(0)
                                            }}
                                            className="py-2 bg-secondary text-foreground text-[10px] uppercase font-bold tracking-widest border border-primary/20 hover:border-primary/45 transition-colors"
                                        >
                                            Quick View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                if (!session) {
                                                    handleWishlistAuthRedirect()
                                                    return
                                                }
                                                const item = {
                                                    id: productId,
                                                    title: product.title,
                                                    price: product.price,
                                                    image: imageUrl,
                                                    category: product.category
                                                }
                                                if (isInWishlist(productId)) {
                                                    removeFromWishlist(productId)
                                                    showToast('Removed from Wishlist')
                                                } else {
                                                    addToWishlist(item)
                                                    showToast('Added to Wishlist ❤️')
                                                }
                                            }}
                                            className="py-2 bg-primary text-foreground text-[10px] uppercase font-bold tracking-widest border border-primary/30 hover:bg-primary/90 transition-colors"
                                        >
                                            {isInWishlist(productId) ? 'Wishlisted' : 'Wishlist'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleCompareClick(product)
                                            }}
                                            className="col-span-2 py-2 bg-background/80 text-foreground text-[10px] uppercase font-bold tracking-widest border border-primary/25 hover:border-primary/50 transition-colors inline-flex items-center justify-center gap-1"
                                        >
                                            <Scale className="h-3.5 w-3.5" />
                                            Compare
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <h3 className="text-sm uppercase tracking-wide font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[2.5rem]">
                                        {product.title || 'Untitled Product'}
                                    </h3>
                                    <p className="text-[10px] tracking-[0.1em] text-foreground/50 line-clamp-1">
                                        {detailSummary || (product.category || 'Jewellery')}
                                    </p>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl leading-none font-extrabold text-primary">{displayPrice || "Price on request"}</p>
                                            {hasDiscount && (
                                                <p className="text-xs text-foreground/45 line-through">{formatPrice(originalPriceRaw)}</p>
                                            )}
                                        </div>
                                        {hasDiscount && (
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Save {savePercent}%</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-primary -mt-1">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, starIndex) => (
                                                <Star key={starIndex} className={`h-[17px] w-[17px] ${starIndex < Math.round(rating) ? 'fill-current' : ''}`} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold">({reviewCount > 0 ? reviewCount : rating.toFixed(1)})</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 text-[9px] uppercase tracking-widest font-bold">
                                        <span className="px-2 py-1 border border-primary/20 text-primary inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {certificationText}</span>
                                        <span className="px-2 py-1 border border-primary/20 text-primary">100% Authentic</span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/55">Ships in {deliveryPromise} days</p>
                                    {isCustomisable && (
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Customisable</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>

            {hasMore && (
                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 8)}
                        className="px-6 py-3 text-xs uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/70 hover:bg-primary/10 transition-all"
                    >
                        Load More Designs
                    </button>
                </div>
            )}

            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[140] px-4 py-2 bg-background border border-primary/35 text-xs uppercase tracking-widest font-bold shadow-xl">
                    {toastMessage}
                </div>
            )}

            {compareItems.length > 0 && !compareModalOpen && (
                <div className="fixed bottom-6 left-6 z-[135] px-4 py-3 bg-background border border-primary/35 shadow-xl flex items-center gap-3">
                    <p className="text-[10px] uppercase tracking-widest font-bold">
                        Compare {compareItems.length} item{compareItems.length > 1 ? 's' : ''}
                    </p>
                    <button
                        type="button"
                        onClick={() => setCompareModalOpen(true)}
                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60 transition-colors"
                    >
                        Open
                    </button>
                    <button
                        type="button"
                        onClick={() => setCompareItems([])}
                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-primary/20 hover:border-primary/45 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            )}

            {comparePickerOpen && (
                <div
                    className="fixed inset-0 z-[142] bg-black/70 p-4 flex items-center justify-center overflow-y-auto"
                    onClick={() => setComparePickerOpen(false)}
                >
                    <div
                        className="w-full max-w-5xl max-h-[90vh] bg-background border border-primary/20 p-4 sm:p-6 space-y-4 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold uppercase tracking-widest">Add Items to Compare - {comparePickerCategoryLabel}</h3>
                            <div className="flex items-center gap-2">
                                {compareItems.length >= 2 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setComparePickerOpen(false)
                                            setCompareModalOpen(true)
                                        }}
                                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-primary/35 hover:border-primary/60 transition-colors"
                                    >
                                        Compare Now
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setComparePickerOpen(false)}
                                    className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            Select up to 3 products from same category
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {products
                                .filter((product) => getProductCategory(product) === comparePickerCategoryKey)
                                .map((product) => {
                                    const id = String(product._id || product.id || product?.sys?.id || '')
                                    const selected = compareItems.some((item) => item.id === id)
                                    return (
                                        <div key={id} className="border border-primary/15 bg-muted/5 p-2 space-y-2">
                                            <div className="aspect-square bg-secondary overflow-hidden">
                                                <img src={product.images?.[0] || ''} alt={product.title || 'Product'} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold line-clamp-2">{product.title || 'Product'}</p>
                                                <p className="text-sm font-extrabold text-primary">{formatPrice(Number(product.price || 0))}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCompareAdd(product)}
                                                className={`w-full py-2 text-[10px] uppercase tracking-widest font-bold border inline-flex items-center justify-center gap-1 ${selected ? 'border-primary/60 bg-primary/10 text-primary' : 'border-primary/25 hover:border-primary/55'}`}
                                            >
                                                {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                                                {selected ? 'Added' : 'Add'}
                                            </button>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            )}

            {compareModalOpen && compareItems.length > 0 && (
                <div
                    className="fixed inset-0 z-[145] bg-black/70 p-4 flex items-center justify-center overflow-y-auto"
                    onClick={() => setCompareModalOpen(false)}
                >
                    <div
                        className="w-full max-w-5xl max-h-[90vh] bg-background border border-primary/20 p-4 sm:p-6 space-y-4 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold uppercase tracking-widest">Compare {compareItems[0]?.categoryLabel || 'Jewellery'}</h3>
                            <button
                                type="button"
                                onClick={() => setCompareModalOpen(false)}
                                className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {compareItems.map((item) => (
                                <div key={item.id} className="border border-primary/15 bg-muted/5 p-3 space-y-3">
                                    <div className="aspect-square bg-secondary overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold leading-snug">{item.title}</p>
                                        <p className="text-xl font-extrabold text-primary">{formatPrice(Number(item.price || 0))}</p>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground space-y-1">
                                        <p>Metal: {item.metalType}</p>
                                        <p>Stone: {item.stoneShape}</p>
                                        <p>Carat: {item.caratWeight}</p>
                                        <p>Delivery: {item.deliveryTime} days</p>
                                        <p>Rating: {item.ratings > 0 ? item.ratings.toFixed(1) : '--'}</p>
                                        <p>Cert: {item.certification}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/product/${item.id}`)}
                                            className="flex-1 px-3 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60 transition-colors"
                                        >
                                            View Product
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = compareItems.filter((c) => c.id !== item.id)
                                                setCompareItems(updated)
                                                if (updated.length === 0) setCompareModalOpen(false)
                                            }}
                                            className="px-3 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/20 hover:border-primary/45 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {Array.from({ length: Math.max(0, 3 - compareItems.length) }).map((_, idx) => (
                                <button
                                    key={`compare-slot-${idx}`}
                                    type="button"
                                    onClick={() => {
                                        setCompareModalOpen(false)
                                        setComparePickerOpen(true)
                                    }}
                                    className="border border-dashed border-primary/30 bg-muted/5 p-3 min-h-[280px] flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-colors"
                                >
                                    <div className="h-12 w-12 rounded-full border border-primary/45 inline-flex items-center justify-center">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                        Add Product to Compare
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {quickViewProduct && (
                <div
                    className="fixed inset-0 z-[130] bg-black/70 p-4 flex items-center justify-center"
                    onClick={() => setQuickViewProduct(null)}
                >
                    <div
                        className="relative w-full max-w-4xl bg-background border border-primary/20 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setQuickViewProduct(null)}
                            className="absolute top-3 right-3 z-10 p-1.5 bg-background/75 border border-primary/30 hover:border-primary/60 transition-colors"
                            aria-label="Close quick view"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="space-y-3">
                            <div className="relative aspect-square bg-secondary overflow-hidden">
                                <img
                                    src={quickViewProduct.images?.[quickViewImageIndex] || quickViewProduct.images?.[0] || ''}
                                    alt={quickViewProduct.title || 'Quick view product'}
                                    className="w-full h-full object-cover"
                                />
                                {(quickViewProduct.images?.length || 0) > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setQuickViewImageIndex((prev) => Math.max(0, prev - 1))}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-background/70 border border-primary/30"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setQuickViewImageIndex((prev) => Math.min((quickViewProduct.images?.length || 1) - 1, prev + 1))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-background/70 border border-primary/30"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold leading-tight">{quickViewProduct.title || 'Product'}</h3>
                            <p className="text-3xl font-extrabold text-primary">{formatPrice(Number(quickViewProduct.price || 0))}</p>
                            <p className="text-xs uppercase tracking-widest text-foreground/65">
                                {[quickViewProduct.metalType || quickViewProduct.metal, quickViewProduct.stoneShape || quickViewProduct.stoneType, quickViewProduct.totalCaratWeight || quickViewProduct.caratWeight].filter(Boolean).join(' • ')}
                            </p>
                            <p className="text-xs uppercase tracking-widest text-foreground/65">
                                Delivery: {quickViewProduct.deliveryTime || quickViewProduct.deliveryDays || '3-5 days'}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-4">{toPlainText(quickViewProduct.description) || 'Detailed description available on product page.'}</p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        addToCart({
                                            id: String(quickViewProduct.id || quickViewProduct._id || ''),
                                            title: quickViewProduct.title || 'Jewellery Piece',
                                            price: Number(quickViewProduct.price || 0),
                                            category: quickViewProduct.category || 'Jewellery',
                                            image: quickViewProduct.images?.[0] || '',
                                            quantity: 1,
                                            description: quickViewProduct.description,
                                            sku: quickViewProduct.sku,
                                            metalType: quickViewProduct.metalType || quickViewProduct.metal,
                                            metalPurity: quickViewProduct.metalPurity,
                                            metalWeight: Number(quickViewProduct.metalWeight || 0) || undefined,
                                            stoneType: quickViewProduct.stoneType,
                                            stoneShape: quickViewProduct.stoneShape,
                                            caratWeight: quickViewProduct.caratWeight,
                                            totalCaratWeight: quickViewProduct.totalCaratWeight,
                                            deliveryTime: quickViewProduct.deliveryTime || quickViewProduct.deliveryDays,
                                            deliveryDays: quickViewProduct.deliveryDays,
                                            certification: quickViewProduct.certification || quickViewProduct.certificationType,
                                            chainLength: quickViewProduct.chainLength,
                                            warranty: quickViewProduct.warranty,
                                            returnEligibility: quickViewProduct.returnEligibility,
                                            compareAtPrice: Number(quickViewProduct.compareAtPrice || quickViewProduct.originalPrice || quickViewProduct.mrp || 0) || undefined,
                                            stock: Number(quickViewProduct.stock || 0) || undefined,
                                            isPopular: Boolean(quickViewProduct.isPopular),
                                        })
                                        showToast('Added to Bag')
                                    }}
                                    className="px-4 py-2 bg-primary text-black text-xs uppercase tracking-widest font-bold inline-flex items-center gap-1"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Add to Cart
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push(`/product/${quickViewProduct.id || quickViewProduct._id}`)}
                                    className="px-4 py-2 border border-primary/35 text-xs uppercase tracking-widest font-bold"
                                >
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductGrid
