"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/components/providers/CartContext'
import { useWishlist } from '@/components/providers/WishlistContext'
import { useSession, signOut } from 'next-auth/react'
import SearchOverlay from './SearchOverlay'

const Navbar = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const { data: session } = useSession()

    const { cartCount } = useCart()
    const { wishlistCount } = useWishlist()

    return (
        <>
            <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <button className="p-2 sm:hidden">
                                <Menu className="h-6 w-6 text-primary" />
                            </button>
                            <div className="hidden sm:flex space-x-8 text-sm uppercase tracking-widest font-medium">
                                <Link href="/shop" className="luxury-link transition-colors">Shop</Link>
                                <Link href="/custom" className="luxury-link transition-colors">Custom</Link>
                                <Link href="/about" className="luxury-link transition-colors">Our Story</Link>
                            </div>
                        </div>

                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-2xl font-bold tracking-tighter gold-text uppercase">
                                Radha Govind
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 sm:space-x-6">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:text-primary transition-colors cursor-pointer"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                            <Link href="/profile/wishlist" className="p-2 hover:text-primary transition-colors relative cursor-pointer">
                                <Heart className="h-5 w-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-background text-[10px] flex items-center justify-center rounded-full">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {session ? (
                                <Link href="/profile" className="p-2 hover:text-primary transition-colors flex items-center space-x-2 group cursor-pointer">
                                    <User className="h-5 w-5" />
                                    <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                                        {session.user?.name?.split(' ')[0]}
                                    </span>
                                </Link>
                            ) : (
                                <Link href="/auth/signin" className="p-2 hover:text-primary transition-colors flex items-center space-x-2 group cursor-pointer">
                                    <User className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                    <span className="hidden lg:inline text-[10px] uppercase tracking-widest font-bold group-hover:text-primary transition-colors">
                                        Sign In
                                    </span>
                                </Link>
                            )}

                            <Link href="/cart" className="p-2 hover:text-primary transition-colors relative cursor-pointer">
                                <ShoppingBag className="h-5 w-5" />
                                <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-background text-[10px] flex items-center justify-center rounded-full">{cartCount}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}

export default Navbar

