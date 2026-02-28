"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Package, MapPin, Heart, Clock } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const ProfileDashboard = () => {
    const { data: session } = useSession()

    return (
        <div className="space-y-8">
            <section className="bg-muted/10 p-10 border border-primary/10">
                <div className="mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest gold-text">Welcome Back, {session?.user?.name || 'Member'}</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-2">Your personalized experience awaits.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { label: 'Total Orders', value: '02', icon: Package, href: '/profile/orders' },
                        { label: 'Saved Items', value: '05', icon: Heart, href: '/profile/wishlist' }, // Wishlist placeholder
                        { label: 'Active Requests', value: '01', icon: Clock, href: '/custom' }
                    ].map((stat, i) => (
                        <Link
                            key={i}
                            href={stat.href}
                            className="bg-background border border-primary/5 p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/20 transition-all group"
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
                <div className="bg-muted/10 p-10 border border-primary/10">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        Primary Address
                    </h3>
                    <p className="text-xs text-muted-foreground font-serif leading-relaxed mb-6">
                        123 Pink City Square,<br />
                        Jaipur, Rajasthan 302001
                    </p>
                    <Link href="/profile/addresses" className="text-[10px] uppercase tracking-widest font-bold border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-all">Manage</Link>
                </div>

                <div className="bg-secondary p-10 border border-primary/10 flex flex-col justify-center items-center text-center space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-background">Personal Stylist</h3>
                    <p className="text-[10px] text-background/60 uppercase tracking-widest">Expert guidance for your next masterpiece.</p>
                    <Link href="/consultation" className="text-xs uppercase tracking-widest font-bold text-primary border-b border-primary pb-1 hover:text-primary-foreground transition-all flex items-center">
                        Book Consultation
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default ProfileDashboard

