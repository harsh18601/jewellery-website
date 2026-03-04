"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, Diamond, X, ChevronDown, Heart, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/providers/CartContext'
import { useWishlist } from '@/components/providers/WishlistContext'
import { useSession, signOut } from 'next-auth/react'
import SearchOverlay from './SearchOverlay'
import type { NavbarLink } from '@/lib/contentful'

const Navbar = ({ navLinks = [] }: { navLinks?: NavbarLink[] }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
    const { data: session } = useSession()

    const { cartCount } = useCart()
    const { wishlistCount } = useWishlist()

    const safeCartCount = cartCount
    const safeWishlistCount = wishlistCount

    const toggleTheme = () => {
        if (typeof window === 'undefined') return
        const root = document.documentElement
        const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
        const next = current === 'dark' ? 'light' : 'dark'
        root.setAttribute('data-theme', next)
        try {
            localStorage.setItem('theme', next)
        } catch (error) {
            console.error('Failed to save theme preference:', error)
        }
    }

    return (
        <>
            <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-[0_8px_24px_-22px_rgba(201,157,45,0.65)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    setOpenMobileSection(null)
                                    setIsMobileMenuOpen(true)
                                }}
                                className="p-2.5 lg:hidden hover:bg-primary/10 transition-colors rounded-full cursor-pointer"
                                aria-label="Open menu"
                            >
                                <Menu className="h-6 w-6 text-primary" />
                            </button>
                            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 group-hover:border-primary transition-all duration-300 shadow-sm shadow-primary/5">
                                    <Diamond className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="hidden sm:flex flex-col items-start">
                                    <span className="text-[1.36rem] font-bold tracking-tighter gold-text uppercase leading-none">Shree Radha Govind</span>
                                    <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-bold leading-none mt-1">Jewellers</span>
                                </div>
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center justify-center flex-1 px-6">
                            <div className="flex items-center gap-10 text-xs uppercase tracking-widest font-semibold">
                                {navLinks.map((link) => (
                                    <div key={link.name} className="relative group">
                                        <Link
                                            href={link.href}
                                            className="inline-flex items-center gap-1 py-2 transition-colors luxury-link"
                                        >
                                            {link.name}
                                            {link.children && link.children.length > 0 ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                                        </Link>
                                        {link.children && link.children.length > 0 ? (
                                            <div className="pointer-events-none opacity-0 translate-y-2 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 absolute left-0 top-full min-w-[220px] border border-primary/30 bg-background/95 backdrop-blur-lg shadow-xl shadow-black/30 z-50">
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className="block px-4 py-3 text-[11px] uppercase tracking-wider text-foreground/90 hover:bg-primary/10 hover:text-primary transition-colors"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 sm:p-2 hover:text-primary transition-colors cursor-pointer"
                                aria-label="Toggle theme"
                                title="Toggle theme"
                            >
                                <Moon className="theme-dark-only h-6 w-6 sm:h-5 sm:w-5" />
                                <Sun className="theme-light-only h-6 w-6 sm:h-5 sm:w-5" />
                            </button>

                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2.5 sm:p-2 hover:text-primary transition-colors cursor-pointer"
                                aria-label="Open search"
                            >
                                <Search className="h-6 w-6 sm:h-5 sm:w-5" />
                            </button>

                            <Link
                                href={session ? '/profile' : '/auth/signin'}
                                className="p-2.5 sm:p-2 hover:text-primary transition-colors cursor-pointer"
                                aria-label={session ? 'Account' : 'Sign in'}
                            >
                                <User className="h-6 w-6 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary" />
                            </Link>

                            <Link href="/profile/wishlist" className="p-2.5 sm:p-2 hover:text-primary transition-colors relative cursor-pointer" aria-label="Wishlist">
                                <Heart className="h-6 w-6 sm:h-5 sm:w-5" />
                                <span
                                    suppressHydrationWarning
                                    className={`absolute top-0 right-0 h-4 w-4 bg-primary text-foreground text-[10px] flex items-center justify-center rounded-full ${safeWishlistCount > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    {safeWishlistCount}
                                </span>
                            </Link>

                            <Link href="/cart" className="p-2.5 sm:p-2 hover:text-primary transition-colors relative cursor-pointer" aria-label="Cart">
                                <ShoppingBag className="h-6 w-6 sm:h-5 sm:w-5" />
                                <span
                                    suppressHydrationWarning
                                    className={`absolute top-0 right-0 h-4 w-4 bg-primary text-foreground text-[10px] flex items-center justify-center rounded-full ${safeCartCount > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    {safeCartCount}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-background lg:hidden"
                    >
                        <div className="flex flex-col h-full p-6 pt-20 space-y-6 overflow-y-auto">
                            <button
                                onClick={() => {
                                    setOpenMobileSection(null)
                                    setIsMobileMenuOpen(false)
                                }}
                                className="absolute top-6 left-4 p-2 hover:bg-primary/10 rounded-full transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="h-7 w-7 text-primary" />
                            </button>

                            <div className="space-y-2">
                                {navLinks.map((link) => (
                                    <div key={link.name} className="border-b border-primary/10 pb-2">
                                        {link.children && link.children.length > 0 ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenMobileSection((prev) => (prev === link.name ? null : link.name))}
                                                    className="w-full flex items-center justify-between py-3 text-left"
                                                >
                                                    <span className="text-lg font-bold uppercase tracking-tight transition-colors hover:text-primary">
                                                        {link.name}
                                                    </span>
                                                    <ChevronDown className={`h-4 w-4 text-primary transition-transform ${openMobileSection === link.name ? 'rotate-180' : ''}`} />
                                                </button>
                                                <AnimatePresence initial={false}>
                                                    {openMobileSection === link.name && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.22 }}
                                                            className="overflow-hidden pl-4"
                                                        >
                                                            <div className="pl-3 border-l border-primary/20 space-y-2 pb-2">
                                                                <Link
                                                                    href={link.href}
                                                                    onClick={() => {
                                                                        setOpenMobileSection(null)
                                                                        setIsMobileMenuOpen(false)
                                                                    }}
                                                                    className="block text-[11px] uppercase tracking-widest text-primary/90 hover:text-primary transition-colors"
                                                                >
                                                                    View All
                                                                </Link>
                                                                {link.children.map((child) => (
                                                                    <Link
                                                                        key={child.name}
                                                                        href={child.href}
                                                                        onClick={() => {
                                                                            setOpenMobileSection(null)
                                                                            setIsMobileMenuOpen(false)
                                                                        }}
                                                                        className="block text-sm uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                                                                    >
                                                                        {child.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                onClick={() => {
                                                    setOpenMobileSection(null)
                                                    setIsMobileMenuOpen(false)
                                                }}
                                                className="block py-3 text-lg font-bold uppercase tracking-tight transition-colors hover:text-primary"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-primary/10">
                                {session ? (
                                    <div className="space-y-6">
                                        <Link
                                            href="/profile"
                                            onClick={() => {
                                                setOpenMobileSection(null)
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="flex items-center space-x-4 group"
                                        >
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Account</p>
                                                <p className="text-lg font-bold uppercase tracking-tight">{session.user?.name}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut()
                                                setOpenMobileSection(null)
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className="w-full py-4 border border-primary/20 text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/signin"
                                        onClick={() => {
                                            setOpenMobileSection(null)
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="block w-full py-4 bg-primary text-foreground text-center text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

export default Navbar
