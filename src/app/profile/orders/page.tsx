"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useCurrency } from '@/components/providers/CurrencyContext'

const OrdersPage = () => {
    const { data: session, status } = useSession()
    const { formatPrice } = useCurrency()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

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
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col sm:flex-row justify-between items-center p-6 bg-background border border-primary/5 hover:border-primary/20 transition-all"
                        >
                            <div className="flex flex-col space-y-1">
                                <span className="text-xs font-bold uppercase tracking-widest">#{order._id}</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                                <p className="text-xs font-serif italic mt-2">{order.products?.length || 0} item(s)</p>
                            </div>
                            <div className="flex items-center space-x-8 mt-4 sm:mt-0">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold">{formatPrice(Number(order.totalPrice || 0))}</span>
                                    <span className="text-[10px] uppercase text-primary font-bold">{order.orderStatus}</span>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-bold border-b border-secondary pb-1 text-muted-foreground">Invoice Soon</span>
                            </div>
                        </motion.div>
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
