import React, { useState } from 'react';
import { 
  ShieldCheck, Award, Download, ExternalLink, Check, AlertTriangle, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PROP_FIRMS_TRANSLATIONS } from '../i18n/propFirmsTranslations';

interface PropFirm {
  id: string;
  name: string;
  badge: string;
  rating: number;
  established: string;
  profitSplit: string;
  eaAllowed: boolean;
  newsTradingAllowed: boolean;
  weekendHolding: boolean;
  recommendedBot: string;
  recommendedBotId: string;
  presetFilename: string;
  rules: {
    profitTarget: string;
    maxDailyLoss: string;
    maxTotalLoss: string;
    minTradingDays: string;
    leverage: string;
  };
  accountPrices: {
    size: string;
    fee: string;
    targetDollar: string;
  }[];
  highlights: string[];
  websiteUrl: string;
}

export const PROP_FIRMS: PropFirm[] = [
  {
    id: 'ftmo',
    name: 'FTMO',
    badge: 'Standardul de Aur • #1 Mondial',
    rating: 4.9,
    established: '2014 (Praga, Cehia)',
    profitSplit: 'Până la 90%',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'Aegis Scalper X & Neural Trend Pro',
    recommendedBotId: 'aegis-scalper-x',
    presetFilename: 'FTMO_Challenge_Safe_100k.set',
    rules: {
      profitTarget: '10% (Faza 1) / 5% (Faza 2)',
      maxDailyLoss: '5% (Circuit Breaker la 3.5% în robot)',
      maxTotalLoss: '10% (Trailing / Static)',
      minTradingDays: '4 Zile (Fără limită maximă de timp)',
      leverage: '1:100 (Forex & Aur)'
    },
    accountPrices: [
      { size: '$10,000', fee: '155 €', targetDollar: '$1,000' },
      { size: '$25,000', fee: '250 €', targetDollar: '$2,500' },
      { size: '$50,000', fee: '345 €', targetDollar: '$5,000' },
      { size: '$100,000', fee: '540 €', targetDollar: '$10,000' },
      { size: '$200,000', fee: '1,080 €', targetDollar: '$20,000' }
    ],
    highlights: [
      'Peste 10 ani de plăți sigure și reputație impecabilă',
      'Roboții (EAs) sunt 100% permiși în conturile standard și swing',
      'Taxa de înscriere este 100% rambursată la primul profit split',
      'Parteneriate oficiale de lichiditate instituțională'
    ],
    websiteUrl: 'https://ftmo.com'
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    badge: 'Cel Mai Bun Profit Split • 95%',
    rating: 4.8,
    established: '2022 (Dubai & Cipru)',
    profitSplit: 'Până la 95% + 15% din faza Challenge',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'Neural Trend Pro',
    recommendedBotId: 'neural-trend-pro',
    presetFilename: 'FundedNext_Stellar_Algo.set',
    rules: {
      profitTarget: '8% (Faza 1) / 5% (Faza 2) sau 10% (1-Step)',
      maxDailyLoss: '5% (Balantă/Equity based)',
      maxTotalLoss: '10%',
      minTradingDays: 'Fără zile minime obligatorii',
      leverage: '1:100'
    },
    accountPrices: [
      { size: '$15,000', fee: '$119', targetDollar: '$1,200' },
      { size: '$25,000', fee: '$199', targetDollar: '$2,000' },
      { size: '$50,000', fee: '$299', targetDollar: '$4,000' },
      { size: '$100,000', fee: '$549', targetDollar: '$8,000' },
      { size: '$200,000', fee: '$999', targetDollar: '$16,000' }
    ],
    highlights: [
      'Primești 15% profit split chiar din faza de evaluare/challenge',
      'Zero presiune de timp (poți trece evaluarea oricât de lent)',
      'Suport excelent în limba română și retrageri în 24 de ore',
      'Servere MT5 ultra-rapide optimizate pentru tranzacționare automată'
    ],
    websiteUrl: 'https://fundednext.com'
  },
  {
    id: 'fundingpips',
    name: 'Funding Pips',
    badge: 'Prețuri Mici & Plăți la 5 Zile',
    rating: 4.8,
    established: '2023 (Dubai, UAE)',
    profitSplit: 'Până la 90%',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'Aegis Scalper X',
    recommendedBotId: 'aegis-scalper-x',
    presetFilename: 'FundingPips_HFT_Scalper.set',
    rules: {
      profitTarget: '8% (Faza 1) / 5% (Faza 2)',
      maxDailyLoss: '5%',
      maxTotalLoss: '10%',
      minTradingDays: 'Zero zile minime',
      leverage: '1:100'
    },
    accountPrices: [
      { size: '$5,000', fee: '$32', targetDollar: '$400' },
      { size: '$10,000', fee: '$60', targetDollar: '$800' },
      { size: '$25,000', fee: '$139', targetDollar: '$2,000' },
      { size: '$50,000', fee: '$239', targetDollar: '$4,000' },
      { size: '$100,000', fee: '$399', targetDollar: '$8,000' }
    ],
    highlights: [
      'Cele mai accesibile taxe de challenge de pe piață (de la doar 32$)',
      'Spread-uri raw ECN autentice ideale pentru Aegis Scalper X',
      'Retrageri de profit posibile la fiecare 5 zile de tranzacționare',
      'Scalare rapidă de capital până la 2 milioane de dolari'
    ],
    websiteUrl: 'https://fundingpips.com'
  },
  {
    id: 'the5ers',
    name: 'The5ers',
    badge: 'Tradiție din 2016 • Finanțare Instant',
    rating: 4.9,
    established: '2016 (Israel & Londra)',
    profitSplit: 'Până la 100% cu scalare',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'Titan Breakout Hunter & Aegis Scalper',
    recommendedBotId: 'titan-breakout-hunter',
    presetFilename: 'The5ers_HighStakes_Safe.set',
    rules: {
      profitTarget: '8% (Faza 1) / 5% (Faza 2)',
      maxDailyLoss: '5%',
      maxTotalLoss: '10%',
      minTradingDays: '3 zile',
      leverage: '1:100'
    },
    accountPrices: [
      { size: '$20,000', fee: '$165', targetDollar: '$1,600' },
      { size: '$60,000', fee: '$300', targetDollar: '$4,800' },
      { size: '$100,000', fee: '$495', targetDollar: '$8,000' },
      { size: '$250,000', fee: '$1,195', targetDollar: '$20,000' }
    ],
    highlights: [
      'Peste 8 ani de continuitate fără scandaluri sau reguli retroactive',
      'Programul Hyper Growth oferă scalare de capital dublată la fiecare 10%',
      'Permite orice stil de tranzacționare algoritmic MQL5',
      'Rambursare taxă + bonus de performanță'
    ],
    websiteUrl: 'https://the5ers.com'
  },
  {
    id: 'alpha-capital',
    name: 'Alpha Capital Group',
    badge: 'Comisioane 0 pe Indici (US100 / NAS100)',
    rating: 4.7,
    established: '2021 (Londra, Marea Britanie)',
    profitSplit: '80% - 90%',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'Neural Trend Pro',
    recommendedBotId: 'neural-trend-pro',
    presetFilename: 'Alpha_US100_Trend.set',
    rules: {
      profitTarget: '8% (Faza 1) / 4% (Faza 2)',
      maxDailyLoss: '5%',
      maxTotalLoss: '10%',
      minTradingDays: 'Fără zile minime',
      leverage: '1:100 pe FX, 1:20 pe Indici'
    },
    accountPrices: [
      { size: '$10,000', fee: '$97', targetDollar: '$800' },
      { size: '$25,000', fee: '$175', targetDollar: '$2,000' },
      { size: '$50,000', fee: '$275', targetDollar: '$4,000' },
      { size: '$100,000', fee: '$475', targetDollar: '$8,000' },
      { size: '$200,000', fee: '$875', targetDollar: '$16,000' }
    ],
    highlights: [
      '0% Comisioane la tranzacționarea indicilor Nasdaq (US100) și US30',
      'Interfață prop proprie cu feed direct TradingView și MT5',
      'Dashboard analitic integrat cu riscul calculat automat',
      'Suport 24/7 direct din Londra'
    ],
    websiteUrl: 'https://alphacapitalgroup.uk'
  },
  {
    id: 'upcomers',
    name: 'Upcomers',
    badge: '100% Algo Friendly • Retrageri Rapide',
    rating: 4.8,
    established: '2023 (Praga & Londra)',
    profitSplit: 'Până la 90%',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'AR-Nexus & Aegis Scalper X',
    recommendedBotId: 'ar-nexus',
    presetFilename: 'Upcomers_AR_Nexus_Safe.set',
    rules: {
      profitTarget: '8% (Faza 1) / 5% (Faza 2)',
      maxDailyLoss: '5% (Circuit Breaker la 3.5%)',
      maxTotalLoss: '10%',
      minTradingDays: 'Fără zile minime obligatorii',
      leverage: '1:100 (Forex, Metale, Indici)'
    },
    accountPrices: [
      { size: '$10,000', fee: '$69', targetDollar: '$800' },
      { size: '$25,000', fee: '$149', targetDollar: '$2,000' },
      { size: '$50,000', fee: '$249', targetDollar: '$4,000' },
      { size: '$100,000', fee: '$449', targetDollar: '$8,000' },
      { size: '$200,000', fee: '$889', targetDollar: '$16,000' }
    ],
    highlights: [
      'Compatibil 100% cu roboți de tranzacționare automată (EA / MQL5)',
      'Fără zile minime de tranzacționare obligatorii - treci evaluarea în ritmul tău',
      'Politici flexibile de știri și weekend holding permise',
      'Infrastructură MT5 de mare viteză cu latență sub 5ms către servere ECN'
    ],
    websiteUrl: 'https://upcomers.com'
  },
  {
    id: 'tpt',
    name: 'TPT (Take Profit Trader)',
    badge: 'Futures & Forex • Retrageri din Ziua 1',
    rating: 4.8,
    established: '2021 (Orlando, Florida, USA)',
    profitSplit: 'Până la 90% (Fără Buffer de Retragere)',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'AR-Nexus & Titan Breakout',
    recommendedBotId: 'ar-nexus',
    presetFilename: 'TPT_AR_Nexus_Futures_Forex.set',
    rules: {
      profitTarget: '6% (Pro Test 1-Step)',
      maxDailyLoss: '3% (EOD End-of-Day Drawdown)',
      maxTotalLoss: '4.5% (Trailing EOD)',
      minTradingDays: '5 Zile de Tranzacționare',
      leverage: '1:50 Forex & Contracte Futures'
    },
    accountPrices: [
      { size: '$25,000', fee: '$150/lună', targetDollar: '$1,500' },
      { size: '$50,000', fee: '$170/lună', targetDollar: '$3,000' },
      { size: '$75,000', fee: '$245/lună', targetDollar: '$4,500' },
      { size: '$100,000', fee: '$330/lună', targetDollar: '$6,000' },
      { size: '$150,000', fee: '$360/lună', targetDollar: '$9,000' }
    ],
    highlights: [
      'Retrageri de profit permise încă din Ziua 1 de cont finanțat Pro fără perioade de așteptare',
      'End of Day (EOD) trailing drawdown - nu te scoate din trade pe fluctuații intraday nerealizate',
      'Fără buffer obligatoriu reținut pentru prima retragere (Profit Split direct în cont)',
      'Execuție optimizată pentru roboți algoritmici MT5 cu latență minimă'
    ],
    websiteUrl: 'https://takeprofittrader.com'
  },
  {
    id: 'lucid',
    name: 'Lucid Trading',
    badge: 'Static Drawdown • Spread Minim ECN',
    rating: 4.7,
    established: '2023 (Londra, Marea Britanie)',
    profitSplit: 'Până la 90%',
    eaAllowed: true,
    newsTradingAllowed: true,
    weekendHolding: true,
    recommendedBot: 'AR-Nexus & Aegis Scalper X',
    recommendedBotId: 'ar-nexus',
    presetFilename: 'Lucid_AR_Nexus_SMC_Institutional.set',
    rules: {
      profitTarget: '8% (Faza 1) / 5% (Faza 2)',
      maxDailyLoss: '4% (Circuit Breaker la 3% în EA)',
      maxTotalLoss: '8% - 10% (Static Drawdown)',
      minTradingDays: 'Fără zile minime obligatorii',
      leverage: '1:100 (Forex, Aur XAUUSD, Indici)'
    },
    accountPrices: [
      { size: '$10,000', fee: '$75', targetDollar: '$800' },
      { size: '$25,000', fee: '$155', targetDollar: '$2,000' },
      { size: '$50,000', fee: '$260', targetDollar: '$4,000' },
      { size: '$100,000', fee: '$460', targetDollar: '$8,000' },
      { size: '$200,000', fee: '$890', targetDollar: '$16,000' }
    ],
    highlights: [
      'Drawdown static fără capcane trailing: riscul este calculat raportat strict la balanța inițială',
      'Roboții SMC bazați pe lichiditate (precum AR-Nexus) beneficiază de latență de execuție sub 3ms',
      'Tranzacționare permisă pe timpul știrilor economice majore și weekend holding activat',
      'Spread-uri brute ECN de 0.0 pips pe perechi majore EURUSD/GBPUSD și Aur'
    ],
    websiteUrl: 'https://lucidtrading.com'
  }
];

interface PropFirmsSectionProps {
  onOpenSourceModal?: () => void;
}

export const PropFirmsSection: React.FC<PropFirmsSectionProps> = () => {
  const { t, language } = useLanguage();
  const [selectedFirmId, setSelectedFirmId] = useState<string>(PROP_FIRMS[0].id);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(3); // $100,000 default

  const selectedFirm = PROP_FIRMS.find((f) => f.id === selectedFirmId) || PROP_FIRMS[0];
  const pfI18n = PROP_FIRMS_TRANSLATIONS[language] || PROP_FIRMS_TRANSLATIONS.en;
  const localizedFirm = pfI18n.firms[selectedFirm.id];

  const displayBadge = localizedFirm?.badge || selectedFirm.badge;
  const displayEstablished = localizedFirm?.established || selectedFirm.established;
  const displayProfitSplit = localizedFirm?.profitSplit || selectedFirm.profitSplit;
  const displayRules = localizedFirm?.rules || selectedFirm.rules;
  const displayHighlights = localizedFirm?.highlights || selectedFirm.highlights;

  const formatFee = (fee: string) => fee.replace('/lună', pfI18n.perMonth);

  const handleDownloadPreset = (firm: PropFirm) => {
    const presetContent = `;+------------------------------------------------------------------+
;| Nexus Quant Systems - Optimized Prop Firm Preset (${firm.name})
;| Target Symbol: XAUUSD / EURUSD / US100
;| Timeframe: M5 - M15
;| Risk per trade: 0.75% (Stress-free prop challenge passing preset)
;+------------------------------------------------------------------+
InpLicenseKey=NX-PROPFIRM-ACTIVE-LD4
InpMagicNumber=884120
InpAllowPropFirmMode=true
InpRiskPercent=0.75
InpMaxDailyDrawdown=3.5
InpMaxSpreadPoints=25
InpFastMAPeriod=8
InpSlowMAPeriod=21
InpRSIPeriod=14
InpStopLossPips=35
InpTakeProfitPips=70
InpEnableTrailing=true
InpTrailingStartPips=20
InpTrailingStepPips=8
`;
    const blob = new Blob([presetContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = firm.presetFilename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="prop-firms" className="py-20 md:py-28 bg-[#06080e] relative border-t border-slate-900 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>{t.propFirms.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.propFirms.title} <span className="text-cyan-400">{t.propFirms.titleHighlight1}</span> {t.propFirms.titleTo} <span className="text-emerald-400">{t.propFirms.titleHighlight2}</span>
          </h2>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            {t.propFirms.subtitle}
          </p>
        </div>

        {/* Firm Selectors Pills */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-10">
          {PROP_FIRMS.map((firm) => (
            <button
              key={firm.id}
              onClick={() => {
                setSelectedFirmId(firm.id);
                setSelectedSizeIndex(Math.min(selectedSizeIndex, firm.accountPrices.length - 1));
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                selectedFirm.id === firm.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/15'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{firm.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                ★ {firm.rating}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Prop Firm Deep-Dive Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Overview & Pricing */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-2xl md:text-3xl font-black text-white">{selectedFirm.name}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {displayBadge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {pfI18n.hqLabel} <span className="text-slate-300">{displayEstablished}</span> • {pfI18n.profitSplitLabel}{' '}
                    <span className="text-emerald-400 font-bold font-mono">{displayProfitSplit}</span>
                  </div>
                </div>

                <a
                  href={selectedFirm.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <span>{t.propFirms.officialSite}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Account Size Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  {t.propFirms.selectSize}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {selectedFirm.accountPrices.map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedSizeIndex === idx
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-black font-mono">{acc.size}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t.propFirms.fee} {formatFee(acc.fee)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {t.propFirms.whyIdeal}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {displayHighlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Presets and Robot Match Action */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950 border border-cyan-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t.propFirms.recommendedBot} {selectedFirm.recommendedBot}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {t.propFirms.downloadPresetDesc}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadPreset(selectedFirm)}
                  className="py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all shrink-0 w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.propFirms.downloadPreset} {selectedFirm.presetFilename}</span>
                </button>
              </div>
            </div>

            {/* Right Col: Strict Rules Matrix */}
            <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white">{t.propFirms.rulesTitle} - {selectedFirm.name}</span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t.propFirms.eaAllowed}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between gap-3 p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">{t.propFirms.profitTarget}</span>
                  <span className="text-emerald-400 font-bold text-right">{displayRules.profitTarget}</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">{t.propFirms.maxDailyLoss}</span>
                  <span className="text-amber-400 font-bold text-right">{displayRules.maxDailyLoss}</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">{t.propFirms.maxTotalLoss}</span>
                  <span className="text-rose-400 font-bold text-right">{displayRules.maxTotalLoss}</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">{t.propFirms.minTradingDays}</span>
                  <span className="text-white text-right">{displayRules.minTradingDays}</span>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">{t.propFirms.leverage}</span>
                  <span className="text-cyan-300 font-bold text-right">{displayRules.leverage}</span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 text-[11px] text-amber-300/90 leading-relaxed font-sans">
                <div className="font-bold flex items-center gap-1 text-amber-400 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.propFirms.guardTitle}</span>
                </div>
                {t.propFirms.guardDesc}
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Strategy To Pass Prop Firms Guaranteed */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h4 className="text-xl md:text-2xl font-bold text-white">
              {t.propFirms.strategyTitle}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {t.propFirms.strategySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm mb-3">
                01
              </div>
              <h5 className="text-sm font-bold text-white">{t.propFirms.step1Title}</h5>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {t.propFirms.step1Desc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono font-bold flex items-center justify-center text-sm mb-3">
                02
              </div>
              <h5 className="text-sm font-bold text-white">{t.propFirms.step2Title}</h5>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {t.propFirms.step2Desc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm mb-3">
                03
              </div>
              <h5 className="text-sm font-bold text-white">{t.propFirms.step3Title}</h5>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {t.propFirms.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
