"use client"

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type SortOption = {
    label: string
    value: string
}

const AutoSortSelect = ({
    options,
    currentSort,
    disabled = false,
    id,
    className,
}: {
    options: SortOption[]
    currentSort?: string
    disabled?: boolean
    id?: string
    className?: string
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        const params = new URLSearchParams(searchParams.toString())
        if (!value) {
            params.delete('sort')
        } else {
            params.set('sort', value)
        }
        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    return (
        <select
            id={id}
            value={currentSort || 'new-arrivals'}
            onChange={handleChange}
            disabled={disabled}
            style={{ colorScheme: 'dark' }}
            className={className}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-secondary text-foreground">
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default AutoSortSelect
