"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Package, MapPin, Heart, Clock, Plus, Sparkles, ArrowRight, Diamond, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useWishlist } from '@/components/providers/WishlistContext'

type Address = {
    id?: number
    street?: string
    city?: string
    state?: string
    zip?: string
    isDefault?: boolean
}

type RecentlyViewedItem = {
    id: string
    title: string
    image?: string
    slug?: string
}

const ProfileDashboard = () => {
    const { data: session } = useSession()
    const { wishlistCount } = useWishlist()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [ordersCount, setOrdersCount] = useState(0)
    const [recentlyViewed] = useState<RecentlyViewedItem[]>(() => {
        if (typeof window === 'undefined') return []
        try {
            const raw = localStorage.getItem('recentlyViewedProducts')
            if (!raw) return []
            const items = JSON.parse(raw)
            return Array.isArray(items) ? items.slice(0, 4) : []
        } catch {
            return []
        }
    })
    const [lastOrder, setLastOrder] = useState<{ date?: string; status?: string } | null>(null)

    useEffect(() => {
        if (!session) return

        const fetchUserData = async () => {
            try {
                const [userRes, ordersRes] = await Promise.all([
                    fetch('/api/user/sync'),
                    fetch('/api/orders'),
                ])

                if (userRes.ok) {
                    const data = await userRes.json()
                    setAddresses(data.addresses || [])
                }
                if (ordersRes.ok) {
                    const orderData = await ordersRes.json()
                    const orders = orderData.orders || []
                    setOrdersCount(orders.length)
                    if (orders.length > 0) {
                        const latest = orders[0]
                        setLastOrder({ date: latest?.createdAt, status: latest?.orderStatus || 'Processing' })
                    }
                }
            } catch (e) {
                console.error("Failed to fetch profile data", e)
            }
        }
        fetchUserData()
    }, [session])

    const primaryAddress = useMemo(() => {
        if (addresses.length === 0) return null
        return addresses.find((addr) => addr.isDefault) || addresses[0]
    }, [addresses])

    const welcomeName = session?.user?.name?.split(' ')[0] || 'Member'

    return (
        <div className="space-y-8">
            <section className="bg-muted/10 p-10 border border-primary/10">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold uppercase tracking-widest gold-text">Welcome back, {welcomeName}</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-2">
                        You have {ordersCount} order(s) and {wishlistCount} saved design(s) waiting for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Link href="/shop" className="flex items-center justify-center gap-2 bg-primary text-black py-3 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
                        <ShoppingBag className="h-4 w-4" /> Continue Shopping
                    </Link>
                    <Link href="/profile/orders" className="flex items-center justify-center gap-2 border border-primary/30 py-3 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">
                        <Package className="h-4 w-4" /> View Orders
                    </Link>
                    <Link href="/shop?category=lab-grown-diamonds" className="flex items-center justify-center gap-2 border border-primary/30 py-3 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">
                        <Diamond className="h-4 w-4" /> Browse Lab Diamonds
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            label: 'Total Orders',
                            value: ordersCount.toString(),
                            subtext: lastOrder?.date ? `Last order: ${new Date(lastOrder.date).toLocaleDateString('en-IN')}` : 'No orders yet',
                            icon: Package,
                            href: '/profile/orders'
                        },
                        {
                            label: 'Saved Items',
                            value: wishlistCount.toString(),
                            subtext: wishlistCount > 0 ? `${wishlistCount} item(s) in wishlist` : '0 items saved - Explore jewellery',
                            icon: Heart,
                            href: '/profile/wishlist'
                        },
                        {
                            label: 'Active Requests',
                            value: '0',
                            subtext: 'No active consultations - Book now',
                            icon: Clock,
                            href: '/consultation'
                        }
                    ].map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-background border border-primary/5 p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                        >
                            <stat.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-[11px] text-muted-foreground mt-2">{stat.subtext}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-muted/10 p-10 border border-primary/10 min-h-[240px] flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center justify-between">
                        <span className="inline-flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            Primary Address
                        </span>
                        {primaryAddress?.isDefault && (
                            <span className="text-[10px] uppercase tracking-widest px-2 py-1 border border-primary/40 text-primary">Default</span>
                        )}
                    </h3>

                    {primaryAddress ? (
                        <>
                            <p className="text-xs text-muted-foreground font-serif leading-relaxed mb-6">
                                {primaryAddress.street},<br />
                                {primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip}
                            </p>
                            <div className="mt-auto flex flex-wrap gap-3">
                                <Link href="/profile/addresses" className="text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-primary/30 hover:bg-primary/10 transition-colors">Edit</Link>
                                <Link href="/profile/addresses" className="text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-primary/30 hover:bg-primary/10 transition-colors">Add New Address</Link>
                                {!primaryAddress.isDefault && (
                                    <Link href="/profile/addresses" className="text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-primary/30 hover:bg-primary/10 transition-colors">Set Default</Link>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-primary/20 p-6">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">No Primary Address Set</p>
                            <Link
                                href="/profile/addresses"
                                className="flex items-center text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary/80 transition-all"
                            >
                                <Plus className="h-3 w-3 mr-1" /> Add New Address
                            </Link>
                        </div>
                    )}
                </div>

                <div className="relative overflow-hidden p-10 border border-primary/20 bg-gradient-to-br from-secondary via-secondary to-primary/10 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Personal Stylist</h3>
                    <p className="text-[11px] text-foreground/70">Get 1:1 expert guidance for your next custom design.</p>
                    <Link href="/consultation" className="px-5 py-3 bg-primary text-black text-[10px] uppercase tracking-widest font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-2">
                        Book Consultation <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </section>

            <section className="bg-muted/10 p-10 border border-primary/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest">Recently Viewed</h3>
                    <Link href="/shop" className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">Explore More</Link>
                </div>
                {recentlyViewed.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {recentlyViewed.map((item) => (
                            <Link key={item.id} href={item.slug ? `/product/${item.slug}` : '/shop'} className="border border-primary/20 p-3 hover:border-primary/40 transition-colors">
                                <div className="aspect-square bg-muted/20 border border-primary/10 overflow-hidden">
                                    {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : null}
                                </div>
                                <p className="mt-2 text-xs font-bold line-clamp-2">{item.title}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border border-dashed border-primary/20">
                        <p className="text-sm text-muted-foreground">No recently viewed designs yet.</p>
                        <Link href="/shop" className="mt-4 inline-block text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">Explore Jewellery</Link>
                    </div>
                )}
            </section>
        </div>
    )
}

export default ProfileDashboard
