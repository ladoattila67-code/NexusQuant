import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, Zap, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const ProfitCalculator: React.FC = () => {
  const { t, language } = useLanguage();
  const [initialCapital, setInitialCapital] = useState<number>(5000);
  const [months, setMonths] = useState<number>(12);
  const [monthlyReturnPct, setMonthlyReturnPct] = useState<number>(14.8);
  const [isCompounding, setIsCompounding] = useState<boolean>(true);

  // Calculate results
  const calculation = useMemo(() => {
    let balance = initialCapital;
    const monthlyData: { month: number; balance: number; profit: number }[] = [];
    const monthlyRate = monthlyReturnPct / 100;

    for (let m = 1; m <= months; m++) {
      if (isCompounding) {
        const profit = balance * monthlyRate;
        balance += profit;
        monthlyData.push({ month: m, balance: Math.round(balance), profit: Math.round(profit) });
      } else {
        const profit = initialCapital * monthlyRate;
        balance += profit;
        monthlyData.push({ month: m, balance: Math.round(balance), profit: Math.round(profit) });
      }
    }

    const totalProfit = balance - initialCapital;
    const multiplier = (balance / initialCapital).toFixed(1);
    const avgMonthlyWithdrawal = Math.round(totalProfit / months);

    return {
      finalBalance: Math.round(balance),
      totalProfit: Math.round(totalProfit),
      multiplier,
      avgMonthlyWithdrawal,
      monthlyData
    };
  }, [initialCapital, months, monthlyReturnPct, isCompounding]);

  const presetStrategies = [
    { name: 'AR-Nexus', rate: 19.2, risk: 'Flagship SMC (3.8% DD)' },
    { name: 'Conservative (Aegis Scalper)', rate: 12.0, risk: 'Min Risk (<4% DD)' },
    { name: 'Balanced (Nexus Quant Core)', rate: 14.8, risk: 'Recommended (5% DD)' },
    { name: 'Aggressive (Neural Trend)', rate: 19.4, risk: 'Fast Growth (7% DD)' }
  ];

  return (
    <section id="calculator-profit" className="py-16 md:py-24 bg-slate-900/50 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.calculator.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.calculator.title}
          </h2>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Panel */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            {/* Initial Capital Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> {t.calculator.initialCapital}
                </label>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {initialCapital.toLocaleString(language === 'en' ? 'en-US' : language)} €
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                <span>500 €</span>
                <span>10,000 €</span>
                <span>25,000 €</span>
                <span>50,000 €</span>
              </div>
            </div>

            {/* Time Horizon Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" /> {t.calculator.periodMonths}
                </label>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  {months} M
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                step="1"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                <span>1 lună</span>
                <span>6 luni</span>
                <span>12 luni (1 an)</span>
                <span>24 luni</span>
                <span>36 luni</span>
              </div>
            </div>

            {/* Strategy Preset Selector */}
            <div>
              <label className="text-sm font-semibold text-slate-300 block mb-2">
                Selectează Strategia / Rata Lunară Țintă:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presetStrategies.map((strat) => (
                  <button
                    key={strat.name}
                    type="button"
                    onClick={() => setMonthlyReturnPct(strat.rate)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      monthlyReturnPct === strat.rate
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{strat.rate}% / lună</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{strat.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-emerald-400 mt-1 font-mono">{strat.risk}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reinvest Toggle */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Reinvestire Profit (Dobândă Compusă)
                </div>
                <div className="text-[11px] text-slate-400">
                  {isCompounding
                    ? 'Profitul lunar se reinvestește automat pentru creștere exponențială'
                    : 'Profitul lunar este retras constant la finalul fiecărei luni'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompounding(!isCompounding)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  isCompounding ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    isCompounding ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Results Summary Display */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-900/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div>
                <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  {t.calculator.badge}
                </span>
                <div className="mt-2">
                  <div className="text-xs text-slate-400">{t.calculator.projectedBalance}:</div>
                  <div className="text-4xl md:text-5xl font-black font-mono text-white mt-1">
                    {calculation.finalBalance.toLocaleString(language === 'en' ? 'en-US' : language)} €
                  </div>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-medium">{t.calculator.totalProfit}</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    +{calculation.totalProfit.toLocaleString(language === 'en' ? 'en-US' : language)} €
                  </div>
                  <div className="text-[11px] text-emerald-400/80 font-mono mt-0.5">
                    {calculation.multiplier}x
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="text-xs text-slate-400 font-medium">{t.calculator.monthlyReturn}</div>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                    ~{calculation.avgMonthlyWithdrawal.toLocaleString(language === 'en' ? 'en-US' : language)} €
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">/ mo</div>
                </div>
              </div>

              {/* Trust & Risk Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {t.performance.auditedNote}
                </span>
              </div>

              <a
                href="#catalog-roboti"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
              >
                <span>{t.marketplace.btnBuy}</span>
                <TrendingUp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
