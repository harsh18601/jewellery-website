import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConciergeButton from "@/components/layout/ConciergeButton";
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartContext";
import { WishlistProvider } from "@/components/providers/WishlistContext";

const inter = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const playfair = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Shree Radha Govind Jewellers | Premium Jewellery",
  description: "Jaipur's finest Lab-Grown Diamonds, Custom Jewellery, and Gemstones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-inter bg-background text-foreground antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main className="min-h-screen pt-20">
                {children}
              </main>
              <Footer />
              <ConciergeButton />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
