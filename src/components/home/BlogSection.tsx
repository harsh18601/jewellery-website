"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const defaultBlogs = [
    {
        title: "Revitalize Your Style: 10 Tips to Refresh Your Wardrobe with Radha Govind Jewellers",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
        date: "OCTOBER 2023",
        brand: "RADHA GOVIND"
    },
    {
        title: "Jewelry Maintenance 101: Tips for Keeping Your Gold, Diamond, and Silver Pieces Sparkling",
        image: "https://images.unsplash.com/photo-1573408339371-c063b784999f?auto=format&fit=crop&q=80&w=800",
        date: "AUGUST 2023",
        brand: "RADHA GOVIND"
    },
    {
        title: "Glistening Under the Sun: Summer Trends in Gold and Diamond Jewelry",
        image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800",
        date: "JUNE 2023",
        brand: "RADHA GOVIND"
    }
]

const BlogSection = ({ blogs }: { blogs: any[] }) => {
    const displayBlogs = blogs && blogs.length > 0 ? blogs : defaultBlogs
    return (
        <section className="py-24 bg-secondary text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight">Blog</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {displayBlogs.map((post: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="group cursor-pointer"
                        >
                            <Link href={post.slug ? `/blog/${post.slug}` : '#'}>
                                <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-white/10 group-hover:border-primary/50 transition-colors duration-500">
                                    <img
                                        src={post.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                    <div className="absolute top-4 left-4 text-[10px] tracking-widest font-bold text-white/60">
                                        {post.date}
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="vertical-text text-4xl md:text-5xl font-bold tracking-[0.5em] text-white/20 group-hover:text-primary/30 transition-colors duration-500 select-none">
                                            {post.brand}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-center leading-relaxed tracking-wide group-hover:gold-text transition-colors duration-300 px-4">
                                    {post.title}
                                </h3>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link href="/blog" className="text-xs uppercase tracking-[0.3em] font-bold text-primary border-b border-primary/30 pb-2 hover:border-primary transition-all">
                        View All Articles
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: rotate(180deg);
                }
            `}</style>
        </section>
    )
}

export default BlogSection
