"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

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
    const [currentPage, setCurrentPage] = useState(0)
    const [slidesPerView, setSlidesPerView] = useState(3)

    useEffect(() => {
        const updateSlidesPerView = () => {
            if (window.innerWidth < 768) {
                setSlidesPerView(1)
                return
            }
            if (window.innerWidth < 1024) {
                setSlidesPerView(2)
                return
            }
            setSlidesPerView(3)
        }

        updateSlidesPerView()
        window.addEventListener('resize', updateSlidesPerView)
        return () => window.removeEventListener('resize', updateSlidesPerView)
    }, [])

    const total = displayTestimonials.length
    const pageCount = total > 0 ? Math.ceil(total / slidesPerView) : 0
    const safePage = pageCount > 0 ? ((currentPage % pageCount) + pageCount) % pageCount : 0
    const startIndex = safePage * slidesPerView
    const visibleTestimonials = displayTestimonials.slice(startIndex, startIndex + slidesPerView)
    const visibleCount = visibleTestimonials.length

    const handlePrev = () => {
        setCurrentPage((prev) => prev - 1)
    }

    const handleNext = () => {
        setCurrentPage((prev) => prev + 1)
    }

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4 flex flex-col items-center">
                    <h2 className="site-subheading">Client Experiences</h2>
                    <h3 className="site-heading">Testimonials</h3>
                </div>

                <div className="relative px-14 sm:px-16">
                    <button
                        onClick={handlePrev}
                        disabled={total <= 1}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-11 w-11 border border-primary/30 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed z-10"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <motion.div
                        key={`${safePage}-${slidesPerView}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`grid gap-8 lg:gap-12 ${visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
                    >
                        {visibleTestimonials.map((testimonial: any, i: number) => (
                            <motion.div
                                key={`${testimonial.name}-${safePage}-${i}`}
                                className="bg-muted/5 p-10 border border-primary/10 relative group hover:border-primary/30 transition-all duration-500 h-full min-h-[360px] flex flex-col"
                            >
                                <Quote className="h-8 w-8 text-primary/20 absolute top-8 right-8 group-hover:text-primary/40 transition-colors" />

                                <div className="flex mb-6">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < (testimonial.rating || 0) ? 'text-primary fill-primary' : 'text-primary/35'}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed font-serif italic mb-8">
                                    "{testimonial.content}"
                                </p>

                                <div className="mt-auto">
                                    <h4 className="font-bold uppercase tracking-widest text-xs text-foreground">{testimonial.name}</h4>
                                    <span className="text-[10px] text-primary uppercase tracking-widest font-bold">{testimonial.role}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <button
                        onClick={handleNext}
                        disabled={total <= 1}
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-11 w-11 border border-primary/30 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed z-10"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {pageCount > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {Array.from({ length: pageCount }).map((_, i: number) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => setCurrentPage(i)}
                                aria-label={`Go to testimonial page ${i + 1}`}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${safePage === i ? 'bg-primary scale-110' : 'bg-primary/35 hover:bg-primary/60'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default TestimonialsSection
