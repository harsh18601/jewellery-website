import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConciergeButton from "@/components/layout/ConciergeButton";
import WhatsAppFloatingButton from "@/components/layout/WhatsAppFloatingButton";
import AuthProvider from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartContext";
import { WishlistProvider } from "@/components/providers/WishlistContext";
import { CurrencyProvider } from "@/components/providers/CurrencyContext";
import { fetchFooterData, fetchNavbarLinks } from "@/lib/contentful";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navLinks, footerData] = await Promise.all([
    fetchNavbarLinks(),
    fetchFooterData(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${cinzel.variable} font-sans bg-background text-foreground antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CurrencyProvider>
                <Navbar navLinks={navLinks} />
                <main className="min-h-screen pt-16 sm:pt-20">
                  {children}
                </main>
                <Footer data={footerData} />
                <WhatsAppFloatingButton whatsappUrl={footerData?.whatsappUrl} />
                <ConciergeButton />
              </CurrencyProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
