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
        [BLOCKS.PARAGRAPH]: (node: any) => {
            const lines: React.ReactNode[][] = [[]];

            node.content.forEach((child: any) => {
                const isBold = child.marks?.some((m: any) => m.type === 'bold');

                if (isBold && lines[lines.length - 1].length > 0) {
                    lines.push([]);
                }

                if (child.nodeType === 'text') {
                    const textValue = child.value;
                    if (textValue.includes('•') || textValue.includes('|') || textValue.includes('—')) {
                        const segments = textValue.split(/([•|—])/);
                        segments.forEach((seg: string) => {
                            if (seg === '•' || seg === '|' || seg === '—') {
                                lines.push([]);
                            } else if (seg.trim().length > 0) {
                                lines[lines.length - 1].push(seg.trim());
                            }
                        });
                    } else {
                        lines[lines.length - 1].push(textValue);
                    }
                } else {
                    const rendered = documentToReactComponents({
                        nodeType: BLOCKS.DOCUMENT,
                        data: {},
                        content: [child]
                    }, {
                        renderMark: getOptions(isDark).renderMark,
                        renderNode: { [BLOCKS.PARAGRAPH]: (_, children) => children }
                    });
                    lines[lines.length - 1].push(rendered);
                }
            });

            return (
                <div className="mb-12 space-y-4">
                    {lines.filter(l => l.length > 0).map((line, i) => (
                        <p key={i} className={`leading-[1.8] text-[0.95rem] border-l-2 border-primary/20 pl-6 py-1 hover:border-primary transition-colors ${isDark ? 'text-white/90' : 'text-foreground'}`}>
                            {line}
                        </p>
                    ))}
                </div>
            );
        },
        [BLOCKS.HEADING_1]: (_: any, children: React.ReactNode) => (
            <h1 className={`text-4xl font-bold uppercase tracking-[0.3em] mb-12 mt-20 border-b-2 pb-6 ${isDark ? 'text-white border-white/10' : 'text-secondary border-secondary/10'}`}>
                {children}
            </h1>
        ),
        [BLOCKS.HEADING_2]: (_: any, children: React.ReactNode) => (
            <h2 className={`text-2xl font-bold uppercase tracking-[0.2em] mb-10 mt-16 border-b pb-4 ${isDark ? 'text-primary border-primary/20' : 'text-primary border-primary/10'}`}>
                {children}
            </h2>
        ),
        [BLOCKS.HEADING_3]: (_: any, children: React.ReactNode) => (
            <h3 className={`text-xl font-bold uppercase tracking-widest mb-8 mt-12 ${isDark ? 'text-white/80' : 'text-secondary/80'}`}>
                {children}
            </h3>
        ),
        [BLOCKS.UL_LIST]: (_: any, children: React.ReactNode) => <ul className="list-none space-y-6 mb-12 ml-2">{children}</ul>,
        [BLOCKS.LIST_ITEM]: (_: any, children: React.ReactNode) => (
            <li className="flex items-start group">
                <span className="text-primary mr-5 mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-all flex-shrink-0" />
                <span className={`leading-relaxed transition-colors ${isDark ? 'text-white/70 group-hover:text-white' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {children}
                </span>
            </li>
        ),
    },
});

export const RichTextRenderer = ({ content, isDark = false }: { content: any, isDark?: boolean }) => {
    if (!content) return null;

    const options = getOptions(isDark);

    if (typeof content === 'string') {
        const parts = content.split(/[•|—]/).filter(p => p.trim().length > 0);
        return (
            <div className={`space-y-6 ${isDark ? 'text-white/90' : 'text-foreground'}`}>
                {parts.map((p, i) => (
                    <p key={i} className="leading-[1.8] text-[0.95rem] whitespace-pre-line border-l-2 border-primary/20 pl-6 py-2 hover:border-primary transition-colors">{p.trim()}</p>
                ))}
            </div>
        );
    }

    return (
        <div className={`rich-text-content ${isDark ? 'prose-invert' : 'prose-luxury'}`}>
            {documentToReactComponents(content, options)}
        </div>
    );
};
