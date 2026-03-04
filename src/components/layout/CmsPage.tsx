"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { RichTextRenderer } from '@/lib/richTextRenderer'
import FAQAccordion from './FAQAccordion'


interface CmsPageProps {
    data: any;
    fallback?: {
        title: string;
        subtitle?: string;
        image?: string;
        content: string;
    }
}

const CmsPage = ({ data, fallback }: CmsPageProps) => {
    const fields = data?.fields || {}
    const title = fields.title || fields.pageTitle || fallback?.title
    const subtitle = fields.subtitle || fields.subTitle || fallback?.subtitle
    const imageField = fields.image || fields.bannerImage || null
    const image = imageField?.fields?.file?.url ? `https:${imageField.fields.file.url}` : fallback?.image
    const content = fields.content || fields.body || fields.description
    const faqItems = fields.faq || fields.FAQ || fields.faqs || []
    const hasData = Boolean(title || subtitle || content || image || faqItems.length > 0)

    if (!hasData) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center px-4">
                <p className="text-muted-foreground font-serif italic text-center">Page content is not available yet.</p>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center bg-secondary overflow-hidden">
                <div className="absolute inset-0 opacity-40 grayscale">
                    {image && (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="relative z-10 text-center space-y-4 px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold text-foreground uppercase tracking-tighter"
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-foreground/70 text-lg uppercase tracking-widest font-light"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-muted-foreground font-serif">
                    <RichTextRenderer content={content} isDark={true} />
                    {!content && fallback?.content && (
                        <p className="whitespace-pre-line leading-relaxed">{fallback.content}</p>
                    )}
                </div>

                {/* FAQ Section */}
                {faqItems.length > 0 && (
                    <div className="mt-20">
                        <FAQAccordion items={faqItems} />
                    </div>
                )}
            </section>
        </div>
    )
}

export default CmsPage

