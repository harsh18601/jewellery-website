"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Heart, CheckCircle2, X, ChevronLeft, ChevronRight, Scale, ShoppingBag } from 'lucide-react'
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
    const [visibleCount, setVisibleCount] = useState(12)
    const [toastMessage, setToastMessage] = useState('')
    const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null)
    const [quickViewImageIndex, setQuickViewImageIndex] = useState(0)

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

    const toPlainText = (value: any): string => {
        if (typeof value === 'string') return value
        if (!value) return ''
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
                                                showToast('Compare feature coming soon')
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
                        onClick={() => setVisibleCount((prev) => prev + 12)}
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

            {quickViewProduct && (
                <div
                    className="fixed inset-0 z-[130] bg-black/70 p-4 flex items-center justify-center"
                    onClick={() => setQuickViewProduct(null)}
                >
                    <div
                        className="w-full max-w-4xl bg-background border border-primary/20 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-3">
                            <div className="relative aspect-square bg-secondary overflow-hidden">
                                <img
                                    src={quickViewProduct.images?.[quickViewImageIndex] || quickViewProduct.images?.[0] || ''}
                                    alt={quickViewProduct.title || 'Quick view product'}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuickViewProduct(null)}
                                    className="absolute top-3 right-3 p-1.5 bg-background/70 border border-primary/30"
                                >
                                    <X className="h-4 w-4" />
                                </button>
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
