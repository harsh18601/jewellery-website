"use client"

import React from 'react'
import { useCurrency } from '@/components/providers/CurrencyContext'

const CurrencyPriceText = ({ amountInInr }: { amountInInr: number }) => {
    const { formatPrice } = useCurrency()
    return <>{formatPrice(Number(amountInInr || 0))}</>
}

export default CurrencyPriceText
