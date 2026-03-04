"use client"

import React from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

const MobileStickyActions = () => {
    const openFilters = () => {
        const filterPanel = document.getElementById("shop-mobile-filters") as HTMLDetailsElement | null
        if (!filterPanel) return
        filterPanel.open = !filterPanel.open
        if (filterPanel.open) {
            filterPanel.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    const openSort = () => {
        const filterPanel = document.getElementById("shop-mobile-filters") as HTMLDetailsElement | null
        if (filterPanel?.open) {
            filterPanel.open = false
        }

        const sortPanel = document.getElementById("shop-sort-controls")
        sortPanel?.scrollIntoView({ behavior: "smooth", block: "start" })

        window.setTimeout(() => {
            const sortSelect = document.querySelector<HTMLSelectElement>("#shop-mobile-sort-select")
            if (!sortSelect) return
            sortSelect.focus()

            // Prefer native picker where available (mobile-friendly).
            const pickerCapable = sortSelect as HTMLSelectElement & { showPicker?: () => void }
            if (typeof pickerCapable.showPicker === "function") {
                pickerCapable.showPicker()
                return
            }

            // Fallback for browsers without showPicker support.
            sortSelect.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
            sortSelect.click()
        }, 120)
    }

    return (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-0 border-t border-primary/20 bg-background/88 backdrop-blur-md shadow-[0_-8px_22px_rgba(0,0,0,0.22)]">
            <button
                type="button"
                onClick={openFilters}
                className="h-[56px] bg-primary/12 text-primary text-[10px] uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 border-r border-primary/20 hover:bg-primary/18 transition-colors"
            >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
            </button>
            <button
                type="button"
                onClick={openSort}
                className="h-[56px] bg-transparent text-foreground text-[10px] uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/8 transition-colors"
            >
                <ChevronDown className="h-4 w-4" />
                Sort
            </button>
        </div>
    )
}

export default MobileStickyActions
