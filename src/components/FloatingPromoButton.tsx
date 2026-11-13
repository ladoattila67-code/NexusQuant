import React from 'react';
import { Megaphone, MessageSquare, Send, Sparkles } from 'lucide-react';
import { getPaymentConfig } from '../data/paymentConfig';
import { useLanguage } from '../i18n/LanguageContext';

interface FloatingPromoButtonProps {
  onOpenPromoModal: () => void;
}

export const FloatingPromoButton: React.FC<FloatingPromoButtonProps> = ({ onOpenPromoModal }) => {
  const { t } = useLanguage();

  const config = getPaymentConfig();
  const cleanPhone = (config.sellerPhone || '+40762808899').replace(/\D/g, '') || '40762808899';
  const waText = encodeURIComponent('Salut! Doresc acces în grupul WhatsApp NexusQuantum și detalii despre roboții Nexus Quant.');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
  const telegramUrl = 'https://t.me/NexusQuant';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Telegram Group NexusQuant Floating Sticker */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0088cc] hover:bg-[#0099e6] text-white font-bold text-xs shadow-xl shadow-sky-950/70 transition-all hover:scale-105 border border-sky-300/40"
        title="Telegram Grup NexusQuant"
      >
        <Send className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
        <span>Telegram • NexusQuant</span>
      </a>

      {/* WhatsApp Fast Chat Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 border border-emerald-400/50"
        title="WhatsApp • Grup NexusQuantum"
      >
        <MessageSquare className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">{t.common.whatsapp}</span>
      </a>

      {/* Main Promo & Share Button */}
      <button
        onClick={onOpenPromoModal}
        className="group flex items-center gap-2.5 px-4 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs md:text-sm shadow-2xl shadow-cyan-500/40 transition-all hover:scale-105 border border-cyan-300/40"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950"></span>
        </span>
        <Megaphone className="w-4 h-4 text-slate-950 group-hover:rotate-[-10deg] transition-transform" />
        <span>{t.common.promote}</span>
      </button>
    </div>
  );
};
