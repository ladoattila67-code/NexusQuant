import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ShieldCheck, 
  Send, AlertTriangle, ArrowRight, CheckCircle, TrendingUp, Layers, 
  Copy, Check, Download, Video, Film, Eye
} from 'lucide-react';

interface ArNexusVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: () => void;
}

export const ArNexusVideoModal: React.FC<ArNexusVideoModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'cinematic' | 'youtube' | 'script' | 'aiPrompts'>('youtube');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<string>('');

  const scenes = [
    {
      id: 'scan',
      time: '00:00 - 00:08',
      title: '1. Scanare Automată a Lichidității (M15 & Daily)',
      tagline: 'Identificare Nivele Extreme: Swing High / Low și HOD / LOD',
      voiceover: 'AR-Nexus scanează piața secundă cu secundă pe timeframe-urile M15 și Daily, cartografiind nivelurile cheie unde se acumulează lichiditatea.',
      visualBadge: 'M15 & DAILY SMC SCANNER',
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
      pair: 'XAU/USD (Gold) & EUR/USD',
      metric: 'Lichiditate detectată: 2,688.40',
      statusText: 'HOD / LOD Identificate • Așteptare Reacție Preț'
    },
    {
      id: 'sweep',
      time: '00:08 - 00:16',
      title: '2. Detectare Vânătoare de Stopuri (Liquidity Sweeps)',
      tagline: 'Capcana Marilor Bănci: Breakout Fals peste Maxime',
      voiceover: 'Când marile bănci forțează o spargere falsă pentru a declanșa stop loss-urile traderilor de retail, AR-Nexus identifică sweep-ul în timp real.',
      visualBadge: 'INSTITUTIONAL SWEEP DETECTED',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800',
      pair: 'XAU/USD • High Swept @ 2,694.10',
      metric: 'Stop Hunt: +18 Puncte Peste High',
      statusText: 'Respingere Lumânare în desfășurare • Semnal SELL Pregătit'
    },
    {
      id: 'entry',
      time: '00:16 - 00:25',
      title: '3. Raport Asimetric Risc:Recompensă (1:3.5 - 1:4.2)',
      tagline: 'Execuție Precisă: Risc Minim, Profit Multiplicat',
      voiceover: 'Intrarea se face exclusiv la reintrarea lumânării în canal, cu un raport asimetric de minimum 1:3.5. O singură tranzacție câștigătoare acoperă multiple încercări.',
      visualBadge: 'RISK : REWARD 1:3.5 EXECUTION',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
      pair: 'Intrare SELL Executată @ 2,692.50',
      metric: 'SL: 2,695.50 (30 pts) | TP: 2,682.00 (105 pts)',
      statusText: 'R:R 1:3.5 • Poziție Asigurată în Profit'
    },
    {
      id: 'news',
      time: '00:25 - 00:33',
      title: '4. Filtru Știri Economice cu Dosar Roșu (High Impact)',
      tagline: 'Pauză Automată 30 Min Înainte/După CPI, NFP și FOMC',
      voiceover: 'Capitalul tău este în siguranță absolută. Filtrul economic integrat detectează știrile cu dosar roșu și suspendă tranzacționarea pentru a evita slippage-ul.',
      visualBadge: 'RED FOLDER NEWS SHIELD ACTIVE',
      badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-800',
      pair: 'US CPI Inflation Rate (High Impact)',
      metric: 'Trading Paused (-30m / +30m)',
      statusText: 'Filtru Activ • Nicio tranzacție riscantă pe volatilitate'
    },
    {
      id: 'prop',
      time: '00:33 - 00:40',
      title: '5. Protecție Conturi Prop Firm (FTMO, TPT, Lucid, Upcomers)',
      tagline: 'Hard-Stop Zilnic Integrat: Respectă 100% Regulile de Drawdown',
      voiceover: 'Treci orice evaluare de Prop Firm. AR-Nexus are limită de pierdere zilnică blocată matematic, compatibil 100% cu FTMO, TPT, Lucid, Upcomers și FundedNext.',
      visualBadge: 'FTMO • TPT • LUCID VERIFIED PASS',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800',
      pair: 'Max Daily DD Cap: 4.0% Strict Lock',
      metric: 'Weekend Close: Activ (Fără Gap-uri)',
      statusText: 'Algoritm Aprobat pentru Conturi Finanțate de $100k-$200k'
    },
    {
      id: 'telegram',
      time: '00:40 - 00:48',
      title: '6. Alerte Automate în Timp Real pe Telegram',
      tagline: 'Notificări Instant pe Telefonul Tău: Sweep, Intrare, TP/SL',
      voiceover: 'Primești fiecare semnal direct pe telefonul tău în Telegram: când se formează un sweep, când intră în piață și când atinge Take Profit-ul.',
      visualBadge: 'TELEGRAM BOT CONNECTED',
      badgeColor: 'text-sky-400 bg-sky-950/80 border-sky-800',
      pair: 'Notificare Telegram: 🚀 INTRARE SELL XAU/USD',
      metric: 'TP Atins: +350.00 EUR Profit',
      statusText: 'Alertă trimisă instantaneu pe telefonul traderului'
    }
  ];

  // Auto-progress cinematic scenes when playing
  useEffect(() => {
    if (!isOpen || !isPlaying || activeTab !== 'cinematic') return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % scenes.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, activeTab, scenes.length]);

  if (!isOpen) return null;

  const currentScene = scenes[currentStepIndex];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Video className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                <span>Prezentare Video AR-Nexus</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  SMC LIQUIDITY
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                Trailer Cinematic & Prezentare Algoritm MT5
              </h3>
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
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6 gap-2 text-xs font-semibold shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'youtube'
                ? 'border-red-500 text-red-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Format YouTube (16:9 Widescreen & 4K)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cinematic')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'cinematic'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Simulare Cinematică</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'script'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Scenariu Voice-Over (45s)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aiPrompts')}
            className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'aiPrompts'
                ? 'border-cyan-400 text-cyan-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Prompturi AI Video (Veo/Runway)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* TAB: YOUTUBE STUDIO FORMAT (16:9 WIDESCREEN & 4K) */}
          {activeTab === 'youtube' && (
            <div className="space-y-5">
              {/* YouTube Tech Specs Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 border border-red-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                      Format Oficial YouTube Video (16:9 Landscape)
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    Pachet Complet de Publicare YouTube pentru AR-Nexus
                  </h4>
                  <p className="text-xs text-slate-400">
                    Rezoluție recomandată: <strong>1920x1080 (Full HD)</strong> sau <strong>3840x2160 (4K UHD)</strong> • Raport de aspect: <strong>16:9 Orizontal</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-red-950 text-red-300 border border-red-800 font-bold">
                    16:9 Widescreen
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
                    60 FPS
                  </span>
                </div>
              </div>

              {/* YouTube Thumbnail Showcase & Download */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-red-400" />
                    <span>Copertă Video YouTube (Thumbnail 1280x720px - 72 DPI):</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">Format Perfect YouTube</span>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video relative group max-w-xl mx-auto shadow-2xl">
                  <img
                    src="/ar_nexus_cover.jpg"
                    alt="YouTube Thumbnail AR-Nexus"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-left">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600 text-white font-bold">
                        16:9 HD THUMBNAIL
                      </span>
                      <div className="text-sm font-black text-white mt-1">
                        AR-NEXUS: Strategia de Lichiditate (SMC) pe MT5
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <a
                    href="/ar_nexus_cover.jpg"
                    download="AR_Nexus_YouTube_Thumbnail_1280x720.jpg"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/25 transition-all font-mono"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descarcă Miniatura YouTube (1280x720px HD)</span>
                  </a>
                </div>
              </div>

              {/* 3 High CTR YouTube Titles */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-300">
                  Titluri Optimizate SEO pentru YouTube (Alege unul):
                </div>

                <div className="space-y-2">
                  {[
                    'Robot Tranzacționare MetaTrader 5: Strategia Pură de Lichiditate SMC | AR-Nexus EA',
                    'Cum să treci evaluarea FTMO & Upcomers cu Algoritmul AR-Nexus (Raport Risc 1:3.5)',
                    'AR-Nexus MT5: Vânătoare de Lichiditate (Liquidity Sweeps) + Filtru Știri Roșii pe Gold'
                  ].map((title, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div className="text-slate-200 font-medium">
                        <span className="text-red-400 font-mono font-bold mr-2">#{i + 1}</span>
                        <span>{title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(title, `ytTitle${i}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-bold shrink-0 flex items-center gap-1 transition-colors"
                      >
                        {copiedIndex === `ytTitle${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === `ytTitle${i}` ? 'Copiat!' : 'Copiază'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full YouTube Description with Chapters / Timestamps */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Descrierea Completă YouTube (cu Capitole și Linkuri):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`🚀 AR-Nexus este un algoritm instituțional de tranzacționare automată pentru MetaTrader 5 (MT5), dezvoltat exclusiv pe baza strategiei de lichiditate pură Smart Money Concepts (SMC).

🔗 Descarcă Robotul AR-Nexus și Presetul Optimizat:
https://ais-pre-aqqqo5cnq7nto5xip7777p-99379531255.europe-west2.run.app

⏱️ CAPITOLE / TIMESTAMPS:
00:00 - Introducere: De ce pierd traderii la spargerile false
00:45 - Ce este AR-Nexus & Strategia SMC de Lichiditate
01:30 - Cum detectează vânătoarea de stopuri a marilor bănci (Sweeps)
02:15 - Raport asimetric Risc:Recompensă (1:3.5 - 1:4.2)
03:00 - Filtrul automat de știri economice cu dosar roșu (Pauză 30 min)
03:45 - Protecția conturilor de Prop Firm (FTMO & Upcomers - Hard Stop 4%)
04:30 - Alerte Telegram automate în timp real pe telefon
05:00 - Conectare & Instalare în MetaTrader 5 în 5 minute

✨ CARACTERISTICI PRINCIPALE AR-NEXUS:
• Scanare automată pe M15 și Daily a extremelor de Swing High/Low și HOD/LOD.
• Detectare vânătoare de stopuri (Liquidity Sweeps) ale marilor bănci.
• Raport asimetric Risc:Recompensă garantat de 1:3.5 până la 1:4.2.
• Filtru automat integrat pentru știri economice cu dosar roșu (CPI, NFP, FOMC) - pauză 30 minute.
• Hard-stop zilnic pentru protecția conturilor de Prop Firm (FTMO, Upcomers, TPT, Lucid, FundedNext).
• Alerte automate în timp real pe Telegram direct pe smartphone-ul tău.

⚠️ Avertisment privind riscul (Risk Disclosure):
Tranzacționarea instrumentelor financiare derivate (Forex, CFD-uri, contracte futures și criptomonede) implică un nivel substanțial de risc și poate duce la pierderea totală a capitalului investit. Acest videoclip are scop educațional și nu reprezintă o recomandare financiară.

#trading #forex #mql5 #arnexus #smartmoneyconcepts #smc #ftmo #upcomers #tpt #lucidtrading #metatrader5`, 'ytDesc')}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 font-mono transition-colors"
                  >
                    {copiedIndex === 'ytDesc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 'ytDesc' ? 'Descriere Copiată!' : 'Copiază Toată Descrierea'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-40 overflow-y-auto select-all">
                  🚀 AR-Nexus este un algoritm instituțional de tranzacționare automată pentru MetaTrader 5 (MT5)...<br />
                  00:00 - Introducere: De ce pierd traderii la spargerile false<br />
                  00:45 - Ce este AR-Nexus & Strategia SMC de Lichiditate<br />
                  01:30 - Cum detectează vânătoarea de stopuri a marilor bănci (Sweeps)<br />
                  02:15 - Raport asimetric Risc:Recompensă (1:3.5 - 1:4.2)<br />
                  03:00 - Filtrul automat de știri economice cu dosar roșu<br />
                  03:45 - Protecția conturilor de Prop Firm (FTMO & Upcomers)<br />
                  04:30 - Alerte Telegram automate în timp real pe telefon<br />
                  05:00 - Conectare & Instalare în MetaTrader 5
                </div>
              </div>

              {/* YouTube Tags */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Etichete YouTube (Tags / Keywords):</span>
                  <button
                    type="button"
                    onClick={() => handleCopy('ar-nexus, robot forex mt5, expert advisor mt5, smart money concepts ea, smc liquidity sweep, ftmo trading bot, upcomers prop firm ea, robot tranzactionare aur xauusd, trading institutional mql5, robot algoritmic 2026, metatrader 5 bot', 'ytTags')}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    {copiedIndex === 'ytTags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === 'ytTags' ? 'Tag-uri Copiate!' : 'Copiază Tag-urile'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800 select-all">
                  ar-nexus, robot forex mt5, expert advisor mt5, smart money concepts ea, smc liquidity sweep, ftmo trading bot, upcomers prop firm ea, robot tranzactionare aur xauusd, trading institutional mql5, robot algoritmic 2026, metatrader 5 bot
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: CINEMATIC SIMULATOR PLAYER */}
          {activeTab === 'cinematic' && (
            <div className="space-y-4">
              {/* Main Cinematic Video Display Window (16:9 ratio) */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060913] aspect-video flex flex-col justify-between shadow-2xl group">
                {/* Background Cover Overlay */}
                <img
                  src="/ar_nexus_cover.jpg"
                  alt="AR-Nexus Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

                {/* Top Video HUD overlay */}
                <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="text-white font-bold tracking-wider">REC • AR-NEXUS 4K</span>
                    <span className="text-slate-400 hidden sm:inline">|</span>
                    <span className="text-cyan-400 hidden sm:inline">{currentScene.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${currentScene.badgeColor}`}>
                      {currentScene.visualBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  </div>
                </div>

                {/* Center Dynamic Visual Simulation Box */}
                <div className="relative z-10 px-4 sm:px-8 py-2 text-center max-w-2xl mx-auto space-y-3">
                  <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
                    Scena {currentStepIndex + 1} din {scenes.length}
                  </div>
                  <h4 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {currentScene.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                    {currentScene.tagline}
                  </p>

                  {/* Terminal telemetry pill */}
                  <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-left shadow-lg">
                    <div className="text-amber-300 font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>{currentScene.pair}</span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">•</span>
                    <div className="text-slate-200">
                      <span>{currentScene.metric}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Video Controls & Timeline Bar */}
                <div className="relative z-10 p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800/80 flex flex-col gap-2.5">
                  {/* Progress segments */}
                  <div className="grid grid-cols-6 gap-1.5">
                    {scenes.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentStepIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentStepIndex
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50'
                            : idx < currentStepIndex
                            ? 'bg-cyan-900/80'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/25"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                        <span className="text-xs">{isPlaying ? 'Pauză' : 'Redă'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStepIndex(0)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        title="Reia de la început"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-mono hidden sm:block">
                      <span className="text-white font-bold">Voice-Over Activ:</span> {currentScene.voiceover}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 Features Quick Navigation Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {scenes.map((sc, idx) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      idx === currentStepIndex
                        ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">Scena 0{idx + 1}</div>
                    <div className="text-xs font-bold text-white truncate mt-0.5">{sc.title.split('. ')[1] || sc.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{sc.tagline}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FULL PROMOTIONAL VIDEO SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Scenariu Video Complet Promoțional (45 Secunde)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gata redactat pentru video-uri pe TikTok, Instagram Reels, YouTube Shorts sau clipul de prezentare Gumroad!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(scenes.map(s => `[${s.time}] (${s.title})\nVIDEO: ${s.tagline}\nVOICE: ${s.voiceover}\n`).join('\n'), 'fullScript')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  {copiedIndex === 'fullScript' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 'fullScript' ? 'Copiat!' : 'Copiază Tot Scenariul'}</span>
                </button>
              </div>

              {/* Scenes Cards */}
              <div className="space-y-3">
                {scenes.map((sc, idx) => (
                  <div key={sc.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-mono text-cyan-400 font-bold">Secunda {sc.time}</span>
                      <span className="font-bold text-white">{sc.title}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      <strong className="text-amber-300">🎬 Ce apare pe ecran:</strong> {sc.tagline} ({sc.pair})
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-200 leading-relaxed font-sans">
                      <strong className="text-emerald-400">🎙️ Voce (Voice-Over):</strong> „{sc.voiceover}”
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROMPTS FOR AI VIDEO GENERATORS */}
          {activeTab === 'aiPrompts' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/60 text-xs text-purple-200 leading-relaxed">
                <span className="font-bold text-white">Cum generezi clipuri video AI folosind aceste prompturi:</span>
                <p className="mt-1 text-slate-300">
                  Poți copia fiecare prompt de mai jos și să îl introduci în instrumente video AI precum <strong>Google Veo</strong>, <strong>Runway Gen-3</strong>, <strong>Luma Dream Machine</strong> sau <strong>Kling AI</strong> pentru a genera clipuri cinematice 4K cu grafică bursieră de nivel Wall Street!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Prompt Scena 1 & 2: Holographic Liquidity Sweep Terminal</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('Cinematic close-up of a high-tech institutional trading room at night. Holographic neon MetaTrader 5 candlestick charts glowing in cyan and gold on dark obsidian curved glass screens. Gold XAUUSD price surging up, breaking the previous daily high with a glowing red laser LIQUIDITY SWEEP line, followed by rapid candle rejection down. Volumetric neon lighting, 8k resolution, ultra-detailed photorealistic financial technology aesthetic.', 'prompt1')}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedIndex === 'prompt1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 'prompt1' ? 'Copiat!' : 'Copiază Prompt'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800 select-all">
                    Cinematic close-up of a high-tech institutional trading room at night. Holographic neon MetaTrader 5 candlestick charts glowing in cyan and gold on dark obsidian curved glass screens. Gold XAUUSD price surging up, breaking the previous daily high with a glowing red laser LIQUIDITY SWEEP line, followed by rapid candle rejection down. Volumetric neon lighting, 8k resolution, ultra-detailed photorealistic financial technology aesthetic.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Prompt Scena 3: Order Execution & Asymmetric 1:3.5 Take Profit</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('Macro focus on a sleek algorithmic trading workstation. A glowing green BUY/SELL order triggers with precision, drawing an asymmetric 1:3.5 Risk Reward ratio box on the chart. Small red Stop Loss box, massive emerald green Take Profit target rushing into target. High-speed data stream particles, crisp Bloomberg terminal feel, cinematic depth of field.', 'prompt2')}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedIndex === 'prompt2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 'prompt2' ? 'Copiat!' : 'Copiază Prompt'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800 select-all">
                    Macro focus on a sleek algorithmic trading workstation. A glowing green BUY/SELL order triggers with precision, drawing an asymmetric 1:3.5 Risk Reward ratio box on the chart. Small red Stop Loss box, massive emerald green Take Profit target rushing into target. High-speed data stream particles, crisp Bloomberg terminal feel, cinematic depth of field.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Prompt Scena 4 & 5: Economic News Shield & Prop Firm Badge</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('Futuristic cybersecurity shield pulsing in red and gold warning of HIGH IMPACT US CPI news. A digital lock symbol secures the balance. Next shot cuts to golden badges verifying FTMO and Upcomers Prop Firm challenge passed with flying colors. Sleek 3D corporate quantitative finance commercial.', 'prompt3')}
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {copiedIndex === 'prompt3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 'prompt3' ? 'Copiat!' : 'Copiază Prompt'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 border border-slate-800 select-all">
                    Futuristic cybersecurity shield pulsing in red and gold warning of HIGH IMPACT US CPI news. A digital lock symbol secures the balance. Next shot cuts to golden badges verifying FTMO and Upcomers Prop Firm challenge passed with flying colors. Sleek 3D corporate quantitative finance commercial.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garanție returnare 30 zile • Fișiere .MQ5 și .SET incluse</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {onOpenCheckout && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Comandă Robotul AR-Nexus (299 €)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
