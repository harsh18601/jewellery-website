Act as a senior full-stack architect and build a production-ready modern jewellery eCommerce platform.

Project Name:
Shree Radha Govind Jewellers – Digital Platform

Business Background:
We are a Jaipur-based jewellery business dealing in precious & semi-precious stones, silver jewellery, and expanding into Lab-Grown Diamond Jewellery. The platform should combine our traditional business with a modern high-profit digital jewellery brand.

Goal:
Create a scalable, premium, conversion-focused website that supports:
1. Lab-grown diamond jewellery (primary focus)
2. Custom jewellery orders
3. Gemstones & silver jewellery (existing business)
4. Future international expansion

--------------------------------------------------

TECH STACK (Modern & Scalable)

Frontend:
- Next.js (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion animations
- ShadCN UI components

Backend:
- Node.js + Express OR Next.js Server Actions
- REST + optional GraphQL API
- JWT Authentication
- Role-based access (Admin / Customer)

Database:
- MongoDB Atlas
- Mongoose ORM

Storage:
- Cloudinary or AWS S3 (for jewellery images/videos)

Payments:
- Razorpay (India)
- Stripe (for international expansion)

Deployment:
- Vercel (frontend)
- Render / Railway / AWS (backend)
- MongoDB Atlas cloud DB

Search:
- MongoDB Atlas Search OR Algolia

--------------------------------------------------

CORE WEBSITE SECTIONS

1. HOME PAGE
- Premium luxury feel
- Hero section for Lab-Grown Diamonds
- Brand story (Jaipur heritage + modern innovation)
- Featured collections
- Customer testimonials
- Instagram integration

2. SHOP SECTION
Categories:
- Lab-Grown Diamond Jewellery
- Custom Jewellery
- Gemstones
- Silver Jewellery
- Lightweight Daily Wear

Filters:
- Price
- Metal
- Stone type
- Occasion
- Gender
- Certification

3. LAB-GROWN DIAMOND EXPERIENCE
- Educational section explaining lab diamonds
- Comparison: Natural vs Lab-grown
- Certification info
- Custom ring builder

4. CUSTOM JEWELLERY BUILDER (HIGH PRIORITY)
Users can:
- Select stone
- Select metal
- Upload reference design
- Add engraving text
- Request quotation

Admin receives order dashboard.

5. PRODUCT PAGE
- 360° images
- Zoom
- Stone details
- Certification info
- Live price calculation
- Wishlist
- WhatsApp inquiry button

6. ABOUT US
- Family legacy
- Jaipur craftsmanship
- Manufacturing process

7. ADMIN DASHBOARD
Admin can:
- Add/edit products
- Manage orders
- Upload inventory
- Manage custom requests
- View analytics
- Update pricing

--------------------------------------------------

DATABASE DESIGN (MongoDB Collections)

Users
- name
- email
- password
- role
- addresses

Products
- title
- category
- metal
- stoneType
- labGrown(boolean)
- price
- images
- description
- certification
- inventory

Orders
- userId
- products[]
- totalPrice
- paymentStatus
- orderStatus

CustomOrders
- userDetails
- selectedOptions
- referenceImages
- quotationStatus

Reviews
- productId
- rating
- comment

--------------------------------------------------

ADVANCED FEATURES (MODERN DIFFERENTIATORS)

- AI Jewellery Recommendation System
- Virtual try-on (future integration)
- Live gold price API integration
- WhatsApp automation
- SEO optimized product pages
- Progressive Web App (PWA)
- Fast loading (<2s)

--------------------------------------------------

UI/UX STYLE

- Luxury minimal design
- Black + Gold + Ivory color palette
- Smooth micro-animations
- Mobile-first responsive design

Inspired by:
- Cartier
- Blue Nile
- Modern D2C Indian brands

--------------------------------------------------

SEO & MARKETING

- Schema markup for products
- Blog section:
    - Lab-grown diamond education
    - Gemstone guides
    - Jewellery trends
- Instagram reel embedding
- Lead capture forms

--------------------------------------------------

SECURITY

- HTTPS
- JWT auth
- Rate limiting
- Admin access protection
- Secure payment verification

--------------------------------------------------

OUTPUT REQUIRED

1. Full folder structure
2. Backend API routes
3. MongoDB schemas
4. Frontend page components
5. Deployment steps
6. Environment variables setup
7. Future scalability suggestions

EXTRA HIGH-PROFIT ADD-ON (You SHOULD Include)

Add this section also inside website:

⭐ “Design Your Ring” Feature

This alone can become your biggest money-maker.

Why?

Engagement rings = emotional buying

High margins

Advance payments

PAN India orders

Build the project in modular architecture so new jewellery categories can be added easily.