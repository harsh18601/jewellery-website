import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import CmsPage from '@/components/layout/CmsPage'

export default async function SizeGuidePage() {
    const pages = await fetchEntries('pageContent')
    const pageData = pages.find((p: any) => p.fields.slug === 'size-guide')

    const fallback = {
        title: "Size Guide",
        subtitle: "Find Your Perfect Fit",
        content: `Rings: Measure the inner diameter of an existing ring. Necklaces: standard lengths are 16, 18, and 20 inches.`
    }

    return <CmsPage data={pageData} fallback={fallback} />
}
