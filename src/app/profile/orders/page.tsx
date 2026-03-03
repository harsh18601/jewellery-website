"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useCurrency } from '@/components/providers/CurrencyContext'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/providers/CartContext'
import { ChevronDown } from 'lucide-react'

const OrdersPage = () => {
    const router = useRouter()
    const { addToCart } = useCart()
    const { data: session, status } = useSession()
    const { formatPrice } = useCurrency()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({})
    const [expandedTrackingIds, setExpandedTrackingIds] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (status === 'loading') return
        if (!session) {
            setOrders([])
            setIsLoading(false)
            return
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders')
                if (res.ok) {
                    const data = await res.json()
                    setOrders(data.orders || [])
                } else {
                    setOrders([])
                }
            } catch (e) {
                console.error('Failed to fetch orders', e)
                setOrders([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [session, status])

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

    const getOrderIdLabel = (order: any, index: number) => {
        const year = new Date(order.createdAt).getFullYear()
        const rawId = String(order._id || '')
        const parsed = Number.parseInt(rawId.slice(-6), 16)
        const serial = Number.isFinite(parsed) ? String(parsed % 100000).padStart(5, '0') : String(index + 1).padStart(5, '0')
        return `#SRGJ-${year}-${serial}`
    }

    const getExpectedDelivery = (date: string) => {
        const expected = new Date(date)
        expected.setDate(expected.getDate() + 5)
        return formatDate(expected.toISOString())
    }

    const getStatusMeta = (statusValue: string, paymentStatusValue?: string) => {
        const payment = String(paymentStatusValue || '').toLowerCase()
        const normalized = String(statusValue || '').toLowerCase()
        if (payment === 'pending' || payment === 'failed') {
            return {
                label: 'Payment Pending',
                icon: '⏳',
                classes: 'bg-amber-500/18 text-amber-300 border-amber-300/40 shadow-[0_0_14px_rgba(245,158,11,0.18)]'
            }
        }
        if (normalized === 'delivered') return { label: 'Delivered', classes: 'bg-green-500/15 text-green-400 border-green-400/30' }
        if (normalized === 'shipped') return { label: 'Shipped', classes: 'bg-blue-500/15 text-blue-400 border-blue-400/30' }
        if (normalized === 'cancelled') return { label: 'Cancelled', classes: 'bg-red-500/15 text-red-400 border-red-400/30' }
        return {
            label: 'Processing',
            icon: '⏳',
            classes: 'bg-amber-500/18 text-amber-300 border-amber-300/40 shadow-[0_0_14px_rgba(245,158,11,0.18)]'
        }
    }

    const getTimelineProgress = (statusValue: string, paymentStatusValue?: string) => {
        const payment = String(paymentStatusValue || '').toLowerCase()
        if (payment === 'pending' || payment === 'failed') return 10
        const normalized = String(statusValue || '').toLowerCase()
        if (normalized === 'delivered') return 100
        if (normalized === 'shipped') return 50
        if (normalized === 'processing') return 25
        return 0
    }

    const getTimelineStepState = (statusValue: string, step: string, paymentStatusValue?: string) => {
        const payment = String(paymentStatusValue || '').toLowerCase()
        const normalized = String(statusValue || '').toLowerCase()

        if (step === 'Order Placed') {
            return {
                isActive: payment === 'pending' || payment === 'failed',
                isComplete: payment !== 'pending' && payment !== 'failed',
            }
        }

        if (payment === 'pending' || payment === 'failed') {
            return { isActive: false, isComplete: false }
        }

        if (normalized === 'delivered') {
            return { isActive: false, isComplete: true }
        }

        if (normalized === 'shipped') {
            if (step === 'Processing') return { isActive: false, isComplete: true }
            if (step === 'Shipped') return { isActive: true, isComplete: false }
            return { isActive: false, isComplete: false }
        }

        if (normalized === 'processing') {
            if (step === 'Processing') return { isActive: true, isComplete: false }
            return { isActive: false, isComplete: false }
        }

        return { isActive: false, isComplete: false }
    }

    const toggleDetails = (orderId: string) => {
        setExpandedOrderIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
    }

    const toggleTracking = (orderId: string) => {
        setExpandedTrackingIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
    }

    const handleReorder = (order: any) => {
        const orderProducts = Array.isArray(order?.products) ? order.products : []
        orderProducts.forEach((product: any) => {
            if (!product?.productId) return
            addToCart({
                id: String(product.productId),
                title: product.productName || product.title || 'Jewellery Piece',
                price: Number(product.price || 0),
                category: product.category || 'Jewellery',
                image: product.productImage || product.image || product.images?.[0] || '',
                quantity: Math.max(1, Number(product.quantity || 1)),
                sku: product.sku || '',
                metalType: product.metalType || product.metal || '',
                metalPurity: product.metalPurity || '',
                metalWeight: Number(product.metalWeight || 0) || undefined,
                stoneType: product.stoneType || '',
                stoneShape: product.stoneShape || '',
                caratWeight: product.caratWeight || '',
                deliveryTime: product.deliveryTime || '',
                certification: product.certification || '',
            })
        })
        router.push('/cart')
    }

    return (
        <section className="bg-muted/10 p-10 border border-primary/10 min-h-[60vh]">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-8 gold-text">Order History</h2>
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 bg-muted/5 border border-dashed border-primary/20">
                        <p className="text-sm text-muted-foreground font-serif italic">Loading your orders...</p>
                    </div>
                ) : orders.length > 0 ? (
                    orders.map((order, i) => (
                        (() => {
                            const statusMeta = getStatusMeta(order.orderStatus, order.paymentStatus)
                            const canDownloadInvoice = ['shipped', 'delivered'].includes(String(order.orderStatus || '').toLowerCase())
                            return (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 bg-background border border-primary/5 hover:border-primary/20 transition-all space-y-5"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-5">
                                <div className="flex items-center gap-4 min-w-0">
                                    {(order.products?.[0]?.productImage || order.products?.[0]?.image || order.products?.[0]?.images?.[0]) ? (
                                        <img
                                            src={order.products?.[0]?.productImage || order.products?.[0]?.image || order.products?.[0]?.images?.[0]}
                                            alt={order.products?.[0]?.productName || order.products?.[0]?.title || order.products?.[0]?.name || 'Ordered product'}
                                            className="h-16 w-16 sm:h-20 sm:w-20 object-cover border border-primary/15 bg-muted/10 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 sm:h-20 sm:w-20 border border-primary/15 bg-muted/10 flex-shrink-0" />
                                    )}
                                    <div className="flex flex-col space-y-1 min-w-0">
                                        <span className="text-sm font-bold uppercase tracking-wide truncate">
                                            {order.products?.[0]?.productName || order.products?.[0]?.title || order.products?.[0]?.name || 'Jewellery Piece'}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            Order ID: {getOrderIdLabel(order, i)}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                            {formatDate(order.createdAt)}
                                        </span>
                                        <span className="text-[10px] text-primary uppercase tracking-widest font-bold">
                                            Expected Delivery: {getExpectedDelivery(order.createdAt)}
                                        </span>
                                        <p className="text-xs font-serif italic mt-1">
                                            {order.products?.length || 0} item(s)
                                            {(order.products?.length || 0) > 1 ? ` | +${(order.products?.length || 0) - 1} more` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-5 mt-2 sm:mt-0">
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[20px] leading-none font-bold">{formatPrice(Number(order.totalPrice || 0))}</span>
                                        <span className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-[999px] border inline-flex items-center gap-1.5 ${statusMeta.classes}`}>
                                            {statusMeta.icon ? <span>{statusMeta.icon}</span> : null}
                                            {statusMeta.label}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        title={canDownloadInvoice ? 'Download your invoice' : 'Available after order is shipped'}
                                        disabled={!canDownloadInvoice}
                                        className="text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-primary/25 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/45 transition-colors"
                                    >
                                        Download Invoice
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {['processing', 'shipped'].includes(String(order.orderStatus || '').toLowerCase()) && (
                                    <button
                                        type="button"
                                        onClick={() => toggleTracking(String(order._id))}
                                        className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:bg-primary/10 transition-colors"
                                    >
                                        Track Order
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => toggleDetails(String(order._id))}
                                    className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:bg-primary/10 transition-colors inline-flex items-center gap-2"
                                >
                                    View Details
                                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedOrderIds[String(order._id)] ? 'rotate-180' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleReorder(order)}
                                    className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold border border-primary/30 hover:bg-primary/10 transition-colors"
                                >
                                    Buy Again
                                </button>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Need help with this order? <a href="/consultation" className="text-primary hover:underline">Contact Support</a>
                            </p>

                            {expandedTrackingIds[String(order._id)] && (
                                <div className="mt-3 space-y-3 border border-primary/10 bg-muted/5 p-4">
                                    <div className="h-px w-full bg-primary/30" />
                                    <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${getTimelineProgress(order.orderStatus, order.paymentStatus)}%` }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] uppercase tracking-widest">
                                        {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step) => {
                                            const state = getTimelineStepState(order.orderStatus, step, order.paymentStatus)
                                            return (
                                                <span
                                                    key={step}
                                                    className={`${state.isActive || state.isComplete ? 'text-primary font-bold' : 'text-muted-foreground'} inline-flex items-center gap-1`}
                                                >
                                                    <span>{state.isActive ? '🟡' : state.isComplete ? '🟢' : '⚪'}</span>
                                                    {step}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {expandedOrderIds[String(order._id)] && (
                                <div className="mt-3 border border-primary/10 bg-muted/5 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="md:col-span-2 space-y-2">
                                        <div className="h-px w-full bg-primary/30" />
                                        <p className="uppercase tracking-widest text-[10px] text-muted-foreground">Order Timeline</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] uppercase tracking-widest">
                                            {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step) => {
                                                const state = getTimelineStepState(order.orderStatus, step, order.paymentStatus)
                                                return (
                                                    <span
                                                        key={step}
                                                        className={`${state.isActive || state.isComplete ? 'text-primary font-bold' : 'text-muted-foreground'} inline-flex items-center gap-1`}
                                                    >
                                                        <span>{state.isActive ? '🟡' : state.isComplete ? '🟢' : '⚪'}</span>
                                                        {step}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="uppercase tracking-widest text-[10px] text-muted-foreground">Billing Address</p>
                                        <p>{order.shippingAddress?.name || 'N/A'}</p>
                                        <p>{order.shippingAddress?.street || 'N/A'}</p>
                                        <p>{order.shippingAddress?.city || ''} {order.shippingAddress?.state || ''} {order.shippingAddress?.zip || ''}</p>
                                        <p>{order.shippingAddress?.country || 'India'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="uppercase tracking-widest text-[10px] text-muted-foreground">Shipping Address</p>
                                        <p>{order.shippingAddress?.name || 'N/A'}</p>
                                        <p>{order.shippingAddress?.street || 'N/A'}</p>
                                        <p>{order.shippingAddress?.city || ''} {order.shippingAddress?.state || ''} {order.shippingAddress?.zip || ''}</p>
                                        <p>{order.shippingAddress?.country || 'India'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="uppercase tracking-widest text-[10px] text-muted-foreground">Payment Method</p>
                                        <p>{String(order.paymentStatus || '').toLowerCase() === 'paid' ? 'Online Payment (Razorpay) - Successful' : 'Online Payment (Razorpay) - Pending'}</p>
                                        <p className="uppercase tracking-widest text-[10px] text-muted-foreground mt-3">Delivery Estimate</p>
                                        <p>{getExpectedDelivery(order.createdAt)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="uppercase tracking-widest text-[10px] text-muted-foreground">Order Summary</p>
                                        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(Number(order.totalPrice || 0) / 1.03)}</span></div>
                                        <div className="flex justify-between"><span>Taxes</span><span>{formatPrice(Number(order.totalPrice || 0) - (Number(order.totalPrice || 0) / 1.03))}</span></div>
                                        <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(Number(order.totalPrice || 0))}</span></div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                            )
                        })()
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/5 border border-dashed border-primary/20">
                        <p className="text-sm text-muted-foreground font-serif italic">Your journey with us is just beginning. Your order history will appear here once you place your first order.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default OrdersPage
