"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RichTextRenderer } from '@/lib/richTextRenderer'
import { ShoppingBag, Heart, Share2, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { useCart } from '@/components/providers/CartContext'

interface ProductDetailClientProps {
    product: any;
}

const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
    const { addToCart } = useCart()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)

    const handleAddToCart = () => {
        setIsAdding(true)
        addToCart({
            id: product.id || product._id,
            title: product.title,
            price: product.price,
            category: product.category || 'Jewellery',
            image: product.images?.[0] || '',
            quantity: quantity,
            description: product.description,
        })
        setTimeout(() => setIsAdding(false), 1000)
    }

    const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000']

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative aspect-square bg-secondary overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            src={images[selectedImage]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                </motion.div>

                <div className="grid grid-cols-4 gap-4">
                    {images.map((img: string, i: number) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`aspect-square bg-secondary overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <img src={img} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-primary text-xs uppercase tracking-[0.3em] font-bold mb-2">{product.category}</p>
                            <h1 className="text-4xl font-bold tracking-tight uppercase">{product.title}</h1>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 border border-secondary/10 hover:bg-secondary/5 transition-colors rounded-full">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="p-2 border border-secondary/10 hover:bg-secondary/5 transition-colors rounded-full">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-primary">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'fill-current' : ''}`} />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground font-serif italic border-l border-secondary/10 pl-4">48 REVIEWS</span>
                    </div>

                    <p className="text-3xl font-bold text-secondary">₹{product.price.toLocaleString()}</p>
                </div>

                <div className="text-muted-foreground font-serif">
                    <RichTextRenderer content={product.description} />
                    {!product.description && (
                        <p className="leading-relaxed">Detailed description available in Contentful.</p>
                    )}
                </div>

                <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center border border-secondary/10">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 hover:bg-secondary/5 transition-colors"
                            >-</button>
                            <span className="px-4 font-bold min-w-[3rem] text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-2 hover:bg-secondary/5 transition-colors"
                            >+</button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`flex-1 py-4 bg-primary text-background uppercase tracking-widest text-xs font-bold transition-all relative overflow-hidden ${isAdding ? 'bg-green-600' : 'hover:bg-primary/90'}`}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isAdding ? 'Added to Bag' : (
                                    <>
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Add to Shopping Bag
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-secondary/5">
                    <div className="flex items-center space-x-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Insured Delivery</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Priority Shipping</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <RefreshCw className="h-5 w-5 text-primary" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Easy Returns</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailClient
