"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Gem, Crown, Fingerprint } from 'lucide-react'

import CollectionsSection from './CollectionsSection'
import BlogSection from './BlogSection'
import TestimonialsSection from './TestimonialsSection'

interface HomeContentProps {
    hero: any;
    categories: any[];
    heritageFeatures?: any[];
    blogs: any[];
    collections: any[];
    testimonials: any[];
}

const HomeContent = ({ hero, categories, heritageFeatures, blogs, collections, testimonials }: HomeContentProps) => {
    const heroImage = hero.backgroundImage?.fields?.file?.url ? `https:${hero.backgroundImage.fields.file.url}` : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070"

    const iconMap: { [key: string]: any } = {
        Sparkles,
        ShieldCheck,
        Gem,
        Crown,
        Fingerprint
    }

    const defaultFeatures = [
        {
            title: "Master Craftsmanship",
            description: "Every piece is hand-finished by master artisans in Jaipur, preserving centuries-old techniques.",
            iconName: "Sparkles",
            image: "https://images.unsplash.com/photo-1588444650733-d0c5123fb96e?auto=format&fit=crop&q=80&w=800"
        },
        {
            title: "Modern Ethics",
            description: "We specialize in lab-grown diamonds, offering brilliance without compromise to human or environmental life.",
            iconName: "ShieldCheck",
            image: "https://images.unsplash.com/photo-1573408339371-c063b784999f?auto=format&fit=crop&q=80&w=1000"
        },
        {
            title: "Universal Timelessness",
            description: "Designs that bridge the gap between traditional Rajasthani royalty and contemporary global elegance.",
            iconName: "Gem",
            image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000"
        }
    ]

    const displayFeatures = heritageFeatures && heritageFeatures.length > 0 ? heritageFeatures : defaultFeatures

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center bg-secondary">
                <div className="absolute inset-0 z-0 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                    <img
                        src={heroImage}
                        alt="Radha Govind Hero"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="site-subheading"
                    >
                        {hero.subtitleLabel || "Jaipur's Heritage & Innovation"}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="site-heading text-foreground leading-tight"
                    >
                        {hero.title} <br />
                        <span className="gold-text italic inline-block text-center">{hero.subtitle}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-foreground/70 text-lg md:text-xl font-light"
                    >
                        {hero.description}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
                    >
                        <Link href={hero.ctaLink || "/shop"} className="px-10 py-4 bg-primary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all">
                            {hero.ctaText || "Explore Collection"}
                        </Link>
                        <Link href="/custom" className="px-10 py-4 border border-foreground text-foreground uppercase tracking-widest text-xs font-bold hover:bg-foreground hover:text-background transition-all">
                            Design Your Ring
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Shop By Collections Section */}
            <CollectionsSection collections={collections} />

            {/* Featured Categories */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 space-y-6">
                    <div className="text-center">
                        <h2 className="site-subheading mb-4">Our Specialities</h2>
                        <h3 className="site-heading">Luxury for <span className="italic">Every Occasion</span></h3>
                    </div>
                    <div className="flex justify-end">
                        <Link href="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center group">
                            View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {categories.map((cat, i) => (
                        <Link href={cat.link} key={i} className="group relative h-96 overflow-hidden luxury-card border border-primary/5">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                            <div className="absolute bottom-10 left-10">
                                {cat.badge && (
                                    <span className="inline-block mb-3 px-2.5 py-1 bg-background/70 border border-primary/30 text-primary text-[10px] uppercase tracking-widest font-bold">
                                        {cat.badge}
                                    </span>
                                )}
                                <h4 className="text-2xl font-bold text-foreground mb-2">{cat.title}</h4>
                                {(cat.subtitle || cat.description) && (
                                    <p className="text-xs text-foreground/80 font-serif italic mb-3 max-w-xs line-clamp-2">
                                        {cat.subtitle || cat.description}
                                    </p>
                                )}
                                <span className="text-primary text-xs uppercase tracking-widest font-bold border-b border-primary pb-1">{cat.ctaText || 'Shop Now'}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Heritage Gallery - Immersive Section */}
            <section className="py-32 bg-secondary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20 space-y-4 flex flex-col items-center">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="site-subheading"
                        >
                            The Art of Jaipur
                        </motion.span>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="site-heading text-foreground"
                        >
                            Our <span className="gold-text italic">Heritage</span>
                        </motion.h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {displayFeatures.map((feature, i) => {
                            const Icon = iconMap[feature.iconName] || Sparkles
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="group space-y-6"
                                >
                                    <div className="aspect-[3/4] overflow-hidden relative mb-8 luxury-card">
                                        <img
                                            src={feature.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"}
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-secondary/40 group-hover:bg-transparent transition-colors duration-500" />
                                        <div className="absolute top-6 left-6 p-3 bg-background/90 backdrop-blur-md rounded-full">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-foreground uppercase tracking-tight group-hover:gold-text transition-colors">
                                        {feature.title}
                                    </h4>
                                    <p className="text-sm text-foreground/60 leading-relaxed font-serif italic">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            </section>

            {/* Testimonials Section */}
            <div id="testimonials">
                <TestimonialsSection testimonials={testimonials} />
            </div>

            {/* Blog Section */}
            <BlogSection blogs={blogs} />
        </div>
    )
}

export default HomeContent
