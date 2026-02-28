"use client"

import React from 'react'
import { motion } from 'framer-motion'

const InfoPage = ({ title, bannerImage, children }: { title: string, bannerImage: string, children: React.ReactNode }) => (
    <div className="bg-background">
        <section className="relative h-[40vh] flex items-center justify-center bg-secondary overflow-hidden">
            <div className="absolute inset-0 opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-1000">
                <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest gold-text">{title}</h1>
            </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-24">
            <div className="prose prose-sm prose-gold max-w-none font-serif text-muted-foreground leading-relaxed space-y-12">
                {children}
            </div>
        </div>
    </div>
)

export const Shipping = () => (
    <InfoPage
        title="Shipping & Returns"
        bannerImage="https://images.unsplash.com/photo-1605100804763-247f67b3f413?auto=format&fit=crop&q=80&w=2000"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-secondary uppercase tracking-wider">Secure Worldwide Delivery</h2>
                <p>Every piece of Radha Govind jewellery is handled with extreme care. We use tamper-evident packaging and high-security courier partners to ensure your brilliance reaches you safely.</p>
                <p className="text-xs uppercase tracking-widest font-bold text-primary">Fully Insured | Tracked | Signature Required</p>
            </section>
            <img src="https://images.unsplash.com/photo-1549463595-5381d835061b?auto=format&fit=crop&q=80&w=800" alt="ShippingBox" className="rounded-sm shadow-xl" />
        </div>
        <div className="border-t border-primary/10 pt-12">
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wider mb-4">Refunds & Exchanges</h2>
            <p>We offer a 14-day "No Questions Asked" return policy for our signature collection. Custom-designed pieces are eligible for resizing and lifetime maintenance but are non-refundable due to their bespoke nature.</p>
        </div>
    </InfoPage>
)

export const Care = () => (
    <InfoPage
        title="Jewellery Care"
        bannerImage="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=2000"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img src="https://images.unsplash.com/photo-1573408339371-c063b784999f?auto=format&fit=crop&q=80&w=800" alt="Craftsmanship" className="rounded-sm shadow-xl order-last md:order-first" />
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-secondary uppercase tracking-wider">Maintaining The Glow</h2>
                <p>Jewellery is meant to be worn, but it also deserves professional attention. We recommend a "Deep Clean & Inspection" every 6 months to ensure settings are secure and stones are sparkling.</p>
                <ul className="list-disc pl-5 space-y-2 text-xs uppercase tracking-widest font-bold">
                    <li>Remove before swimming or heavy exercise</li>
                    <li>Avoid direct contact with perfumes and lotions</li>
                    <li>Store in provided Radha Govind silk pouches</li>
                </ul>
            </section>
        </div>
    </InfoPage>
)

export const SizeGuide = () => (
    <InfoPage
        title="Size Guide"
        bannerImage="https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?auto=format&fit=crop&q=80&w=2000"
    >
        <div className="space-y-12">
            <section className="text-center space-y-4">
                <h2 className="text-xl font-bold text-secondary uppercase tracking-wider">The Perfect Fit</h2>
                <p>A ring should be snug enough not to fall off, but loose enough to slide over your knuckle with some resistance.</p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: '📏', title: 'Measure', text: 'Wrap string around finger' },
                    { icon: '📉', title: 'Compare', text: 'Check the mm against chart' },
                    { icon: '✨', title: 'Enjoy', text: 'Order with confidence' }
                ].map((step, i) => (
                    <div key={i} className="p-8 border border-primary/10 text-center space-y-4">
                        <div className="text-3xl">{step.icon}</div>
                        <h3 className="text-xs font-bold uppercase tracking-widest">{step.title}</h3>
                        <p className="text-[10px] uppercase text-muted-foreground">{step.text}</p>
                    </div>
                ))}
            </div>
            <img src="https://images.unsplash.com/photo-1603561591411-071c4f723918?auto=format&fit=crop&q=80&w=2000" alt="Measuring" className="w-full h-64 object-cover grayscale opacity-50" />
        </div>
    </InfoPage>
)

export const FAQ = () => (
    <InfoPage
        title="FAQs"
        bannerImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
    >
        <div className="space-y-12">
            {[
                { q: "What is a Lab-Grown Diamond?", a: "Lab-grown diamonds are real diamonds. They have the same chemical, physical and optical properties as mined diamonds. The only difference is their origin point: a controlled laboratory environment that replicates the earth's natural process." },
                { q: "Do you offer customization?", a: "Yes, our 'Design Your Ring' feature allows you to build a piece from scratch. Customization is the heart of Jaipur's jewellery culture and our brand." },
                { q: "Is your gold BIS Hallmarked?", a: "Absolutely. Every piece of gold jewellery from Radha Govind carries the BIS Hallmark, ensuring the purity you pay for." }
            ].map((faq, i) => (
                <div key={i} className="border-l-4 border-primary pl-8 py-2">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4 group-hover:text-primary transition-colors cursor-default">{faq.q}</h3>
                    <p className="text-muted-foreground font-serif leading-relaxed">{faq.a}</p>
                </div>
            ))}
        </div>
    </InfoPage>
)
