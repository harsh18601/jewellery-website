"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const defaultCollections = [
    {
        title: "WOW",
        subtitle: "the WOW collection",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
        color: "bg-blue-900/40",
        slug: "wow"
    },
    {
        title: "Embrace",
        subtitle: "The Embrace Collection",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800",
        color: "bg-red-900/40",
        slug: "embrace"
    },
    {
        title: "Stars-Align",
        subtitle: "The Stars-Align Collection",
        image: "https://images.unsplash.com/photo-1603561591411-071c789fe493?auto=format&fit=crop&q=80&w=800",
        color: "bg-black/60",
        slug: "stars-align"
    },
    {
        title: "Mood Shades",
        subtitle: "Shades of Every Mood",
        image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800",
        color: "bg-orange-950/40",
        slug: "shades"
    },
    {
        title: "Valentine's",
        subtitle: "Eshwer collection",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
        color: "bg-red-950/40",
        slug: "valentine"
    },
    {
        title: "Ira",
        subtitle: "ira Collection",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=800",
        color: "bg-green-900/10",
        slug: "ira"
    }
]

const CollectionsSection = ({ collections }: { collections: any[] }) => {
    const displayCollections = collections && collections.length > 0 ? collections : defaultCollections
    return (
        <section className="py-24 bg-secondary text-white overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 space-y-4 text-center flex flex-col items-center">
                    <h2 className="site-heading text-white">Shop By Collections</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-20 bg-primary/50" />
                        <div className="text-primary">
                            <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 15C25 10 35 10 40 10M20 15C15 10 5 10 0 10M20 15V20M20 15C20 10 15 5 20 0C25 5 20 10 20 15Z" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                        <div className="h-[1px] w-20 bg-primary/50" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayCollections.map((col: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative aspect-square overflow-hidden cursor-pointer rounded-2xl border border-white/10"
                        >
                            <Link href={`/shop?collection=${col.slug || col.title.toLowerCase()}`}>
                                <img
                                    src={col.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"}
                                    alt={col.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className={`absolute inset-0 ${col.color || 'bg-black/40'} transition-all duration-500`} />

                                <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
                                    <span className="text-xs uppercase tracking-[0.4em] font-bold text-white/60 mb-2 group-hover:text-white transition-colors">
                                        {col.subtitle}
                                    </span>
                                    <h3 className="text-2xl font-bold uppercase tracking-tighter mb-6 group-hover:scale-110 transition-transform">
                                        {col.title}
                                    </h3>

                                    <div className="mt-4 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                                        <ArrowUpRight className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CollectionsSection
