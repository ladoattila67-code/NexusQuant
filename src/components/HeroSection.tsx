import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Activity, CheckCircle, Award, Terminal, Cpu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroSectionProps {
  onOpenDemoModal: () => void;
  onOpenVideoModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemoModal, onOpenVideoModal }) => {
  const { t } = useLanguage();

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-slate-900/90 text-cyan-300 border border-slate-700/80 mb-6 shadow-lg shadow-cyan-950/40">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t.hero.badge}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400">2026 AUDITED</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            {t.hero.titleMain}{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#catalog-roboti"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm md:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>{t.hero.ctaBuy}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {onOpenVideoModal && (
              <button
                type="button"
                onClick={onOpenVideoModal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-600/25 transition-all hover:scale-[1.02]"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>🎬 {t.hero.ctaVideo}</span>
              </button>
            )}

            <a
              href="#performanta-live"
              className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all hover:border-cyan-500"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t.nav.livePerformance}</span>
            </a>

            <button
              onClick={onOpenDemoModal}
              className="px-5 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-300 border border-cyan-800/80 font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.ctaDemo}</span>
            </button>
          </div>

          {/* Live Visitor & Community Telemetry Banner */}
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/50 shadow-xl shadow-cyan-950/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs md:text-sm font-mono font-bold text-emerald-400">42 {t.common.onlineUsers}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-mono text-cyan-300 font-semibold">
              <span className="text-slate-400">Total:</span>
              <span>18.431+ {t.common.totalVisits}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs font-mono text-slate-400 hidden md:inline">LD4 HFT Feed</span>
          </div>

          {/* Trust metrics highlights strip */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-mono">{t.hero.statMonthly}</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">+19.2%</div>
              <div className="text-[10px] text-slate-500">AR-Nexus SMC</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-mono">{t.hero.statWinRate}</div>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5">76.4%</div>
              <div className="text-[10px] text-slate-500">R:R 1:3.5 - 1:4.2</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-mono">{t.hero.statDrawdown}</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">&lt; 3.8%</div>
              <div className="text-[10px] text-slate-500">Hard-Stop Guard</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-[11px] text-slate-400 font-mono">{t.hero.statExecution}</div>
              <div className="text-2xl font-black font-mono text-white mt-0.5">0.7 ms</div>
              <div className="text-[10px] text-slate-500">Equinix LD4 London</div>
            </div>
          </div>
        </div>

        {/* Quant Terminal Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Terminal Top bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-slate-300 font-bold ml-2">
                Nexus Engine v4.8 • Core Algorithm Terminal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STATUS: AUTO-TRADING ACTIVE
              </span>
              <span className="hidden md:inline text-slate-500">FIX Protocol 4.4</span>
            </div>
          </div>

          {/* Terminal Content Mock */}
          <div className="p-5 md:p-6 font-mono text-xs space-y-3 bg-[#080d19]">
            <div className="text-slate-400">
              <span className="text-cyan-400">[08:42:14.029]</span> INICIALIZARE MODUL QUANT: Conectare securizată la nodul Equinix LD4 (Londra) finalizată în 0.72ms.
            </div>
            <div className="text-slate-300">
              <span className="text-cyan-400">[08:42:15.148]</span> ANALIZĂ ORDER BOOK: Detectat dezechilibru de lichiditate pe XAU/USD la 2688.20 (+842 contracte pe Buy Side).
            </div>
            <div className="text-emerald-400 font-semibold bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
              <span>[08:42:15.150] EXECUTIE ORDIN: BUY 0.85 LOT XAU/USD @ 2688.40 | SL: 2682.00 | TP1: 2694.00 | Risc: 0.8% din Equity</span>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">[08:42:18.420]</span> FILTRU STIRI: High-Impact News Shield activat. Următorul eveniment macroeconomic: US Retail Sales în 4h 18m.
            </div>
            <div className="text-cyan-300">
              <span className="text-cyan-400">[08:42:22.812]</span> SINCRONIZARE AUDIT: Datele de equity și drawdown au fost transmise cu succes către serverul Myfxbook.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
