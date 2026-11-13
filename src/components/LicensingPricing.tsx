import React, { useEffect, useState } from 'react';
import { Check, Zap, Sparkles, ShieldCheck, Server, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getCheckoutPaymentVisibility, getPaymentConfig } from '../data/paymentConfig';

interface LicensingPricingProps {
  onSelectTier: (tierName: string, price: number, isLifetime: boolean) => void;
}

export const LicensingPricing: React.FC<LicensingPricingProps> = ({ onSelectTier }) => {
  const { t } = useLanguage();
  const [visibility, setVisibility] = useState(() => getCheckoutPaymentVisibility(getPaymentConfig()));

  useEffect(() => {
    const refresh = () => setVisibility(getCheckoutPaymentVisibility(getPaymentConfig()));
    window.addEventListener('nexus-payment-config-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('nexus-payment-config-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <section id="preturi" className="py-16 md:py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>{t.pricing.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Starter */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                Starter
              </div>
              <h3 className="text-2xl font-bold text-white">Starter Trader</h3>
              <p className="text-xs text-slate-400 mt-1">
                {t.pricing.includesTitle}
              </p>

              <div className="my-6">
                <div className="text-3xl md:text-4xl font-extrabold text-white font-mono">
                  299 €
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {t.marketplace.lifetime} (or 49 €{t.marketplace.monthly})
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1 Trading Bot License (MT4 / MT5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1 Live Account + Unlimited Demo Accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>5-Minute Setup Video & PDF Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Optimized .set Presets (XAU/USD, EUR/USD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>12 Months Free Updates</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTier('Starter Trader', 299, true)}
              className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <span>{t.pricing.btnOrder}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plan 2: Pro Quant Bundle (Featured) */}
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500 flex flex-col justify-between relative shadow-2xl shadow-cyan-500/10 hover:border-cyan-400 transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              {t.pricing.mostPopular}
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                Pro Portfolio
              </div>
              <h3 className="text-2xl font-bold text-white">Pro Quant Bundle</h3>
              <p className="text-xs text-slate-400 mt-1">
                AR-Nexus SMC + Aegis Scalper + Neural Trend Pro
              </p>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black text-white font-mono">699 €</span>
                  <span className="text-xs text-slate-500 line-through font-mono">1,197 €</span>
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  {t.marketplace.lifetime} (Save 498 €)
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-200">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3 Complete Algorithms (AR-Nexus + Aegis + Neural)</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300 font-semibold bg-cyan-950/60 p-2 rounded-lg border border-cyan-800/60">
                  <Server className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3 Months Free VPS (Equinix LD4 London)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>3 Simultaneous Live MT4 / MT5 Accounts</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prop Firm Compatible (FTMO, TPT, Lucid, Upcomers)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Weekly Re-calibrated VIP Presets</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1-on-1 Remote Installation Support (AnyDesk)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTier('Pro Quant Bundle', 699, true)}
              className="mt-8 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
            >
              <span>{t.pricing.btnOrder}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 3: VIP Lifetime */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold mb-1">
                Hedge Fund Level
              </div>
              <h3 className="text-2xl font-bold text-white">Institutional VIP</h3>
              <p className="text-xs text-slate-400 mt-1">
                Full suite for accounts $50,000+ & fund managers
              </p>

              <div className="my-6">
                <div className="text-3xl md:text-4xl font-extrabold text-white font-mono">
                  1,499 €
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Unlimited {t.marketplace.lifetime} VIP License
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium text-white">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>All 6 Nexus Quant Algorithms Included</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300 font-semibold bg-purple-950/50 p-2 rounded-lg border border-purple-800/60">
                  <Server className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>1 Year Free Dedicated Equinix LD4 VPS (480 € Value)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>UNLIMITED Live & Demo Accounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>MQL5 Source Code & Python Backtest Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Direct FIX API Connection (&lt;1ms Latency)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Dedicated Account Manager & Zoom Onboarding</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTier('Institutional VIP', 1499, true)}
              className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <span>{t.pricing.btnOrder}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Accepted Payment Methods Bar */}
        {visibility.methods.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="text-slate-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Accepted Payment Methods:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px]">
              {visibility.methods.includes('gumroad') && (
                <span className="px-2.5 py-1 rounded-lg bg-pink-950/70 text-pink-300 border border-pink-800/80 font-bold flex items-center gap-1.5">
                  <span>⚡ Gumroad (Card / Apple Pay / PayPal)</span>
                </span>
              )}
              {visibility.methods.includes('crypto') && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-800/80 font-bold flex items-center gap-1.5">
                  <span>₿ Crypto ({visibility.cryptoCoins.map((c) => c.toUpperCase()).join(' • ')})</span>
                </span>
              )}
              {visibility.methods.includes('revolut') && (
                <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 text-blue-300 border border-blue-800/80 font-semibold">
                  Revolut Pay
                </span>
              )}
              {visibility.methods.includes('bank') && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 font-semibold">
                  {visibility.showIbanEur && visibility.showIbanRon
                    ? 'Bank Transfer (SEPA / RON)'
                    : visibility.showIbanEur
                    ? 'SEPA Bank Transfer (EUR)'
                    : 'Bank Transfer (RON)'}
                </span>
              )}
              {visibility.methods.includes('card') && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 text-cyan-300 border border-cyan-800/80 font-semibold">
                  {visibility.showStripe && visibility.showPaypal
                    ? 'Card (Stripe) / PayPal'
                    : visibility.showStripe
                    ? 'Card (Stripe)'
                    : 'PayPal'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Money Back Guarantee Banner */}
        <div className="mt-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center border border-emerald-800 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                {t.pricing.guaranteeTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.pricing.guaranteeDesc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold whitespace-nowrap">
            <span>✓ 100% Zero-Risk Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
