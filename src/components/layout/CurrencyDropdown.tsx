"use client"

import React, { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useCurrency } from "@/components/providers/CurrencyContext"

const CurrencyDropdown = ({ className = "" }: { className?: string }) => {
    const { currency, setCurrency, options } = useCurrency()
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selected = options.find((option) => option.code === currency) || options[0]

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-2 text-base sm:text-xs lg:text-sm uppercase tracking-widest font-bold hover:text-primary transition-colors"
            >
                <span suppressHydrationWarning>{selected.code} {selected.symbol}</span>
                {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-3 w-72 max-h-80 overflow-auto bg-background border border-primary/20 shadow-2xl z-[80]">
                    {options.map((option) => (
                        <button
                            key={option.code}
                            type="button"
                            onClick={() => {
                                setCurrency(option.code)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 text-base sm:text-sm transition-colors ${currency === option.code ? "text-primary font-semibold bg-primary/5" : "text-foreground/80 hover:bg-primary/5"}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CurrencyDropdown
