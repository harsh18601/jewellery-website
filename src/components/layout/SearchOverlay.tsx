"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [query, setQuery] = useState('')
    const router = useRouter()
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/shop?search=${encodeURIComponent(query)}`)
            onClose()
            setQuery('')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed top-20 left-0 w-full z-[100] bg-background border-b border-primary/20 shadow-2xl p-8"
                >
                    <div className="max-w-4xl mx-auto flex items-center gap-6">
                        <form onSubmit={handleSearch} className="flex-grow relative">
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search our collections..."
                                className="w-full bg-transparent border-b border-primary/20 pb-4 text-xl outline-none focus:border-primary transition-all font-serif italic"
                            />
                            <button type="submit" className="absolute right-0 top-0 p-2 text-primary cursor-pointer">
                                <ArrowRight className="h-6 w-6" />
                            </button>
                        </form>
                        <button onClick={onClose} className="p-2 hover:text-primary transition-colors cursor-pointer">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="max-w-4xl mx-auto mt-6 flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-muted-foreground">Quick Search:</span>
                        {['Solitaire', '18K Gold', 'Emerald', 'Bespoke'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => { setQuery(tag); }}
                                className="hover:text-primary transition-colors cursor-pointer"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SearchOverlay

