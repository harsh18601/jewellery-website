"use client"

import React, { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Props = {
    minLimit: number
    maxLimit: number
    currentMin: number
    currentMax: number
}

const PriceRangeFilter = ({ minLimit, maxLimit, currentMin, currentMax }: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    void currentMin
    void currentMax

    const formatCompactInr = (value: number) => {
        if (value >= 100000) {
            const lakhs = value / 100000
            const normalized = Number.isInteger(lakhs) ? lakhs.toFixed(0) : lakhs.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
            return `\u20B9${normalized}L`
        }
        return `\u20B9${Math.round(value / 1000)}K`
    }

    const ranges = useMemo(() => ([
        { label: `${formatCompactInr(10000)} - ${formatCompactInr(15000)}`, min: 10000, max: 15000 },
        { label: `${formatCompactInr(15000)} - ${formatCompactInr(25000)}`, min: 15000, max: 25000 },
        { label: `${formatCompactInr(25000)} - ${formatCompactInr(50000)}`, min: 25000, max: 50000 },
        { label: `${formatCompactInr(50000)} - ${formatCompactInr(75000)}`, min: 50000, max: 75000 },
        { label: `${formatCompactInr(75000)}+`, min: 75000, max: maxLimit },
    ]), [maxLimit])

    const applyQuery = (nextMin: number, nextMax: number) => {
        const lower = Math.min(nextMin, nextMax)
        const upper = Math.max(nextMin, nextMax)
        const params = new URLSearchParams(searchParams.toString())
        params.delete("price")
        params.set("min", String(Math.max(minLimit, Math.min(lower, maxLimit))))
        params.set("max", String(Math.max(minLimit, Math.min(upper, maxLimit))))
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                {ranges.map((range) => (
                    <button
                        type="button"
                        key={range.label}
                        onClick={() => {
                            applyQuery(range.min, range.max)
                        }}
                        className="block w-full text-left text-sm border border-primary/25 bg-muted/10 px-3 py-2 text-foreground/90 hover:border-primary/55 hover:text-primary transition-colors"
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default PriceRangeFilter
