"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, Heart, Diamond, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/providers/CartContext'
import { useWishlist } from '@/components/providers/WishlistContext'
import { useSession, signOut } from 'next-auth/react'
import SearchOverlay from './SearchOverlay'
import CurrencyDropdown from './CurrencyDropdown'

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { data: session } = useSession()

    const { cartCount } = useCart()
    const { wishlistCount } = useWishlist()

    const navLinks = [
        { name: 'Shop', href: '/shop' },
        { name: 'Custom', href: '/custom' },
    ]

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const safeWishlistCount = isMounted ? wishlistCount : 0
    const safeCartCount = isMounted ? cartCount : 0

    return (
        <>
            <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-3 sm:hidden hover:bg-primary/10 transition-colors rounded-full cursor-pointer"
                            >
                                <Menu className="h-6 w-6 text-primary" />
                            </button>
                            <div className="hidden sm:flex space-x-8 text-sm uppercase tracking-widest font-medium">
                                {navLinks.slice(0, 3).map((link) => (
                                    <Link key={link.name} href={link.href} className="luxury-link transition-colors">
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 group-hover:border-primary transition-all duration-300 shadow-sm shadow-primary/5">
                                    <Diamond className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="hidden lg:flex flex-col items-center">
                                    <span className="text-xl font-bold tracking-tighter gold-text uppercase leading-none">Shree Radha Govind</span>
                                    <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground font-bold leading-none mt-1">Jewellers</span>
                                </div>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-shrink-0">
                            <div className="hidden sm:block">
                                <CurrencyDropdown />
                            </div>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-3 sm:p-2 hover:text-primary transition-colors cursor-pointer"
                            >
                                <Search className="h-6 w-6 sm:h-5 sm:w-5" />
                            </button>
                            <Link href="/profile/wishlist" className="p-3 sm:p-2 hover:text-primary transition-colors relative cursor-pointer">
                                <Heart className="h-6 w-6 sm:h-5 sm:w-5" />
                                <span
                                    suppressHydrationWarning
                                    className={`absolute top-0 right-0 h-4 w-4 bg-primary text-foreground text-[10px] flex items-center justify-center rounded-full ${safeWishlistCount > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    {safeWishlistCount}
                                </span>
                            </Link>

                            {session ? (
                                <Link href="/profile" className="p-2 hover:text-primary transition-colors flex items-center space-x-2 group cursor-pointer">
                                    <User className="h-6 w-6 sm:h-5 sm:w-5" />
                                    <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                                        {session.user?.name?.split(' ')[0]}
                                    </span>
                                </Link>
                            ) : (
                                <Link href="/auth/signin" className="p-2 hover:text-primary transition-colors flex items-center space-x-2 group cursor-pointer">
                                    <User className="h-6 w-6 sm:h-5 sm:w-5 text-muted-foreground group-hover:text-primary" />
                                    <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                                        Sign In
                                    </span>
                                </Link>
                            )}

                            <Link href="/cart" className="p-3 sm:p-2 hover:text-primary transition-colors relative cursor-pointer">
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

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-background sm:hidden"
                    >
                        <div className="flex flex-col h-full p-8 pt-24 space-y-8">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-6 left-4 p-2 hover:bg-primary/10 rounded-full transition-colors"
                            >
                                <X className="h-7 w-7 text-primary" />
                            </button>

                            <div className="space-y-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-2xl font-bold uppercase tracking-tighter hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-12 border-t border-primary/10">
                                <div className="mb-6">
                                    <CurrencyDropdown />
                                </div>
                                {session ? (
                                    <div className="space-y-6">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center space-x-4 group"
                                        >
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Account</p>
                                                <p className="text-lg font-bold uppercase tracking-tighter">{session.user?.name}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut()
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
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full py-4 bg-primary text-foreground text-center text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>

                            <div className="mt-auto pb-8">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold text-center">
                                    Shree Radha Govind Jewellers
                                </p>
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

