"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RichTextRenderer } from '@/lib/richTextRenderer'
import { ShoppingBag, Heart, Share2, Star, ShieldCheck, Truck, RefreshCw, ArrowLeft } from 'lucide-react'
import { useCart } from '@/components/providers/CartContext'
import { useRouter } from 'next/navigation'

interface ProductDetailClientProps {
    product: any;
}

const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
    const router = useRouter()
    const { addToCart } = useCart()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })

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
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(product.price || 0))

    const getZoomPoint = (clientX: number, clientY: number, rect: DOMRect) => {
        const x = ((clientX - rect.left) / rect.width) * 100
        const y = ((clientY - rect.top) / rect.height) * 100
        return {
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        }
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'touch') return
        const rect = e.currentTarget.getBoundingClientRect()
        setZoomPosition(getZoomPoint(e.clientX, e.clientY, rect))
        setIsZoomed(true)
    }

    const handlePointerLeave = () => {
        setIsZoomed(false)
    }

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!window.matchMedia('(hover: none)').matches) return
        const rect = e.currentTarget.getBoundingClientRect()
        setZoomPosition(getZoomPoint(e.clientX, e.clientY, rect))
        setIsZoomed((prev) => !prev)
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
            return
        }
        router.push('/shop')
    }

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative aspect-square bg-secondary overflow-hidden"
                        onPointerMove={handlePointerMove}
                        onPointerLeave={handlePointerLeave}
                        onClick={handleImageClick}
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
                                className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-[1.75] cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
                                style={{ transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                            />
                        </AnimatePresence>
                        <p className="pointer-events-none absolute bottom-3 right-3 bg-background/60 px-2 py-1 text-[10px] uppercase tracking-widest text-foreground/80">
                            {isZoomed ? 'Tap or move out to reset' : 'Hover or tap to zoom'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img: string, i: number) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedImage(i)
                                    setIsZoomed(false)
                                }}
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
                                <button className="p-2 border border-border hover:bg-secondary/40 transition-colors rounded-full">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="p-2 border border-border hover:bg-secondary/40 transition-colors rounded-full">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <p className="text-4xl font-bold text-primary tracking-tight">{formattedPrice}</p>
                    </div>

                    <div className="text-foreground/90">
                        <RichTextRenderer content={product.description} isDark={true} />
                        {!product.description && (
                            <p className="leading-relaxed">Detailed description available in Contentful.</p>
                        )}
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center border border-border">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-secondary/40 transition-colors"
                                >-</button>
                                <span className="px-4 font-bold min-w-[3rem] text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-secondary/40 transition-colors"
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-bold transition-all relative overflow-hidden ${isAdding ? 'bg-green-600' : 'hover:bg-primary/90'}`}
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

                    <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border/60">
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
        </div>
    )
}

export default ProductDetailClient

