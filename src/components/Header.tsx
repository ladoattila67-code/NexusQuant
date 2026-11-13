import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, Menu, X, ArrowRight, MessageCircle, Users, Eye, CreditCard, Megaphone } from 'lucide-react';
import { VisitorStatsBar } from './VisitorCounter';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  onOpenDemoModal: () => void;
  onOpenSourceCodeModal: () => void;
  onOpenPaymentSettings?: () => void;
  onOpenPromoModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenDemoModal, 
  onOpenSourceCodeModal, 
  onOpenPaymentSettings,
  onOpenPromoModal 
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickerOffset, setTickerOffset] = useState(0);

  // Live price tick simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % 100);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const marketTicks = [
    { pair: 'XAU/USD', price: (2688.40 + (tickerOffset % 5) * 0.35).toFixed(2), change: '+0.84%', isUp: true, lastAction: 'BUY 0.85 lot' },
    { pair: 'EUR/USD', price: (1.0834 + (tickerOffset % 3) * 0.0002).toFixed(4), change: '+0.18%', isUp: true, lastAction: 'BUY 1.50 lot' },
    { pair: 'US100 (Nasdaq)', price: (20540.2 + (tickerOffset % 4) * 2.5).toFixed(1), change: '+1.32%', isUp: true, lastAction: 'HOLD' },
    { pair: 'BTC/USD', price: (89240.0 + (tickerOffset % 6) * 45).toFixed(0), change: '+3.45%', isUp: true, lastAction: 'BUY 0.25' },
    { pair: 'GER40 (DAX)', price: (19385.0 + (tickerOffset % 3) * 1.5).toFixed(1), change: '+0.42%', isUp: true, lastAction: 'SELL 0.75' },
    { pair: 'GBP/USD', price: (1.2952 + (tickerOffset % 2) * 0.0003).toFixed(4), change: '+0.25%', isUp: true, lastAction: 'BUY 1.20' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-xl border-b border-slate-800/80">
      {/* Top micro ticker bar */}
      <div className="bg-slate-950/95 border-b border-slate-800/60 py-1.5 px-4 text-[11px] overflow-hidden whitespace-nowrap block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none font-mono">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE TICK FEED:
            </span>
            {marketTicks.map((tick, i) => (
              <span key={i} className="flex items-center gap-2 text-slate-300">
                <span className="text-white font-semibold">{tick.pair}:</span>
                <span className="text-slate-200">{tick.price}</span>
                <span className={tick.isUp ? 'text-emerald-400' : 'text-rose-400'}>
                  {tick.change}
                </span>
                <span className="text-[10px] text-cyan-400/80 px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
                  {tick.lastAction}
                </span>
                {i < marketTicks.length - 1 && <span className="text-slate-700">|</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono shrink-0 pl-4 border-l border-slate-800">
            <VisitorStatsBar />
            <span className="flex items-center gap-1 text-emerald-400 pl-2 border-l border-slate-800 hidden md:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Equinix LD4: 0.7ms
            </span>
            <span className="text-slate-500 hidden xl:inline">Uptime: 99.99%</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  NEXUS<span className="text-cyan-400">QUANT</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                  v4.8
                </span>
              </div>
              <div className="text-[10px] font-mono tracking-wider text-slate-400">
                ALGORITHMIC TRADING SYSTEMS
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <a href="#catalog-roboti" className="hover:text-cyan-400 transition-colors">
              {t.nav.bots}
            </a>
            <a href="#prop-firms" className="hover:text-cyan-400 transition-colors text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.nav.propFirms}
            </a>
            <a href="#calendar-economic" className="hover:text-red-400 transition-colors text-red-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {t.nav.calendar}
            </a>
            <a href="#punere-in-functiune" className="hover:text-cyan-400 transition-colors text-cyan-300">
              {t.nav.howItWorks}
            </a>
            <a href="#performanta-live" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t.nav.livePerformance}
            </a>
            <a href="#retea-servere" className="hover:text-cyan-400 transition-colors">
              {t.nav.hftNetwork}
            </a>
            <a href="#preturi" className="hover:text-cyan-400 transition-colors">
              {t.nav.pricing}
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              {t.nav.faq}
            </a>
          </nav>

          {/* Action CTAs & Language Selector */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector />

            {onOpenPaymentSettings && (
              <button
                onClick={onOpenPaymentSettings}
                className="py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-800/60 font-mono font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                title="Panou Securizat Administrator (Acces cu PIN / Parolă)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{t.nav.admin}</span>
              </button>
            )}

            <button
              onClick={onOpenSourceCodeModal}
              className="py-2 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-mono font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{t.nav.mql5Files}</span>
            </button>

            <button
              onClick={onOpenDemoModal}
              className="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.nav.demo14Days}</span>
            </button>

            {onOpenPromoModal && (
              <button
                onClick={onOpenPromoModal}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-300 border border-amber-500/50 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                title="Deschide Centrul de Promovare & Kitul de Marketing"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.nav.promote}</span>
              </button>
            )}

            <a
              href="#preturi"
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1"
            >
              <span>{t.nav.buyLicense}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Mobile Menu Toggle & Language Selector */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-3">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
              <a
                href="#catalog-roboti"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg"
              >
                {t.nav.bots}
              </a>
              <a
                href="#prop-firms"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg text-emerald-400 font-bold"
              >
                {t.nav.propFirms}
              </a>
              <a
                href="#calendar-economic"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg text-red-300 font-bold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {t.nav.calendar}
              </a>
              <a
                href="#performanta-live"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {t.nav.livePerformance}
              </a>
              <a
                href="#retea-servere"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg"
              >
                {t.nav.hftNetwork}
              </a>
              <a
                href="#punere-in-functiune"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg"
              >
                {t.nav.howItWorks}
              </a>
              <a
                href="#preturi"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg"
              >
                {t.nav.pricing}
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-900 rounded-lg"
              >
                {t.nav.faq}
              </a>
            </nav>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemoModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-semibold text-xs text-center"
              >
                {t.nav.demo14Days}
              </button>
              {onOpenPromoModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPromoModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-700 font-bold text-xs text-center flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>{t.nav.promote}</span>
                </button>
              )}
              <a
                href="#preturi"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs text-center"
              >
                {t.nav.buyLicense}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
