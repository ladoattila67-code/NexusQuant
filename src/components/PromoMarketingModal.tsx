import React, { useState } from 'react';
import { 
  X, Share2, Copy, Check, MessageCircle, Send, Video, 
  Sparkles, TrendingUp, Megaphone, CheckCircle, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { getPaymentConfig } from '../data/paymentConfig';

interface PromoMarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromoMarketingModal: React.FC<PromoMarketingModalProps> = ({ isOpen, onClose }) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'share' | 'tiktok' | 'facebook' | 'whatsapp'>('share');
  const [customRef, setCustomRef] = useState<string>('trader2026');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://nexusquant.ro';
  const promoUrl = `${currentUrl}?ref=${encodeURIComponent(customRef.trim() || 'nexus')}`;

  const shareText = `🚀 Automatizează-ți tranzacțiile cu AR-Nexus și roboții cuantici Nexus Quant! Strategie Pură de Lichiditate SMC, alerte live Telegram și protecție 100% pentru evaluările FTMO și Upcomers. Testează gratuit 14 zile:`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const openShare = (platform: 'whatsapp' | 'telegram' | 'facebook' | 'twitter') => {
    const encodedUrl = encodeURIComponent(promoUrl);
    const encodedText = encodeURIComponent(shareText);

    let url = '';
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Ready-to-use viral script templates
  const tiktokScript = `Cum să treci un challenge de $100,000 la FTMO sau Upcomers fără să stai 8 ore lipit de grafice 📊📉

Majoritatea pierd conturile de prop firm din două motive: emoții și lipsa disciplinei când piața merge contra lor.

Algoritmul AR-Nexus rezolvă asta 100%:
1. Scanează lichiditatea pe M15 și HOD/LOD (Smart Money Concepts).
2. Nu intră la spargeri false — așteaptă vânătoarea de stopuri și intră pe respingere cu raport de minim 1:3.5.
3. Are circuit-breaker automat la 4% pierdere zilnică: oprește execuția înainte să încalci regula prop firm-ului!

Trimite alerte instant pe Telegram la fiecare mișcare.

Poți testa algoritmul gratuit 14 zile pe cont Demo:
👉 Link în bio / pe site: ${promoUrl}

#tradingromania #forexromania #ftmo #upcomers #propfirm #algotrading #smc #mql5 #metatrader5`;

  const facebookScript = `Salutare tuturor! 🚀

Pentru cei care tranzacționează pe MetaTrader 5 sau încearcă challenge-uri la FTMO / TPT / Lucid / Upcomers / FundedNext:

Am lansat oficial algoritmul AR-Nexus — un robot dezvoltat exclusiv pe strategia de lichiditate instituțională (SMC Liquidity Sweeps pe M15 și Daily).

De ce este diferit de 99% din roboții din piață?
✅ FĂRĂ Martingale, FĂRĂ Grid periculos
✅ Stop Loss automat la fiecare intrare și Risc:Recompensă asimetric de 1:3.5
✅ Circuit Breaker automat de securitate: dacă pierderea zilnică atinge 4%, închide toate pozițiile și se blochează pentru protecția contului Prop Firm
✅ Alerte live trimise direct pe Telegram la fiecare nivel și tranzacție

Puteți vedea backtesturile detaliate și descărca versiunea Demo de test gratuit timp de 14 zile direct de pe platformă:
🔗 ${promoUrl}

Succes și pipsi verzi tuturor!`;

  const whatsappDirectScript = `Salut! Am găsit platforma celor de la Nexus Quant și au lansat robotul AR-Nexus pentru MetaTrader 5 (pe lichiditate SMC, perfect pentru conturi FTMO, TPT, Lucid și Upcomers cu stop loss automat și alerte Telegram). Poți să-l testezi gratuit 14 zile pe cont demo de pe linkul ăsta: ${promoUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-800/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>Centrul de Promovare & Distribuire Virală</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Kit Marketing 2026
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Distribuie cu 1 click pe rețele sau copiază scripturile gata scrise pentru TikTok, grupuri și WhatsApp.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('share')}
            className={`py-3 px-2 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>1-Click Share</span>
          </button>
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`py-3 px-2 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'tiktok'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-pink-400" />
            <span>TikTok / Reels</span>
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`py-3 px-2 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'facebook'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Grupuri FB/Telegram</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-3 px-2 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Direct</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 md:p-6 space-y-5">
          
          {/* TAB 1: 1-Click Social Share */}
          {activeTab === 'share' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Linkul Tău Unic de Promovare (Tracking / Recomandare):
                </label>
                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono text-cyan-300 flex-1 truncate">
                    {promoUrl}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customRef}
                      onChange={(e) => setCustomRef(e.target.value)}
                      placeholder="tag"
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-white font-mono"
                      title="Personalizează eticheta ta de tracking"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(promoUrl, 'url')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      {copiedItem === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedItem === 'url' ? 'Copiat!' : 'Copiază'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Social Buttons */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-3">
                  Distribuie Imediat pe Canalele Tale:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => openShare('whatsapp')}
                    className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700 text-emerald-300 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold">WhatsApp</span>
                    <span className="text-[10px] text-emerald-500">Trimite contactelor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openShare('telegram')}
                    className="p-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-700 text-sky-300 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <Send className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-bold">Telegram</span>
                    <span className="text-[10px] text-sky-400">Grupuri & Canale</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openShare('facebook')}
                    className="p-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700 text-blue-300 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold">Facebook</span>
                    <span className="text-[10px] text-blue-400">Feed & Grupuri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openShare('twitter')}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <span className="font-bold text-base">𝕏</span>
                    <span className="text-xs font-bold">X (Twitter)</span>
                    <span className="text-[10px] text-slate-400">Postare rapidă</span>
                  </button>
                </div>
              </div>

              {/* Live Preview of Shared Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-2 font-mono flex items-center justify-between">
                  <span>PREVIZUALIZARE MESAJ DISTRIBUIT:</span>
                  <span className="text-cyan-400">Gata de trimis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                  {shareText} {promoUrl}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TikTok & Reels Viral Script */}
          {activeTab === 'tiktok' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                    Script Video de 30-45 Secunde (TikTok / Instagram Reels / YouTube Shorts)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Citește acest text în fața camerei sau pune-l ca voce peste ecranul MT5 cu robotul în funcțiune.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tiktokScript, 'tiktok')}
                  className="py-1.5 px-3 rounded-lg bg-pink-950 hover:bg-pink-900 text-pink-300 border border-pink-700 font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  {copiedItem === 'tiktok' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedItem === 'tiktok' ? 'Copiat!' : 'Copiază Scriptul'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {tiktokScript}
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Sfat Pro:</strong> Postează la orele de vârf (12:30, 18:30, 21:00). Folosește un sunet trending și pune link-ul în profilul tău (Bio).
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Facebook Groups & Telegram Channels Script */}
          {activeTab === 'facebook' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Postare pentru Grupuri de Trading (Facebook & Canale Telegram)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Postează în grupuri precum „Traderi Forex România”, „FTMO România”, „Prop Firms România”.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(facebookScript, 'fb')}
                  className="py-1.5 px-3 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700 font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  {copiedItem === 'fb' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedItem === 'fb' ? 'Copiat!' : 'Copiază Postarea'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                {facebookScript}
              </div>
            </div>
          )}

          {/* TAB 4: WhatsApp Direct Message Script */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Mesaj Direct pentru Prieteni & Traderi pe WhatsApp
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Trimite mesajul direct traderilor pe care îi cunoști pentru a testa trialul gratuit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(whatsappDirectScript, 'wa')}
                  className="py-1.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-bold text-xs flex items-center gap-1.5 shrink-0"
                >
                  {copiedItem === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedItem === 'wa' ? 'Copiat!' : 'Copiază Mesajul'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {whatsappDirectScript}
              </div>

              {/* Direct Chat with Seller */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/80 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-white">Vrei să oferi suport sau să inviți în grupul NexusQuantum?</div>
                  <div className="text-slate-400 text-[11px]">Clienții pot vorbi direct pe WhatsApp ({getPaymentConfig().sellerPhone}) sau Email ({getPaymentConfig().sellerEmail}).</div>
                </div>
                <a
                  href={`https://wa.me/${(getPaymentConfig().sellerPhone || '+40762808899').replace(/\D/g, '') || '40762808899'}?text=${encodeURIComponent('Salut! Am văzut platforma NexusQuantum și doresc să intru în grup.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Deschide WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SEO Activat • OpenGraph & Twitter Cards Integrate • Indexare Google 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Închide
          </button>
        </div>

      </div>
    </div>
  );
};
