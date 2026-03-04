"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ShoppingBag, Trash2, ArrowRight, X, ArrowLeft, CheckCircle2, CreditCard, Wallet, Landmark, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartContext'
import { useSession } from 'next-auth/react'
import { createOrder } from '@/actions/orderActions'
import { useCurrency } from '@/components/providers/CurrencyContext'
import { AnimatePresence, motion } from 'framer-motion'

const CartPage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
    const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart()
    const { formatPrice } = useCurrency()
    const [addresses, setAddresses] = useState<any[]>([])
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [selectedAddressKey, setSelectedAddressKey] = useState<string>('')
    const [isAddressLoading, setIsAddressLoading] = useState(false)
    const [couponCode, setCouponCode] = useState('')
    const [couponMessage, setCouponMessage] = useState('')
    const [deliveryPin, setDeliveryPin] = useState('')
    const [deliveryPinMessage, setDeliveryPinMessage] = useState('')
    const [checkoutModal, setCheckoutModal] = useState({
        open: false,
        title: '',
        message: '',
        isSuccess: true,
    })
    const [removeModal, setRemoveModal] = useState<{ open: boolean; id: string; title: string }>({
        open: false,
        id: '',
        title: '',
    })
    const [removeToast, setRemoveToast] = useState<{
        open: boolean
        item: any | null
    }>({
        open: false,
        item: null,
    })
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const savingsTotal = cartItems.reduce((acc, item: any) => {
        const compareAtPrice = Number(item.compareAtPrice || item.originalPrice || item.mrp || 0)
        const saved = compareAtPrice > Number(item.price || 0) ? (compareAtPrice - Number(item.price || 0)) * item.quantity : 0
        return acc + saved
    }, 0)
    const goldValue = cartItems.reduce((acc, item: any) => {
        const perItemGold = Number(item.goldValue || item.price * 0.88)
        return acc + (perItemGold * item.quantity)
    }, 0)
    const makingCharges = cartItems.reduce((acc, item: any) => {
        const perItemMaking = Number(item.makingCharges || item.price * 0.12)
        return acc + (perItemMaking * item.quantity)
    }, 0)
    const gstAmount = (goldValue + makingCharges) * 0.03
    const total = subtotal * 1.03

    const formatDateLabel = (date: Date) =>
        date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

    const estimateDeliveryWindow = () => {
        const getMaxDays = (value: any) => {
            if (typeof value === 'number' && Number.isFinite(value)) return value
            if (typeof value === 'string') {
                const matches = value.match(/\d+/g)
                if (matches?.length) return Number(matches[matches.length - 1])
            }
            return 5
        }

        const maxDeliveryDays = Math.max(
            3,
            ...cartItems.map((item: any) => getMaxDays(item.deliveryTime || item.deliveryDays))
        )

        const earliest = new Date()
        earliest.setDate(earliest.getDate() + Math.max(3, maxDeliveryDays - 2))
        const latest = new Date()
        latest.setDate(latest.getDate() + maxDeliveryDays)

        return `${formatDateLabel(earliest)} - ${formatDateLabel(latest)}`
    }

    const estimatedDeliveryRange = estimateDeliveryWindow()

    const handlePinDeliveryCheck = () => {
        if (!/^\d{6}$/.test(deliveryPin)) {
            setDeliveryPinMessage('Enter a valid 6-digit PIN code.')
            return
        }
        setDeliveryPinMessage(`Delivering to ${deliveryPin}: expected by ${estimatedDeliveryRange}.`)
    }

    useEffect(() => {
        if (!session) {
            setAddresses([])
            return
        }

        const fetchAddresses = async () => {
            setIsAddressLoading(true)
            try {
                const res = await fetch('/api/user/sync')
                if (!res.ok) {
                    setAddresses([])
                    return
                }
                const data = await res.json()
                const fetchedAddresses = Array.isArray(data.addresses) ? data.addresses : []
                setAddresses(fetchedAddresses)
            } catch {
                setAddresses([])
            } finally {
                setIsAddressLoading(false)
            }
        }

        fetchAddresses()
    }, [session])

    const getAddressKey = (address: any, index: number) =>
        String(address.id || address._id || `${address.street || 'addr'}-${address.zip || ''}-${index}`)

    const placeOrder = async (shippingAddress: any) => {
        if (!session?.user) {
            router.push('/auth/signin?callbackUrl=/cart')
            return
        }

        setIsCheckoutLoading(true)
        try {
            const orderData = {
                userId: (session.user as any).id || session.user?.email,
                products: cartItems.map(item => ({
                    productId: item.id,
                    productName: item.title,
                    productImage: item.image,
                    sku: (item as any).sku || '',
                    metalType: (item as any).metalType || (item as any).metal || 'Yellow Gold',
                    metalPurity: (item as any).metalPurity || '18K',
                    metalWeight: Number((item as any).metalWeight || 0) || undefined,
                    stoneType: (item as any).stoneType || '',
                    stoneShape: (item as any).stoneShape || '',
                    caratWeight: String((item as any).totalCaratWeight || (item as any).caratWeight || ''),
                    deliveryTime: String((item as any).deliveryTime || (item as any).deliveryDays || ''),
                    certification: String((item as any).certification || ''),
                    chainLength: String((item as any).chainLength || ''),
                    warranty: String((item as any).warranty || ''),
                    returnEligibility: String((item as any).returnEligibility || ''),
                    quantity: item.quantity,
                    price: item.price
                })),
                couponCode: couponCode || undefined,
                totalSavings: savingsTotal,
                estimatedDelivery: estimatedDeliveryRange,
                totalPrice: total,
                paymentStatus: 'Pending',
                orderStatus: 'Processing',
                shippingAddress
            }

            const result = await createOrder(orderData)
            if (result.success) {
                clearCart()
                setCheckoutModal({
                    open: true,
                    title: 'Order placed successfully',
                    message: 'Your order has been placed. You can track it from My Orders.',
                    isSuccess: true,
                })
            } else {
                setCheckoutModal({
                    open: true,
                    title: 'Order could not be placed',
                    message: 'Please try again.',
                    isSuccess: false,
                })
            }
        } catch (error) {
            console.error('Checkout error:', error)
            setCheckoutModal({
                open: true,
                title: 'Something went wrong',
                message: 'An unexpected error occurred.',
                isSuccess: false,
            })
        } finally {
            setIsCheckoutLoading(false)
        }
    }

    const handleCheckout = async () => {
        if (!session) {
            router.push('/auth/signin?callbackUrl=/cart')
            return
        }

        if (cartItems.length === 0) return

        let latestAddresses = addresses
        try {
            const res = await fetch('/api/user/sync')
            if (res.ok) {
                const data = await res.json()
                latestAddresses = Array.isArray(data.addresses) ? data.addresses : []
                setAddresses(latestAddresses)
            }
        } catch {
            latestAddresses = addresses
        }

        if (!latestAddresses.length) {
            router.push('/profile/addresses?callbackUrl=/cart')
            return
        }

        if (latestAddresses.length > 1) {
            const defaultIndex = latestAddresses.findIndex((addr: any) => Boolean(addr.isDefault))
            const selectedIndex = defaultIndex >= 0 ? defaultIndex : 0
            setSelectedAddressKey(getAddressKey(latestAddresses[selectedIndex], selectedIndex))
            setAddressModalOpen(true)
            return
        }

        await placeOrder(latestAddresses[0])
    }

    const queueRemovedToast = (itemId: string) => {
        const index = cartItems.findIndex((entry) => String(entry.id) === String(itemId))
        if (index < 0) return
        const removedItem = cartItems[index]
        removeFromCart(itemId)
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
        setRemoveToast({
            open: true,
            item: removedItem,
        })
        undoTimerRef.current = setTimeout(() => {
            setRemoveToast({ open: false, item: null })
            undoTimerRef.current = null
        }, 5500)
    }

    const handleUndoRemove = () => {
        if (!removeToast.item) return
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current)
            undoTimerRef.current = null
        }
        addToCart({ ...removeToast.item })
        setRemoveToast({ open: false, item: null })
    }

    useEffect(() => {
        return () => {
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
        }
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 pb-28 sm:py-24 min-h-screen">
            <div className={`flex flex-col ${cartItems.length > 0 ? 'md:flex-row justify-between items-start gap-10 md:gap-16' : ''}`}>
                <div className={`flex-grow space-y-10 sm:space-y-12 w-full ${cartItems.length === 0 ? 'max-w-4xl mx-auto' : ''}`}>
                    <div className="space-y-4 text-center flex flex-col items-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 self-start text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Continue Shopping
                        </Link>
                        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-center">Shopping Bag</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">
                            {cartItems.length} ITEM(S) IN YOUR BAG
                        </p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="space-y-8">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-6 sm:gap-8 border-b border-primary/10 pb-8">
                                    <Link href={`/product/${item.id}`} className="w-full h-56 sm:w-36 sm:h-44 bg-secondary flex-shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                    </Link>

                                    <div className="flex-grow space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold uppercase tracking-wide">{item.title}</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">{item.category}</p>
                                                <div className="space-y-1 text-[11px] text-muted-foreground">
                                                    <p>Weight: {item.metalWeight ? `${item.metalWeight}g` : '--'}</p>
                                                    <p>SKU: {item.sku || '--'}</p>
                                                    <p>Delivery by {estimatedDeliveryRange}</p>
                                                </div>
                                                <div className="flex items-center gap-4 pt-1">
                                                    <Link
                                                        href={`/product/${item.id}`}
                                                        className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary/80 transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                                {typeof item.description === 'string' && item.description.trim() && (
                                                    <p className="text-[10px] text-muted-foreground/60 line-clamp-2 font-serif italic max-w-md">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 sm:pt-4">
                                            <div className="flex items-center gap-3 sm:gap-4 border border-primary/20 px-4 sm:px-5 py-2.5">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            setRemoveModal({ open: true, id: String(item.id), title: item.title })
                                                            return
                                                        }
                                                        updateQuantity(item.id, -1)
                                                    }}
                                                    className="text-primary hover:text-secondary cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="text-primary hover:text-secondary cursor-pointer"
                                                >
                                                    +
                                                </button>
                                                <span className="h-4 w-px bg-primary/20" />
                                                <button
                                                    type="button"
                                                    onClick={() => setRemoveModal({ open: true, id: String(item.id), title: item.title })}
                                                    className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 sm:py-28 px-6 bg-gradient-to-b from-muted/10 to-background border border-dashed border-primary/25 flex flex-col items-center">
                            <div className="relative mx-auto mb-8 w-fit">
                                <div className="absolute -inset-5 rounded-full bg-primary/10 blur-2xl" />
                                <div className="relative h-20 w-20 rounded-full border border-primary/30 bg-background/80 flex items-center justify-center">
                                    <ShoppingBag className="h-10 w-10 text-primary/60" />
                                </div>
                            </div>
                            <h2 className="w-full text-center text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-3">Your Bag Is Empty</h2>
                            <p className="max-w-2xl mx-auto text-sm text-muted-foreground font-serif italic mb-10">
                                Browse our latest jewellery collection and find something beautiful.
                            </p>
                            <Link
                                href="/shop"
                                className="inline-block px-12 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-extrabold hover:bg-primary/90 hover:scale-[1.04] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform"
                            >
                                Shop Our Collection
                            </Link>

                            <div className="mt-10 space-y-4">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Popular Categories</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {[
                                        ['Rings', '/shop?cat=rings'],
                                        ['Earrings', '/shop?cat=earrings'],
                                        ['Necklaces', '/shop?cat=necklaces'],
                                        ['Bracelets', '/shop?cat=bracelets'],
                                    ].map(([label, href]) => (
                                        <Link
                                            key={label}
                                            href={href}
                                            className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/70 hover:bg-primary/10 transition-all"
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 border border-primary/15 bg-muted/5 p-5 sm:p-6 text-left">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 text-center">You May Like</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] uppercase tracking-widest font-bold">
                                    <Link href="/shop?cat=necklaces" className="border border-primary/20 px-4 py-3 hover:border-primary/55 hover:bg-primary/5 transition-all">Trending Pendants</Link>
                                    <Link href="/shop?cat=rings" className="border border-primary/20 px-4 py-3 hover:border-primary/55 hover:bg-primary/5 transition-all">Best Seller Rings</Link>
                                    <Link href="/shop?cat=bracelets" className="border border-primary/20 px-4 py-3 hover:border-primary/55 hover:bg-primary/5 transition-all">Signature Bracelets</Link>
                                    <Link href="/shop?cat=earrings" className="border border-primary/20 px-4 py-3 hover:border-primary/55 hover:bg-primary/5 transition-all">Daily Wear Earrings</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {session && cartItems.length > 0 && (
                <aside className="w-full md:w-96 bg-muted/5 p-6 sm:p-10 border border-primary/10 space-y-8 md:sticky md:top-32">
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-8 gold-text">Summary</h2>

                    <>
                            <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Gold Value</span>
                                    <span>{formatPrice(goldValue)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Making Charges</span>
                                    <span>{formatPrice(makingCharges)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax (GST)</span>
                                    <span>{formatPrice(gstAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-primary">FREE</span>
                                </div>
                                {savingsTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">You Saved</span>
                                        <span className="text-primary">{formatPrice(savingsTotal)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery</span>
                                    <span>{estimatedDeliveryRange}</span>
                                </div>
                                <div className="border-t border-primary/20 pt-4 flex justify-between text-base">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Deliver to</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        value={deliveryPin}
                                        onChange={(e) => setDeliveryPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="Enter PIN code"
                                        className="h-10 flex-1 px-3 text-xs bg-muted/10 border border-primary/20 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePinDeliveryCheck}
                                        className="h-10 px-3 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60 transition-colors"
                                    >
                                        Check
                                    </button>
                                </div>
                                {deliveryPinMessage && <p className="text-[10px] text-muted-foreground">{deliveryPinMessage}</p>}
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Apply Coupon</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter coupon code"
                                        className="h-10 flex-1 px-3 text-xs bg-muted/10 border border-primary/20 focus:border-primary outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setCouponMessage(couponCode ? 'Coupon will be validated at checkout.' : 'Enter a coupon code.')}
                                        className="h-10 px-3 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {['WELCOME10', 'SAVE5'].map((offer) => (
                                        <button
                                            key={offer}
                                            type="button"
                                            onClick={() => {
                                                setCouponCode(offer)
                                                setCouponMessage(`${offer} selected. Coupon will be validated at checkout.`)
                                            }}
                                            className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:border-primary/60"
                                        >
                                            {offer}
                                        </button>
                                    ))}
                                </div>
                                {couponMessage && <p className="text-[10px] text-muted-foreground">{couponMessage}</p>}
                            </div>

                            <div className="border border-primary/15 bg-muted/5 p-3 space-y-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Payment Methods</p>
                                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest font-bold">
                                    <p className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-primary" /> UPI</p>
                                    <p className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-primary" /> Cards</p>
                                    <p className="inline-flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-primary" /> Net Banking</p>
                                    <p className="inline-flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-primary" /> Wallets</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No-Cost EMI from {formatPrice(Math.max(1, Math.round(total / 12)))}/month</p>
                            </div>

                            <div className="space-y-2 text-[10px] uppercase tracking-widest font-bold">
                                <p className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure Payment</p>
                                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Hallmarked Gold</p>
                                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Easy Returns</p>
                                <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Lifetime Service</p>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isCheckoutLoading || isAddressLoading || cartItems.length === 0}
                                className="w-full py-5 bg-secondary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group/checkout"
                            >
                                {isCheckoutLoading ? 'Processing...' : (
                                    <span className="flex items-center">
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover/checkout:translate-x-1 transition-transform duration-300" />
                                    </span>
                                )}
                            </button>
                    </>

                    <div className="text-[10px] text-muted-foreground text-center font-serif italic py-4">
                        Security & Authenticity Guaranteed. Secure checkout via Razorpay/Stripe.
                    </div>
                </aside>
                )}
            </div>

            {cartItems.length > 0 && (
                <section className="mt-10 border border-primary/10 bg-muted/5 p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Complete the Look</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] uppercase tracking-widest font-bold">
                        <Link href="/shop?cat=earrings" className="border border-primary/20 px-3 py-3 hover:border-primary/55 transition-colors">Earrings</Link>
                        <Link href="/shop?cat=bracelets" className="border border-primary/20 px-3 py-3 hover:border-primary/55 transition-colors">Bracelet</Link>
                        <Link href="/shop?cat=rings" className="border border-primary/20 px-3 py-3 hover:border-primary/55 transition-colors">Ring</Link>
                        <Link href="/shop?cat=necklaces" className="border border-primary/20 px-3 py-3 hover:border-primary/55 transition-colors">Necklace</Link>
                    </div>
                </section>
            )}

            {cartItems.length > 0 && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-primary/20 bg-background/95 backdrop-blur-md p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total</p>
                            <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={isCheckoutLoading || isAddressLoading}
                            className="px-4 py-2.5 bg-primary text-foreground text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
                        >
                            {isCheckoutLoading ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {removeToast.open && removeToast.item && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed bottom-5 right-5 z-[130] px-4 py-3 border border-primary/30 bg-background/95 backdrop-blur-md shadow-2xl flex items-center gap-4"
                    >
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                            Item removed from bag
                        </p>
                        <button
                            type="button"
                            onClick={handleUndoRemove}
                            className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary/80 transition-colors"
                        >
                            Undo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {removeModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[125] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg bg-background border border-primary/20 p-8 space-y-5"
                        >
                            <h3 className="text-2xl font-bold text-center">Remove Item</h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Are you sure you want to remove
                                <span className="text-foreground font-semibold"> {removeModal.title}</span> from your bag?
                            </p>
                            <div className="flex items-center justify-center gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setRemoveModal({ open: false, id: '', title: '' })}
                                    className="px-6 py-3 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        queueRemovedToast(removeModal.id)
                                        setRemoveModal({ open: false, id: '', title: '' })
                                    }}
                                    className="px-6 py-3 border border-destructive/60 text-destructive text-xs font-bold uppercase tracking-widest hover:bg-destructive/10 transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {checkoutModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg bg-background border border-primary/20 p-8 space-y-5 text-center relative"
                        >
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setCheckoutModal((prev) => ({ ...prev, open: false }))}
                                className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <h3 className={`text-2xl font-bold text-center ${checkoutModal.isSuccess ? 'text-primary' : 'text-destructive'}`}>
                                {checkoutModal.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {checkoutModal.message}
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    if (checkoutModal.isSuccess) {
                                        setCheckoutModal((prev) => ({ ...prev, open: false }))
                                        router.push('/profile/orders')
                                        return
                                    }
                                    setCheckoutModal((prev) => ({ ...prev, open: false }))
                                }}
                                className="px-8 py-3 bg-primary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                            >
                                {checkoutModal.isSuccess ? 'Go to Orders' : 'OK'}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {addressModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl bg-background border border-primary/20 p-8 space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-center">Select Delivery Address</h3>
                            <div className="space-y-3 max-h-[50vh] overflow-auto pr-1">
                                {addresses.map((address, index) => {
                                    const key = getAddressKey(address, index)
                                    return (
                                        <button
                                            type="button"
                                            key={key}
                                            onClick={() => setSelectedAddressKey(key)}
                                            className={`w-full text-left p-4 border transition-colors ${selectedAddressKey === key ? 'border-primary bg-primary/5' : 'border-primary/15 hover:border-primary/40'}`}
                                        >
                                            <p className="text-sm font-bold">{address.name || 'Address'}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {address.street}, {address.city}, {address.state} {address.zip}
                                            </p>
                                            {address.phone && (
                                                <p className="text-xs text-muted-foreground">Phone: {address.phone}</p>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAddressModalOpen(false)}
                                    className="px-6 py-3 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const selectedIndex = addresses.findIndex((address, index) => getAddressKey(address, index) === selectedAddressKey)
                                        const selectedAddress = selectedIndex >= 0 ? addresses[selectedIndex] : addresses[0]
                                        setAddressModalOpen(false)
                                        await placeOrder(selectedAddress)
                                    }}
                                    className="px-6 py-3 bg-primary text-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                                >
                                    Continue Checkout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CartPage
