"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles, Phone, Mail, Instagram } from 'lucide-react'

const ConciergeButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const dragStateRef = useRef({
        dragging: false,
        moved: false,
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
    })

    useEffect(() => {
        if (typeof window === 'undefined') return

        const updateViewportMode = () => {
            const mobile = window.innerWidth < 640
            setIsMobile(mobile)

            if (mobile) {
                setPosition((prev) => {
                    const mobileBottomSafeSpace = 78
                    if (prev.x === 0 && prev.y === 0) {
                        return {
                            x: Math.max(12, window.innerWidth - 76),
                            y: Math.max(12, window.innerHeight - 132),
                        }
                    }
                    const maxX = Math.max(12, window.innerWidth - 64)
                    const maxY = Math.max(12, window.innerHeight - mobileBottomSafeSpace)
                    return {
                        x: Math.min(maxX, Math.max(12, prev.x)),
                        y: Math.min(maxY, Math.max(12, prev.y)),
                    }
                })
            }
        }

        updateViewportMode()
        window.addEventListener('resize', updateViewportMode)
        return () => window.removeEventListener('resize', updateViewportMode)
    }, [])

    const onDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isMobile) return
        dragStateRef.current = {
            dragging: true,
            moved: false,
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const onDragMove = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isMobile || !dragStateRef.current.dragging) return
        const dx = event.clientX - dragStateRef.current.startX
        const dy = event.clientY - dragStateRef.current.startY

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
            dragStateRef.current.moved = true
        }

        const mobileBottomSafeSpace = 78
        const maxX = Math.max(12, window.innerWidth - 64)
        const maxY = Math.max(12, window.innerHeight - mobileBottomSafeSpace)
        const nextX = Math.min(maxX, Math.max(12, dragStateRef.current.originX + dx))
        const nextY = Math.min(maxY, Math.max(12, dragStateRef.current.originY + dy))

        setPosition({ x: nextX, y: nextY })
    }

    const onDragEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isMobile) return
        dragStateRef.current.dragging = false
        event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const onToggle = () => {
        if (isMobile && dragStateRef.current.moved) {
            dragStateRef.current.moved = false
            return
        }
        setIsOpen(!isOpen)
    }

    return (
        <div
            className={`fixed z-[100] ${isMobile ? '' : 'bottom-4 right-4 sm:bottom-8 sm:right-8'}`}
            style={isMobile ? { left: `${position.x}px`, top: `${position.y}px` } : undefined}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-16 sm:bottom-20 right-0 w-[min(19rem,calc(100vw-2rem))] sm:w-80 bg-background/80 backdrop-blur-xl border border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden rounded-sm"

                    >
                        <div className="relative bg-gradient-to-b from-[#1b1f26] to-[#0f141a] p-5 border-b border-primary/10">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-foreground/40 hover:text-primary transition-all hover:scale-110"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Concierge</h3>
                                    <p className="text-[9px] text-foreground/40 uppercase tracking-widest mt-0.5">Bespoke assistance</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 space-y-1">
                            {[
                                {
                                    href: "tel:+918306469764",
                                    icon: <Phone className="h-4 w-4" />,
                                    label: "Call Concierge",
                                    sub: "Speak with a jewellery expert",
                                    hoverIcon: "rotate-12"
                                },
                                {
                                    href: "mailto:info@radhagovind.com",
                                    icon: <Mail className="h-4 w-4" />,
                                    label: "Email Inquiry",
                                    sub: "Detailed design requests",
                                    hoverIcon: "-translate-y-0.5"
                                },
                                {
                                    href: "https://instagram.com",
                                    icon: <Instagram className="h-4 w-4" />,
                                    label: "DM on Instagram",
                                    sub: "Follow our latest collections",
                                    hoverIcon: "scale-110"
                                }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    target={item.href.startsWith('http') ? "_blank" : undefined}
                                    rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                                    className="flex items-center gap-4 p-4 hover:bg-primary/[0.03] transition-all group border-l-2 border-transparent hover:border-primary/40 rounded-r-sm"
                                >
                                    <div className={`p-2.5 bg-primary/10 rounded-full border border-primary/20 group-hover:bg-primary/20 transition-all group-hover:${item.hoverIcon}`}>
                                        <span className="text-primary">{item.icon}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/90">{item.label}</span>
                                        <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mt-0.5">{item.sub}</span>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="px-6 py-4 bg-primary/[0.02] border-t border-primary/10">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className="h-[1px] w-4 bg-primary/20" />
                                <span className="text-[8px] text-primary uppercase tracking-[0.3em] font-bold">Status: Available</span>
                                <div className="h-[1px] w-4 bg-primary/20" />
                            </div>
                            <p className="text-[9px] text-center text-muted-foreground/80 uppercase tracking-[0.1em] font-medium">
                                Mon – Sat | 10:00 – 19:00 IST
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggle}
                onPointerDown={onDragStart}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerCancel={onDragEnd}
                className="bg-primary text-foreground h-[52px] w-[52px] sm:h-auto sm:w-auto p-0 sm:p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-primary/90 transition-all group"
            >
                {isOpen ? (
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-[10px] uppercase tracking-widest font-bold">
                            Concierge
                        </span>
                    </div>
                )}
            </motion.button>
        </div>
    )
}

export default ConciergeButton
