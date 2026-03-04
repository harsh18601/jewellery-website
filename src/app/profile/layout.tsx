"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Package, MapPin, Settings, LogOut, Heart, Camera, LayoutDashboard } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const { data: session } = useSession()
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [avatar, setAvatar] = useState('')
    const hideSidebarOnMobile = pathname === '/profile/wishlist'

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/sync')
                if (!res.ok) return
                const data = await res.json()
                setAvatar(data.avatar || '')
            } catch (e) {
                console.error('Failed to load profile avatar', e)
            }
        }
        fetchProfile()
    }, [])

    const navItems = [
        { icon: LayoutDashboard, text: 'Overview', href: '/profile' },
        { icon: Package, text: 'My Orders', href: '/profile/orders' },
        { icon: Heart, text: 'Wishlist', href: '/profile/wishlist' },
        { icon: MapPin, text: 'Addresses', href: '/profile/addresses' },
        { icon: Settings, text: 'Account Settings', href: '/profile/settings' },
    ]

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async () => {
            const dataUrl = typeof reader.result === 'string' ? reader.result : ''
            if (!dataUrl) return
            setAvatar(dataUrl)
            try {
                await fetch('/api/user/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ avatar: dataUrl }),
                })
            } catch (err) {
                console.error('Failed to save avatar', err)
            }
        }
        reader.readAsDataURL(file)
        e.currentTarget.value = ''
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <div className="md:hidden mb-6 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 min-w-max border border-primary/10 p-2 bg-muted/10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-all ${isActive ? 'bg-primary text-foreground' : 'border border-primary/20 text-foreground/80'}`}
                            >
                                <item.icon className="h-3.5 w-3.5" />
                                <span>{item.text}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <aside className={`space-y-8 ${hideSidebarOnMobile ? 'hidden md:block' : ''}`}>
                    <div className="pb-8 border-b border-primary/10">
                        <div className="flex items-start md:items-center space-x-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border border-primary/30 bg-primary/10 overflow-hidden flex items-center justify-center group">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-8 w-8 text-primary" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-black flex items-center justify-center hover:bg-primary/90 hover:scale-110 transition-all"
                                    title="Upload profile photo"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="text-left">
                                <h1 className="font-bold uppercase tracking-tight text-left">
                                    {session?.user?.name || "Boutique Member"}
                                </h1>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-left">
                                    {session?.user?.email}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="text-[10px] uppercase tracking-widest font-bold text-primary mt-1 hover:text-primary/80 transition-colors"
                                >
                                    Upload Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    <nav className="hidden md:flex flex-col space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-4 text-xs uppercase tracking-widest font-bold transition-all border-l-2 ${isActive
                                        ? 'bg-gradient-to-r from-primary/12 to-primary/4 text-primary border-primary/70'
                                        : 'border-transparent hover:bg-secondary hover:text-foreground'
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

                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default ProfileLayout
