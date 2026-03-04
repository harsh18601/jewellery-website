"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, User, Mail, Sparkles, CheckCircle2, ArrowLeft, ChevronDown, Gem, Star, MessageCircle, Check, ArrowRight } from 'lucide-react'
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
    const [preferredService, setPreferredService] = useState('')
    const [preferredTime, setPreferredTime] = useState('')
    const [preferredDate, setPreferredDate] = useState('')
    const [openDropdown, setOpenDropdown] = useState<null | 'service'>(null)
    const dropdownRef = useRef<HTMLFormElement>(null)
    const todayString = new Date().toISOString().slice(0, 10)
    const isToday = preferredDate === todayString
    const availableTimeOptions = isToday ? timeOptions.slice(1) : timeOptions
    const selectedTime = availableTimeOptions.includes(preferredTime) ? preferredTime : ''
    const inputClass = "w-full bg-muted/5 border border-primary/10 px-12 py-4 text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_rgba(212,175,55,0.34),0_0_16px_rgba(212,175,55,0.14)] transition-all"

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 sm:space-y-10 lg:col-span-7 order-1"
                    >
                        <div className="space-y-4 text-center">
                            <Link href="/profile" className="inline-flex items-center w-full justify-start text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
                                <ArrowLeft className="h-3 w-3 mr-2" /> Back to Profile
                            </Link>
                            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter leading-tight text-center mx-auto">Book a <span className="gold-text">Consultation</span></h1>
                            <p className="text-sm text-muted-foreground font-serif leading-relaxed max-w-2xl lg:mx-auto">
                                Schedule a private consultation with our Jaipur master stylists to design your perfect piece.
                            </p>
                            <div className="flex flex-wrap gap-2 lg:justify-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                <span className="border border-primary/20 px-3 py-1">Duration: 30 minutes</span>
                                <span className="border border-primary/20 px-3 py-1">Location: Video Call / In Store</span>
                            </div>
                            <div className="flex flex-wrap gap-2 lg:justify-center pt-1">
                                <span className="text-[10px] uppercase tracking-widest font-bold border border-primary/30 px-3 py-1 text-primary">Step 1: Choose Service</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold border border-primary/20 px-3 py-1 text-muted-foreground">Step 2: Pick Time</span>
                                <span className="text-[10px] uppercase tracking-widest font-bold border border-primary/20 px-3 py-1 text-muted-foreground">Step 3: Confirm</span>
                            </div>
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
                                    className="space-y-6 bg-background/70 backdrop-blur-md border border-primary/20 p-5 sm:p-7 shadow-[0_16px_36px_rgba(0,0,0,0.4)]"
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
                                                    className={inputClass}
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
                                                    className={inputClass}
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
                                                className="w-full bg-muted/5 border border-primary/25 px-4 pr-12 py-4 text-sm text-left text-foreground focus:outline-none focus:border-primary focus:shadow-[0_0_0_1px_rgba(212,175,55,0.34),0_0_16px_rgba(212,175,55,0.14)] transition-all"
                                            >
                                                {preferredService || "Select Service"}
                                            </button>
                                            <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary transition-transform ${openDropdown === 'service' ? 'rotate-180' : ''}`} />
                                            {openDropdown === 'service' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    className="absolute left-0 right-0 mt-1 border border-primary/30 bg-background shadow-xl z-20"
                                                >
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
                                                </motion.div>
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
                                                    min={todayString}
                                                    value={preferredDate}
                                                    onChange={(e) => {
                                                        const nextDate = e.target.value
                                                        setPreferredDate(nextDate)
                                                        const nextOptions = nextDate === todayString ? timeOptions.slice(1) : timeOptions
                                                        if (!nextOptions.includes(preferredTime)) {
                                                            setPreferredTime('')
                                                        }
                                                    }}
                                                    className={`consultation-date-input ${inputClass}`}
                                                />
                                            </div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                                {isToday ? 'Available today' : 'Choose a date to see available consultation times.'}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Preferred Time</label>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {availableTimeOptions.map((slot) => (
                                                    <motion.button
                                                        key={slot}
                                                        type="button"
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => setPreferredTime(slot)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${selectedTime === slot ? 'border-primary bg-primary/15 text-primary shadow-[0_0_14px_rgba(212,175,55,0.14)]' : 'border-primary/25 hover:border-primary/55 hover:bg-primary/8'}`}
                                                    >
                                                        {selectedTime === slot && <Check className="h-3 w-3" />}
                                                        {slot}
                                                    </motion.button>
                                                ))}
                                            </div>
                                            <input type="hidden" name="preferredTime" value={selectedTime} />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading || !preferredService || !preferredDate || !preferredTime}
                                        type="submit"
                                        className="group relative overflow-hidden w-full mt-2 py-5 min-h-14 bg-gradient-to-r from-primary/85 via-primary to-primary/85 text-black uppercase tracking-widest text-xs font-extrabold transition-all disabled:opacity-50 flex items-center justify-center gap-3 hover:shadow-[0_0_28px_rgba(212,175,55,0.35)]"
                                    >
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                                        {loading ? "Scheduling..." : "Request Appointment"}
                                        {!loading && <Sparkles className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                    </motion.button>

                                    <div className="flex justify-center w-full">
                                        <button
                                            type="button"
                                            className="w-full sm:w-auto sm:min-w-[230px] py-4 border border-primary/35 text-primary text-[10px] uppercase tracking-widest font-bold hover:bg-primary/10 transition-all inline-flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            Book via WhatsApp
                                        </button>
                                    </div>


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
                                    <h2 className="text-2xl font-bold uppercase tracking-widest">Appointment Requested</h2>
                                    <p className="text-sm text-muted-foreground font-serif italic mb-8">
                                        Our stylist will confirm shortly.
                                    </p>
                                    <Link href="/profile" className="inline-block w-full sm:w-auto px-10 py-4 border border-primary/50 bg-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                                        Return to Dashboard
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative h-[480px] lg:h-[600px] overflow-hidden order-2 lg:col-span-5 lg:mt-0 group"
                    >
                        <img
                            src="/assets/consultation.png"
                            alt="Consultation"
                            className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 bg-background/60 backdrop-blur-xl p-6 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.05)] space-y-5">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-tight">Bespoke Experience</h2>
                                </div>
                                <p className="text-xs text-muted-foreground/80 font-serif italic pl-12 leading-relaxed max-w-[280px]">
                                    Every masterpiece begins with a conversation.
                                </p>
                            </div>

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } }
                                }}
                                className="pl-12 space-y-3"
                            >
                                {[
                                    { text: "Custom Design Guidance", icon: <Gem className="h-3 w-3" /> },
                                    { text: "Diamond Selection Help", icon: <Star className="h-3 w-3" /> },
                                    { text: "Wedding Jewellery Planning", icon: <Sparkles className="h-3 w-3" /> }
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, x: -10 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.15em] font-medium text-muted-foreground hover:text-primary transition-colors cursor-default"
                                    >
                                        <span className="text-primary/70">{feature.icon}</span>
                                        {feature.text}
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="pt-2 pl-12"
                            >
                                <button className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary hover:gap-3 transition-all group/cta">
                                    Start Your Design
                                    <ArrowRight className="h-3 w-3 transition-transform" />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ConsultationPage
