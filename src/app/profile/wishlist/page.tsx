"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useWishlist } from '@/components/providers/WishlistContext'
import ProductGrid from '@/components/shop/ProductGrid'

const WishlistPage = () => {
    const { wishlistItems, wishlistCount } = useWishlist()

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 min-h-screen">
            <div className="space-y-10 sm:space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-5 sm:gap-6 border-b border-primary/10 pb-8 sm:pb-12 text-center md:text-left">
                    <div className="w-full md:w-auto">
                        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter mb-3 sm:mb-4">My Wishlist</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            {wishlistCount} SAVED TREASURE(S)
                        </p>
                    </div>
                    <Link href="/shop" className="text-[10px] uppercase tracking-widest font-bold border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-all inline-flex items-center group">
                        Return to Shop <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {wishlistItems.length > 0 ? (
                    <ProductGrid products={wishlistItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        images: [item.image],
                        category: item.category
                    }))} />
                ) : (
                    <div className="text-center py-20 sm:py-32 bg-muted/5 border border-dashed border-primary/20">
                        <Heart className="h-12 w-12 text-primary/20 mx-auto mb-6" />
                        <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Your Wishlist is Empty</h2>
                        <p className="font-serif italic text-muted-foreground mb-12 max-w-md mx-auto">
                            Add the pieces that speak to you, and we'll keep them safe until you're ready to make them yours.
                        </p>
                        <Link href="/shop" className="px-10 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all inline-block">
                            Explore Collection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage

