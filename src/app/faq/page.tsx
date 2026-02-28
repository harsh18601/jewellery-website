import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import CmsPage from '@/components/layout/CmsPage'

export default async function FAQPage() {
    const pages = await fetchEntries('pageContent')
    const pageData = pages.find((p: any) => p.fields.slug === 'faq')

    const fallback = {
        title: "Frequently Asked Questions",
        subtitle: "Everything You Need to Know",
        content: `Q: Are your diamonds real? A: Yes, they are real diamonds, chemically and physically identical to mined diamonds but grown in a controlled environment.`
    }

    return <CmsPage data={pageData} fallback={fallback} />
}
