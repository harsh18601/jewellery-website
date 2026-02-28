"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, Mail, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const ConsultationPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

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
            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative h-[600px] hidden lg:block overflow-hidden"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1573408339371-c063b784999f?auto=format&fit=crop&q=80&w=1000"
                            alt="Consultation"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
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
                        className="space-y-12"
                    >
                        <div className="space-y-4">
                            <Link href="/profile" className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                                <ArrowLeft className="h-3 w-3 mr-2" /> Back to Profile
                            </Link>
                            <h1 className="text-4xl font-bold uppercase tracking-tighter">Book a <span className="gold-text">Consultation</span></h1>
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
                                        <select className="w-full bg-muted/5 border border-primary/10 px-4 py-4 text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                                            <option>Bespoke Ring Design</option>
                                            <option>Bridal Styling</option>
                                            <option>Lab-Grown Diamond Education</option>
                                            <option>Repairs & Restoration</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <input
                                                    required
                                                    type="date"
                                                    className="w-full bg-muted/5 border border-primary/10 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <select className="w-full bg-muted/5 border border-primary/10 px-12 py-4 text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                                                    <option>10:00 AM - 12:00 PM</option>
                                                    <option>12:00 PM - 02:00 PM</option>
                                                    <option>02:00 PM - 04:00 PM</option>
                                                    <option>04:00 PM - 06:00 PM</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full py-5 bg-secondary text-background uppercase tracking-widest text-xs font-bold hover:bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? "Scheduling..." : "Request Appointment"}
                                        {!loading && <Sparkles className="h-4 w-4" />}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-muted/5 border border-primary/20 p-12 text-center space-y-6"
                                >
                                    <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="h-10 w-10 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest">Request Received</h2>
                                    <p className="text-sm text-muted-foreground font-serif italic mb-8">
                                        "A member of our concierge team will reach out to you within 24 hours to confirm your private session."
                                    </p>
                                    <Link href="/profile" className="inline-block px-10 py-4 border border-secondary text-secondary uppercase tracking-widest text-[10px] font-bold hover:bg-secondary hover:text-background transition-all">
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
