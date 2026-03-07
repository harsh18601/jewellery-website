# Shree Radha Govind Jewellers

Luxury jewellery e-commerce platform built with Next.js App Router, Contentful-powered storefront content, and MongoDB-backed user/order flows.

## Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Contentful (CMS for homepage, navbar, footer, blogs, products, dynamic pages)
- MongoDB + Mongoose
- NextAuth (Credentials + Google + GitHub)
- Cloudinary (custom order image uploads)

## Core Features
- CMS-driven homepage sections, navigation, and footer with graceful fallbacks when CMS data is missing
- Product listing and product detail pages
- Cart and wishlist state with shared providers
- Authentication (sign in, sign up, OAuth, profile area)
- Profile pages for orders, wishlist, addresses, and settings
- Blog listing and slug-based blog pages
- Consultation and custom jewellery request flows
- Floating WhatsApp and concierge support entry points

## Main Routes
- `/`
- `/shop`
- `/product/[id]`
- `/cart`
- `/custom`
- `/consultation`
- `/blog`
- `/blog/[slug]`
- `/auth/signin`
- `/auth/signup`
- `/profile`
- `/profile/orders`
- `/profile/wishlist`
- `/profile/addresses`
- `/profile/settings`
- `/[slug]` (dynamic CMS pages)

## Requirements
- Node.js `>=20 <21`
- npm
- MongoDB (local or Atlas)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` (or copy from `.env.example`) and set required variables:
```env
# Database/Auth
MONGODB_URI=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# OAuth (optional but needed for social login)
GOOGLE_ID=
GOOGLE_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# CMS (optional; app falls back to defaults when absent)
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=

# Media uploads for custom orders
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

3. Run locally:
```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts
- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Notes
- Contentful is optional in local development. If `CONTENTFUL_SPACE_ID` or `CONTENTFUL_ACCESS_TOKEN` is missing, CMS fetches resolve to empty data and UI fallbacks are used.
- Custom order image uploads require valid Cloudinary credentials.
