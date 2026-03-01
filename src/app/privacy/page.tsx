import React from 'react'
import { fetchEntriesBySlug } from '@/lib/contentful'
import { RichTextRenderer } from '@/lib/richTextRenderer'

const PrivacyPage = async () => {
    const entry = await fetchEntriesBySlug('legalPage', 'privacy-policy')
    const content = entry?.fields?.content

    return (
        <div className="max-w-4xl mx-auto px-4 py-24 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold uppercase tracking-tighter gold-text">
                    {(entry?.fields?.title as string) || "Privacy Policy"}
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
                        <p>At Shree Radha Govind Jewellers, accessible from radhagovind.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Radha Govind and how we use it.</p>

                        <h2>1. Information We Collect</h2>
                        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect in various ways, including to:</p>
                        <ul>
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                        </ul>

                        <h2>3. Log Files</h2>
                        <p>Radha Govind follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics.</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default PrivacyPage
