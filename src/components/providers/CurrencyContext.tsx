"use client"

import React, { createContext, useContext, useState } from "react"

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "AED" | "SGD"

type CurrencyOption = {
    code: CurrencyCode
    label: string
    symbol: string
}

type CurrencyContextType = {
    currency: CurrencyCode
    setCurrency: (currency: CurrencyCode) => void
    options: CurrencyOption[]
    formatPrice: (amountInInr: number) => string
    convertFromInr: (amountInInr: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = "site_currency"

const options: CurrencyOption[] = [
    { code: "INR", label: "India (INR Rs.)", symbol: "Rs." },
    { code: "USD", label: "United States (USD $)", symbol: "$" },
    { code: "EUR", label: "Eurozone (EUR EUR)", symbol: "EUR" },
    { code: "GBP", label: "United Kingdom (GBP PS)", symbol: "PS" },
    { code: "CAD", label: "Canada (CAD $)", symbol: "$" },
    { code: "AUD", label: "Australia (AUD $)", symbol: "$" },
    { code: "AED", label: "UAE (AED AED)", symbol: "AED" },
    { code: "SGD", label: "Singapore (SGD $)", symbol: "$" },
]

// Conversion multipliers from INR.
const rates: Record<CurrencyCode, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    CAD: 0.016,
    AUD: 0.019,
    AED: 0.044,
    SGD: 0.016,
}

const localeByCurrency: Record<CurrencyCode, string> = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "en-IE",
    GBP: "en-GB",
    CAD: "en-CA",
    AUD: "en-AU",
    AED: "en-AE",
    SGD: "en-SG",
}

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
        if (typeof window === "undefined") return "INR"
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && options.some((option) => option.code === saved)) {
            return saved as CurrencyCode
        }
        return "INR"
    })

    const setCurrency = (nextCurrency: CurrencyCode) => {
        setCurrencyState(nextCurrency)
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, nextCurrency)
        }
    }

    const convertFromInr = (amountInInr: number) => {
        const parsed = Number(amountInInr)
        if (!Number.isFinite(parsed)) return 0
        return parsed * rates[currency]
    }

    const formatPrice = (amountInInr: number) => {
        const converted = convertFromInr(amountInInr)
        return new Intl.NumberFormat(localeByCurrency[currency], {
            style: "currency",
            currency,
            maximumFractionDigits: currency === "INR" ? 0 : 2,
        }).format(converted)
    }

    const value = { currency, setCurrency, options, formatPrice, convertFromInr }

    return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext)
    if (!context) throw new Error("useCurrency must be used within a CurrencyProvider")
    return context
}
