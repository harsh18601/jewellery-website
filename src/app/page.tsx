import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import HomeContent from '@/components/home/HomeContent'

export default async function Home() {
  // Fetch CMS data in parallel for faster first render.
  const [heroEntries, categoryEntries, heritageEntries, blogEntries, collectionEntries, testimonialEntries] = await Promise.all([
    fetchEntries('hero'),
    fetchEntries('category'),
    fetchEntries('heritageFeature'),
    fetchEntries('blogPost'),
    fetchEntries('collection'),
    fetchEntries('testimonial'),
  ])

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
    subtitle: cat.fields.subtitle || '',
    description: cat.fields.description || '',
    badge: cat.fields.badge || '',
    ctaText: cat.fields.ctaText || 'Shop Now',
    image: cat.fields.image?.fields?.file?.url ? `https:${cat.fields.image.fields.file.url}` : 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000',
    link: cat.fields.slug ? `/shop?cat=${cat.fields.slug}` : '#'
  })) || []

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

  const blogs = blogEntries?.map((entry: any) => ({
    title: entry.fields.title,
    image: entry.fields.featuredImage?.fields?.file?.url ? `https:${entry.fields.featuredImage.fields.file.url}` : null,
    date: entry.fields.date ? new Date(entry.fields.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase() : null,
    brand: entry.fields.brand || "RADHA GOVIND",
    slug: entry.fields.slug
  })) || []

  const collections = collectionEntries?.map((entry: any) => ({
    title: entry.fields.title,
    subtitle: entry.fields.subtitle,
    image: entry.fields.image?.fields?.file?.url ? `https:${entry.fields.image.fields.file.url}` : null,
    color: entry.fields.color || "bg-black/60",
    slug: entry.fields.slug
  })) || []

  const testimonials = testimonialEntries?.map((entry: any) => ({
    name: entry.fields.name,
    role: entry.fields.role,
    content: entry.fields.content,
    rating: entry.fields.rating || 5
  })) || []

  return (
    <HomeContent
      hero={hero}
      categories={categories}
      heritageFeatures={heritageFeatures}
      blogs={blogs}
      collections={collections}
      testimonials={testimonials}
    />
  )
}
