import React from 'react'
import { fetchEntries } from '@/lib/contentful'
import HomeContent from '@/components/home/HomeContent'

export default async function Home() {
  // Fetch CMS data in parallel for faster first render.
  const [heroEntries, categoryEntries, heritageEntries, blogEntries, testimonialEntries, productEntries] = await Promise.all([
    fetchEntries('hero'),
    fetchEntries('category'),
    fetchEntries('heritageFeature'),
    fetchEntries('blogPost'),
    fetchEntries('testimonial'),
    fetchEntries('product'),
  ])

  const rawHero = heroEntries?.[0]?.fields as any
  const hero = rawHero || {
    title: "Real Diamonds",
    subtitle: "Ethically Created",
    subtitleLabel: "Lab-Grown Diamond Specialists",
    description: "Modern diamonds with traditional craftsmanship from Jaipur.",
    backgroundImage: { fields: { file: { url: "//images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=2070" } } },
    ctaText: "Shop Lab Diamonds",
    ctaLink: "/shop"
  }

  if (hero.title === "Pure Brilliance,") hero.title = "Real Diamonds."
  if (hero.subtitle === "Ethically Crafted") hero.subtitle = "Ethically Created."
  if (hero.subtitleLabel === "Jaipur's Heritage & Innovation") hero.subtitleLabel = "Lab-Grown Diamond Specialists"
  if (hero.description?.includes("Discover our exclusive collection")) {
    hero.description = "Modern diamonds with traditional craftsmanship from Jaipur."
  }
  if (hero.ctaText === "Explore Collection") hero.ctaText = "Shop Lab Diamonds"

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

  const testimonials = testimonialEntries?.map((entry: any) => ({
    name: entry.fields.name,
    role: entry.fields.role,
    content: entry.fields.content,
    rating: entry.fields.rating || 5,
    image: entry.fields.image?.fields?.file?.url
      ? `https:${entry.fields.image.fields.file.url}`
      : null
  })) || []

  const featuredProducts = (productEntries || []).map((entry: any) => {
    const fields = entry?.fields || {}
    const images = Array.isArray(fields.images) ? fields.images : []
    return {
      id: entry?.sys?.id,
      title: fields.title || 'Jewellery Design',
      price: Number(fields.price || 0),
      rating: Number(fields.ratings || 0),
      image: images?.[0]?.fields?.file?.url ? `https:${images[0].fields.file.url}` : null,
      category: Array.isArray(fields.category) ? (fields.category?.[0]?.fields?.name || 'Jewellery') : (fields.category?.fields?.name || fields.category || 'Jewellery'),
      slug: fields.slug || '',
      isFeatured: Boolean(fields.isFeatured),
      createdAt: entry?.sys?.createdAt || '',
    }
  })
    .sort((a: any, b: any) => {
      const aScore = (a.isFeatured ? 2 : 0) + Number(a.rating || 0)
      const bScore = (b.isFeatured ? 2 : 0) + Number(b.rating || 0)
      if (bScore !== aScore) return bScore - aScore
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 6)

  return (
    <HomeContent
      hero={hero}
      categories={categories}
      heritageFeatures={heritageFeatures}
      featuredProducts={featuredProducts}
      blogs={blogs}
      testimonials={testimonials}
    />
  )
}
