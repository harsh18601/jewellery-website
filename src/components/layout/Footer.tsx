"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ShieldCheck, Gem, RotateCcw, Truck, CreditCard, Landmark } from 'lucide-react'
import type { FooterData, FooterTrustBadge } from '@/lib/contentful'

const defaultExploreLinks = [
    { label: 'Collections', href: '/shop' },
    { label: 'Engagement Rings', href: '/shop?category=engagement-rings' },
    { label: 'Lab Diamonds', href: '/shop?category=lab-grown-diamonds' },
    { label: 'Journal', href: '/blog' },
    { label: 'Our Story', href: '/about' },
]

const defaultHelpLinks = [
    { label: 'Shipping', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns-and-exchanges' },
    { label: 'Jewellery Care', href: '/care' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
]

const defaultTrustItems = ['Certified Diamonds', 'Secure Payments', 'Hallmarked Gold', 'Easy Returns', 'Free Shipping']
const defaultPaymentMethods = ['Visa', 'Mastercard', 'UPI', 'PayPal', 'Razorpay']

const Footer = ({ data }: { data?: FooterData | null }) => {
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [newsletterMessage, setNewsletterMessage] = useState('')

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        const email = newsletterEmail.trim()
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!isValidEmail) {
            setNewsletterMessage('Please enter a valid email address.')
            return
        }
        setNewsletterMessage('Thank you for subscribing to our newsletter.')
        setNewsletterEmail('')
    }

    const brandName = data?.brandName || 'RADHA GOVIND'
    const brandDescription = data?.brandDescription || "Handcrafted in Jaipur, Radha Govind blends royal Rajasthani artistry with modern lab-grown diamonds to create jewellery meant for life's most meaningful moments."
    const primaryCtaText = data?.primaryCtaText || 'Explore Lab Diamonds'
    const primaryCtaLink = data?.primaryCtaLink || '/shop?category=lab-grown-diamonds'
    const followLabel = data?.followLabel || 'Follow Our Journey'
    const instagramUrl = data?.instagramUrl || '#'
    const facebookUrl = data?.facebookUrl || '#'
    const twitterUrl = data?.twitterUrl || '#'
    const exploreTitle = data?.exploreTitle || 'Explore'
    const exploreLinks = data?.exploreLinks?.length ? data.exploreLinks : defaultExploreLinks
    const helpTitle = data?.helpTitle || 'Help'
    const helpLinks = data?.helpLinks?.length ? data.helpLinks : defaultHelpLinks
    const trustTitle = data?.trustTitle || 'Trust'
    const trustItems = data?.trustItems?.length ? data.trustItems : defaultTrustItems
    const trustBadges: FooterTrustBadge[] = (data?.trustBadges?.length
        ? data.trustBadges
        : trustItems.map((title) => ({ title }))) as FooterTrustBadge[]
    const showNewsletter = data?.showNewsletter ?? false
    const contactTitle = data?.contactTitle || 'Contact'
    const locationText = data?.locationText || 'Jaipur, Rajasthan'
    const phone = data?.phone || '+91 86969 14998'
    const email = data?.email || 'info@radhagovind.com'
    const newsletterTitle = data?.newsletterTitle || 'Newsletter'
    const newsletterDescription = data?.newsletterDescription || 'Join our circle for early access to collections, private offers, and expert jewellery guides.'
    const newsletterPlaceholder = data?.newsletterPlaceholder || 'Enter your e-mail'
    const newsletterCtaButton = data?.newsletterCtaButton || 'Subscribe'
    const paymentTitle = data?.paymentTitle || 'Payment Methods'
    const paymentMethods = data?.paymentMethods?.length ? data.paymentMethods : defaultPaymentMethods
    const copyrightText = data?.copyrightText || `© ${new Date().getFullYear()} Shree Radha Govind Jewellers. All Rights Reserved.`

    const trustIconFor = (item: string) => {
        const value = item.toLowerCase()
        if (value.includes('diamond') || value.includes('gem')) return Gem
        if (value.includes('secure') || value.includes('payment') || value.includes('shield')) return ShieldCheck
        if (value.includes('hallmark') || value.includes('gold') || value.includes('upi') || value.includes('bank')) return Landmark
        if (value.includes('return')) return RotateCcw
        if (value.includes('ship') || value.includes('delivery')) return Truck
        return Gem
    }

    return (
        <footer className="bg-secondary text-foreground pt-20 pb-8 border-t border-primary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-7">
                        <h3 className="text-2xl font-bold gold-text tracking-[0.16em]">{brandName}</h3>
                        <p className="text-sm text-foreground/70 leading-relaxed font-serif">
                            {brandDescription}
                        </p>
                        <Link href={primaryCtaLink} className="inline-flex items-center gap-2 border border-primary/35 px-5 py-3 text-xs uppercase tracking-[0.18em] font-bold text-primary hover:bg-primary/10 hover:border-primary transition-all">
                            {primaryCtaText}
                        </Link>
                        <div className="space-y-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/60 font-bold">{followLabel}</p>
                            <div className="flex items-center gap-3">
                                <a href={instagramUrl} target={instagramUrl.startsWith('http') ? '_blank' : undefined} rel={instagramUrl.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label="Instagram" className="h-11 w-11 border border-primary/25 rounded-full inline-flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_12px_24px_-18px_rgba(212,175,55,0.75)] transition-all">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href={facebookUrl} target={facebookUrl.startsWith('http') ? '_blank' : undefined} rel={facebookUrl.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label="Facebook" className="h-11 w-11 border border-primary/25 rounded-full inline-flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_12px_24px_-18px_rgba(212,175,55,0.75)] transition-all">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href={twitterUrl} target={twitterUrl.startsWith('http') ? '_blank' : undefined} rel={twitterUrl.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label="Twitter" className="h-11 w-11 border border-primary/25 rounded-full inline-flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_12px_24px_-18px_rgba(212,175,55,0.75)] transition-all">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">{exploreTitle}</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            {exploreLinks.map((link) => (
                                <li key={`${link.label}-${link.href}`}>
                                    <Link href={link.href || '#'} className="luxury-link hover:text-primary transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">{helpTitle}</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            {helpLinks.map((link) => (
                                <li key={`${link.label}-${link.href}`}>
                                    <Link href={link.href || '#'} className="luxury-link hover:text-primary transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">{trustTitle}</h4>
                        <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3 text-sm text-foreground/65">
                            {trustBadges.map((badge, index) => {
                                const Icon = trustIconFor(badge.title)
                                return (
                                    <li key={`${badge.title}-${index}`} className="inline-flex items-center gap-2">
                                        {badge.iconUrl ? (
                                            <img
                                                src={badge.iconUrl}
                                                alt={badge.title}
                                                className="h-5 w-5 object-contain"
                                                style={{ filter: 'invert(72%) sepia(52%) saturate(530%) hue-rotate(8deg) brightness(95%) contrast(95%)' }}
                                                loading="lazy"
                                            />
                                        ) : (
                                            <Icon className="h-5 w-5 text-primary" />
                                        )}
                                        {badge.title}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">{contactTitle}</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                <span>{locationText}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">{phone}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 pt-10 border-t border-primary/15">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {showNewsletter && (
                            <div className="lg:col-span-7 space-y-4">
                                <h4 className="text-2xl sm:text-3xl tracking-tight font-semibold">{newsletterTitle}</h4>
                                <p className="text-foreground/70 font-serif italic">{newsletterDescription}</p>
                                <form onSubmit={handleSubscribe} className="max-w-xl">
                                    <div className="flex items-center h-12 rounded-[10px] border border-foreground/20 overflow-hidden bg-transparent">
                                        <Mail className="h-4 w-4 text-primary/80 ml-3 mr-2 shrink-0" />
                                        <input
                                            type="email"
                                            value={newsletterEmail}
                                            onChange={(e) => setNewsletterEmail(e.target.value)}
                                            placeholder={newsletterPlaceholder}
                                            className="flex-1 h-full px-1.5 text-sm bg-transparent outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="h-full px-4 sm:px-5 bg-primary text-foreground uppercase tracking-widest text-[10px] font-bold hover:bg-primary/90 transition-colors"
                                        >
                                            {newsletterCtaButton}
                                        </button>
                                    </div>
                                </form>
                                {newsletterMessage && (
                                    <p className="text-xs text-primary font-medium">{newsletterMessage}</p>
                                )}
                            </div>
                        )}

                        <div className={`${showNewsletter ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-4`}>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/60 font-bold">{paymentTitle}</p>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-bold">
                                {paymentMethods.map((method, index) => {
                                    const lower = method.toLowerCase()
                                    const Icon = lower.includes('upi') || lower.includes('bank') ? Landmark : lower.includes('razorpay') ? ShieldCheck : CreditCard
                                    return (
                                        <span key={`${method}-${index}`} className="inline-flex items-center gap-1.5 border border-primary/25 px-3 py-2">
                                            <Icon className="h-3.5 w-3.5 text-primary" /> {method}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-foreground/10 text-center text-[10px] text-foreground/40 uppercase tracking-widest">
                {copyrightText}
            </div>
        </footer>
    )
}

export default Footer

