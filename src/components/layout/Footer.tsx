"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ShieldCheck, Gem, RotateCcw, Truck, CreditCard, Landmark } from 'lucide-react'

const Footer = () => {
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

    return (
        <footer className="bg-secondary text-foreground pt-20 pb-8 border-t border-primary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-7">
                        <h3 className="text-2xl font-bold gold-text tracking-[0.16em]">RADHA GOVIND</h3>
                        <p className="text-sm text-foreground/70 leading-relaxed font-serif">
                            Handcrafted in Jaipur, Radha Govind blends royal Rajasthani artistry with modern lab-grown diamonds to create jewellery meant for life&apos;s most meaningful moments.
                        </p>
                        <Link href="/shop?category=lab-grown-diamonds" className="inline-flex items-center gap-2 border border-primary/35 px-5 py-3 text-xs uppercase tracking-[0.18em] font-bold text-primary hover:bg-primary/10 hover:border-primary transition-all">
                            Explore Lab Diamonds
                        </Link>
                        <div className="space-y-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-foreground/60 font-bold">Follow Our Journey</p>
                            <div className="flex items-center gap-3">
                                <a href="#" aria-label="Instagram" className="h-11 w-11 border border-primary/25 rounded-full inline-flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_12px_24px_-18px_rgba(212,175,55,0.75)] transition-all">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" aria-label="Facebook" className="h-11 w-11 border border-primary/25 rounded-full inline-flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_12px_24px_-18px_rgba(212,175,55,0.75)] transition-all">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" aria-label="Twitter" className="h-11 w-11 border border-primary/25 rounded-full inline-flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary/60 hover:shadow-[0_12px_24px_-18px_rgba(212,175,55,0.75)] transition-all">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Explore</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            <li><Link href="/shop" className="luxury-link hover:text-primary transition-colors">Collections</Link></li>
                            <li><Link href="/shop?category=engagement-rings" className="luxury-link hover:text-primary transition-colors">Engagement Rings</Link></li>
                            <li><Link href="/shop?category=lab-grown-diamonds" className="luxury-link hover:text-primary transition-colors">Lab Diamonds</Link></li>
                            <li><Link href="/blog" className="luxury-link hover:text-primary transition-colors">Journal</Link></li>
                            <li><Link href="/about" className="luxury-link hover:text-primary transition-colors">Our Story</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Help</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            <li><Link href="/shipping" className="luxury-link hover:text-primary transition-colors">Shipping</Link></li>
                            <li><Link href="/shipping" className="luxury-link hover:text-primary transition-colors">Returns</Link></li>
                            <li><Link href="/care" className="luxury-link hover:text-primary transition-colors">Jewellery Care</Link></li>
                            <li><Link href="/faq" className="luxury-link hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/terms" className="luxury-link hover:text-primary transition-colors">Terms</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Trust</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            <li className="inline-flex items-center gap-2"><Gem className="h-4 w-4 text-primary" /> Certified Diamonds</li>
                            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure Payments</li>
                            <li className="inline-flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" /> Hallmarked Gold</li>
                            <li className="inline-flex items-center gap-2"><RotateCcw className="h-4 w-4 text-primary" /> Easy Returns</li>
                            <li className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free Shipping</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Contact</h4>
                        <ul className="space-y-4 text-sm text-foreground/65">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                                <span>Jaipur, Rajasthan, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>+91 86969 14998</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>info@radhagovind.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-14 pt-10 border-t border-primary/15">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        <div className="lg:col-span-7 space-y-4">
                            <h4 className="text-3xl tracking-tight font-semibold">Newsletter</h4>
                            <p className="text-foreground/70 font-serif italic">Join our circle for early access to collections, private offers, and expert jewellery guides.</p>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your e-mail"
                                    className="flex-1 h-12 px-4 bg-transparent border border-foreground/20 outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="h-12 px-8 bg-primary text-foreground uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                            {newsletterMessage && (
                                <p className="text-xs text-primary font-medium">{newsletterMessage}</p>
                            )}
                        </div>

                        <div className="lg:col-span-5 space-y-4">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/60 font-bold">Payment Methods</p>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] font-bold">
                                <span className="inline-flex items-center gap-1.5 border border-primary/25 px-3 py-2"><CreditCard className="h-3.5 w-3.5 text-primary" /> Visa</span>
                                <span className="inline-flex items-center gap-1.5 border border-primary/25 px-3 py-2"><CreditCard className="h-3.5 w-3.5 text-primary" /> Mastercard</span>
                                <span className="inline-flex items-center gap-1.5 border border-primary/25 px-3 py-2"><Landmark className="h-3.5 w-3.5 text-primary" /> UPI</span>
                                <span className="inline-flex items-center gap-1.5 border border-primary/25 px-3 py-2"><CreditCard className="h-3.5 w-3.5 text-primary" /> PayPal</span>
                                <span className="inline-flex items-center gap-1.5 border border-primary/25 px-3 py-2"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Razorpay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-foreground/10 text-center text-[10px] text-foreground/40 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} Shree Radha Govind Jewellers. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer


