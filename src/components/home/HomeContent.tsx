"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShieldCheck, Gem, Crown, Fingerprint, Truck, Star } from 'lucide-react'

import BlogSection from './BlogSection'
import TestimonialsSection from './TestimonialsSection'

interface HomeContentProps {
    hero: any;
    categories: any[];
    heritageFeatures?: any[];
    featuredProducts?: any[];
    blogs: any[];
    testimonials: any[];
    homeStory?: any;
}

const HomeContent = ({ hero, categories, heritageFeatures, blogs, testimonials, homeStory }: HomeContentProps) => {
    const heroImage = hero?.backgroundImage?.fields?.file?.url ? `https:${hero.backgroundImage.fields.file.url}` : ''

    const iconMap: { [key: string]: any } = {
        Sparkles,
        ShieldCheck,
        Gem,
        Crown,
        Fingerprint
    }
    const heroTrustBadges: string[] = Array.isArray(hero?.trustBadges) ? hero.trustBadges : []
    const getBadgeIcon = (label: string) => {
        const value = String(label || '').toLowerCase()
        if (value.includes('diamond')) return Gem
        if (value.includes('conflict') || value.includes('secure') || value.includes('certified')) return ShieldCheck
        if (value.includes('shipping') || value.includes('delivery')) return Truck
        if (value.includes('custom') || value.includes('design')) return Star
        return Sparkles
    }

    const defaultFeatures = [
        {
            title: "Master Craftsmanship",
            description: "Jaipur artisans hand-finish each piece with precise, enduring craft.",
            iconName: "Sparkles",
            image: "https://images.unsplash.com/photo-1631983090121-8ea8701904b7?auto=format&fit=crop&q=80&w=1200"
        },
        {
            title: "Modern Ethics",
            description: "Lab-grown diamonds with uncompromising brilliance and ethics.",
            iconName: "ShieldCheck",
            image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200"
        },
        {
            title: "Universal Timelessness",
            description: "Contemporary silhouettes inspired by timeless royal elegance.",
            iconName: "Gem",
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200"
        }
    ]

    const displayFeatures = heritageFeatures && heritageFeatures.length > 0 ? heritageFeatures : defaultFeatures
    const orderedFeatures = [...displayFeatures].sort((a, b) => {
        const aModern = String(a?.title || '').toLowerCase().includes('modern ethics') ? -1 : 1
        const bModern = String(b?.title || '').toLowerCase().includes('modern ethics') ? -1 : 1
        if (aModern !== bModern) return aModern - bModern
        return 0
    })
    const categoryPriority = [
        'Engagement Rings',
        'Lab Diamonds',
        'Lab Grown Diamonds',
        'Earrings',
    ]

    const orderedCategories = [...categories].sort((a, b) => {
        const aIndex = categoryPriority.findIndex((name) => name.toLowerCase() === String(a?.title || '').toLowerCase())
        const bIndex = categoryPriority.findIndex((name) => name.toLowerCase() === String(b?.title || '').toLowerCase())
        const aRank = aIndex === -1 ? 999 : aIndex
        const bRank = bIndex === -1 ? 999 : bIndex
        if (aRank !== bRank) return aRank - bRank
        return String(a?.title || '').localeCompare(String(b?.title || ''))
    })
    const displayHomeStory = homeStory || null
    const storyHighlightIcons = [Crown, ShieldCheck, Fingerprint, Gem, Sparkles]
    const displayStoryHighlights = Array.isArray(displayHomeStory?.highlights) ? displayHomeStory.highlights : []

    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center bg-secondary">
                {heroImage && (
                    <div className="absolute inset-0 z-0 opacity-38 grayscale hover:grayscale-0 transition-all duration-700">
                        <img
                            src={heroImage}
                            alt={hero?.title || 'Hero image'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="absolute inset-0 z-0 bg-background/68 backdrop-blur-[2px]" />
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.14),rgba(5,10,22,0.86)_60%)]" />
                <div className="absolute z-0 left-1/2 top-[48%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-[95px]" />

                <div className="relative z-10 text-center space-y-10 px-4 max-w-4xl">
                    {hero?.subtitleLabel && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="site-subheading"
                        >
                            {hero.subtitleLabel}
                        </motion.p>
                    )}
                    {(hero?.title || hero?.subtitle) && (
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="site-heading text-foreground leading-[1.14]"
                        >
                            {hero?.title ? String(hero.title).replace(/\.$/, "") : ''} {hero?.title && hero?.subtitle ? <br /> : null}
                            {hero?.subtitle && <span className="gold-text italic inline-block">{String(hero.subtitle).replace(/\.$/, "")}</span>}
                        </motion.h1>
                    )}
                    {hero?.description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-foreground/82 text-base md:text-lg font-light max-w-2xl mx-auto"
                        >
                            {hero.description}
                        </motion.p>
                    )}
                    {heroTrustBadges.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.45 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px] uppercase tracking-[0.2em] font-bold max-w-3xl mx-auto"
                        >
                            {heroTrustBadges.map((badge, index) => {
                                const BadgeIcon = getBadgeIcon(badge)
                                return (
                                    <span key={`${badge}-${index}`} className="h-[64px] sm:h-auto border border-primary/20 bg-background/45 px-4 py-2.5 inline-flex items-center justify-center gap-1.5">
                                        <BadgeIcon className="h-3.5 w-3.5 text-primary" />
                                        {badge}
                                    </span>
                                )
                            })}
                        </motion.div>
                    )}
                    {(hero?.ctaText && hero?.ctaLink) || (hero?.secondaryCtaText && hero?.secondaryCtaLink) ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2"
                        >
                            {hero?.ctaText && hero?.ctaLink && (
                                <Link href={hero.ctaLink} className="px-14 py-[1.15rem] bg-primary text-foreground uppercase tracking-widest text-sm font-extrabold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50">
                                    {hero.ctaText}
                                </Link>
                            )}
                            {hero?.secondaryCtaText && hero?.secondaryCtaLink && (
                                <Link href={hero.secondaryCtaLink} className="px-10 py-4 border border-foreground/55 text-foreground/85 uppercase tracking-widest text-xs font-bold hover:border-primary hover:text-primary transition-all">
                                    {hero.secondaryCtaText}
                                </Link>
                            )}
                        </motion.div>
                    ) : null}
                    {hero?.valueProposition && (
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.68 }}
                            className="text-primary text-[11px] md:text-xs uppercase tracking-[0.16em] font-semibold"
                        >
                            {hero.valueProposition}
                        </motion.p>
                    )}
                    {hero?.valueFootnote && (
                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.72 }}
                            className="text-foreground/62 text-[11px] md:text-xs uppercase tracking-[0.12em]"
                        >
                            {hero.valueFootnote}
                        </motion.p>
                    )}
                </div>
            </section>

            {/* Quick Category Navigation */}
            <section className="py-7 border-y border-primary/25 bg-secondary/80 backdrop-blur-md shadow-[inset_0_1px_0_rgba(212,175,55,0.12)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/35 to-transparent mb-5" />
                    <div className="overflow-x-auto no-scrollbar">
                        <div className="inline-flex min-w-max items-center gap-3">
                            {orderedCategories.slice(0, 8).map((cat, idx) => (
                                <Link
                                    key={`${cat.title}-${idx}`}
                                    href={cat.link}
                                    className="px-5 py-2.5 border border-primary/25 text-[10px] uppercase tracking-widest font-bold text-foreground hover:border-primary/55 hover:bg-primary/10 transition-colors whitespace-nowrap"
                                >
                                    {cat.title}
                                </Link>
                            ))}
                            <Link
                                href="/shop?sort=new-arrivals"
                                className="px-5 py-2.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold whitespace-nowrap"
                            >
                                New Arrivals
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 space-y-4 text-center">
                    <h2 className="site-subheading">Our Specialities</h2>
                    <h3 className="site-heading">Luxury for <span className="italic">Every Occasion</span></h3>
                    <p className="text-foreground/70 text-sm md:text-base font-serif italic">
                        Browse our signature collections crafted for modern celebrations.
                    </p>
                    <div className="pt-2">
                        <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border border-primary/35 px-5 py-3 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary">
                            View All Collections <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {orderedCategories.map((cat, i) => (
                        <Link href={cat.link} key={i} className="group relative h-[450px] lg:h-[480px] overflow-hidden luxury-card border border-primary/10 transition-all duration-500 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_24px_48px_-28px_rgba(212,175,55,0.6)]">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/88 via-secondary/35 to-transparent group-hover:from-secondary/78 group-hover:via-secondary/25 transition-colors duration-500" />
                            <div className="absolute bottom-10 left-10 right-8">
                                {cat.badge && (
                                    <span className="inline-block mb-3 px-2.5 py-1 bg-background/70 border border-primary/30 text-primary text-[10px] uppercase tracking-widest font-bold">
                                        {cat.badge}
                                    </span>
                                )}
                                <h4 className="text-[1.9rem] leading-tight font-bold text-foreground mb-3">{cat.title}</h4>
                                {(cat.subtitle || cat.description) && (
                                    <p className="text-sm text-foreground/90 font-serif italic mb-4 max-w-sm line-clamp-2">
                                        {cat.subtitle || cat.description}
                                    </p>
                                )}
                                <span className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-bold border-b border-primary/80 pb-1 transition-all duration-300 group-hover:border-primary group-hover:tracking-[0.18em]">
                                    {cat.ctaText || 'Shop Now'}
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>


            {/* Heritage Gallery - Immersive Section */}
            <section className="py-36 bg-secondary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-28 space-y-5 flex flex-col items-center">
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
                            Where Tradition Meets <span className="italic bg-gradient-to-r from-[#F6E08A] via-[#D4AF37] to-[#F8E7A1] bg-clip-text text-transparent">Lab Diamonds</span>
                        </motion.h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                        {orderedFeatures.map((feature, i) => {
                            const Icon = iconMap[feature.iconName] || Sparkles
                            const isModernEthics = String(feature?.title || '').toLowerCase().includes('modern ethics')
                            const isTimeless = String(feature?.title || '').toLowerCase().includes('universal timelessness')
                            const shortDescription = String(feature?.description || '').split('.')[0]
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="group space-y-6"
                                >
                                    <div className={`aspect-[3/4] overflow-hidden relative mb-8 luxury-card border transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_26px_52px_-34px_rgba(212,175,55,0.7)] ${isModernEthics ? 'border-primary/45 shadow-[0_0_0_1px_rgba(212,175,55,0.35)]' : 'border-primary/12 group-hover:border-primary/35'}`}>
                                        <img
                                            src={feature.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"}
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04] grayscale hover:grayscale-0"
                                        />
                                        <div className={`absolute inset-0 transition-colors duration-500 ${isModernEthics ? 'bg-secondary/28 group-hover:bg-secondary/12' : 'bg-secondary/40 group-hover:bg-secondary/20'}`} />
                                        {isModernEthics ? (
                                            <div className="absolute inset-0 pointer-events-none opacity-55">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(212,175,55,0.18)_0%,transparent_28%),radial-gradient(circle_at_75%_35%,rgba(255,245,200,0.12)_0%,transparent_24%),radial-gradient(circle_at_55%_75%,rgba(212,175,55,0.14)_0%,transparent_22%)] animate-pulse" />
                                            </div>
                                        ) : null}
                                        {isTimeless ? (
                                            <div className="absolute left-1/2 bottom-6 h-14 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
                                        ) : null}
                                        <div className="absolute top-6 left-6 p-3 bg-background/90 backdrop-blur-md rounded-full border border-primary/20 transition-transform duration-300 group-hover:scale-110">
                                            <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-6" />
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-bold text-foreground uppercase tracking-tight group-hover:gold-text transition-colors">
                                        {feature.title}
                                    </h4>
                                    <p className="text-base text-foreground/72 leading-relaxed font-serif italic">
                                        {shortDescription}.
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                    <div className="pt-14 text-center">
                        <Link href="/shop?category=lab-grown-diamonds" className="group inline-flex items-center gap-2 border border-primary/35 px-7 py-3.5 text-xs uppercase tracking-[0.18em] font-bold text-primary hover:bg-primary/10 hover:border-primary transition-all">
                            Explore Lab Diamonds
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </Link>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
            </section>

            {/* Emotional Story Section */}
            {displayHomeStory && (
                <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="space-y-6 lg:col-span-4">
                            <div className="space-y-3">
                                {displayHomeStory.sectionLabel && <p className="site-subheading text-left">{displayHomeStory.sectionLabel}</p>}
                                <div className="h-px w-24 bg-gradient-to-r from-primary/80 to-transparent" />
                            </div>
                            <h3 className="site-heading text-left">
                                {displayHomeStory.titlePrefix} {displayHomeStory.titleHighlight && <span className="italic">{displayHomeStory.titleHighlight}</span>}
                            </h3>
                            {displayHomeStory.description && (
                                <p className="text-foreground/70 leading-relaxed font-serif italic">
                                    {displayHomeStory.description}
                                </p>
                            )}
                            {displayStoryHighlights.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 text-xs uppercase tracking-widest font-bold">
                                    {displayStoryHighlights.map((label: string, index: number) => {
                                        const Icon = storyHighlightIcons[index % storyHighlightIcons.length]
                                        return (
                                            <span key={`${label}-${index}`} className="group inline-flex items-center gap-2 border border-primary/20 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_14px_28px_-20px_rgba(212,175,55,0.8)]">
                                                <Icon className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
                                                {label}
                                            </span>
                                        )
                                    })}
                                </div>
                            )}
                            {displayHomeStory.ctaText && displayHomeStory.ctaLink && (
                                <Link href={displayHomeStory.ctaLink} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-primary hover:text-primary/80">
                                    {displayHomeStory.ctaText} <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                        {displayHomeStory.image && (
                            <div className="aspect-[5/3] lg:col-span-8 overflow-hidden border border-primary/20 group relative bg-gradient-to-br from-background via-secondary/60 to-background shadow-[0_30px_60px_-40px_rgba(212,175,55,0.55)]">
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_30%_80%,rgba(212,175,55,0.18),transparent_42%)]" />
                                <img
                                    src={displayHomeStory.image}
                                    alt={displayHomeStory.imageAlt || 'Story image'}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                                />
                                <div className="pointer-events-none absolute bottom-6 left-1/2 h-10 w-44 -translate-x-1/2 rounded-full bg-primary/25 blur-2xl" />
                            </div>
                        )}
                    </div>
                </section>
            )}

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
