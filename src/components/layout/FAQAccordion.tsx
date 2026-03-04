"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
    fields: {
        question: string;
        answer: string;
    }
}

interface FAQAccordionProps {
    items: FAQItem[];
}

const FAQAccordion = ({ items }: FAQAccordionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-2">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                const question = item.fields.question;
                const answer = item.fields.answer;

                return (
                    <div
                        key={index}
                        className="border-b border-primary/10 overflow-hidden"
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full py-6 flex items-center justify-between text-left group transition-all duration-300"
                        >
                            <span className={`text-[15px] md:text-[17px] font-medium tracking-wide transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-foreground/90 group-hover:text-primary'}`}>
                                {question}
                            </span>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className={`flex-shrink-0 ml-4 ${isOpen ? 'text-primary' : 'text-foreground/40 group-hover:text-primary/60'}`}
                            >
                                <ChevronDown size={20} strokeWidth={1.5} />
                            </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="pb-8 pr-12 text-[0.95rem] leading-[1.8] text-foreground/70 font-serif">
                                        <p className="whitespace-pre-line">{answer}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default FAQAccordion;
