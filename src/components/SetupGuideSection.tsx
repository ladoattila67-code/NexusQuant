import React, { useState } from 'react';
import { PlayCircle, Download, CheckCircle, ArrowRight, Laptop, Server, Key, ShieldCheck, FileCode, Sliders, RefreshCw, Terminal } from 'lucide-react';
import { TRADING_BOTS } from '../data/tradingBots';
import { useLanguage } from '../i18n/LanguageContext';

interface SetupGuideSectionProps {
  onOpenSourceCodeModal?: () => void;
}

export const SetupGuideSection: React.FC<SetupGuideSectionProps> = ({ onOpenSourceCodeModal }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'video' | 'simulator'>('simulator');
  const [selectedBotId, setSelectedBotId] = useState<string>('aegis-scalper-x');
  const [accountType, setAccountType] = useState<'demo' | 'live' | 'prop'>('live');
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [balance, setBalance] = useState<number>(5000);
  const [isSimulatedActive, setIsSimulatedActive] = useState<boolean>(true);
  const [generatedSetFile, setGeneratedSetFile] = useState<boolean>(false);

  const selectedBot = TRADING_BOTS.find((b) => b.id === selectedBotId) || TRADING_BOTS[0];

  const handleDownloadPreset = () => {
    // Generate realistic .set file content
    const content = `;--- Nexus Quant Systems - Expert Advisor Config File
;--- Bot: ${selectedBot.name}
;--- Account Type: ${accountType.toUpperCase()}
;--- Risk per Trade: ${riskPercent}%
;--- Created for Balance: ${balance} EUR

LicenseKey=NX-PRO-8842-LIVE-LD4
RiskPercent=${riskPercent}
MaxDailyLossPercent=3.5
MaxDrawdownCap=5.0
StopLoss_Pips=45
TakeProfit_Pips=90
TrailingStop=true
TrailingStart_Pips=25
TrailingStep_Pips=10
UseNewsFilter=true
HighImpactNewsShield_MinutesBefore=30
HighImpactNewsShield_MinutesAfter=30
MaxSpread_Pips=1.8
Slippage_Tolerance=2
MagicNumber=984120
UseVPSCoLocation=true
BrokerLatencyCorrection=true
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBot.id}_${accountType}_risk${riskPercent}pct.set`;
    link.click();
    URL.revokeObjectURL(url);
    setGeneratedSetFile(true);
  };

  const steps = [
    {
      step: '01',
      title: t.setup.step1Title,
      desc: t.setup.step1Desc,
      icon: Laptop,
      badge: '2 Min'
    },
    {
      step: '02',
      title: t.setup.step2Title,
      desc: t.setup.step2Desc,
      icon: Download,
      badge: 'Instant'
    },
    {
      step: '03',
      title: t.setup.step3Title,
      desc: t.setup.step3Desc,
      icon: FileCode,
      badge: '1 Min'
    },
    {
      step: '04',
      title: t.setup.step4Title,
      desc: t.setup.step4Desc,
      icon: Key,
      badge: '24/7 Algo'
    }
  ];

  return (
    <section id="punere-in-functiune" className="py-16 md:py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 mb-3">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>{t.setup.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.setup.title}
          </h2>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            {t.setup.subtitle}
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono text-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      {s.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Simulator Card: MetaTrader Terminal Live Experience */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="p-5 md:p-6 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Interactive Configuration Simulator
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">
                Test Live Setup & Generate Your .SET Preset File
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your account parameters below and download an optimized preset file ready to load into MetaTrader.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AutoTrading: {isSimulatedActive ? 'ENABLED' : 'STOPPED'}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  1. Select Trading Robot:
                </label>
                <select
                  value={selectedBotId}
                  onChange={(e) => setSelectedBotId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  {TRADING_BOTS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Trading Account Type:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('demo')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      accountType === 'demo'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Demo Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('live')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      accountType === 'live'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Real Live Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('prop')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      accountType === 'prop'
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    FTMO / Prop Firm
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-300">
                    3. Risk per Trade:
                  </label>
                  <span className="font-mono font-bold text-cyan-400">{riskPercent}% of equity</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0.5% (Conservative)</span>
                  <span>1.0% (Recommended)</span>
                  <span>2.0% (Aggressive)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  4. Simulated Account Balance:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                    EUR
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleDownloadPreset}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Custom Settings File (.SET)</span>
                </button>

                {onOpenSourceCodeModal && (
                  <button
                    type="button"
                    onClick={onOpenSourceCodeModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-cyan-800/80 font-mono text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <span>View & Download MQL5 Source Code ({selectedBot.name}.mq5)</span>
                  </button>
                )}

                {generatedSetFile && (
                  <p className="text-[11px] text-emerald-400 text-center mt-2 font-mono flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Your `.set` configuration file has been generated and downloaded!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Simulated MetaTrader Terminal View */}
            <div className="lg:col-span-7 bg-[#0b101d] rounded-xl border border-slate-800 p-4 md:p-5 flex flex-col justify-between font-mono text-xs">
              <div>
                {/* MetaTrader Chart Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{selectedBot.marketPairs[0]}</span>
                    <span className="text-cyan-400">M15</span>
                    <span className="text-slate-500">Tickmill-Live ECN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      ☺ {selectedBot.name} (ACTIVE)
                    </span>
                  </div>
                </div>

                {/* Simulated Chart Area */}
                <div className="h-44 my-4 relative flex items-center justify-center rounded-lg border border-slate-900 bg-[#070b14] overflow-hidden">
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="border-r border-b border-cyan-400" />
                    ))}
                  </div>

                  {/* Simulated algorithmic trade levels */}
                  <div className="absolute left-6 right-6 top-10 flex items-center justify-between border-t border-dashed border-emerald-500/80 text-[10px] text-emerald-400">
                    <span>TP: +90 pips (Take Profit)</span>
                    <span className="font-bold">+450.00 €</span>
                  </div>

                  <div className="absolute left-6 right-6 top-20 flex items-center justify-between border-t border-cyan-400 text-[10px] text-cyan-300 font-bold bg-cyan-950/30 px-2 py-0.5">
                    <span>ENTRY BUY 0.50 LOT @ 2688.40</span>
                    <span>SPREAD: 0.2 pips</span>
                  </div>

                  <div className="absolute left-6 right-6 bottom-8 flex items-center justify-between border-t border-dashed border-rose-500/80 text-[10px] text-rose-400">
                    <span>SL: -45 pips (Stop Loss)</span>
                    <span>-50.00 € (Strict 1.0% Risk)</span>
                  </div>

                  <div className="text-center z-10 text-slate-500 text-[11px]">
                    0.7ms Execution Engine • Equinix LD4 London
                  </div>
                </div>

                {/* MT5 Terminal Log Window */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-300 space-y-1">
                  <div className="text-slate-500">08:42:01.002 | Nexus Quant Engine v4.8 initialized successfully.</div>
                  <div className="text-cyan-400">08:42:01.045 | License verified: {accountType.toUpperCase()} account authorized.</div>
                  <div className="text-slate-400">08:42:01.090 | News Filter: No high-impact event within the next 30 minutes.</div>
                  <div className="text-emerald-400">
                    08:42:02.120 | Order opened #984129: BUY 0.50 {selectedBot.marketPairs[0]} @ 2688.40 (SL locked).
                  </div>
                </div>
              </div>

              {/* Free Installation Assistance Callout */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Free Remote Setup Assistance via AnyDesk / WhatsApp included!
                </span>
                <a
                  href="#preturi"
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>View Available Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
