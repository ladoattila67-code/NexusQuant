import React, { useState, useEffect } from 'react';
import { TrendingUp, ShieldAlert, Award, ExternalLink, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from 'lucide-react';
import { TRADING_BOTS } from '../data/tradingBots';
import { TradePosition } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

export const LivePerformanceSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedBotId, setSelectedBotId] = useState<string>('aegis-scalper-x');
  const [activeTimeframe, setActiveTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [livePnlOffset, setLivePnlOffset] = useState<number>(0);
  const [recentTrades, setRecentTrades] = useState<TradePosition[]>(TRADING_BOTS[0].recentTrades);

  const selectedBot = TRADING_BOTS.find((b) => b.id === selectedBotId) || TRADING_BOTS[0];

  // Simulate real-time ticking of current floating P&L and micro movements
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePnlOffset((prev) => {
        const delta = (Math.random() * 8 - 3.8);
        return Number((prev + delta).toFixed(2));
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRecentTrades(selectedBot.recentTrades);
  }, [selectedBotId, selectedBot]);

  // Equity curve data points based on timeframe
  const equityPoints = [
    { label: 'Jan', value: 10000 },
    { label: 'Feb', value: 11480 },
    { label: 'Mar', value: 13100 },
    { label: 'Apr', value: 15300 },
    { label: 'May', value: 17250 },
    { label: 'Jun', value: 20420 },
    { label: 'Jul', value: 23200 },
    { label: 'Aug', value: 26950 },
    { label: 'Sep', value: 30700 },
    { label: 'Oct', value: 35500 },
    { label: 'Nov', value: 38850 + livePnlOffset }
  ];

  const minValue = 9000;
  const maxValue = 42000;
  const chartHeight = 220;
  const chartWidth = 720;

  // Build SVG path
  const pointsString = equityPoints
    .map((pt, i) => {
      const x = (i / (equityPoints.length - 1)) * chartWidth;
      const y = chartHeight - ((pt.value - minValue) / (maxValue - minValue)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `0,${chartHeight} ${pointsString} ${chartWidth},${chartHeight}`;

  return (
    <section id="performanta-live" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.performance.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {t.performance.title}
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl text-base">
              {t.performance.subtitle}
            </p>
          </div>

          {/* Verification Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 font-mono">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Myfxbook Audited</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 font-mono">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Darwinex Tracked</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Tickmill Live ECN</span>
            </div>
          </div>
        </div>

        {/* Bot selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {TRADING_BOTS.map((bot) => (
            <button
              key={bot.id}
              onClick={() => setSelectedBotId(bot.id)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                selectedBotId === bot.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{bot.name}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  selectedBotId === bot.id
                    ? 'bg-slate-950 text-emerald-400'
                    : 'bg-slate-800 text-emerald-400'
                }`}
              >
                +{bot.avgMonthlyReturn}%/mo
              </span>
            </button>
          ))}
        </div>

        {/* Quant KPI Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">{t.performance.monthlyReturn}</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              +{selectedBot.avgMonthlyReturn}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Monthly compounded</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">{t.performance.winRate}</div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
              {selectedBot.winRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{selectedBot.totalTrades} total orders</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">{t.hero.statDrawdown}</div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
              {selectedBot.maxDrawdown}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Historical peak-to-valley</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">{t.performance.profitFactor}</div>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {selectedBot.profitFactor}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Gross profit / Loss</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">{t.performance.sharpeRatio}</div>
            <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
              {selectedBot.sharpeRatio}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Risk-adjusted return</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <div className="text-xs text-slate-400 font-medium">Risk Profile</div>
            <div className="text-lg font-bold text-slate-200 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              {selectedBot.riskLevel}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              {selectedBot.propFirmCompatible ? '✓ Prop Firm Ready' : 'Standard Accounts'}
            </div>
          </div>
        </div>

        {/* Main Chart + Live Trades Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Equity Curve SVG Chart */}
          <div className="lg:col-span-8 p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    Account Equity Growth Curve
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl md:text-3xl font-extrabold font-mono text-white">
                    €{(38850 + livePnlOffset).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-400 flex items-center">
                    <ArrowUpRight className="w-4 h-4" />
                    +288.5% Net Profit
                  </span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      activeTimeframe === tf
                        ? 'bg-slate-800 text-cyan-400 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative w-full h-[230px] my-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke="#1e293b"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Area under curve */}
                <polygon points={areaString} fill="url(#equityGrad)" />

                {/* Polyline */}
                <polyline
                  points={pointsString}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Latest point pulsing marker */}
                {equityPoints.length > 0 && (() => {
                  const lastX = chartWidth;
                  const lastY =
                    chartHeight -
                    (((equityPoints[equityPoints.length - 1].value) - minValue) / (maxValue - minValue)) *
                      chartHeight;
                  return (
                    <g>
                      <circle cx={lastX} cy={lastY} r="7" fill="#06b6d4" opacity="0.4" className="animate-ping" />
                      <circle cx={lastX} cy={lastY} r="4.5" fill="#22d3ee" stroke="#0f172a" strokeWidth="2" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Monthly return heat table snippet */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-2.5 flex items-center justify-between">
                <span>Verified Monthly Returns (Current Year):</span>
                <span className="text-[11px] font-mono text-emerald-400">Avg: +{selectedBot.avgMonthlyReturn}%</span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                {selectedBot.historicalReturns.map((hr, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-center"
                  >
                    <div className="text-[10px] text-slate-500 font-mono">{hr.month}</div>
                    <div className="text-xs font-bold font-mono text-emerald-400 mt-0.5">
                      +{hr.returnPct}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Executed Trades Feed */}
          <div className="lg:col-span-4 p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Latest Open Positions
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Live API Feed</span>
              </div>

              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            trade.type === 'BUY'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {trade.type}
                        </span>
                        <span className="font-bold text-white text-xs font-mono">{trade.symbol}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{trade.lots} lot</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold font-mono text-emerald-400 flex items-center justify-end gap-0.5">
                          <ArrowUpRight className="w-3 h-3" />+€{trade.pnl}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">+{trade.pips} pips</div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Entry: {trade.openPrice}</span>
                      <span>TP: {trade.takeProfit}</span>
                      <span className="text-slate-400">{trade.openTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Audit Link Box */}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-800/40 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Detailed Myfxbook Report</div>
                  <div className="text-[11px] text-slate-400">100% verified live track record</div>
                </div>
                <a
                  href="#catalog-roboti"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-cyan-400 transition-all"
                >
                  <span>Explore</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
