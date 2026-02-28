import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import CmsPage from '@/components/layout/CmsPage'

export default async function ShippingPage() {
    const pages = await fetchEntries('pageContent')
    const pageData = pages.find((p: any) => p.fields.slug === 'shipping')

    const fallback = {
        title: "Shipping Information",
        subtitle: "Safe and Insured Delivery to Your Doorstep",
        content: `Domestic Shipping: 3-5 business days. International Shipping: 7-14 business days. All shipments are fully insured.`
    }

    return <CmsPage data={pageData} fallback={fallback} />
}
