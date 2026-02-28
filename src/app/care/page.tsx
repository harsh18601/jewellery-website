import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import CmsPage from '@/components/layout/CmsPage'

export default async function CarePage() {
    const pages = await fetchEntries('pageContent')
    const pageData = pages.find((p: any) => p.fields.slug === 'care')

    const fallback = {
        title: "Jewellery Care",
        subtitle: "Keep Your Brilliance Forever",
        content: `Store your jewellery in a dry place. Clean with a soft cloth and mild soap. Avoid contact with perfumes and chemicals.`
    }

    return <CmsPage data={pageData} fallback={fallback} />
}
