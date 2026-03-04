"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const defaultBlogs = [
    {
        title: "How to Choose a Lab-Grown Diamond That Looks Exceptional",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1200",
        category: "Diamond Buying Guide",
        readingTime: "5 min read"
    },
    {
        title: "Lab Diamond Care Tips to Keep Every Stone Brilliant",
        image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=1200",
        category: "Care Guide",
        readingTime: "4 min read"
    },
    {
        title: "Engagement Ring Styles Modern Couples Love in 2026",
        image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=1200",
        category: "Style Guide",
        readingTime: "6 min read"
    }
]

const BlogSection = ({ blogs }: { blogs: any[] }) => {
    const displayBlogs = blogs && blogs.length > 0 ? blogs : defaultBlogs
    const featuredPost = displayBlogs[0]
    const sidePosts = displayBlogs.slice(1, 3)
    const fallbackMeta = ["Diamond Buying Guide", "Care Guide", "Style Guide"]

    const getMeta = (post: any, index: number) => ({
        category: post?.category || fallbackMeta[index % fallbackMeta.length],
        readingTime: post?.readingTime || "5 min read",
    })

    return (
        <section className="py-28 bg-secondary text-foreground overflow-hidden border-y border-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-18 space-y-4 flex flex-col items-center">
                    <h2 className="site-heading journal-heading text-foreground">The Radha Govind Journal</h2>
                    <p className="text-foreground/75 text-sm md:text-base font-serif italic max-w-3xl">
                        Learn how to choose the perfect diamond, care for your jewellery, and make confident purchases.
                    </p>
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {featuredPost ? (
                        <motion.div
                            key={`featured-${featuredPost.title}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="group cursor-pointer lg:col-span-7"
                        >
                            <Link href={featuredPost.slug ? `/blog/${featuredPost.slug}` : '#'}>
                                <div className="relative aspect-[16/10] overflow-hidden mb-6 border border-white/10 group-hover:border-primary/50 transition-all duration-500">
                                    <img
                                        src={featuredPost.image || "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1200"}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                                    <div className="absolute left-5 bottom-5 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] font-bold">
                                        <span className="border border-primary/40 bg-background/50 px-2.5 py-1 text-primary">
                                            {getMeta(featuredPost, 0).category}
                                        </span>
                                        <span className="text-white/75">{getMeta(featuredPost, 0).readingTime}</span>
                                    </div>
                                </div>
                                <h3 className="blog-post-title text-2xl md:text-[1.75rem] font-bold leading-snug tracking-tight group-hover:gold-text transition-colors duration-300">
                                    {featuredPost.title}
                                </h3>
                            </Link>
                        </motion.div>
                    ) : null}

                    <div className="lg:col-span-5 grid grid-cols-1 gap-7">
                        {sidePosts.map((post: any, i: number) => (
                            <motion.div
                                key={post.title || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link href={post.slug ? `/blog/${post.slug}` : '#'}>
                                    <div className="relative aspect-[16/9] overflow-hidden mb-4 border border-white/10 group-hover:border-primary/45 transition-all duration-500">
                                        <img
                                            src={post.image || "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=1200"}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                        <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] font-bold">
                                            <span className="border border-primary/40 bg-background/50 px-2 py-1 text-primary">
                                                {getMeta(post, i + 1).category}
                                            </span>
                                            <span className="text-white/70">{getMeta(post, i + 1).readingTime}</span>
                                        </div>
                                    </div>
                                    <h3 className="blog-post-title text-lg font-bold leading-snug tracking-tight group-hover:gold-text transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-bold text-primary border border-primary/35 px-6 py-3 hover:bg-primary/10 hover:border-primary transition-all">
                        Explore Diamond Guides
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default BlogSection
