import React, { useState } from 'react';
import {
  BarChart3, Sliders, Download, CheckCircle2, ShieldCheck, Layers
} from 'lucide-react';
import { TRADING_BOTS } from '../data/tradingBots';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

const GRID_COPY: Record<Language, {
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
  safetyBanner: string;
  downloadBtn: string;
  downloadedMsg: string;
  proofResultsLabel: string;
  proofInputsLabel: string;
  clickToZoom: string;
  paramNames: string[];
}> = {
  en: {
    badge: 'MT5 STRATEGY TESTER • DYNAMIC GRID & 3% HARD-CAP AUDIT',
    title: 'Quantum Grid Sentinel — Verified Results & Safety Settings',
    subtitle: 'MetaTrader 5 Strategy Tester audit enforcing Prop Firm Safety Guardrails: 3% Hard-Stop Drawdown Cap, max 4 grid levels, 30-pip spacing, and 40-pip Basket Take Profit.',
    inputsTitle: 'Exact Input Settings (PROP FIRM SAFETY GUARD)',
    inputsSubtitle: 'Zero-liquidation grid cap & basket target preset',
    resultsTitle: 'Multi-Asset MT5 Optimization Results',
    resultsSubtitle: 'Peak Profit Factor 8.21 on XAU/USD (+$67,919.40 across 569 trades)',
    colParam: 'Variable',
    colValue: 'Value',
    colRange: 'Opt. Range',
    colPass: 'Pass',
    colSymbol: 'Symbol',
    colProfit: 'Profit ($)',
    colTrades: 'Trades',
    colPF: 'Profit Factor',
    colPayoff: 'Exp. Payoff',
    safetyBanner: 'Hard Drawdown Cap: 3% • Max 4 Grid Levels • Step: 30 pips • Basket TP: 40 pips',
    downloadBtn: 'Download Grid Sentinel (.SET)',
    downloadedMsg: 'QuantumGridSentinel_Optimized.set downloaded!',
    proofResultsLabel: 'MT5 Strategy Tester — Quantum Grid Optimization Results',
    proofInputsLabel: 'MT5 Inputs — Prop Firm Safety & Grid Settings',
    clickToZoom: 'Click to inspect full resolution',
    paramNames: [
      'InpLicenseKey',
      'InpMagicNumber',
      'Hard Stop Drawdown (%) Cap',
      'Max 4 Grid Levels (Zero Liquidation)',
      'Initial Base Lot Size',
      'Distance Between Levels (pips)',
      'Basket Take Profit (pips)'
    ],
  },
  ro: {
    badge: 'MT5 STRATEGY TESTER • AUDIT GRID DINAMIC & HARD-CAP 3%',
    title: 'Quantum Grid Sentinel — Rezultate & Setări Verificate',
    subtitle: 'Optimizare auditată în MetaTrader 5 cu Setări de Siguranță Prop Firm: Hard Stop Drawdown la 3%, maxim 4 niveluri de grid, pas de 30 pips și Take Profit pe coș de 40 pips.',
    inputsTitle: 'Setări Exacte Input (SIGURANȚĂ PROP FIRM)',
    inputsSubtitle: 'Protecție anti-lichidare și închidere automată pe coș',
    resultsTitle: 'Rezultate Optimizare Multi-Simbol MT5',
    resultsSubtitle: 'Profit Factor maxim 8.21 pe XAUUSD (+67,919.40 $ din 569 tranzacții)',
    colParam: 'Parametru',
    colValue: 'Valoare',
    colRange: 'Interval Opt.',
    colPass: 'Pass',
    colSymbol: 'Simbol',
    colProfit: 'Profit ($)',
    colTrades: 'Tranzacții',
    colPF: 'Profit Factor',
    colPayoff: 'Payoff Mediu',
    safetyBanner: 'Hard Stop Drawdown: 3% • Maxim 4 Niveluri • Pas: 30 pips • Basket TP: 40 pips',
    downloadBtn: 'Descarcă Setările Grid (.SET)',
    downloadedMsg: 'Fișierul QuantumGridSentinel_Optimized.set a fost descărcat!',
    proofResultsLabel: 'MetaTrader 5 — Rezultate Optimizare Quantum Grid Sentinel',
    proofInputsLabel: 'MetaTrader 5 — Setări Siguranță Prop Firm (Inputs)',
    clickToZoom: 'Apasă pentru mărire la rezoluție completă',
    paramNames: [
      'InpLicenseKey (Cheie Licență)',
      'InpMagicNumber',
      'HARD STOP DRAWDOWN (%): Închide tot la',
      'Maxim 4 niveluri de grid (Zero risc lichidare)',
      'Lot inițial de bază',
      'Distanță între niveluri (pips)',
      'Take Profit pe întreg coșul de poziții (pips)'
    ],
  },
  hu: {
    badge: 'MT5 STRATEGY TESTER • DINAMIKUS GRID & 3% HARD-CAP AUDIT',
    title: 'Quantum Grid Sentinel — Igazolt Eredmények és Beállítások',
    subtitle: 'MetaTrader 5 Strategy Tester teszt Prop Firm biztonsági védelemmel: 3%-os Hard-Stop Drawdown limit, maximum 4 grid szint, 30 pip lépésköz és 40 pip kosár Take Profit.',
    inputsTitle: 'Pontos Bemeneti Beállítások (PROP FIRM VÉDELEM)',
    inputsSubtitle: 'Likvidálás elleni védelem és kosár TP beállítás',
    resultsTitle: 'Több-Instrumentumos MT5 Optimalizálási Eredmények',
    resultsSubtitle: 'Csúcs Profit Factor: 8.21 XAUUSD-n (+67,919.40 $ 569 kötésből)',
    colParam: 'Paraméter',
    colValue: 'Érték',
    colRange: 'Opt. Tartomány',
    colPass: 'Pass',
    colSymbol: 'Szimbólum',
    colProfit: 'Profit ($)',
    colTrades: 'Kötések',
    colPF: 'Profit Factor',
    colPayoff: 'Várható Hozam',
    safetyBanner: 'Hard Drawdown Limit: 3% • Max 4 Grid Szint • Lépés: 30 pip • Kosár TP: 40 pip',
    downloadBtn: 'Grid Beállítások Letöltése (.SET)',
    downloadedMsg: 'A QuantumGridSentinel_Optimized.set letöltve!',
    proofResultsLabel: 'MT5 Strategy Tester — Quantum Grid Eredmények',
    proofInputsLabel: 'MT5 Inputs — Prop Firm Biztonsági Beállítások',
    clickToZoom: 'Kattintson a teljes méretű nézethez',
    paramNames: [
      'InpLicenseKey',
      'InpMagicNumber',
      'Hard Stop Drawdown (%) Limit',
      'Max 4 Grid Szint (Nulla likvidálási kockázat)',
      'Kezdő alap lotméret',
      'Szintek közötti távolság (pip)',
      'Teljes pozíciókosár Take Profit (pip)'
    ],
  },
  de: {
    badge: 'MT5 STRATEGY TESTER • DYNAMISCHES GRID & 3% HARD-CAP AUDIT',
    title: 'Quantum Grid Sentinel — Verifizierte Ergebnisse & Einstellungen',
    subtitle: 'MetaTrader 5 Strategy Tester Audit mit Prop-Firm-Schutz: 3% Hard-Stop Drawdown Cap, maximal 4 Grid-Level, 30 Pips Abstand und 40 Pips Basket Take Profit.',
    inputsTitle: 'Exakte Input-Parameter (PROP FIRM SICHERHEIT)',
    inputsSubtitle: 'Null-Liquidations-Schutz & Basket-TP-Konfiguration',
    resultsTitle: 'Multi-Asset MT5 Optimierungsergebnisse',
    resultsSubtitle: 'Spitzen-Profit-Factor 8.21 auf XAUUSD (+67.919,40 $ aus 569 Trades)',
    colParam: 'Parameter',
    colValue: 'Wert',
    colRange: 'Opt.-Bereich',
    colPass: 'Pass',
    colSymbol: 'Symbol',
    colProfit: 'Profit ($)',
    colTrades: 'Trades',
    colPF: 'Profit Factor',
    colPayoff: 'Erw. Payoff',
    safetyBanner: 'Hard Drawdown Cap: 3% • Max 4 Level • Abstand: 30 Pips • Basket TP: 40 Pips',
    downloadBtn: 'Grid Einstellungen Herunterladen (.SET)',
    downloadedMsg: 'QuantumGridSentinel_Optimized.set heruntergeladen!',
    proofResultsLabel: 'MT5 Strategy Tester — Quantum Grid Ergebnisse',
    proofInputsLabel: 'MT5 Inputs — Prop Firm Sicherheitsparameter',
    clickToZoom: 'Zum Vergrößern klicken',
    paramNames: [
      'InpLicenseKey',
      'InpMagicNumber',
      'Hard Stop Drawdown (%) Cap',
      'Max 4 Grid-Level (Kein Liquidationsrisiko)',
      'Basis-Start-Lotgröße',
      'Abstand zwischen Leveln (Pips)',
      'Basket Take Profit (Pips)'
    ],
  },
  es: {
    badge: 'MT5 STRATEGY TESTER • AUDITORÍA GRID DINÁMICO & HARD-CAP 3%',
    title: 'Quantum Grid Sentinel — Resultados y Ajustes Verificados',
    subtitle: 'Auditoría en MetaTrader 5 Strategy Tester con Protección Prop Firm: Límite Hard-Stop Drawdown del 3%, máximo 4 niveles de grid, paso de 30 pips y Basket TP de 40 pips.',
    inputsTitle: 'Parámetros Exactos (SEGURIDAD PROP FIRM)',
    inputsSubtitle: 'Protección antiliquidación y cierre conjunto por cesta',
    resultsTitle: 'Resultados Multi-Activo en MT5 Strategy Tester',
    resultsSubtitle: 'Profit Factor máximo de 8.21 en XAUUSD (+67,919.40 $ en 569 operaciones)',
    colParam: 'Parámetro',
    colValue: 'Valor',
    colRange: 'Rango Opt.',
    colPass: 'Pass',
    colSymbol: 'Símbolo',
    colProfit: 'Beneficio ($)',
    colTrades: 'Operaciones',
    colPF: 'Profit Factor',
    colPayoff: 'Payoff Esp.',
    safetyBanner: 'Drawdown Cap: 3% • Máx 4 Niveles • Paso: 30 pips • Basket TP: 40 pips',
    downloadBtn: 'Descargar Ajustes Grid (.SET)',
    downloadedMsg: '¡QuantumGridSentinel_Optimized.set descargado!',
    proofResultsLabel: 'MT5 Strategy Tester — Resultados Quantum Grid',
    proofInputsLabel: 'MT5 Inputs — Configuración Prop Firm Safety',
    clickToZoom: 'Haz clic para ampliar',
    paramNames: [
      'InpLicenseKey',
      'InpMagicNumber',
      'Hard Stop Drawdown (%) Máx',
      'Máximo 4 niveles de grid (Riesgo cero)',
      'Lote inicial base',
      'Distancia entre niveles (pips)',
      'Take Profit en cesta completa (pips)'
    ],
  },
  zh: {
    badge: 'MT5 策略测试器 • 动态网格与 3% 硬性回撤保护审计',
    title: 'Quantum Grid Sentinel — 实测成绩与风控参数设定',
    subtitle: 'MetaTrader 5 官方策略测试器审计，内置自营资金安全保护：3% 硬性回撤止损、最多 4 层网格、30 点层级间距及 40 点一篮子整体止盈。',
    inputsTitle: '精准输入参数 (PROP FIRM 安全风控)',
    inputsSubtitle: '零爆仓限制与整体篮子止盈设定',
    resultsTitle: '多资产 MT5 优化实测表现',
    resultsSubtitle: 'XAUUSD 黄金最高盈利因子 8.21（569 笔交易净利润 +$67,919.40）',
    colParam: '参数名称',
    colValue: '设定值',
    colRange: '优化范围',
    colPass: '轮次',
    colSymbol: '交易品种',
    colProfit: '净利润 ($)',
    colTrades: '总笔数',
    colPF: '盈利因子',
    colPayoff: '预期收益',
    safetyBanner: '硬性回撤保护：3% • 最多 4 层网格 • 间距：30 点 • 整体止盈：40 点',
    downloadBtn: '下载 Grid Sentinel 配置 (.SET)',
    downloadedMsg: 'QuantumGridSentinel_Optimized.set 已下载！',
    proofResultsLabel: 'MT5 策略测试器 — Quantum Grid 优化成绩截图',
    proofInputsLabel: 'MT5 参数窗口 — 安全风控与网格输入设定',
    clickToZoom: '点击查看大图',
    paramNames: [
      'InpLicenseKey (授权密钥)',
      'InpMagicNumber (魔术号)',
      '硬性最大回撤保护 (%)',
      '最大网格层数限制 (零爆仓风险)',
      '初始基础手数',
      '网格加仓间距 (点数)',
      '整篮持仓总止盈 (点数)'
    ],
  },
};

export const QuantumGridShowcase: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language } = useLanguage();
  const copy = GRID_COPY[language] || GRID_COPY.en;
  const gridBot = TRADING_BOTS.find((b) => b.id === 'quantum-grid-sentinel');
  const gridOpt = gridBot?.gridOptimization;

  const [downloaded, setDownloaded] = useState(false);

  if (!gridOpt) return null;

  const handleDownloadSet = () => {
    const content = `;+------------------------------------------------------------------+
;| Nexus Quant Systems - Quantum Grid Sentinel (MT5 Verified Preset)
;| Tested on MetaTrader 5 Strategy Tester
;| Top Pass: XAUUSD Pass #8 (+67,919.40 USD, 569 trades, PF 8.21)
;+------------------------------------------------------------------+
InpLicenseKey=NX-GRID-7712-SAFE
InpMagicNumber=884122
InpMaxDrawdownCap=3.0
InpMaxOpenPositions=4
InpBaseLotSize=1.0
InpGridStepPips=30
InpBasketTakeProfitPips=40
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'QuantumGridSentinel_Optimized.set';
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <div className={compact ? 'space-y-5' : 'mt-8 rounded-2xl bg-slate-900/90 border border-emerald-800/60 shadow-2xl p-5 md:p-8'}>
      {/* Section Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/70 mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
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
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
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
        {/* Left: Exact Grid Input Settings */}
        <div className="xl:col-span-5 rounded-xl bg-slate-950/90 border border-slate-800 p-4 md:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>{copy.inputsTitle}</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{copy.inputsSubtitle}</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                3% DD CAP
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                    <th className="py-2 pr-2">{copy.colParam}</th>
                    <th className="py-2 px-2 text-right text-emerald-300">{copy.colValue}</th>
                    <th className="py-2 pl-2 text-right">{copy.colRange}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {gridOpt.inputs.map((inp, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-2 pr-2 text-slate-300 font-sans text-xs">
                        {copy.paramNames[idx] || inp.name}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-400">
                        {inp.value}
                      </td>
                      <td className="py-2 pl-2 text-right text-[10px] text-slate-500">
                        {inp.start === '—' ? '—' : `${inp.start} → ${inp.stop} (${inp.step})`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{copy.safetyBanner}</span>
          </div>
        </div>

        {/* Right: Verified MT5 Strategy Tester Results */}
        <div className="xl:col-span-7 rounded-xl bg-slate-950/90 border border-slate-800 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>{copy.resultsTitle}</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{copy.resultsSubtitle}</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold">
              PF 8.21 Peak
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
                  <th className="py-2 pl-2 text-right">{copy.colPayoff}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {gridOpt.results.map((row) => (
                  <tr
                    key={row.pass}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      row.pass === 8 ? 'bg-emerald-950/25' : ''
                    }`}
                  >
                    <td className="py-2 pr-2 text-slate-500">#{row.pass}</td>
                    <td className="py-2 px-2 font-bold text-white">{row.symbol}</td>
                    <td className="py-2 px-2 text-right font-bold text-emerald-400">{row.profit}</td>
                    <td className="py-2 px-2 text-right text-slate-300">{row.trades}</td>
                    <td className="py-2 px-2 text-right font-bold text-cyan-300">{row.profitFactor}</td>
                    <td className="py-2 pl-2 text-right text-slate-300">{row.expectedPayoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
