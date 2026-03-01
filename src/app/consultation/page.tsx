"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, Mail, Sparkles, CheckCircle2, ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const serviceOptions = [
    "Bespoke Ring Design",
    "Bridal Styling",
    "Lab-Grown Diamond Education",
    "Repairs & Restoration",
]

const timeOptions = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
]

const ConsultationPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [preferredService, setPreferredService] = useState(serviceOptions[0])
    const [preferredTime, setPreferredTime] = useState(timeOptions[0])
    const [openDropdown, setOpenDropdown] = useState<null | 'service' | 'time'>(null)
    const dropdownRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener('mousedown', closeOnOutsideClick)
        return () => document.removeEventListener('mousedown', closeOnOutsideClick)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            setIsSubmitted(true)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative h-[600px] hidden lg:block overflow-hidden"
                    >
                        <img
                            src="/assets/consultation.png"
                            alt="Consultation"
                            className="w-full h-full object-cover transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-secondary/20" />
                        <div className="absolute bottom-12 left-12 right-12 bg-background/90 backdrop-blur-md p-8 border-l-4 border-primary">
                            <Sparkles className="h-6 w-6 text-primary mb-4" />
                            <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">Bespoke Experience</h2>
                            <p className="text-sm text-muted-foreground font-serif italic">
                                "Every masterpiece begins with a conversation. Let our master stylists guide you through Jaipur's rich heritage of craftsmanship."
                            </p>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 sm:space-y-12"
                    >
                        <div className="space-y-4">
                            <Link href="/profile" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                                <ArrowLeft className="h-3 w-3 mr-2" /> Back to Profile
                            </Link>
                            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter leading-tight">Book a <span className="gold-text">Consultation</span></h1>
                            <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                                Schedule a 1-on-1 session with our Jaipur-based master stylists. Whether you're designing an engagement ring or exploring our collections, we're here to help.
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    ref={dropdownRef}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full bg-muted/5 border border-primary/10 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    className="w-full bg-muted/5 border border-primary/10 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Service</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setOpenDropdown(openDropdown === 'service' ? null : 'service')}
                                                className="w-full bg-muted/5 border border-primary/25 px-4 pr-12 py-4 text-sm text-left text-foreground focus:outline-none focus:border-primary transition-colors"
                                            >
                                                {preferredService}
                                            </button>
                                            <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-transform ${openDropdown === 'service' ? 'rotate-180' : ''}`} />
                                            {openDropdown === 'service' && (
                                                <div className="absolute left-0 right-0 mt-1 border border-primary/30 bg-background shadow-xl z-20">
                                                    {serviceOptions.map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                setPreferredService(option)
                                                                setOpenDropdown(null)
                                                            }}
                                                            className={`w-full px-4 py-3 text-left text-sm transition-colors break-words ${preferredService === option ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-primary/10'}`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <input type="hidden" name="preferredService" value={preferredService} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="date"
                                                    className="consultation-date-input w-full bg-muted/5 border border-primary/10 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
                                                    className="w-full bg-muted/5 border border-primary/25 pl-12 pr-12 py-4 text-sm text-left text-foreground focus:outline-none focus:border-primary transition-colors"
                                                >
                                                    {preferredTime}
                                                </button>
                                                <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-transform ${openDropdown === 'time' ? 'rotate-180' : ''}`} />
                                                {openDropdown === 'time' && (
                                                    <div className="absolute left-0 right-0 mt-1 border border-primary/30 bg-background shadow-xl z-20">
                                                        {timeOptions.map((option) => (
                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() => {
                                                                    setPreferredTime(option)
                                                                    setOpenDropdown(null)
                                                                }}
                                                                className={`w-full px-4 py-3 text-left text-sm transition-colors break-words ${preferredTime === option ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-primary/10'}`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <input type="hidden" name="preferredTime" value={preferredTime} />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "hsl(43 58% 46% / 0.22)" }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading}
                                        type="submit"
                                        className="w-full py-5 bg-primary/15 border border-primary/45 text-primary uppercase tracking-widest text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-3 hover:bg-primary/20"
                                    >
                                        {loading ? "Scheduling..." : "Request Appointment"}
                                        {!loading && <Sparkles className="h-4 w-4" />}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-muted/5 border border-primary/20 p-6 sm:p-12 text-center space-y-6"
                                >
                                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-10 w-10 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest">Request Received</h2>
                                    <p className="text-sm text-muted-foreground font-serif italic mb-8">
                                        "A member of our concierge team will reach out to you within 24 hours to confirm your private session."
                                    </p>
                                    <Link href="/profile" className="inline-block w-full sm:w-auto px-10 py-4 border border-primary/50 bg-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                                        Return to Dashboard
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ConsultationPage

