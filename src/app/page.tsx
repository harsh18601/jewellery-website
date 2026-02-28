import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchEntries } from '@/lib/contentful'
import HomeContent from '@/components/home/HomeContent'

export default async function Home() {
  // Fetch from Contentful
  const heroEntries = await fetchEntries('hero')
  const categoryEntries = await fetchEntries('category')
  const heritageEntries = await fetchEntries('heritageFeature')

  const hero = heroEntries?.[0]?.fields as any || {
    title: "Pure Brilliance,",
    subtitle: "Ethically Crafted",
    subtitleLabel: "Jaipur's Heritage & Innovation",
    description: "Discover our exclusive collection of Lab-Grown Diamonds and Bespoke Jewellery.",
    backgroundImage: { fields: { file: { url: "//images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070" } } },
    ctaText: "Explore Collection",
    ctaLink: "/shop"
  }

  const categories = categoryEntries?.map((cat: any) => ({
    title: cat.fields.name,
    image: cat.fields.image?.fields?.file?.url ? `https:${cat.fields.image.fields.file.url}` : 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000',
    link: cat.fields.slug ? `/shop?cat=${cat.fields.slug}` : '#'
  })) || [
      { title: 'Lab-Grown Diamonds', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000', link: '/shop?cat=lab-grown' },
      { title: 'Custom Jewellery', image: 'https://images.unsplash.com/photo-1573408339371-c063b784999f?auto=format&fit=crop&q=80&w=1000', link: '/custom' },
      { title: 'Silver Collection', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000', link: '/shop?cat=silver' }
    ]

  const heritageFeatures = heritageEntries?.map((entry: any) => {
    const imgField = entry.fields.featureImage || entry.fields.image;
    return {
      title: entry.fields.title,
      description: entry.fields.description,
      iconName: entry.fields.iconName,
      image: imgField?.fields?.file?.url ? `https:${imgField.fields.file.url}` : null,
      order: entry.fields.order || 99
    }
  }).sort((a: any, b: any) => a.order - b.order)

  return <HomeContent hero={hero} categories={categories} heritageFeatures={heritageFeatures} />
}
