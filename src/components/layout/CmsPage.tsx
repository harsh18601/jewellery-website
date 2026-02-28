"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { RichTextRenderer } from '@/lib/richTextRenderer'

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
    const title = data?.fields?.title || fallback?.title;
    const subtitle = data?.fields?.subtitle || fallback?.subtitle;
    const image = data?.fields?.image?.fields?.file?.url ? `https:${data.fields.image.fields.file.url}` : fallback?.image;
    const content = data?.fields?.content;

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
                        className="text-5xl md:text-7xl font-bold text-background uppercase tracking-tighter"
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-background/70 text-lg uppercase tracking-widest font-light"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>
            </section>

            {/* Content Section */}
            <section className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-muted-foreground font-serif">
                    <RichTextRenderer content={content} />
                    {!content && fallback?.content && (
                        <p className="whitespace-pre-line leading-relaxed">{fallback.content}</p>
                    )}
                </div>
            </section>
        </div>
    )
}

export default CmsPage
