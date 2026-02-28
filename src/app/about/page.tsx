import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import CmsPage from '@/components/layout/CmsPage'

export default async function AboutPage() {
    const pages = await fetchEntries('pageContent')
    const pageData = pages.find((p: any) => p.fields.slug === 'about')

    const fallback = {
        title: "Our Legacy",
        subtitle: "Jaipur Heritage Meets Modern Innovation",
        image: "https://images.unsplash.com/photo-1573408339371-c063b784999f?auto=format&fit=crop&q=80&w=2000",
        content: `Founded in the heart of the "Pink City" Jaipur, Shree Radha Govind Jewellers began as a small family atelier dedicated to the art of gemstone cutting and silver filigree. For decades, we have been trusted partners in the traditional jewellery trade, supplying precious stones to the world’s most renowned houses.

        Today, we are bridging our rich heritage with the future. By embracing Lab-Grown Diamonds, we offer the same brilliance and luxury our city is known for, but with a commitment to ethics, sustainability, and transparency that the modern world demands.`
    }

    return <CmsPage data={pageData} fallback={fallback} />
}
