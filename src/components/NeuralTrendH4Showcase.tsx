import React, { useState } from 'react';
import {
  BarChart3, Sliders, Download, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react';
import { TRADING_BOTS } from '../data/tradingBots';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

const H4_COPY: Record<Language, {
  badge: string;
  title: string;
  subtitle: string;
  inputsTitle: string;
  inputsSubtitle: string;
  resultsTitle: string;
  resultsSubtitle: string;
  colParam: string;
  colValue: string;
  colRange: string;
  colPass: string;
  colSymbol: string;
  colProfit: string;
  colTrades: string;
  colPF: string;
  colPayoff: string;
  colDD: string;
  colRecovery: string;
  colSharpe: string;
  downloadBtn: string;
  downloadedMsg: string;
  proofResultsLabel: string;
  proofInputsLabel: string;
  clickToZoom: string;
  paramNames: string[];
}> = {
  en: {
    badge: 'MT5 STRATEGY TESTER • H4 (4-HOUR) TIMEFRAME AUDIT',
    title: 'Neural Trend Pro — 4H Results & Input Settings',
    subtitle: 'Verified MetaTrader 5 optimization on the H4 (4-Hour) timeframe using Dual-EMA trend filtering (200 / 50), 20-period Breakout Channel, and dynamic ATR (14) Risk:Reward 1:3.',
    inputsTitle: 'Exact H4 Input Parameters (TREND & ATR)',
    inputsSubtitle: 'Recommended live & evaluation preset configuration',
    resultsTitle: 'H4 Multi-Symbol Optimization Results',
    resultsSubtitle: 'Sorted by Profit Factor & Risk-Adjusted Sharpe Ratio',
    colParam: 'Variable',
    colValue: 'Value',
    colRange: 'Opt. Range',
    colPass: 'Pass',
    colSymbol: 'Symbol',
    colProfit: 'Profit',
    colTrades: 'Trades',
    colPF: 'Profit Factor',
    colPayoff: 'Exp. Payoff',
    colDD: 'Drawdown %',
    colRecovery: 'Recovery',
    colSharpe: 'Sharpe',
    downloadBtn: 'Download H4 Settings (.SET)',
    downloadedMsg: 'NeuralTrendPro_H4_Optimized.set downloaded!',
    proofResultsLabel: 'MT5 Strategy Tester — H4 Optimization Results',
    proofInputsLabel: 'MT5 Inputs — Trend & ATR Parameters',
    clickToZoom: 'Click to inspect full resolution',
    paramNames: [
      'Macro Regime EMA Filter',
      'Medium Direction EMA',
      'Channel Breakout Window',
      'ATR Volatility Period',
      'Stop Loss = 1.5 × ATR',
      'Take Profit = 3 × SL (R:R 1:3)',
      'Risk per Trade (1% Base)'
    ],
  },
  ro: {
    badge: 'MT5 STRATEGY TESTER • AUDIT TIMEFRAME H4 (4 ORE)',
    title: 'Neural Trend Pro — Rezultate & Setări pe Timeframe 4H',
    subtitle: 'Optimizare verificată în MetaTrader 5 pe timeframe-ul H4 (4 Ore) folosind filtrul de trend Dual-EMA (200 / 50), Breakout Canale (20) și risc dinamic ATR (14) cu raport fix R:R 1:3.',
    inputsTitle: 'Setări Exacte Timeframe H4 (PARAMETRI TREND & ATR)',
    inputsSubtitle: 'Configurația recomandată pentru conturi Live și Prop Firm',
    resultsTitle: 'Rezultate Optimizare Multi-Simbol pe H4',
    resultsSubtitle: 'Ordonate după Profit Factor și Sharpe Ratio',
    colParam: 'Parametru',
    colValue: 'Valoare',
    colRange: 'Interval Opt.',
    colPass: 'Pass',
    colSymbol: 'Simbol',
    colProfit: 'Profit',
    colTrades: 'Tranzacții',
    colPF: 'Profit Factor',
    colPayoff: 'Payoff Mediu',
    colDD: 'Drawdown %',
    colRecovery: 'Recovery',
    colSharpe: 'Sharpe',
    downloadBtn: 'Descarcă Setările H4 (.SET)',
    downloadedMsg: 'Fișierul NeuralTrendPro_H4_Optimized.set a fost descărcat!',
    proofResultsLabel: 'MetaTrader 5 — Rezultate Optimizare H4',
    proofInputsLabel: 'MetaTrader 5 — Setări Trend & ATR (Inputs)',
    clickToZoom: 'Apasă pentru mărire la rezoluție completă',
    paramNames: [
      'EMA Filtru Regim Macro',
      'EMA Direcție Medie',
      'Fereastră Breakout Canale',
      'Volatilitate ATR',
      'Stop Loss = 1.5 × ATR',
      'Take Profit = 3 × SL (R:R 1:3)',
      'Risc per trade 1%'
    ],
  },
  hu: {
    badge: 'MT5 STRATEGY TESTER • H4 (4 ÓRÁS) IDŐSÍK AUDIT',
    title: 'Neural Trend Pro — 4H Eredmények és Bemeneti Beállítások',
    subtitle: 'MetaTrader 5-ben igazolt H4 (4 órás) optimalizálás Dual-EMA trendszűrővel (200 / 50), 20 periódusú kitörési csatornával és dinamikus ATR (14) 1:3 hozam/kockázat aránnyal.',
    inputsTitle: 'Pontos H4 Bemeneti Paraméterek (TREND & ATR)',
    inputsSubtitle: 'Ajánlott élő és prop firm konfiguráció',
    resultsTitle: 'H4 Több-Instrumentumos Optimalizálási Eredmények',
    resultsSubtitle: 'Profit Factor és Sharpe-ráta alapján rendezve',
    colParam: 'Paraméter',
    colValue: 'Érték',
    colRange: 'Opt. Tartomány',
    colPass: 'Pass',
    colSymbol: 'Szimbólum',
    colProfit: 'Profit',
    colTrades: 'Kötések',
    colPF: 'Profit Factor',
    colPayoff: 'Várható Hozam',
    colDD: 'Drawdown %',
    colRecovery: 'Recovery',
    colSharpe: 'Sharpe',
    downloadBtn: 'H4 Beállítások Letöltése (.SET)',
    downloadedMsg: 'A NeuralTrendPro_H4_Optimized.set letöltve!',
    proofResultsLabel: 'MT5 Strategy Tester — H4 Eredmények',
    proofInputsLabel: 'MT5 Inputs — Trend & ATR Paraméterek',
    clickToZoom: 'Kattintson a nagyításhoz',
    paramNames: [
      'Makró EMA Szűrő',
      'Közepes Irány EMA',
      'Csatorna Kitörési Ablak',
      'ATR Volatilitás Periódus',
      'Stop Loss = 1.5 × ATR',
      'Take Profit = 3 × SL (R:R 1:3)',
      'Kockázat kötésenként (1% alap)'
    ],
  },
  de: {
    badge: 'MT5 STRATEGY TESTER • H4 (4-STUNDEN) TIMEFRAME-AUDIT',
    title: 'Neural Trend Pro — 4H Ergebnisse & Input-Einstellungen',
    subtitle: 'Verifizierte MetaTrader 5 Optimierung auf dem H4-Zeitrahmen mit Dual-EMA-Trendfilter (200 / 50), 20er Breakout-Kanal und dynamischem ATR (14) 1:3 Chance-Risiko-Verhältnis.',
    inputsTitle: 'Exakte H4-Eingabeparameter (TREND & ATR)',
    inputsSubtitle: 'Empfohlenes Setup für Live- und Prop-Firm-Konten',
    resultsTitle: 'H4 Multi-Symbol Optimierungsergebnisse',
    resultsSubtitle: 'Sortiert nach Profit Factor und Sharpe Ratio',
    colParam: 'Parameter',
    colValue: 'Wert',
    colRange: 'Opt.-Bereich',
    colPass: 'Pass',
    colSymbol: 'Symbol',
    colProfit: 'Profit',
    colTrades: 'Trades',
    colPF: 'Profit Factor',
    colPayoff: 'Erw. Payoff',
    colDD: 'Drawdown %',
    colRecovery: 'Recovery',
    colSharpe: 'Sharpe',
    downloadBtn: 'H4 Einstellungen Herunterladen (.SET)',
    downloadedMsg: 'NeuralTrendPro_H4_Optimized.set heruntergeladen!',
    proofResultsLabel: 'MT5 Strategy Tester — H4 Optimierungsergebnisse',
    proofInputsLabel: 'MT5 Inputs — Trend & ATR Parameter',
    clickToZoom: 'Zum Vergrößern klicken',
    paramNames: [
      'Makro-Regime EMA Filter',
      'Mittlere Richtung EMA',
      'Kanal-Breakout-Fenster',
      'ATR Volatilitätsperiode',
      'Stop Loss = 1.5 × ATR',
      'Take Profit = 3 × SL (R:R 1:3)',
      'Risiko pro Trade (1% Basis)'
    ],
  },
  es: {
    badge: 'MT5 STRATEGY TESTER • AUDITORÍA TIMEFRAME H4 (4 HORAS)',
    title: 'Neural Trend Pro — Resultados y Configuración en 4H',
    subtitle: 'Optimización verificada en MetaTrader 5 en temporalidad H4 (4 Horas) con filtro macro Dual-EMA (200 / 50), ruptura de canales (20) y ATR (14) con ratio fijo R:R 1:3.',
    inputsTitle: 'Parámetros Exactos H4 (TREND & ATR)',
    inputsSubtitle: 'Configuración recomendada para cuentas Live y Prop Firms',
    resultsTitle: 'Resultados de Optimización Multi-Símbolo H4',
    resultsSubtitle: 'Ordenado por Profit Factor y Ratio de Sharpe',
    colParam: 'Parámetro',
    colValue: 'Valor',
    colRange: 'Rango Opt.',
    colPass: 'Pass',
    colSymbol: 'Símbolo',
    colProfit: 'Beneficio',
    colTrades: 'Operaciones',
    colPF: 'Profit Factor',
    colPayoff: 'Payoff Esp.',
    colDD: 'Drawdown %',
    colRecovery: 'Recovery',
    colSharpe: 'Sharpe',
    downloadBtn: 'Descargar Ajustes H4 (.SET)',
    downloadedMsg: '¡NeuralTrendPro_H4_Optimized.set descargado!',
    proofResultsLabel: 'MT5 Strategy Tester — Resultados H4',
    proofInputsLabel: 'MT5 Inputs — Parámetros Trend & ATR',
    clickToZoom: 'Haz clic para ampliar',
    paramNames: [
      'Filtro EMA Régimen Macro',
      'EMA Dirección Media',
      'Ventana Breakout Canales',
      'Volatilidad ATR',
      'Stop Loss = 1.5 × ATR',
      'Take Profit = 3 × SL (R:R 1:3)',
      'Riesgo por operación (1% base)'
    ],
  },
  zh: {
    badge: 'MT5 策略测试器 • H4（4小时）周期实测审计',
    title: 'Neural Trend Pro — 4小时 (H4) 优化成绩与参数设置',
    subtitle: 'MetaTrader 5 H4 周期官方优化验证：采用双均线趋势过滤 (EMA 200 / 50)、20 周期通道突破与动态 ATR (14) 止损，固定 1:3 盈亏比。',
    inputsTitle: 'H4 精准输入参数 (TREND & ATR)',
    inputsSubtitle: '实盘与自营资金考核推荐预设',
    resultsTitle: 'H4 多品种优化实测表现',
    resultsSubtitle: '按盈利因子与夏普比率排序',
    colParam: '参数名称',
    colValue: '设定值',
    colRange: '优化范围',
    colPass: '轮次',
    colSymbol: '交易品种',
    colProfit: '净利润',
    colTrades: '总笔数',
    colPF: '盈利因子',
    colPayoff: '预期收益',
    colDD: '最大回撤',
    colRecovery: '恢复因子',
    colSharpe: '夏普比率',
    downloadBtn: '下载 H4 专属配置文件 (.SET)',
    downloadedMsg: 'NeuralTrendPro_H4_Optimized.set 已下载！',
    proofResultsLabel: 'MT5 策略测试器 — H4 优化结果截图',
    proofInputsLabel: 'MT5 参数窗口 — Trend & ATR 输入设定',
    clickToZoom: '点击查看大图',
    paramNames: [
      '宏观周期过滤 EMA',
      '中期趋势方向 EMA',
      '通道突破窗口周期',
      'ATR 波动率周期',
      '止损倍数 (1.5 × ATR)',
      '止盈倍数 (3 × SL / R:R 1:3)',
      '单笔交易风险比例 (1%基准)'
    ],
  },
};

export const NeuralTrendH4Showcase: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language } = useLanguage();
  const copy = H4_COPY[language] || H4_COPY.en;
  const neuralBot = TRADING_BOTS.find((b) => b.id === 'neural-trend-pro');
  const h4 = neuralBot?.h4Optimization;

  const [downloaded, setDownloaded] = useState(false);

  if (!h4) return null;

  const handleDownloadSet = () => {
    const content = `;+------------------------------------------------------------------+
;| Nexus Quant Systems - Neural Trend Pro (H4 4-Hour Verified Preset)
;| Tested on MetaTrader 5 Strategy Tester
;| Top Passes: INTC (PF 2.96, DD 2.86%), MSFT (PF 1.65, DD 2.39%)
;+------------------------------------------------------------------+
InpTimeframe=PERIOD_H4
InpEMAMacroFilter=200
InpEMAMediumDir=50
InpBreakoutChannelWindow=20
InpATRPeriod=14
InpStopLossATRMultiplier=1.5
InpTakeProfitSLMultiplier=3.0
InpRiskPercentPerTrade=0.5
InpUseHardStop=true
InpMaxSpreadPoints=30
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NeuralTrendPro_H4_Optimized.set';
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <div className={compact ? 'space-y-5' : 'mt-12 rounded-2xl bg-slate-900/90 border border-cyan-800/60 shadow-2xl p-5 md:p-8'}>
      {/* Section Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/70 mb-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copy.badge}</span>
          </div>
          <h3 className={`${compact ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'} font-extrabold text-white tracking-tight`}>
            {copy.title}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDownloadSet}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{copy.downloadBtn}</span>
          </button>
          {downloaded && (
            <div className="text-[11px] font-mono text-emerald-400 mt-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{copy.downloadedMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Results + Inputs Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-6">
        {/* Left: Exact H4 Input Parameters */}
        <div className="xl:col-span-5 rounded-xl bg-slate-950/90 border border-slate-800 p-4 md:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>{copy.inputsTitle}</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{copy.inputsSubtitle}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                H4 • 1:3 R:R
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th className="py-2 pr-2">{copy.colParam}</th>
                    <th className="py-2 px-2 text-right text-cyan-300">{copy.colValue}</th>
                    <th className="py-2 pl-2 text-right">{copy.colRange}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {h4.inputs.map((inp, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2 pr-2 text-slate-300 font-sans text-xs">
                        {copy.paramNames[idx] || inp.name}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-cyan-400">
                        {inp.value}
                      </td>
                      <td className="py-2 pl-2 text-right text-[10px] text-slate-500">
                        {inp.start} → {inp.stop} ({inp.step})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Stop Loss = 1.5 × ATR • Take Profit = 3 × SL (1:3) • 0.5% Live Risk</span>
          </div>
        </div>

        {/* Right: Verified H4 Strategy Tester Optimization Results */}
        <div className="xl:col-span-7 rounded-xl bg-slate-950/90 border border-slate-800 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>{copy.resultsTitle}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{copy.resultsSubtitle}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold">
              MT5 Audited
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                  <th className="py-2 pr-2">{copy.colPass}</th>
                  <th className="py-2 px-2">{copy.colSymbol}</th>
                  <th className="py-2 px-2 text-right">{copy.colProfit}</th>
                  <th className="py-2 px-2 text-right">{copy.colTrades}</th>
                  <th className="py-2 px-2 text-right">{copy.colPF}</th>
                  <th className="py-2 px-2 text-right">{copy.colPayoff}</th>
                  <th className="py-2 px-2 text-right">{copy.colDD}</th>
                  <th className="py-2 px-2 text-right">{copy.colRecovery}</th>
                  <th className="py-2 pl-2 text-right">{copy.colSharpe}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {h4.results.map((row) => {
                  const isHighDD = parseFloat(row.drawdownPct) > 15;
                  return (
                    <tr
                      key={row.pass}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        row.pass === 11 ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="py-2 pr-2 text-slate-500">#{row.pass}</td>
                      <td className="py-2 px-2 font-bold text-white">{row.symbol}</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-400">{row.profit}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{row.trades}</td>
                      <td className="py-2 px-2 text-right font-bold text-cyan-300">{row.profitFactor}</td>
                      <td className="py-2 px-2 text-right text-slate-300">{row.expectedPayoff}</td>
                      <td className={`py-2 px-2 text-right font-bold ${isHighDD ? 'text-amber-400' : 'text-emerald-300'}`}>
                        {row.drawdownPct}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-300">{row.recoveryFactor}</td>
                      <td className="py-2 pl-2 text-right font-bold text-purple-300">{row.sharpeRatio}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
