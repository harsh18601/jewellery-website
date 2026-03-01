import React from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-secondary text-background pt-16 pb-8 border-t border-primary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold gold-text tracking-widest">RADHA GOVIND</h3>
                    <p className="text-sm text-background/60 leading-relaxed font-serif">
                        Traditional Jaipur craftsmanship meets modern innovation. Specializing in ethically sourced Lab-Grown Diamonds and bespoke custom jewellery.
                    </p>
                    <div className="flex space-x-4">
                        <Instagram className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                        <Facebook className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                        <Twitter className="h-5 w-5 hover:text-primary cursor-pointer transition-colors" />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Explore</h4>
                    <ul className="space-y-4 text-sm text-background/60">
                        <li><Link href="/shop?cat=lab-grown" className="luxury-link">Lab-Grown Diamonds</Link></li>
                        <li><Link href="/shop?cat=silver" className="luxury-link">Silver Jewellery</Link></li>
                        <li><Link href="/blog" className="luxury-link">Our Blog</Link></li>
                        <li><Link href="/#testimonials" className="luxury-link">Testimonials</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Customer Care</h4>
                    <ul className="space-y-4 text-sm text-background/60">
                        <li><Link href="/shipping" className="luxury-link">Shipping & Returns</Link></li>
                        <li><Link href="/care" className="luxury-link">Jewellery Care</Link></li>
                        <li><Link href="/size-guide" className="luxury-link">Size Guide</Link></li>
                        <li><Link href="/faq" className="luxury-link">FAQs</Link></li>
                        <li><Link href="/privacy" className="luxury-link">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="luxury-link">Terms & Conditions</Link></li>
                        <li><Link href="/disclaimer" className="luxury-link">Disclaimer</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-widest mb-6 text-primary">Contact Us</h4>
                    <ul className="space-y-4 text-sm text-background/60">
                        <li className="flex items-start space-x-3">
                            <MapPin className="h-4 w-4 text-primary mt-1" />
                            <span>Jaipur, Rajasthan, India</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>+91 86969 14998</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>info@radhagovind.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-background/10 text-center text-[10px] text-background/40 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} Shree Radha Govind Jewellers. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer
