import React from 'react'
import { fetchEntriesBySlug } from '@/lib/contentful'
import { RichTextRenderer } from '@/lib/richTextRenderer'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await fetchEntriesBySlug('blogPost', slug)

    if (!post) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-6">
                <h1 className="text-4xl font-serif gold-text uppercase tracking-widest">Article Not Found</h1>
                <Link href="/blog" className="text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all uppercase tracking-widest text-xs font-bold">
                    Return to Journal
                </Link>
            </div>
        )
    }

    const title = (post.fields.title as string) || "Untitled Article"
    const date = post.fields.date ? new Date(post.fields.date as string).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : null
    const brand = (post.fields.brand as string) || "SHREE RADHA GOVIND"
    const content = post.fields.content
    const featuredImage = post.fields.featuredImage as any
    const image = featuredImage?.fields?.file?.url ? `https:${featuredImage.fields.file.url}` : null

    return (
        <article className="min-h-screen bg-black text-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12 space-y-6">
                    <Link href="/blog" className="inline-flex items-center text-primary text-xs uppercase tracking-widest font-bold hover:translate-x-[-4px] transition-transform">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journal
                    </Link>

                    <div className="space-y-4">
                        <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold border-l-2 border-primary pl-4">
                            {brand}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif tracking-tighter uppercase leading-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                        {date && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-primary" />
                                {date}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-primary" />
                            By Heritage Desk
                        </div>
                    </div>
                </div>

                {/* Featured Image */}
                {image && (
                    <div className="aspect-video w-full overflow-hidden mb-16 border border-white/5 rounded-sm">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover opacity-90"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose max-w-none font-serif">
                    <RichTextRenderer content={content} isDark={true} />
                </div>

                {/* Footer Section */}
                <div className="mt-24 pt-12 border-t border-white/10 flex flex-col items-center space-y-8">
                    <div className="text-center">
                        <p className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold mb-4">Interested in bespoke pieces?</p>
                        <Link href="/custom" className="px-10 py-4 bg-primary text-background uppercase tracking-widest text-xs font-bold hover:bg-primary/90 transition-all inline-block">
                            Consult with Our Artisans
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
