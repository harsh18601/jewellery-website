import React from 'react'
import { fetchEntriesBySlug } from '@/lib/contentful'
import { RichTextRenderer } from '@/lib/richTextRenderer'

const TermsPage = async () => {
    const entry = await fetchEntriesBySlug('legalPage', 'terms-and-conditions')
    const content = entry?.fields?.content

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold uppercase tracking-tighter gold-text">
                    {(entry?.fields?.title as string) || "Terms & Conditions"}
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Last Updated: {entry?.sys?.updatedAt ? new Date(entry.sys.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2026"}
                </p>
            </div>

            <div className="prose prose-neutral max-w-none prose-luxury">
                {content ? (
                    <RichTextRenderer content={content} />
                ) : (
                    <>
                        <p>Welcome to Shree Radha Govind Jewellers. These terms and conditions outline the rules and regulations for the use of our website and services.</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Radha Govind if you do not agree to take all of the terms and conditions stated on this page.</p>

                        <h2>2. Intellectual Property</h2>
                        <p>Unless otherwise stated, Shree Radha Govind Jewellers and/or its licensors own the intellectual property rights for all material on Radha Govind. All intellectual property rights are reserved.</p>

                        <h2>3. User Responsibilities</h2>
                        <p>You must not:</p>
                        <ul>
                            <li>Republish material from Radha Govind</li>
                            <li>Sell, rent or sub-license material from Radha Govind</li>
                            <li>Reproduce, duplicate or copy material from Radha Govind</li>
                            <li>Redistribute content from Radha Govind</li>
                        </ul>

                        <h2>4. Custom Orders</h2>
                        <p>All bespoke and custom orders require a non-refundable deposit. Final delivery timelines are estimates and may vary based on the complexity of the design.</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default TermsPage
