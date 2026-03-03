import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConciergeButton from "@/components/layout/ConciergeButton";
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartContext";
import { WishlistProvider } from "@/components/providers/WishlistContext";
import { CurrencyProvider } from "@/components/providers/CurrencyContext";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "500", "600", "700"] });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Shree Radha Govind Jewellers | Premium Jewellery",
  description: "Jaipur's finest Lab-Grown Diamonds, Custom Jewellery, and Gemstones.",
  icons: {
    icon: "/brand-icon.svg?v=3",
    shortcut: "/brand-icon.svg?v=3",
    apple: "/brand-icon.svg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${cinzel.variable} font-sans bg-background text-foreground antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CurrencyProvider>
                <Navbar />
                <main className="min-h-screen pt-20">
                  {children}
                </main>
                <Footer />
                <ConciergeButton />
              </CurrencyProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
