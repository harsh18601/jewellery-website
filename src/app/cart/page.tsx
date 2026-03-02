"use client"

import React, { useState } from 'react'
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartContext'
import { useSession } from 'next-auth/react'
import { createOrder } from '@/actions/orderActions'

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(value)

const CartPage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
    const { cartItems, removeFromCart, updateQuantity } = useCart()

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const total = subtotal * 1.03

    const handleCheckout = async () => {
        if (!session) {
            router.push('/auth/signin?callbackUrl=/cart')
            return
        }

        if (cartItems.length === 0) return

        setIsCheckoutLoading(true)
        try {
            const orderData = {
                userId: (session.user as any).id || session.user?.email,
                products: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalPrice: total,
                paymentStatus: 'Pending',
                orderStatus: 'Processing'
            }

            const result = await createOrder(orderData)
            if (result.success) {
                alert(`Order placed successfully! Order ID: ${result.orderId}`)
            } else {
                alert('Failed to place order. Please try again.')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('An unexpected error occurred.')
        } finally {
            setIsCheckoutLoading(false)
        }
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
                                            <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
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
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax (GST)</span>
                            <span>{formatCurrency(subtotal * 0.03)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-primary">FREE</span>
                        </div>
                        <div className="border-t border-primary/20 pt-4 flex justify-between text-base">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isCheckoutLoading || cartItems.length === 0}
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
        </div>
    )
}

export default CartPage
