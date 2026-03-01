"use client"

import React from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'

const getOptions = (isDark: boolean) => ({
    renderMark: {
        [MARKS.BOLD]: (text: React.ReactNode) => (
            <strong className={`font-bold ${isDark ? 'text-primary' : 'text-secondary'}`}>
                {text}
            </strong>
        ),
    },
    renderNode: {
        [BLOCKS.PARAGRAPH]: (_: any, children: React.ReactNode) => (
            <p className={`mb-6 leading-[1.8] text-[0.95rem] whitespace-pre-wrap ${isDark ? 'text-foreground/90' : 'text-foreground'}`}>
                {children}
            </p>
        ),
        [BLOCKS.HEADING_1]: (_: any, children: React.ReactNode) => (
            <h1 className={`text-4xl font-bold uppercase tracking-[0.3em] mb-12 mt-20 ${isDark ? 'text-foreground' : 'text-secondary'}`}>
                {children}
            </h1>
        ),
        [BLOCKS.HEADING_2]: (_: any, children: React.ReactNode) => (
            <h2 className={`text-2xl font-bold uppercase tracking-[0.2em] mb-10 mt-16 ${isDark ? 'text-primary' : 'text-primary'}`}>
                {children}
            </h2>
        ),
        [BLOCKS.HEADING_3]: (_: any, children: React.ReactNode) => (
            <h3 className={`text-xl font-bold uppercase tracking-widest mb-8 mt-12 ${isDark ? 'text-foreground/80' : 'text-secondary/80'}`}>
                {children}
            </h3>
        ),
        [BLOCKS.UL_LIST]: (_: any, children: React.ReactNode) => <ul className="list-disc space-y-3 mb-8 pl-6">{children}</ul>,
        [BLOCKS.LIST_ITEM]: (_: any, children: React.ReactNode) => (
            <li className={`leading-relaxed ${isDark ? 'text-foreground/90' : 'text-muted-foreground'}`}>{children}</li>
        ),
    },
})

export const RichTextRenderer = ({ content, isDark = false }: { content: any, isDark?: boolean }) => {
    if (!content) return null

    const options = getOptions(isDark)

    if (typeof content === 'string') {
        return (
            <p className={`leading-[1.8] text-[0.95rem] whitespace-pre-wrap ${isDark ? 'text-foreground/90' : 'text-foreground'}`}>
                {content}
            </p>
        )
    }

    return (
        <div className={`rich-text-content ${isDark ? 'prose-invert' : 'prose-luxury'}`}>
            {documentToReactComponents(content, options)}
        </div>
    )
}
