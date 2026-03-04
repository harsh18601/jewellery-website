"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [query, setQuery] = useState('')
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!isOpen) return
        setTimeout(() => inputRef.current?.focus(), 0)
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) onClose()
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    const searchByKeyword = (keyword: string) => {
        const value = keyword.trim()
        if (!value) return
        router.push(`/shop?search=${encodeURIComponent(value)}`)
        setQuery('')
        onClose()
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        searchByKeyword(query)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) onClose()
                    }}
                    className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.985 }}
                        className="absolute top-16 sm:top-20 left-0 w-full bg-background/95 border-b border-primary/20 shadow-2xl p-4 sm:p-8"
                    >
                        <div className="max-w-4xl mx-auto">
                            <motion.form
                                onSubmit={handleSearch}
                                className="flex-grow relative"
                                initial={{ scaleX: 0.985 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/80" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for rings, diamonds, pendants..."
                                    className="w-full h-12 sm:h-16 rounded-full bg-transparent border border-[rgba(212,175,55,0.35)] pl-11 sm:pl-12 pr-12 sm:pr-14 text-base sm:text-[1.05rem] placeholder:text-foreground/60 placeholder:text-sm sm:placeholder:text-base outline-none focus:border-[rgba(212,175,55,0.45)] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_0_22px_rgba(212,175,55,0.12)] transition-all font-serif italic"
                                />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-primary/20 bg-background/70 inline-flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-all"
                                    aria-label="Close search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </motion.form>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SearchOverlay
