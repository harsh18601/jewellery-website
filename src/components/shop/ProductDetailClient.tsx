"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RichTextRenderer } from '@/lib/richTextRenderer'
import { ShoppingBag, Heart, Share2, ShieldCheck, Truck, RefreshCw, ArrowLeft, CreditCard, Landmark, Wallet, CircleDollarSign, Lock, CheckCircle2, Gem, Hammer, Sparkles, Star } from 'lucide-react'
import { useCart } from '@/components/providers/CartContext'
import { useWishlist } from '@/components/providers/WishlistContext'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCurrency } from '@/components/providers/CurrencyContext'
import Link from 'next/link'

interface ProductDetailClientProps {
    product: any;
    relatedProducts?: any[];
}

const ProductDetailClient = ({ product, relatedProducts = [] }: ProductDetailClientProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    const { addToCart } = useCart()
    const { formatPrice } = useCurrency()
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const [selectedImage, setSelectedImage] = useState(0)
    const [isAdding, setIsAdding] = useState(false)
    const [isBuyingNow, setIsBuyingNow] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
    const [shareFeedback, setShareFeedback] = useState('')
    const [pincode, setPincode] = useState('')
    const [shippingMessage, setShippingMessage] = useState('Delivery in 3-5 days across major cities.')
    const [showStickyCartBar, setShowStickyCartBar] = useState(false)
    const productId = product.id || product._id
    const wishlistAuthMessage = 'You must login or register to add items to your wishlist.'

    const handleAddToCart = () => {
        setIsAdding(true)
        addToCart({
            id: product.id || product._id,
            title: product.title,
            price: product.price,
            category: product.category || 'Jewellery',
            image: product.images?.[0] || '',
            quantity: 1,
            description: product.description,
            sku: product.sku,
            metalType: product.metalType || product.metal,
            metalPurity: product.metalPurity,
            metalWeight: Number(product.metalWeight || 0) || undefined,
            stoneType: product.stoneType,
            stoneShape: product.stoneShape,
            caratWeight: product.caratWeight,
            totalCaratWeight: product.totalCaratWeight,
            deliveryTime: product.deliveryTime || product.deliveryDays,
            deliveryDays: product.deliveryDays,
            certification: product.certification || product.certificationType,
            chainLength: product.chainLength,
            warranty: product.warranty,
            returnEligibility: product.returnEligibility,
            compareAtPrice: Number(product.compareAtPrice || product.originalPrice || product.mrp || 0) || undefined,
            stock: Number(product.stock || 0) || undefined,
            isPopular: Boolean(product.isPopular),
        })
        setTimeout(() => setIsAdding(false), 1000)
    }

    const handleBuyNow = () => {
        setIsBuyingNow(true)
        addToCart({
            id: product.id || product._id,
            title: product.title,
            price: product.price,
            category: product.category || 'Jewellery',
            image: product.images?.[0] || '',
            quantity: 1,
            description: product.description,
            sku: product.sku,
            metalType: product.metalType || product.metal,
            metalPurity: product.metalPurity,
            metalWeight: Number(product.metalWeight || 0) || undefined,
            stoneType: product.stoneType,
            stoneShape: product.stoneShape,
            caratWeight: product.caratWeight,
            totalCaratWeight: product.totalCaratWeight,
            deliveryTime: product.deliveryTime || product.deliveryDays,
            deliveryDays: product.deliveryDays,
            certification: product.certification || product.certificationType,
            chainLength: product.chainLength,
            warranty: product.warranty,
            returnEligibility: product.returnEligibility,
            compareAtPrice: Number(product.compareAtPrice || product.originalPrice || product.mrp || 0) || undefined,
            stock: Number(product.stock || 0) || undefined,
            isPopular: Boolean(product.isPopular),
        })
        router.push('/cart')
        setTimeout(() => setIsBuyingNow(false), 700)
    }

    const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000']
    const formattedPrice = formatPrice(Number(product.price || 0))
    const compareAtPrice = Number(product.compareAtPrice || product.originalPrice || product.mrp || 0)
    const hasDiscount = compareAtPrice > Number(product.price || 0)
    const deliveryWindow = product.deliveryDays || '3-5'
    const certificationLabel = product.certification || 'BIS Hallmarked'
    const emiMonthly = Number(product.emiMonthly || (Number(product.price || 0) > 0 ? Math.round(Number(product.price || 0) / 24) : 0))
    const ratingValue = Number(product.ratings || product.rating || 0)
    const stoneShapeLabel = product.stoneShape || ''
    const stoneTypeLabel = product.stoneType || ''
    const caratWeightLabel = product.totalCaratWeight || product.caratWeight || ''
    const metalTypeLabel = product.metalType || product.metal || ''
    const metalPurityLabel = product.metalPurity || ''
    const metalWeightLabel = Number(product.metalWeight || 0) > 0 ? `${Number(product.metalWeight).toFixed(2)} g` : ''
    const productSpecs = [
        { label: 'Metal Type', value: metalTypeLabel },
        { label: 'Metal Purity', value: metalPurityLabel },
        { label: 'Metal Weight', value: metalWeightLabel },
        { label: 'Stone Type', value: stoneTypeLabel },
        { label: 'Stone Shape', value: stoneShapeLabel },
        { label: 'Total Carat Weight', value: caratWeightLabel },
        { label: 'Certification', value: certificationLabel },
        { label: 'Delivery Time', value: `${deliveryWindow} days` },
    ].filter((item) => Boolean(item.value))
    useEffect(() => {
        const onScroll = () => {
            setShowStickyCartBar(window.scrollY > 600)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const getZoomPoint = (clientX: number, clientY: number, rect: DOMRect) => {
        const x = ((clientX - rect.left) / rect.width) * 100
        const y = ((clientY - rect.top) / rect.height) * 100
        return {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        }
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'touch') return
        const rect = e.currentTarget.getBoundingClientRect()
        setZoomPosition(getZoomPoint(e.clientX, e.clientY, rect))
        setIsZoomed(true)
    }

    const handlePointerLeave = () => {
        setIsZoomed(false)
    }

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!window.matchMedia('(hover: none)').matches) return
        const rect = e.currentTarget.getBoundingClientRect()
        setZoomPosition(getZoomPoint(e.clientX, e.clientY, rect))
        setIsZoomed((prev) => !prev)
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
            return
        }
        router.push('/shop')
    }

    const handleWishlistAuthRedirect = () => {
        const query = searchParams.toString()
        const callbackUrl = query ? `${pathname}?${query}` : pathname
        router.push(
            `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&message=${encodeURIComponent(wishlistAuthMessage)}`
        )
    }

    const handleWishlistClick = () => {
        const item = {
            id: productId,
            title: product.title,
            price: product.price,
            image: images[0] || '',
            category: product.category || 'Jewellery',
        }
        if (!session) {
            handleWishlistAuthRedirect()
            return
        }
        if (isInWishlist(productId)) {
            removeFromWishlist(productId)
            return
        }
        addToWishlist(item)
    }

    const handleShareClick = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : ''
        if (!url) return

        const shareData = {
            title: product.title || 'Product',
            text: `Check out this jewellery piece: ${product.title || 'Product'}`,
            url,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
                setShareFeedback('Shared successfully')
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url)
                setShareFeedback('Link copied')
            } else {
                setShareFeedback('Sharing not supported')
            }
        } catch {
            setShareFeedback('Sharing cancelled')
        } finally {
            setTimeout(() => setShareFeedback(''), 2000)
        }
    }

    const handleCheckPincode = () => {
        if (!/^\d{6}$/.test(pincode)) {
            setShippingMessage('Enter a valid 6-digit pincode.')
            return
        }
        setShippingMessage(`Delivery estimate for ${pincode}: ${deliveryWindow} business days.`)
    }

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative aspect-square bg-secondary overflow-hidden"
                        onPointerMove={handlePointerMove}
                        onPointerLeave={handlePointerLeave}
                        onClick={handleImageClick}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                src={images[selectedImage]}
                                alt={product.title}
                                className={`w-full h-full object-cover transition-transform duration-300 will-change-transform [backface-visibility:hidden] ${isZoomed ? 'scale-[1.75] cursor-zoom-out' : 'scale-[1.12] cursor-zoom-in'}`}
                                style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                            />
                        </AnimatePresence>
                        <p className="pointer-events-none absolute bottom-3 right-3 bg-background/60 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground/80">
                            {isZoomed ? 'Tap or move out to reset' : 'Hover or tap to zoom'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-4 gap-6 md:gap-7">
                        {images.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedImage(i)
                                    setIsZoomed(false)
                                }}
                                className={`aspect-square bg-secondary overflow-hidden rounded-sm border-2 transition-all duration-400 ease-out ${selectedImage === i ? 'border-primary shadow-[0_0_0_1px_rgba(201,162,39,0.75),0_0_20px_rgba(201,162,39,0.18)]' : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/45 hover:-translate-y-0.5'}`}
                            >
                                <img src={img} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="min-w-0">
                                <p className="text-primary text-xs uppercase tracking-[0.3em] font-bold mb-2">{product.category}</p>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight break-words">{product.title}</h1>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {product.isFeatured && (
                                        <span className="px-2 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/35 bg-primary/10 text-primary">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex space-x-2 self-start">
                                <button
                                    type="button"
                                    onClick={handleWishlistClick}
                                    className="p-2 border border-border hover:bg-secondary/40 transition-colors rounded-full"
                                >
                                    <Heart className={`h-5 w-5 ${isInWishlist(productId) ? 'fill-primary text-primary' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShareClick}
                                    className="p-2 border border-border hover:bg-secondary/40 transition-colors rounded-full"
                                >
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        {shareFeedback && (
                            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{shareFeedback}</p>
                        )}

                        {product.tagline && (
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{product.tagline}</p>
                        )}
                        <div className="flex items-end gap-3">
                            <p className="text-4xl font-bold text-primary tracking-tight">{formattedPrice}</p>
                            {hasDiscount && (
                                <p className="text-sm text-muted-foreground line-through pb-1">{formatPrice(compareAtPrice)}</p>
                            )}
                        </div>
                        {ratingValue > 0 && (
                            <div className="flex items-center gap-2 text-primary">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className={`h-4 w-4 ${index < Math.round(ratingValue) ? 'fill-current' : ''}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold">({ratingValue.toFixed(1)})</span>
                            </div>
                        )}
                    </div>

                    <div className="border border-primary/15 bg-muted/5 p-4 space-y-3">
                        <p className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                            <Truck className="h-4 w-4 text-primary" /> Delivery in {deliveryWindow} days
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Enter pincode to check delivery"
                                className="flex-1 p-3 text-sm bg-muted/20 border border-primary/20 focus:border-primary outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleCheckPincode}
                                className="px-4 py-3 bg-secondary border border-primary/20 text-xs uppercase tracking-widest font-bold hover:border-primary transition-colors"
                            >
                                Check
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">{shippingMessage}</p>
                        <p className="text-xs text-primary font-bold uppercase tracking-widest">{certificationLabel}</p>
                        {emiMonthly > 0 && (
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">EMI starting at {formatPrice(emiMonthly)}/month</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 7-Day Easy Return</p>
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Lifetime Polishing</p>
                            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Free Shipping</p>
                        </div>
                    </div>

                    <div className="text-foreground/90">
                        <RichTextRenderer content={product.description} isDark={true} />
                        {!product.description && (
                            <p className="leading-relaxed">Detailed description available in Contentful.</p>
                        )}
                    </div>

                    <div className="border border-primary/15 bg-muted/5 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs uppercase tracking-widest font-bold text-primary">Product Specifications</h3>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Crafted Details</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            {productSpecs.map((spec) => (
                                <div key={spec.label} className="flex justify-between gap-3 border-b border-primary/10 py-1.5">
                                    <span className="text-muted-foreground uppercase tracking-widest text-[10px]">{spec.label}</span>
                                    <span className="text-right font-semibold">{String(spec.value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 pt-8 mt-2">
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`w-full min-h-16 px-6 bg-primary text-foreground uppercase tracking-widest text-sm font-extrabold transition-all relative overflow-hidden shadow-lg shadow-primary/20 ${isAdding ? 'bg-green-600' : 'hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30'}`}
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isAdding ? 'Added to Bag' : (
                                        <>
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </>
                                    )}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={isBuyingNow}
                                className="w-full min-h-16 px-6 border border-primary text-primary uppercase tracking-widest text-sm font-extrabold hover:bg-primary/10 transition-all"
                            >
                                {isBuyingNow ? 'Processing...' : 'Buy Now'}
                            </button>
                        </div>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Secure Checkout | Easy Returns</p>
                    </div>

                    <div className="border border-primary/15 p-5 space-y-4 bg-muted/5">
                        <h3 className="text-xs uppercase tracking-widest font-bold text-primary">Trusted Payments</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] uppercase tracking-widest font-bold">
                            <div className="border border-primary/20 p-3 flex items-center gap-2"><Wallet className="h-4 w-4 text-primary" /> UPI</div>
                            <div className="border border-primary/20 p-3 flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" /> Razorpay / Stripe</div>
                            <div className="border border-primary/20 p-3 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Visa / Mastercard</div>
                            <div className="border border-primary/20 p-3 flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-primary" /> COD</div>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                            <Lock className="h-4 w-4" /> 100% Secure Encrypted Payment
                        </p>
                    </div>

                    <div className="mt-4 border border-primary/20 shadow-[0_0_24px_rgba(201,162,39,0.08)] p-5 space-y-4 bg-muted/5">
                        <h3 className="text-xl font-bold">Why Buy From Shree Radha Govind Jewellers?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="border border-primary/20 p-4 space-y-1 bg-background/30">
                                <p className="font-semibold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 25+ Years of Craftsmanship</p>
                                <p className="text-xs text-muted-foreground">Expert artisans crafting timeless designs.</p>
                            </div>
                            <div className="border border-primary/20 p-4 space-y-1 bg-background/30">
                                <p className="font-semibold flex items-center gap-2"><Hammer className="h-4 w-4 text-primary" /> Handcrafted Designs</p>
                                <p className="text-xs text-muted-foreground">Every piece is finished by skilled human hands.</p>
                            </div>
                            <div className="border border-primary/20 p-4 space-y-1 bg-background/30">
                                <p className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Premium Finish</p>
                                <p className="text-xs text-muted-foreground">Polished to luxury standards for lasting shine.</p>
                            </div>
                            <div className="border border-primary/20 p-4 space-y-1 bg-background/30">
                                <p className="font-semibold flex items-center gap-2"><Gem className="h-4 w-4 text-primary" /> Authentic Silver</p>
                                <p className="text-xs text-muted-foreground">Trusted quality with verified purity and detailing.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border/60">
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Insured Delivery</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Truck className="h-5 w-5 text-primary" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Priority Shipping</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <RefreshCw className="h-5 w-5 text-primary" />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Easy Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <section className="pt-8 md:pt-14 border-t border-primary/10">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
                        <div>
                            <h3 className="text-2xl font-bold">You may also like</h3>
                            <p className="text-sm text-muted-foreground">Similar rings, same metal, and matching price range.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {relatedProducts.map((item) => {
                            const itemId = item.id || item._id
                            const imageUrl = item.images?.[0] || ''
                            return (
                                <Link
                                    key={itemId}
                                    href={`/product/${itemId}`}
                                    className="border border-primary/10 hover:border-primary/40 transition-colors bg-muted/5"
                                >
                                    <div className="aspect-square bg-secondary overflow-hidden">
                                        <img src={imageUrl} alt={item.title || 'Related product'} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-3 space-y-1">
                                        <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.category || 'Jewellery'}</p>
                                        <h4 className="text-sm font-bold leading-tight line-clamp-2">{item.title || 'Product'}</h4>
                                        <p className="text-sm font-bold text-primary">{formatPrice(Number(item.price || 0))}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            )}

            {showStickyCartBar && (
                <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-primary/20 bg-background/95 backdrop-blur-md px-4 py-3">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{product.title}</p>
                            <p className="text-xs text-primary font-semibold">{formattedPrice}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="px-5 py-2.5 bg-primary text-foreground text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetailClient
