"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const { data: session } = useSession()
    const hideSidebarOnMobile = pathname === '/profile/wishlist'

    const navItems = [
        { icon: Package, text: 'My Orders', href: '/profile/orders' },
        { icon: MapPin, text: 'Manage Addresses', href: '/profile/addresses' },
        { icon: Settings, text: 'Account Settings', href: '/profile/settings' },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar */}
                <aside className={`space-y-8 ${hideSidebarOnMobile ? 'hidden md:block' : ''}`}>
                    <div className="flex items-center space-x-4 pb-8 border-b border-primary/10">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold uppercase tracking-tight">
                                {session?.user?.name || "Boutique Member"}
                            </h1>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-col space-y-1">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-4 text-xs uppercase tracking-widest font-bold transition-all ${isActive
                                        ? 'bg-primary text-foreground'
                                        : 'hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.text}</span>
                                </Link>
                            )
                        })}
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center space-x-3 p-4 text-xs uppercase tracking-widest font-bold border border-transparent hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive transition-all duration-300 w-full text-left group cursor-pointer"
                        >
                            <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                            <span>Sign Out</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default ProfileLayout

