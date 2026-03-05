"use client"

import React from 'react'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'

const getOptions = (isDark: boolean) => ({
    renderMark: {
        [MARKS.BOLD]: (text: React.ReactNode) => (
            <strong className={`font-bold ${isDark ? 'text-primary' : 'text-foreground'}`}>
                {text}
            </strong>
        ),
    },
    renderNode: {
        [BLOCKS.PARAGRAPH]: (_: any, children: React.ReactNode) => (
            <p className={`mb-10 leading-[1.8] text-[1rem] whitespace-pre-wrap ${isDark ? 'text-foreground/80' : 'text-foreground/90'}`}>
                {children}
            </p>
        ),
        [BLOCKS.HEADING_1]: (_: any, children: React.ReactNode) => (
            <h1 className={`text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] mb-12 mt-20 ${isDark ? 'gold-text' : 'text-primary'}`}>
                {children}
            </h1>
        ),
        [BLOCKS.HEADING_2]: (_: any, children: React.ReactNode) => (
            <h2 className={`text-[13px] md:text-[14px] font-bold uppercase tracking-[0.25em] mb-4 mt-16 ${isDark ? 'text-primary' : 'text-primary'}`}>
                {children}
            </h2>
        ),
        [BLOCKS.HEADING_3]: (_: any, children: React.ReactNode) => (
            <h3 className={`text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] mb-3 mt-12 ${isDark ? 'text-primary/90' : 'text-primary'}`}>
                {children}
            </h3>
        ),
        [BLOCKS.HEADING_4]: (_: any, children: React.ReactNode) => (
            <h4 className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] mb-3 mt-10 text-primary">
                {children}
            </h4>
        ),
        [BLOCKS.HEADING_5]: (_: any, children: React.ReactNode) => (
            <h5 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-3 mt-8 text-primary">
                {children}
            </h5>
        ),
        [BLOCKS.HEADING_6]: (_: any, children: React.ReactNode) => (
            <h6 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2 mt-6 text-primary">
                {children}
            </h6>
        ),
        [BLOCKS.UL_LIST]: (_: any, children: React.ReactNode) => <ul className="list-disc space-y-4 mb-10 pl-6">{children}</ul>,
        [BLOCKS.LIST_ITEM]: (_: any, children: React.ReactNode) => (
            <li className={`leading-relaxed text-[0.95rem] ${isDark ? 'text-foreground/80' : 'text-muted-foreground'}`}>{children}</li>
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
