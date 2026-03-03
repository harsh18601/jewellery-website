"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type BackButtonProps = {
    label?: string
    fallbackHref?: string
    className?: string
}

const BackButton = ({ label = 'Back', fallbackHref = '/', className = '' }: BackButtonProps) => {
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
            router.back()
            return
        }
        router.push(fallbackHref)
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors ${className}`}
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </button>
    )
}

export default BackButton
