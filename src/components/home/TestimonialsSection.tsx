"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

const defaultTestimonials = [
    {
        name: "Ananya Sharma",
        role: "Verified Buyer",
        content: "The custom ring they designed for my anniversary is absolutely stunning. The craftsmanship is world-class, and the lab-grown diamonds are exceptionally brilliant.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=220"
    },
    {
        name: "Vikram Mehta",
        role: "Verified Buyer",
        content: "Found the perfect pair of emerald earrings here. Their attention to detail and traditional Jaipur heritage really shows in every piece.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=220"
    },
    {
        name: "Priya Patel",
        role: "Bespoke Client",
        content: "Exceptional service from the concierge team. They helped me through the entire design process for my bridal set. Highly recommended!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=220"
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
                    <p className="text-foreground/70 text-sm md:text-base font-serif italic">
                        Loved by modern couples choosing lab-grown diamonds
                    </p>
                </div>

                <div className="relative">
                    <motion.div
                        key={`${safePage}-${slidesPerView}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`grid gap-8 lg:gap-12 ${visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}
                    >
                        {visibleTestimonials.map((testimonial: any, i: number) => {
                            const isCenterFeatured = slidesPerView >= 3 && visibleCount >= 3 && i === 1
                            const testimonialImage =
                                testimonial?.image ||
                                testimonial?.photo ||
                                testimonial?.avatar ||
                                testimonial?.featuredImage?.fields?.file?.url

                            const resolvedImage = testimonialImage
                                ? (String(testimonialImage).startsWith("//")
                                    ? `https:${testimonialImage}`
                                    : String(testimonialImage))
                                : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=220"

                            return (
                            <motion.div
                                key={`${testimonial.name}-${safePage}-${i}`}
                                className={`bg-muted/5 p-10 border border-primary/10 relative group hover:border-primary/35 transition-all duration-500 h-full min-h-[380px] flex flex-col ${isCenterFeatured ? 'lg:scale-[1.04] border-primary/35 shadow-[0_24px_52px_-34px_rgba(212,175,55,0.65)]' : ''}`}
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

                                <p className={`text-foreground/80 leading-relaxed font-serif italic mb-8 ${isCenterFeatured ? 'text-lg' : 'text-base'}`}>
                                    "{testimonial.content}"
                                </p>

                                <div className="mt-auto flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full border border-primary/30 overflow-hidden shrink-0 bg-muted/40">
                                        <img
                                            src={resolvedImage}
                                            alt={testimonial.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold uppercase tracking-widest text-xs text-foreground">{testimonial.name}</h4>
                                        <span className="text-[10px] text-primary uppercase tracking-widest font-bold block">{testimonial.role}</span>
                                    </div>
                                </div>
                            </motion.div>
                            )
                        })}
                    </motion.div>
                </div>

                {pageCount > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <button
                            onClick={handlePrev}
                            disabled={total <= 1}
                            className="h-10 w-10 border border-primary/30 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Previous testimonials"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from({ length: pageCount }).map((_, i: number) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => setCurrentPage(i)}
                                aria-label={`Go to testimonial page ${i + 1}`}
                                className={`h-2.5 w-2.5 rounded-full transition-all ${safePage === i ? 'bg-primary scale-110' : 'bg-primary/35 hover:bg-primary/60'}`}
                            />
                        ))}
                        <button
                            onClick={handleNext}
                            disabled={total <= 1}
                            className="h-10 w-10 border border-primary/30 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Next testimonials"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

export default TestimonialsSection
