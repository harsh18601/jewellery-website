"use client"

import React, { useEffect, useState } from 'react'

const VisibleResultsCount = ({ total, overallTotal }: { total: number, overallTotal?: number }) => {
    const [visible, setVisible] = useState(Math.min(8, total))
    const baseTotal = typeof overallTotal === 'number' ? overallTotal : total

    useEffect(() => {
        setVisible(Math.min(8, total))
    }, [total])

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<{ visibleCount?: number }>
            const nextVisible = Number(customEvent.detail?.visibleCount || 0)
            setVisible(Math.max(0, Math.min(total, nextVisible)))
        }
        window.addEventListener('shop-visible-count', handler as EventListener)
        return () => window.removeEventListener('shop-visible-count', handler as EventListener)
    }, [total])

    if (total === 0) return <>Showing 0 of {baseTotal} designs</>
    return <>Showing {visible} of {baseTotal} designs</>
}

export default VisibleResultsCount
