"use client"

import React, { useState } from 'react'
import { ShoppingBag, Trash2, ArrowRight, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartContext'
import { useSession } from 'next-auth/react'
import { createOrder } from '@/actions/orderActions'
import { useCurrency } from '@/components/providers/CurrencyContext'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

const CartPage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()
    const { formatPrice } = useCurrency()
    const [addresses, setAddresses] = useState<any[]>([])
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [selectedAddressKey, setSelectedAddressKey] = useState<string>('')
    const [isAddressLoading, setIsAddressLoading] = useState(false)
    const [checkoutModal, setCheckoutModal] = useState({
        open: false,
        title: '',
        message: '',
        isSuccess: true,
    })

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const total = subtotal * 1.03

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
                    quantity: item.quantity,
                    price: item.price
                })),
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16">
                <div className="flex-grow space-y-10 sm:space-y-12 w-full">
                    <div className="space-y-4 text-center flex flex-col items-center">
                        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2 text-center">Shopping Bag</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">
                            {cartItems.length} ITEM(S) IN YOUR BAG
                        </p>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="space-y-8">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-6 sm:gap-8 border-b border-primary/10 pb-8">
                                    <div className="w-full h-52 sm:w-32 sm:h-40 bg-secondary flex-shrink-0 overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                    </div>

                                    <div className="flex-grow space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-bold uppercase tracking-widest">{item.title}</h3>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">{item.category}</p>
                                                {item.description && (
                                                    <p className="text-[10px] text-muted-foreground/60 line-clamp-2 font-serif italic max-w-md">
                                                        {typeof item.description === 'string'
                                                            ? item.description
                                                            : 'Premium quality handcrafted piece.'}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 sm:pt-4">
                                            <div className="flex items-center space-x-4 border border-primary/20 px-4 py-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
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
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-muted/5 border border-dashed border-primary/20">
                            <ShoppingBag className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                            <p className="font-serif italic text-muted-foreground mb-8">Your shopping bag is as empty as a clear gemstone.</p>
                            <Link
                                href="/shop"
                                className="inline-block px-10 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary/90 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 transform"
                            >
                                Shop Our Collection
                            </Link>
                        </div>
                    )}
                </div>

                <aside className="w-full md:w-96 bg-muted/5 p-6 sm:p-10 border border-primary/10 space-y-8 md:sticky md:top-32">
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-8 gold-text">Summary</h2>

                    <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax (GST)</span>
                            <span>{formatPrice(subtotal * 0.03)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-primary">FREE</span>
                        </div>
                        <div className="border-t border-primary/20 pt-4 flex justify-between text-base">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
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

                    <div className="text-[10px] text-muted-foreground text-center font-serif italic py-4">
                        Security & Authenticity Guaranteed. Secure checkout via Razorpay/Stripe.
                    </div>
                </aside>
            </div>

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
