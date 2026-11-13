import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Star, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/tradingBots';
import { useLanguage } from '../i18n/LanguageContext';

export const FaqAndTrustSection: React.FC = () => {
  const { t } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What minimum capital do I need to start automated trading?',
      a: 'You can start with as little as €200 - €500 on an ECN or Cent/Micro account, or from €1,000 on a standard account. Our robots automatically calculate lot sizes based on your available capital, enforcing a strict 0.5% - 1% maximum risk per trade.'
    },
    {
      q: 'How do I install the bot on MetaTrader 4 or 5?',
      a: 'Setup takes under 5 minutes: download the compiled robot file (.ex5 or .ex4) and preset (.set) files, copy them into your MetaTrader `MQL5/Experts` folder, enable "Allow Algo Trading", and enter your unique license key. A step-by-step video guide is included, plus free remote AnyDesk/TeamViewer setup support.'
    },
    {
      q: 'Are these bots compatible with Prop Firms (FTMO, TPT, Lucid, FundedNext)?',
      a: 'Yes! AR-Nexus and our institutional EAs include a built-in "Prop Firm Shield" module that automatically halts trading if daily drawdown approaches 3.5% (well below FTMO / TPT / Lucid limits) and enforces a mandatory hard Stop Loss on every position.'
    },
    {
      q: 'Do I need to keep my computer running 24/7?',
      a: 'No. Pro Quant and Institutional VIP plans include free dedicated VPS hosting in Equinix LD4 (London) with sub-millisecond latency and 99.99% uptime. The robot operates continuously in the cloud even when your personal device is switched off.'
    },
    {
      q: 'How does the money-back guarantee work?',
      a: 'We offer a transparent 14-day guarantee: if you deploy the robot using our recommended configuration presets and it breaches the maximum drawdown documented in its technical sheet, we issue a 100% refund with zero hassle.'
    },
    {
      q: 'Which brokers do you recommend for optimal execution?',
      a: 'We recommend genuine Raw/ECN brokers with 0.0 pip spreads and direct Equinix LD4 or NY4 cross-connects, such as Tickmill Pro/VIP, IC Markets Raw Spread, Pepperstone Razor, or LMAX Global.'
    },
    {
      q: 'If someone downloads the 14-day Demo and does not purchase, can they keep using the bot?',
      a: 'Strictly NO. Our compiled MQL5 (.ex5) source code enforces hardware-verified license expiration. After the 14-day trial window expires—or if attached to a live real-money account without an active key—the EA automatically executes MetaTrader `ExpertRemove()` and detaches immediately.'
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-slate-900/40 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Block */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 mb-3">
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
              <span>VERIFIED MYFXBOOK & TRUSTPILOT REVIEWS (4.9/5)</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              What Traders Say About Nexus Quant
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{item.name}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400">{item.role}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold mt-0.5">
                        {item.verifiedProfit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Block */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.faq.badge}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              {t.faq.title}
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              {t.faq.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 md:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 md:px-5 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
