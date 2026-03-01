"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const defaultTestimonials = [
    {
        name: "Ananya Sharma",
        role: "Verified Buyer",
        content: "The custom ring they designed for my anniversary is absolutely stunning. The craftsmanship is world-class, and the lab-grown diamonds are exceptionally brilliant.",
        rating: 5
    },
    {
        name: "Vikram Mehta",
        role: "Verified Buyer",
        content: "Found the perfect pair of emerald earrings here. Their attention to detail and traditional Jaipur heritage really shows in every piece.",
        rating: 5
    },
    {
        name: "Priya Patel",
        role: "Bespoke Client",
        content: "Exceptional service from the concierge team. They helped me through the entire design process for my bridal set. Highly recommended!",
        rating: 5
    }
]

const TestimonialsSection = ({ testimonials }: { testimonials: any[] }) => {
    const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-sm text-primary uppercase tracking-[0.4em] font-bold">Client Experiences</h2>
                    <h3 className="text-4xl font-bold tracking-tight uppercase">What they <span className="italic font-serif">say about us</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {displayTestimonials.map((testimonial: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-muted/5 p-10 border border-primary/10 relative group hover:border-primary/30 transition-all duration-500"
                        >
                            <Quote className="h-8 w-8 text-primary/20 absolute top-8 right-8 group-hover:text-primary/40 transition-colors" />

                            <div className="flex mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                                ))}
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed font-serif italic mb-8">
                                "{testimonial.content}"
                            </p>

                            <div>
                                <h4 className="font-bold uppercase tracking-widest text-xs text-secondary">{testimonial.name}</h4>
                                <span className="text-[10px] text-primary uppercase tracking-widest font-bold">{testimonial.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
