"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Heart } from 'lucide-react'
import { useWishlist } from '@/components/providers/WishlistContext'

const formatPrice = (value: unknown) => {
    const amount = Number(value)
    if (!Number.isFinite(amount)) {
        return null
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

const ProductGrid = ({ products, emptyMessage }: { products: any[], emptyMessage?: string }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-foreground font-serif italic">{emptyMessage || "No products available."}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product, i) => {
                const productId = product._id || product.id || (product.sys && product.sys.id)
                const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800'
                const displayPrice = formatPrice(product.price)

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
                                    src={imageUrl}
                                    alt={product.title || 'Jewellery product'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        const item = {
                                            id: productId,
                                            title: product.title,
                                            price: product.price,
                                            image: imageUrl,
                                            category: product.category
                                        }
                                        if (isInWishlist(productId)) {
                                            removeFromWishlist(productId)
                                        } else {
                                            addToWishlist(item)
                                        }
                                    }}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full border border-primary/25 bg-background/65 backdrop-blur-md shadow-sm shadow-black/20 hover:bg-background/85 hover:border-primary/45 transition-all group/heart"
                                >
                                    <Heart
                                        className={`h-4 w-4 transition-colors ${isInWishlist(productId) ? 'fill-primary text-primary' : 'text-foreground/70 group-hover/heart:text-primary'}`}
                                    />
                                </button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] py-3 bg-secondary text-foreground text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-center">
                                    Pick Your Brilliance
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-foreground group-hover:text-primary transition-colors">
                                        {product.title || 'Untitled Product'}
                                    </h3>
                                    <div className="flex items-center space-x-1 text-primary">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span className="text-[10px] font-bold">4.9</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">{product.category || 'Jewellery'}</p>
                                <p className="text-sm font-bold text-primary">{displayPrice || "Price on request"}</p>
                            </div>
                        </Link>
                    </motion.div>
                )
            })}
        </div>
    )
}

export default ProductGrid
