"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star, Heart } from 'lucide-react'
import { useWishlist } from '@/components/providers/WishlistContext'

const ProductGrid = ({ products }: { products: any[] }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground font-serif italic">Discovering gems for you...</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className="aspect-[4/5] bg-muted/20" />
                            <div className="h-4 bg-muted/20 w-3/4" />
                            <div className="h-4 bg-muted/20 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, i) => {
                const productId = product._id || product.id || (product.sys && product.sys.id);
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={productId}
                        className="group cursor-pointer active:scale-[0.98] luxury-card bg-background p-4 border border-primary/5"
                    >
                        <Link href={`/product/${productId}`} className="block">
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-secondary">
                                <img
                                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Wishlist Toggle */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const item = {
                                            id: productId,
                                            title: product.title,
                                            price: product.price,
                                            image: product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
                                            category: product.category
                                        };
                                        if (isInWishlist(productId)) {
                                            removeFromWishlist(productId);
                                        } else {
                                            addToWishlist(item);
                                        }
                                    }}
                                    className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-background transition-all group/heart"
                                >
                                    <Heart
                                        className={`h-4 w-4 transition-colors ${isInWishlist(productId) ? 'fill-primary text-primary' : 'text-secondary group-hover/heart:text-primary'}`}
                                    />
                                </button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] py-3 bg-secondary text-background text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-center">
                                    Pick Your Brilliance
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xs uppercase tracking-widest font-bold group-hover:text-primary transition-colors">{product.title}</h3>
                                    <div className="flex items-center space-x-1 text-primary">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span className="text-[10px] font-bold">4.9</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{product.category}</p>
                                <p className="text-sm font-bold text-secondary">₹{product.price.toLocaleString()}</p>
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    )
}

export default ProductGrid
