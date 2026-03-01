import React from 'react'
import { fetchEntriesBySlug } from '@/lib/contentful'
import { RichTextRenderer } from '@/lib/richTextRenderer'

const DisclaimerPage = async () => {
    const entry = await fetchEntriesBySlug('legalPage', 'disclaimer')
    const content = entry?.fields?.content

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold uppercase tracking-tighter gold-text">
                    {(entry?.fields?.title as string) || "Disclaimer"}
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
                        <p>The information provided by Shree Radha Govind Jewellers ("we," "us," or "our") on radhagovind.com (the "Site") is for general informational purposes only.</p>

                        <h2>1. General Disclaimer</h2>
                        <p>All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>

                        <h2>2. Professional Advice</h2>
                        <p>The Site cannot and does not contain jewellery valuation or gemstone authenticity advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice.</p>

                        <h2>3. Errors and Omissions</h2>
                        <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Shree Radha Govind Jewellers is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default DisclaimerPage
