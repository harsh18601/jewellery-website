import React from 'react'
import { notFound } from 'next/navigation'
import { fetchEntriesBySlug } from '@/lib/contentful'
import CmsPage from '@/components/layout/CmsPage'

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const pageData = await fetchEntriesBySlug('pageContent', slug)

    if (!pageData) {
        notFound()
    }

    return <CmsPage data={pageData} />
}
