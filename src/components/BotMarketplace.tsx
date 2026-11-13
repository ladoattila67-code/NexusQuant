import React, { useState, useMemo } from 'react';
import { getAllTradingBots } from '../data/tradingBots';
import { TradingBot } from '../types';
import { Search, Filter, ShieldCheck, ArrowRight, Eye, Sparkles, Cpu, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { NeuralTrendH4Showcase } from './NeuralTrendH4Showcase';
import { QuantumGridShowcase } from './QuantumGridShowcase';

interface BotMarketplaceProps {
  bots?: TradingBot[];
  onSelectBotForModal: (bot: TradingBot) => void;
  onSelectBotForCheckout: (bot: TradingBot, plan: 'lifetime' | 'monthly') => void;
  onTryDemo?: (bot: TradingBot) => void;
}

export const BotMarketplace: React.FC<BotMarketplaceProps> = ({
  bots,
  onSelectBotForModal,
  onSelectBotForCheckout,
  onTryDemo
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'return' | 'winrate' | 'drawdown' | 'trades'>('return');

  const availableBots = bots && bots.length > 0 ? bots : getAllTradingBots();

  const categories = [
    { id: 'all', label: t.marketplace.filterAll },
    { id: 'breakout', label: t.marketplace.filterSMC },
    { id: 'scalping', label: t.marketplace.filterScalping },
    { id: 'trend', label: t.marketplace.filterTrend },
    { id: 'grid', label: t.marketplace.filterGrid },
  ];

  const filteredBots = useMemo(() => {
    return availableBots.filter((bot) => {
      const matchesCategory = selectedCategory === 'all' || bot.category === selectedCategory;
      const matchesQuery =
        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bot.marketPairs.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === 'return') return b.avgMonthlyReturn - a.avgMonthlyReturn;
      if (sortBy === 'winrate') return b.winRate - a.winRate;
      if (sortBy === 'drawdown') return a.maxDrawdown - b.maxDrawdown; // lower is better
      if (sortBy === 'trades') return b.totalTrades - a.totalTrades;
      return 0;
    });
  }, [availableBots, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog-roboti" className="py-16 md:py-24 bg-slate-950/60 relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.marketplace.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {t.marketplace.title}
          </h2>
          <p className="text-slate-400 mt-3 text-base md:text-lg">
            {t.marketplace.subtitle}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-8 space-y-4">
          {/* Categories Tab Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap border ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bot name, gold, nasdaq, pairs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="return">Monthly Return (High to Low)</option>
                <option value="winrate">Win Rate %</option>
                <option value="drawdown">Lowest Drawdown</option>
                <option value="trades">Total Trades</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => (
            <div
              key={bot.id}
              className={`rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group ${
                bot.isPopular
                  ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Top */}
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {bot.categoryLabel}
                  </span>

                  {bot.badge && (
                    <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      {bot.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {bot.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {bot.tagline}
                </p>

                {/* Market pairs tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {bot.marketPairs.map((pair, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-semibold"
                    >
                      {pair}
                    </span>
                  ))}
                </div>

                {/* Quant Stats Dashboard Grid inside Card */}
                <div className="grid grid-cols-2 gap-2.5 mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.performance.monthlyReturn}</div>
                    <div className="text-lg font-extrabold font-mono text-emerald-400">
                      +{bot.avgMonthlyReturn}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Win Rate</div>
                    <div className="text-lg font-extrabold font-mono text-cyan-400">
                      {bot.winRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Max Drawdown</div>
                    <div className="text-sm font-bold font-mono text-amber-400">
                      {bot.maxDrawdown}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-mono">Profit Factor</div>
                    <div className="text-sm font-bold font-mono text-white">
                      {bot.profitFactor}
                    </div>
                  </div>
                </div>

                {/* Platform support pills */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {bot.platforms.map((p) => (
                      <span
                        key={p}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 font-semibold"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  {bot.propFirmCompatible && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Prop Firm Ready
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Pricing & Actions */}
              <div className="p-5 md:p-6 bg-slate-950/90 border-t border-slate-800/80">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">{t.marketplace.lifetime}</div>
                    <div className="text-2xl font-extrabold font-mono text-white">
                      {bot.priceLifetime} €
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">{t.marketplace.btnRent}</div>
                    <div className="text-sm font-bold font-mono text-slate-300">
                      {bot.priceMonthly} €<span className="text-[11px] text-slate-500">{t.marketplace.monthly}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectBotForModal(bot)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.marketplace.btnDetails}</span>
                  </button>

                  <button
                    onClick={() => onSelectBotForCheckout(bot, 'lifetime')}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <span>{t.marketplace.btnBuy}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {onTryDemo && (
                  <button
                    type="button"
                    onClick={() => onTryDemo(bot)}
                    className="mt-2 w-full py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/70 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.marketplace.btnDemo}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated H4 (4-Hour) Neural Trend Pro Results & Settings Section on Page */}
        <NeuralTrendH4Showcase />

        {/* Dedicated Quantum Grid Sentinel Results & Settings Section on Page */}
        <QuantumGridShowcase />
      </div>
    </section>
  );
};
