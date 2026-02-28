# ✨ Shree Radha Govind Jewellers

A premium, high-end e-commerce experience for Jaipur's finest jewellery, specializing in **Lab-Grown Diamonds**, **Custom Designs**, and **Traditional Heritage**.

![Premium Jewellery Showcase](https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070)

## 💎 Features

### 🌟 Boutique Experience
- **Dynamic Heritage Gallery**: Immersive storytelling section powered by Contentful CMS.
- **Personal Stylist Consultation**: High-end booking flow for private sessions.
- **Luxury Interactivity**: Custom animated underlines, card-lift effects, and premium transitions.
- **Boutique Concierge**: A floating support hub for instant access via Phone, Email, or Socials.

### 💍 Advanced Shop Logic
- **Wishlist System**: Persistently save your favorite pieces with real-time Navbar updates.
- **Interactive Ring Builder**: Choose your stone, shape, carat weight, and metal with live pricing.
- **Bespoke Requests**: Upload reference images for custom-made masterpieces.

### ⚙️ Technical Brilliance
- **Framework**: [Next.js 15+](https://nextjs.org/) with App Router.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a curated luxury color palette.
- **CMS**: [Contentful](https://www.contentful.com/) integrated for all dynamic content and products.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for silky-smooth luxury transitions.
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose for persistent user data.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Contentful Space
- MongoDB instance (local or Atlas)

### 2. Environment Setup
Create a `.env.local` file in the root:
```env
# Contentful
CONTENTFUL_SPACE_ID=your_id_here
CONTENTFUL_ACCESS_TOKEN=your_token_here

# Auth & DB
MONGODB_URI=your_mongo_uri
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Installation
```bash
npm install
npm run dev
```

---

## 🎨 Design Philosophy
The website is designed with a **"Digital Gold"** aesthetic.
- **Typography**: `Playfair Display` for high-end headings and `Inter` for clarity.
- **Colors**: A palette of `#D4AF37` (Gold), `#F9E272` (Shimmering Light), and `hsl(40 30% 98%)` (Creamy Paper).
- **Interactions**: Subtle, intentional micro-animations that respond to the user's touch.

---

## 🏛️ Heritage Gallery Integration
The gallery is dynamic! Define a `heritageFeature` content model in Contentful with:
- `title` (Short Text)
- `description` (Long Text)
- `iconName` (Options: `Sparkles`, `ShieldCheck`, `Gem`, `Crown`, `Fingerprint`)
- `featureImage` (Asset)
- `order` (Integer)

---

Developed with ❤️ for **Shree Radha Govind Jewellers, Jaipur**.
