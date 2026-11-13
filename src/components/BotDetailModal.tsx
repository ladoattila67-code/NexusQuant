import React from 'react';
import { X, ShieldCheck, CheckCircle2, TrendingUp, Cpu, ArrowRight, Zap } from 'lucide-react';
import { TradingBot } from '../types';
import { NeuralTrendH4Showcase } from './NeuralTrendH4Showcase';
import { QuantumGridShowcase } from './QuantumGridShowcase';
import { useLanguage } from '../i18n/LanguageContext';

interface BotDetailModalProps {
  bot: TradingBot | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (bot: TradingBot) => void;
  onTryDemo?: (bot: TradingBot) => void;
}

export const BotDetailModal: React.FC<BotDetailModalProps> = ({
  bot,
  isOpen,
  onClose,
  onBuy,
  onTryDemo
}) => {
  const { t } = useLanguage();
  if (!isOpen || !bot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 bg-slate-950/90 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                {bot.categoryLabel}
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                ✓ {bot.verifiedPeriod}
              </span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">{bot.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{bot.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">{t.performance.monthlyReturn}</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
                +{bot.avgMonthlyReturn}%
              </div>
              <div className="text-[10px] text-slate-500">verified monthly avg</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">{t.performance.winRate}</div>
              <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-0.5">
                {bot.winRate}%
              </div>
              <div className="text-[10px] text-slate-500">{bot.totalTrades} trades</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">{t.hero.statDrawdown}</div>
              <div className="text-2xl font-extrabold font-mono text-amber-400 mt-0.5">
                {bot.maxDrawdown}%
              </div>
              <div className="text-[10px] text-slate-500">Strictly controlled risk</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">{t.performance.profitFactor}</div>
              <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                {bot.profitFactor}
              </div>
              <div className="text-[10px] text-slate-500">Sharpe: {bot.sharpeRatio}</div>
            </div>
          </div>

          {/* Description & Algorithm Architecture */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Mathematical Architecture & Operating Mode
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {bot.description}
            </p>
            <div className="mt-3 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
              <span className="font-semibold text-white">Execution Logic: </span>
              {bot.algorithmSummary}
            </div>
          </div>

          {/* Dedicated H4 Strategy Tester Results & Settings when present */}
          {bot.h4Optimization && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-800/60">
              <NeuralTrendH4Showcase compact />
            </div>
          )}

          {/* Dedicated Quantum Grid Strategy Tester Results & Settings when present */}
          {bot.gridOptimization && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-800/60">
              <QuantumGridShowcase compact />
            </div>
          )}

          {/* Key Advantages / Features */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Key Features & Safety Filters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bot.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Returns Heat Table */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Verified Monthly Returns History
              </span>
              <span className="text-xs font-mono text-emerald-400">Avg: +{bot.avgMonthlyReturn}%</span>
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {bot.historicalReturns.map((hr, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center"
                >
                  <div className="text-[10px] text-slate-500 font-mono">{hr.month} {hr.year}</div>
                  <div className="text-sm font-black font-mono text-emerald-400 mt-0.5">
                    +{hr.returnPct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility & Prop Firm Support */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">Platform & Prop Firm Compatibility</div>
                <div className="text-slate-400 mt-0.5">
                  Supported: {bot.platforms.join(', ')} • {bot.propFirmCompatible ? '100% compliant with FTMO, TPT, Lucid, FundedNext' : 'Optimized for personal live accounts'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 md:p-6 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">{t.marketplace.lifetime}</div>
            <div className="text-2xl font-black font-mono text-white">{bot.priceLifetime} €</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              {t.common.close}
            </button>
            {onTryDemo && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTryDemo(bot);
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/80 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.marketplace.btnDemo}</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onBuy(bot);
              }}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>{t.marketplace.btnBuy}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
