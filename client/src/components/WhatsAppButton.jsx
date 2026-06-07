import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/908500000000?text=Merhaba%2C%20e-market.com%20%C3%BCzerinden%20size%20ula%C5%9F%C4%B1yorum."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
            aria-label="WhatsApp ile İletişime Geç"
        >
            <MessageCircle size={28} className="md:w-8 md:h-8" />

            {/* Tooltip-like label for Desktop */}
            <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block pointer-events-none">
                WhatsApp Destek
            </span>

            {/* Ping animation effect */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
        </a>
    );
}
