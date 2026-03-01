"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Package, MapPin, Heart, Clock, Plus } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useWishlist } from '@/components/providers/WishlistContext'

const ProfileDashboard = () => {
    const { data: session } = useSession()
    const { wishlistCount } = useWishlist()
    const [addresses, setAddresses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (session) {
            const fetchUserData = async () => {
                try {
                    const res = await fetch('/api/user/sync')
                    if (res.ok) {
                        const data = await res.json()
                        setAddresses(data.addresses || [])
                    }
                } catch (e) {
                    console.error("Failed to fetch profile data", e)
                } finally {
                    setIsLoading(false)
                }
            }
            fetchUserData()
        }
    }, [session])

    const primaryAddress = addresses.length > 0 ? addresses[0] : null

    return (
        <div className="space-y-8">
            <section className="bg-muted/10 p-10 border border-primary/10">
                <div className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest gold-text">Welcome Back, {session?.user?.name || 'Member'}</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-2">Your personalized experience awaits.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { label: 'Total Orders', value: '00', icon: Package, href: '/profile/orders' },
                        { label: 'Saved Items', value: wishlistCount.toString().padStart(2, '0'), icon: Heart, href: '/profile/wishlist' },
                        { label: 'Active Requests', value: '00', icon: Clock, href: '/custom' }
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
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-muted/10 p-10 border border-primary/10 min-h-[200px] flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Primary Address
                    </h3>

                    {primaryAddress ? (
                        <>
                            <p className="text-xs text-muted-foreground font-serif leading-relaxed mb-6">
                                {primaryAddress.street},<br />
                                {primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip}
                            </p>
                            <Link href="/profile/addresses" className="mt-auto text-[10px] uppercase tracking-widest font-bold border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-all w-fit">Manage</Link>
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

                <div className="bg-secondary p-10 border border-primary/10 flex flex-col justify-center items-center text-center space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Personal Stylist</h3>
                    <p className="text-[10px] text-foreground/60 uppercase tracking-widest">Expert guidance for your next masterpiece.</p>
                    <Link href="/consultation" className="text-xs uppercase tracking-widest font-bold text-primary border-b border-primary pb-1 hover:text-primary-foreground transition-all flex items-center">
                        Book Consultation
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default ProfileDashboard


