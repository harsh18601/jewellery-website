import React from 'react'
import { MessageCircle } from 'lucide-react'

const DEFAULT_WHATSAPP_URL = 'https://wa.me/918306469764'
const DEFAULT_WHATSAPP_MESSAGE = 'Hi, I want to know more about your jewellery.'

const normalizeWhatsAppUrl = (url?: string) => {
    const value = (url || '').trim()
    const baseUrl = value || DEFAULT_WHATSAPP_URL

    try {
        const parsed = new URL(baseUrl)
        if (!parsed.searchParams.has('text')) {
            parsed.searchParams.set('text', DEFAULT_WHATSAPP_MESSAGE)
        }
        return parsed.toString()
    } catch {
        const separator = baseUrl.includes('?') ? '&' : '?'
        return `${baseUrl}${separator}text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`
    }
}

const WhatsAppFloatingButton = ({ whatsappUrl }: { whatsappUrl?: string }) => {
    const href = normalizeWhatsAppUrl(whatsappUrl)

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed left-4 bottom-4 sm:left-8 sm:bottom-8 z-[95] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_14px_30px_-12px_rgba(37,211,102,0.7)] transition-all hover:bg-[#22c15e] hover:scale-[1.02]"
        >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em]">
                Chat on WhatsApp
            </span>
        </a>
    )
}

export default WhatsAppFloatingButton
