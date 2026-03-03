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
                    if (prev.x === 0 && prev.y === 0) {
                        return {
                            x: Math.max(12, window.innerWidth - 76),
                            y: Math.max(12, window.innerHeight - 92),
                        }
                    }
                    const maxX = Math.max(12, window.innerWidth - 60)
                    const maxY = Math.max(12, window.innerHeight - 60)
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

        const maxX = Math.max(12, window.innerWidth - 60)
        const maxY = Math.max(12, window.innerHeight - 60)
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
                        className="absolute bottom-16 sm:bottom-20 right-0 w-[min(18rem,calc(100vw-2rem))] sm:w-72 bg-background border border-primary/20 shadow-2xl overflow-hidden"
                    >
                        <div className="bg-secondary p-6 text-center space-y-2">
                            <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
                            <h3 className="w-full text-center text-sm font-bold uppercase tracking-widest text-foreground">Boutique Concierge</h3>
                            <p className="text-[10px] text-foreground/60 uppercase tracking-widest">How may we assist you today?</p>
                        </div>

                        <div className="p-4 space-y-2">
                            <a
                                href="tell:+918696914998"
                                className="flex items-center space-x-4 p-4 hover:bg-muted/10 transition-colors group"
                            >
                                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <Phone className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Call Concierge</span>
                            </a>
                            <a
                                href="mailto:info@radhagovind.com"
                                className="flex items-center space-x-4 p-4 hover:bg-muted/10 transition-colors group"
                            >
                                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <Mail className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">Email Inquiry</span>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-4 p-4 hover:bg-muted/10 transition-colors group"
                            >
                                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                    <Instagram className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">DM on Instagram</span>
                            </a>
                        </div>

                        <div className="bg-muted/5 p-4 text-center border-t border-primary/5">
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-serif italic">
                                Monday - Saturday | 10:00 - 19:00 IST
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
                className="bg-primary text-foreground p-3 sm:p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-primary/90 transition-all group"
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

