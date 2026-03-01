import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import BlogSection from '@/components/home/BlogSection'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BlogListingPage() {
    const blogEntries = await fetchEntries('blogPost')

    const blogs = blogEntries?.map((entry: any) => ({
        title: entry.fields.title,
        image: entry.fields.featuredImage?.fields?.file?.url ? `https:${entry.fields.featuredImage.fields.file.url}` : null,
        date: entry.fields.date ? new Date(entry.fields.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : null,
        brand: entry.fields.brand || "RADHA GOVIND",
        slug: entry.fields.slug
    })) || []

    return (
        <div className="min-h-screen bg-black pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-primary text-xs uppercase tracking-widest font-bold hover:translate-x-[-4px] transition-transform">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </div>

                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tighter uppercase">Our <span className="gold-text italic">Journal</span></h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-serif italic text-lg">
                        Insights into Jaipur's heritage, jewellery care, and the brilliance of lab-grown diamonds.
                    </p>
                </div>

                <BlogSection blogs={blogs} />
            </div>
        </div>
    )
}
