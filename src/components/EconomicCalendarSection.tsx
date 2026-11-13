import React, { useState, useMemo } from 'react';
import { 
  Calendar, AlertOctagon, ShieldAlert, Clock, Bell, CheckCircle2, 
  Filter, Play, RotateCcw, AlertTriangle, ShieldCheck, Flame, Info, ExternalLink, Zap
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface EconomicEvent {
  id: string;
  time: string;
  date: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  title: string;
  impact: 'high' | 'medium' | 'low';
  forecast: string;
  previous: string;
  actual?: string;
  affectedPairs: string[];
  description: string;
}

export const EconomicCalendarSection: React.FC = () => {
  const { t } = useLanguage();
  const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'medium'>('all');
  const [filterCurrency, setFilterCurrency] = useState<'all' | 'USD' | 'EUR' | 'GBP' | 'JPY'>('all');
  const [simulatedRedNewsActive, setSimulatedRedNewsActive] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>('ev-cpi');

  // Real-world high impact and medium impact economic events
  const economicEvents: EconomicEvent[] = [
    {
      id: 'ev-cpi',
      date: 'Joi, 12 Nov',
      time: '15:30 GMT+2',
      currency: 'USD',
      title: 'US CPI (Indicele Prețurilor de Consum / Inflație)',
      impact: 'high',
      forecast: '2.6%',
      previous: '2.4%',
      actual: 'În așteptare',
      affectedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD (Aur)', 'US100'],
      description: 'Eveniment cu impact masiv (Dosar Roșu). Volatilitate extremă de 60-150 pips în primele 3 minute. Robotul AR-Nexus oprește automat execuția cu 30 de minute înainte.'
    },
    {
      id: 'ev-nfp',
      date: 'Vineri, 13 Nov',
      time: '15:30 GMT+2',
      currency: 'USD',
      title: 'Non-Farm Payrolls (NFP & Rata Șomajului SUA)',
      impact: 'high',
      forecast: '185K',
      previous: '254K',
      actual: 'În așteptare',
      affectedPairs: ['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/CAD'],
      description: 'Cea mai violentă știre lunară. Spread-urile pe piață cresc de până la 8 ori. Modulul de protecție la știri blochează orice poziție nouă și protejează balanța.'
    },
    {
      id: 'ev-fomc',
      date: 'Miercuri, 18 Nov',
      time: '21:00 GMT+2',
      currency: 'USD',
      title: 'Decizia Ratei Dobânzii FOMC & Conferința Fed',
      impact: 'high',
      forecast: '4.75%',
      previous: '5.00%',
      actual: 'În așteptare',
      affectedPairs: ['Toate perechile USD', 'XAU/USD', 'US30', 'US100'],
      description: 'Schimbarea politicii monetare a Rezervei Federale. Se activează pauza de 60 de minute pentru eliminarea riscului de lichidare pe gap-uri nocturne.'
    },
    {
      id: 'ev-ecb',
      date: 'Joi, 19 Nov',
      time: '15:15 GMT+2',
      currency: 'EUR',
      title: 'Decizia Ratei Dobânzii BCE (Banca Centrală Europeană)',
      impact: 'high',
      forecast: '3.25%',
      previous: '3.40%',
      actual: 'În așteptare',
      affectedPairs: ['EUR/USD', 'EUR/GBP', 'EUR/JPY', 'GER40 (DAX)'],
      description: 'Impact critic pe moneda Euro. Recomandat de regulile FTMO și Upcomers să fie evitată intrarea în piață la acest eveniment.'
    },
    {
      id: 'ev-boe',
      date: 'Joi, 26 Nov',
      time: '14:00 GMT+2',
      currency: 'GBP',
      title: 'Decizia Ratei Dobânzii Banca Angliei (BoE)',
      impact: 'high',
      forecast: '4.75%',
      previous: '5.00%',
      actual: 'În așteptare',
      affectedPairs: ['GBP/USD', 'EUR/GBP', 'GBP/JPY'],
      description: 'Impact violent pe lira sterlină. Robotul blochează tranzacțiile pe GBP și menține doar analizele pasive.'
    },
    {
      id: 'ev-claims',
      date: 'Săptămânal (Joi)',
      time: '15:30 GMT+2',
      currency: 'USD',
      title: 'US Initial Jobless Claims (Cererile de Șomaj)',
      impact: 'medium',
      forecast: '218K',
      previous: '221K',
      actual: '216K',
      affectedPairs: ['USD/JPY', 'EUR/USD'],
      description: 'Impact moderat. Robotul permite tranzacționarea dacă spread-ul este sub 25 de puncte.'
    },
    {
      id: 'ev-pmi',
      date: 'Marți, 24 Nov',
      time: '10:30 GMT+2',
      currency: 'EUR',
      title: 'German Manufacturing PMI (Zona Euro)',
      impact: 'medium',
      forecast: '43.2',
      previous: '43.0',
      actual: 'În așteptare',
      affectedPairs: ['EUR/USD', 'GER40'],
      description: 'Indicator cheie de sănătate economică industrială germană.'
    },
    {
      id: 'ev-boj',
      date: 'Vineri, 27 Nov',
      time: '05:00 GMT+2',
      currency: 'JPY',
      title: 'Declarația de Politică Monetară BoJ (Banca Japoniei)',
      impact: 'high',
      forecast: '0.25%',
      previous: '0.25%',
      actual: 'În așteptare',
      affectedPairs: ['AUD/JPY', 'USD/JPY', 'EUR/JPY', 'GBP/JPY'],
      description: 'Spike-uri bruște pe yenul japonez. AUD/JPY și USD/JPY intră automat în mod protecție.'
    }
  ];

  const filteredEvents = useMemo(() => {
    return economicEvents.filter((ev) => {
      const matchImpact = 
        filterImpact === 'all' ? true :
        filterImpact === 'high' ? ev.impact === 'high' :
        filterImpact === 'medium' ? ev.impact === 'medium' : true;

      const matchCurrency = 
        filterCurrency === 'all' ? true : ev.currency === filterCurrency;

      return matchImpact && matchCurrency;
    });
  }, [filterImpact, filterCurrency]);

  const selectedEvent = economicEvents.find((e) => e.id === selectedEventId) || economicEvents[0];

  return (
    <section id="calendar-economic" className="py-20 md:py-28 bg-[#070913] relative border-t border-slate-900 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/80 mb-4 shadow-lg shadow-red-950/50">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>{t.calendar.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            {t.calendar.titlePart1} <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">{t.calendar.titleRed}</span> {t.calendar.titlePart2}
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
            {t.calendar.subtitle}
          </p>
        </div>

        {/* Live Bot Protection Status Card & Interactive Simulator */}
        <div className={`p-5 md:p-7 rounded-2xl border transition-all mb-10 ${
          simulatedRedNewsActive 
            ? 'bg-gradient-to-r from-red-950/90 via-slate-950 to-red-950/80 border-red-500 shadow-2xl shadow-red-950/70' 
            : 'bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90 border-slate-800 shadow-xl'
        }`}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                simulatedRedNewsActive 
                  ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
              }`}>
                {simulatedRedNewsActive ? <AlertOctagon className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                    simulatedRedNewsActive 
                      ? 'bg-red-500 text-white' 
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {simulatedRedNewsActive ? `🔴 ${t.calendar.filterActiveTag}` : `🟢 ${t.calendar.filterSafeTag}`}
                  </span>
                  <span className="text-xs text-slate-400">• ±30 min</span>
                </div>

                <h4 className="text-lg md:text-xl font-bold text-white">
                  {simulatedRedNewsActive 
                    ? t.calendar.statusActive 
                    : t.calendar.statusSafe}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {simulatedRedNewsActive
                    ? t.calendar.statusActiveDesc
                    : t.calendar.statusSafeDesc}
                </p>
              </div>
            </div>

            {/* Test Simulation Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setSimulatedRedNewsActive(!simulatedRedNewsActive)}
                className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  simulatedRedNewsActive 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50' 
                    : 'bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 shadow-amber-950/50'
                }`}
              >
                {simulatedRedNewsActive ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Oprește Simularea Știre Roșie</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Simulează Reacția la Știre Roșie (CPI)</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Telegram notification simulation banner if red news active */}
          {simulatedRedNewsActive && (
            <div className="mt-5 pt-4 border-t border-red-900/60 flex items-center gap-3 text-xs font-mono text-red-300 bg-red-950/60 p-3 rounded-xl">
              <Bell className="w-4 h-4 text-red-400 shrink-0 animate-bounce" />
              <span>
                <strong>Mesaj Telegram Transmis:</strong> 🛑 [AR-Nexus] Știre Economică de Impact Ridicat (US CPI) în desfășurare. Tranzacționarea este SUSPENDATĂ timp de 30 min pentru protecția contului Prop Firm.
              </span>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 pl-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filtru Impact:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilterImpact('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterImpact === 'all' 
                    ? 'bg-slate-800 text-white border border-slate-700' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Toate
              </button>
              <button
                type="button"
                onClick={() => setFilterImpact('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterImpact === 'high' 
                    ? 'bg-red-950 text-red-300 border border-red-700' 
                    : 'text-red-400 hover:bg-red-950/40'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Doar Roșu (High Impact)</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterImpact('medium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterImpact === 'medium' 
                    ? 'bg-amber-950 text-amber-300 border border-amber-700' 
                    : 'text-amber-400 hover:bg-amber-950/40'
                }`}
              >
                Mediu (Portocaliu)
              </button>
            </div>
          </div>

          {/* Currency Filter */}
          <div className="flex items-center gap-1.5 pr-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Monedă:</span>
            {(['all', 'USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setFilterCurrency(curr)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  filterCurrency === curr
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                }`}
              >
                {curr === 'all' ? 'Toate' : curr}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid + Inspector Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Events List (2 columns on lg) */}
          <div className="lg:col-span-2 space-y-3">
            {filteredEvents.map((ev) => {
              const isSelected = selectedEventId === ev.id;
              const isHigh = ev.impact === 'high';

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEventId(ev.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      {/* Impact Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase flex items-center gap-1 ${
                        isHigh 
                          ? 'bg-red-950 text-red-300 border border-red-800' 
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-red-500' : 'bg-amber-400'}`} />
                        <span>{isHigh ? 'ROȘU • IMPACT RIDICAT' : 'PORTOCALIU'}</span>
                      </span>

                      {/* Currency Pill */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                        {ev.currency}
                      </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{ev.date} • {ev.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h5 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {ev.title}
                    </h5>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div>
                        <span className="text-slate-500">Prognoză: </span>
                        <span className="text-slate-300 font-bold">{ev.forecast}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Anterior: </span>
                        <span className="text-slate-400">{ev.previous}</span>
                      </div>
                    </div>
                  </div>

                  {/* Protection rule summary on high impact */}
                  {isHigh && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px] text-red-300/90 font-mono">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>Regulă AR-Nexus: Oprire automată ±30 min</span>
                      </span>
                      <span className="text-slate-500">Compatibil FTMO / Upcomers</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Details & MQL5 Code Implementation Card */}
          <div className="space-y-6">
            
            {/* Selected Event Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                  Detalii Eveniment Selectat
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedEvent.impact === 'high' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300'
                }`}>
                  {selectedEvent.currency}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {selectedEvent.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {selectedEvent.description}
              </p>

              <div className="space-y-2 mb-4 text-xs">
                <div className="text-slate-400 font-semibold">Perechi Valutare Afectate Direct:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.affectedPairs.map((pair) => (
                    <span key={pair} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300">
                      {pair}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-cyan-900/60 text-xs text-cyan-300">
                <div className="font-bold flex items-center gap-1.5 text-white mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Protecție Prop Firm Integrată</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  FTMO și Upcomers penalizează trecerea prin știri dacă spread-ul produce slippage. AR-Nexus nu deschide tranzacții în fereastra roșie.
                </p>
              </div>
            </div>

            {/* MQL5 Code Snippet Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 font-bold">
                  MQL5 Native News Filter Engine
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">ACTIV ÎN AR-NEXUS</span>
              </div>
              <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-cyan-200 overflow-x-auto leading-relaxed border border-slate-800/80">
{`input group "=== Filtru Știri Roșii ==="
input bool InpEnableNewsFilter = true;
input int  InpPauseMinsBefore  = 30;
input int  InpPauseMinsAfter   = 30;

bool IsRedNewsActive()
{
   // Verificare nativă Calendar MT5
   // & orar știri de impact ridicat
   return CheckHighImpactNews(
      _Symbol, 
      InpPauseMinsBefore, 
      InpPauseMinsAfter
   );
}`}
              </pre>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Inclus nativ în codul sursă MQL5</span>
                <span className="text-emerald-400 font-bold">0 Slippage</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
