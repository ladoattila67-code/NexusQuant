import { TradingBot, Testimonial } from '../types';

export const TRADING_BOTS: TradingBot[] = [
  {
    id: 'ar-nexus',
    name: 'AR-Nexus',
    tagline: 'Strategie Pură de Lichiditate SMC cu Alerte Telegram & R:R 1:3.5',
    category: 'breakout',
    categoryLabel: 'Smart Money Concepts (SMC)',
    marketPairs: ['EUR/USD', 'GBP/USD', 'AUD/JPY', 'XAU/USD'],
    winRate: 76.4,
    avgMonthlyReturn: 19.2,
    maxDrawdown: 3.8,
    profitFactor: 2.85,
    sharpeRatio: 3.55,
    totalTrades: 285,
    verifiedPeriod: 'Strategie SMC Oficială • Telegram Bot Integrat',
    priceLifetime: 599,
    priceMonthly: 79,
    isPopular: true,
    badge: '⭐ Robotul Oficial al Fondatorului',
    riskLevel: 'Scăzut',
    description:
      'AR-Nexus este dezvoltat pe baza strategiei pure de lichiditate instituțională (Smart Money Concepts - SMC). Scanează pe M15 și Daily nivelurile extreme de Swing High/Low și HOD/LOD, identifică vânătoarea de stopuri a marilor bănci (Liquidity Sweeps) și intră exclusiv la respingerea lumânării înapoi în canal, cu un raport asimetric Risc:Recompensă de la 1:3.5 la 1:4.2. Trimite alerte automate în timp real pe Telegram.',
    algorithmSummary:
      'Algoritm de Smart Money Concepts (SMC). Detectează automat lichiditatea majoră pe 15M (5 swing bars) și Daily (HOD/LOD). Așteaptă străpungerea (Sweep) de minim 10 puncte și confirmarea revenirii prețului sub/peste nivel. Închidere automată la TP/SL cu raportare instant pe Telegram.',
    features: [
      'Securitate Avansată: Validare Cheie Licență + Blocare pe Număr Cont MT5',
      'Protecție Hard Stop Prop Firm (Închidere automată la 4% pierdere zilnică)',
      'Strategie Pură de Lichiditate SMC (Smart Money Concepts)',
      'Identificare automată Swing High / Low M15 și HOD / LOD zilnic',
      'Raport Asimetric Risc:Recompensă de 1:3.5 – 1:4.2 la fiecare intrare',
      'Filtru inteligent anti-breakout fals (invalidează mișcările violente peste 400 puncte)',
      'Protecție Weekend Guard (Închide tranzacțiile vineri la 21:00 GMT)',
      'Modul Telegram Bot integrat (alerte instant: Nivel Nou, Sweep în curs, TP/SL atins)',
      'Filtru Știri Roșii: Oprește automat tranzacționarea pe evenimente majore (CPI, NFP, FOMC)',
      'Compatibil 100% cu regulile Prop Firms (FTMO, Upcomers, TPT, Lucid, FundedNext, Funding Pips)'
    ],
    platforms: ['MT5', 'MT4'],
    propFirmCompatible: true,
    historicalReturns: [
      { month: 'Nov', year: 2026, returnPct: 5.8 },
      { month: 'Oct', year: 2026, returnPct: 19.4 },
      { month: 'Sep', year: 2026, returnPct: 18.2 },
      { month: 'Aug', year: 2026, returnPct: 21.5 },
      { month: 'Iul', year: 2026, returnPct: 17.8 },
      { month: 'Iun', year: 2026, returnPct: 22.1 },
      { month: 'Mai', year: 2026, returnPct: 16.9 },
      { month: 'Apr', year: 2026, returnPct: 19.8 },
      { month: 'Mar', year: 2026, returnPct: 23.4 },
      { month: 'Feb', year: 2026, returnPct: 17.2 },
      { month: 'Ian', year: 2026, returnPct: 18.9 }
    ],
    recentTrades: [
      {
        id: 'T-SMC-101',
        symbol: 'AUD/JPY',
        type: 'BUY',
        lots: 0.85,
        openPrice: 98.42,
        currentPrice: 99.85,
        pnl: 1215.50,
        pips: 143,
        openTime: 'Acum 18 min',
        takeProfit: 100.10,
        stopLoss: 98.05
      },
      {
        id: 'T-SMC-102',
        symbol: 'GBP/USD',
        type: 'SELL',
        lots: 1.0,
        openPrice: 1.2980,
        currentPrice: 1.2915,
        pnl: 650.0,
        pips: 65,
        openTime: 'Acum 45 min',
        takeProfit: 1.2875,
        stopLoss: 1.3010
      }
    ]
  },
  {
    id: 'aegis-scalper-x',
    name: 'Aegis Scalper X',
    tagline: 'Micro-Scalping Instituțional de Înaltă Frecvență pe Aur & Forex Majors',
    category: 'scalping',
    categoryLabel: 'Scalping HFT',
    marketPairs: ['XAU/USD (Gold)', 'EUR/USD', 'GBP/USD'],
    winRate: 78.4,
    avgMonthlyReturn: 14.8,
    maxDrawdown: 4.8,
    profitFactor: 2.65,
    sharpeRatio: 3.24,
    totalTrades: 3840,
    verifiedPeriod: '24 Luni Verificate Myfxbook',
    priceLifetime: 499,
    priceMonthly: 69,
    isPopular: true,
    badge: 'Cel Mai Vândut',
    riskLevel: 'Scăzut',
    description:
      'Aegis Scalper X utilizează execuție milisecundară la deschiderea sesiunilor Londra & New York. Identifică dezechilibrele de lichiditate din Order Book și capturează micro-mișcări fără expunere prelungită la risc.',
    algorithmSummary:
      'Algoritm hibrid bazat pe Dynamic Tick Delta și filtrare automată a știrilor CPI/FOMC. Stop Loss fix la fiecare ordin, Trailing Stop matematic și zero risc de tip Martingale.',
    features: [
      'Stop Loss & Take Profit automat la fiecare ordin (Zero Martingale)',
      'Filtru inteligent anti-știri macroeconomice (High Impact News Shield)',
      'Compatibil 100% cu regulile Prop Firms (FTMO, FundedNext, MFF)',
      'Algoritm de auto-ajustare a spread-ului și protecție slippage',
      'Configurații predefinite (.set) optimizate trimestrial pe tick data de calitate 99.9%'
    ],
    platforms: ['MT4', 'MT5', 'cTrader'],
    propFirmCompatible: true,
    historicalReturns: [
      { month: 'Nov', year: 2026, returnPct: 4.2 },
      { month: 'Oct', year: 2026, returnPct: 15.6 },
      { month: 'Sep', year: 2026, returnPct: 13.9 },
      { month: 'Aug', year: 2026, returnPct: 16.2 },
      { month: 'Iul', year: 2026, returnPct: 14.1 },
      { month: 'Iun', year: 2026, returnPct: 18.4 },
      { month: 'Mai', year: 2026, returnPct: 12.8 },
      { month: 'Apr', year: 2026, returnPct: 15.1 },
      { month: 'Mar', year: 2026, returnPct: 17.5 },
      { month: 'Feb', year: 2026, returnPct: 13.7 },
      { month: 'Ian', year: 2026, returnPct: 14.9 }
    ],
    recentTrades: [
      {
        id: 'T-9821',
        symbol: 'XAU/USD',
        type: 'BUY',
        lots: 0.85,
        openPrice: 2684.20,
        currentPrice: 2692.50,
        pnl: 705.50,
        pips: 83,
        openTime: 'Acum 14 min',
        takeProfit: 2695.00,
        stopLoss: 2678.50
      },
      {
        id: 'T-9820',
        symbol: 'EUR/USD',
        type: 'SELL',
        lots: 1.50,
        openPrice: 1.0845,
        currentPrice: 1.0821,
        pnl: 360.00,
        pips: 24,
        openTime: 'Acum 42 min',
        takeProfit: 1.0815,
        stopLoss: 1.0862
      },
      {
        id: 'T-9819',
        symbol: 'GBP/USD',
        type: 'BUY',
        lots: 1.20,
        openPrice: 1.2940,
        currentPrice: 1.2974,
        pnl: 408.00,
        pips: 34,
        openTime: 'Acum 2 ore',
        takeProfit: 1.2985,
        stopLoss: 1.2915
      }
    ]
  },
  {
    id: 'neural-trend-pro',
    name: 'Neural Trend Pro',
    tagline: 'H4 (4-Hour) Institutional Trend & ATR Breakout Engine — US Equities (INTC, MSFT, AMD), FX & Indices',
    category: 'trend',
    categoryLabel: 'Trend Following AI (H4)',
    marketPairs: ['INTC', 'MSFT', 'AMD', 'USDCNH', 'US100 (Nasdaq)', 'AUDUSD'],
    winRate: 71.8,
    avgMonthlyReturn: 19.4,
    maxDrawdown: 2.86,
    profitFactor: 2.96,
    sharpeRatio: 3.22,
    totalTrades: 2150,
    verifiedPeriod: 'H4 Strategy Tester Audited • PF 2.96 (INTC)',
    priceLifetime: 599,
    priceMonthly: 79,
    badge: 'H4 Verified • PF 2.96',
    riskLevel: 'Scăzut',
    description:
      'Neural Trend Pro (H4 4-Hour Timeframe Edition) combines Macro Trend Filtering (EMA 200 & EMA 50), 20-period Donchian Channel Breakouts, and ATR (14) dynamic risk sizing with a fixed 1:3 Risk:Reward (SL = 1.5× ATR, TP = 3× SL, 0.5% risk per trade). Verified in MetaTrader 5 Strategy Tester on H4: INTC delivered +10,490.72 profit (21 trades, Profit Factor 2.96, Expected Payoff 499.56, Max Drawdown 2.86%, Recovery 3.52, Sharpe 3.22), MSFT +2,936.45 (PF 1.65, DD 2.39%), AMD +2,933.72 (PF 1.49, DD 3.43%), and USDCNH +4,509.16 (PF 1.30, DD 3.98%).',
    algorithmSummary:
      'H4 (4-Hour) Dual-EMA Regime & Channel Breakout Architecture: EMA Macro Filter = 200, EMA Medium Direction = 50, Channel Breakout Window = 20, ATR Volatility = 14, Stop Loss = 1.5 × ATR, Take Profit = 3 × SL (1:3 R:R), Risk per Trade = 0.5%. Zero martingale, strict hard SL on every order.',
    features: [
      'H4 Verified Peak Result (INTC): +10,490.72 Net Profit, PF 2.96, 2.86% DD, Sharpe 3.22',
      'H4 Consistent Equities & FX: MSFT (+2,936.45 | PF 1.65), AMD (+2,933.72 | PF 1.49), USDCNH (+4,509.16 | PF 1.30)',
      'Exact H4 Trend Inputs: EMA Macro 200 / EMA Medium 50 / Breakout Window 20 / ATR 14',
      'Precision ATR Risk Engine: Stop Loss = 1.5× ATR, Take Profit = 3× SL (Guaranteed 1:3 R:R)',
      'Ultra-Safe 0.5% Risk per Trade preset keeping Strategy Tester Drawdown between 2.39% and 3.98%'
    ],
    platforms: ['MT5', 'cTrader', 'TradingView Webhook'],
    propFirmCompatible: true,
    h4Optimization: {
      timeframe: 'H4 (4 Hours)',
      platform: 'MetaTrader 5 Strategy Tester (Neural_Trend_Pro)',
      summary:
        'Optimized Trend & ATR multi-symbol pass on 4H timeframe achieving up to 2.96 Profit Factor, 3.22 Sharpe Ratio, and 2.39%–3.98% Drawdown across Tech Equities and Major FX pairs.',
      inputs: [
        { name: 'EMA Macro Regime Filter', value: '200', start: '200', step: '1', stop: '2000' },
        { name: 'EMA Medium Direction', value: '50', start: '50', step: '1', stop: '500' },
        { name: 'Channel Breakout Window', value: '20', start: '20', step: '1', stop: '200' },
        { name: 'ATR Volatility Period', value: '14', start: '14', step: '1', stop: '140' },
        { name: 'Stop Loss = 1.5 x ATR', value: '1.5', start: '1.5', step: '0.15', stop: '15.0' },
        { name: 'Take Profit = 3 x SL (R:R 1:3)', value: '3', start: '3.0', step: '0.3', stop: '30.0' },
        { name: 'Risk per Trade (1% base)', value: '0.5%', start: '1.0', step: '0.1', stop: '10.0' }
      ],
      results: [
        { pass: 11, symbol: 'INTC', profit: '+10,490.72', trades: 21, profitFactor: '2.96', expectedPayoff: '499.56', drawdownPct: '2.86%', recoveryFactor: '3.52', sharpeRatio: '3.22' },
        { pass: 10, symbol: 'MSFT', profit: '+2,936.45', trades: 14, profitFactor: '1.65', expectedPayoff: '209.75', drawdownPct: '2.39%', recoveryFactor: '1.19', sharpeRatio: '0.87' },
        { pass: 9, symbol: 'AMD', profit: '+2,933.72', trades: 18, profitFactor: '1.49', expectedPayoff: '162.98', drawdownPct: '3.43%', recoveryFactor: '0.84', sharpeRatio: '1.23' },
        { pass: 3, symbol: 'USDCNH', profit: '+4,509.16', trades: 43, profitFactor: '1.30', expectedPayoff: '104.86', drawdownPct: '3.98%', recoveryFactor: '1.10', sharpeRatio: '1.05' },
        { pass: 4, symbol: 'AUDUSD', profit: '+1,933.26', trades: 39, profitFactor: '1.14', expectedPayoff: '49.57', drawdownPct: '7.44%', recoveryFactor: '0.25', sharpeRatio: '0.48' },
        { pass: 7, symbol: 'USDCAD', profit: '+1,141.56', trades: 47, profitFactor: '1.07', expectedPayoff: '24.29', drawdownPct: '5.60%', recoveryFactor: '0.20', sharpeRatio: '0.30' },
        { pass: 6, symbol: 'XAUUSD', profit: '+6,238.04', trades: 56, profitFactor: '1.02', expectedPayoff: '111.39', drawdownPct: '49.40%', recoveryFactor: '0.08', sharpeRatio: '0.17' }
      ]
    },
    historicalReturns: [
      { month: 'Nov', year: 2026, returnPct: 7.8 },
      { month: 'Oct', year: 2026, returnPct: 21.4 },
      { month: 'Sep', year: 2026, returnPct: 18.2 },
      { month: 'Aug', year: 2026, returnPct: 24.1 },
      { month: 'Iul', year: 2026, returnPct: 16.5 },
      { month: 'Iun', year: 2026, returnPct: 22.8 },
      { month: 'Mai', year: 2026, returnPct: 15.3 },
      { month: 'Apr', year: 2026, returnPct: 19.9 },
      { month: 'Mar', year: 2026, returnPct: 25.1 }
    ],
    recentTrades: [
      {
        id: 'T-9818',
        symbol: 'INTC',
        type: 'BUY',
        lots: 0.50,
        openPrice: 24.80,
        currentPrice: 26.45,
        pnl: 825.00,
        pips: 165,
        openTime: '3h ago',
        takeProfit: 27.10,
        stopLoss: 24.10
      },
      {
        id: 'T-9817',
        symbol: 'MSFT',
        type: 'BUY',
        lots: 0.25,
        openPrice: 518.20,
        currentPrice: 521.20,
        pnl: 412.50,
        pips: 300,
        openTime: '5h ago',
        takeProfit: 526.00,
        stopLoss: 515.60
      }
    ]
  },
  {
    id: 'quantum-grid-sentinel',
    name: 'Quantum Grid Sentinel',
    tagline: 'Dynamic Grid with 3% Hard-Cap Drawdown & 40-Pip Basket Take Profit — Verified +$67,919 on XAUUSD',
    category: 'grid',
    categoryLabel: 'Dynamic Grid Hedging',
    marketPairs: ['XAU/USD (Gold)', 'AUD/USD', 'NZD/USD', 'USD/JPY', 'AMD', 'USD/CHF'],
    winRate: 84.2,
    avgMonthlyReturn: 14.6,
    maxDrawdown: 3.0,
    profitFactor: 8.21,
    sharpeRatio: 3.48,
    totalTrades: 5120,
    verifiedPeriod: 'MT5 Strategy Tester Audited • PF 8.21 (XAUUSD)',
    priceLifetime: 449,
    priceMonthly: 59,
    badge: 'MT5 Verified • PF 8.21',
    riskLevel: 'Scăzut',
    description:
      'Quantum Grid Sentinel enforces strict Prop Firm Safety Settings: Hard Stop Drawdown Cap at 3.0%, maximum 4 Grid Levels (zero liquidation risk), 30-pip Grid Step spacing, and 40-pip Basket Take Profit. Audited in MetaTrader 5 Strategy Tester: XAUUSD generated +67,919.40 net profit across 569 trades (Profit Factor 8.21, Expected Payoff 119.37), alongside AUDUSD (+3,392.22 | PF 2.01), NZDUSD (+2,375.88 | PF 1.73), USDJPY (+1,640.19 | PF 1.42), and AMD (PF 4.32).',
    algorithmSummary:
      'Safe Dynamic Grid Architecture (Prop Firm Safety Guard): Hard Drawdown Circuit Breaker = 3%, Max Open Grid Levels = 4, Base Lot = 1.0 (or 0.02 micro-account start), Grid Step Distance = 30 pips, Basket Take Profit = 40 pips.',
    features: [
      'MT5 Peak Verified Result (XAUUSD Pass #8): +67,919.40 Profit across 569 trades (Profit Factor 8.21)',
      'Multi-Asset Verified Consistency: AMD (PF 4.32), MSFT (PF 2.33), AUDUSD (+3,392.22 | PF 2.01), NZDUSD (+2,375.88 | PF 1.73)',
      'Strict 3% Hard-Stop Drawdown Cap: Automatically closes all positions & protects account equity',
      'Maximum 4 Grid Levels + 30-pip spacing prevents toxic order accumulation',
      'Unified 40-pip Basket Take Profit closes the entire grid basket simultaneously on profit'
    ],
    platforms: ['MT4', 'MT5'],
    propFirmCompatible: true,
    gridOptimization: {
      timeframe: 'M15 / H1 (Multi-Asset Grid)',
      platform: 'MetaTrader 5 Strategy Tester (Quantum_Grid_Sentinel)',
      summary:
        'Verified MT5 Strategy Tester pass with Hard Stop Drawdown Cap at 3%, max 4 grid levels, 30-pip step distance, and 40-pip cumulative Basket Take Profit.',
      inputs: [
        { name: 'InpLicenseKey', value: 'NX-GRID-7712-SAFE', start: '—', step: '—', stop: '—' },
        { name: 'InpMagicNumber', value: '884122', start: '884122', step: '1', stop: '8841220' },
        { name: 'Hard Stop Drawdown (%) Cap', value: '3%', start: '4.5', step: '0.45', stop: '45.0' },
        { name: 'Max Grid Levels (Zero Liquidation)', value: '4', start: '4', step: '1', stop: '40' },
        { name: 'Initial Base Lot Size', value: '1', start: '0.02', step: '0.002', stop: '0.2' },
        { name: 'Distance Between Levels (pips)', value: '30', start: '25', step: '1', stop: '250' },
        { name: 'Basket Take Profit (pips)', value: '40', start: '30', step: '1', stop: '300' }
      ],
      results: [
        { pass: 8, symbol: 'XAUUSD', profit: '+67,919.40', trades: 569, profitFactor: '8.21', expectedPayoff: '119.37', drawdownPct: '3.00%', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 10, symbol: 'AMD', profit: '+337.26', trades: 76, profitFactor: '4.32', expectedPayoff: '4.44', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 11, symbol: 'MSFT', profit: '+47.05', trades: 19, profitFactor: '2.33', expectedPayoff: '2.48', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 5, symbol: 'AUDUSD', profit: '+3,392.22', trades: 19, profitFactor: '2.01', expectedPayoff: '178.54', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 6, symbol: 'NZDUSD', profit: '+2,375.88', trades: 17, profitFactor: '1.73', expectedPayoff: '139.76', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 3, symbol: 'USDJPY', profit: '+1,640.19', trades: 24, profitFactor: '1.42', expectedPayoff: '68.34', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 12, symbol: 'INTC', profit: '+27.43', trades: 23, profitFactor: '1.36', expectedPayoff: '1.19', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 2, symbol: 'USDCHF', profit: '+847.59', trades: 12, profitFactor: '1.26', expectedPayoff: '70.63', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' },
        { pass: 9, symbol: 'USDCAD', profit: '+151.96', trades: 15, profitFactor: '1.05', expectedPayoff: '10.13', drawdownPct: '—', recoveryFactor: '—', sharpeRatio: '—' }
      ]
    },
    historicalReturns: [
      { month: 'Nov', year: 2026, returnPct: 5.4 },
      { month: 'Oct', year: 2026, returnPct: 16.8 },
      { month: 'Sep', year: 2026, returnPct: 14.9 },
      { month: 'Aug', year: 2026, returnPct: 15.4 },
      { month: 'Iul', year: 2026, returnPct: 13.2 },
      { month: 'Iun', year: 2026, returnPct: 14.5 },
      { month: 'Mai', year: 2026, returnPct: 12.9 }
    ],
    recentTrades: [
      {
        id: 'T-9816',
        symbol: 'XAU/USD',
        type: 'BUY',
        lots: 0.04,
        openPrice: 3905.53,
        currentPrice: 3908.40,
        pnl: 486.20,
        pips: 40,
        openTime: '45m ago',
        takeProfit: 3909.53,
        stopLoss: 3890.00
      }
    ]
  },
  {
    id: 'nexus-arbitrage-hft',
    name: 'Nexus Arbitrage HFT',
    tagline: 'Arbitraj Statistic Latency-Free între Brokeri & Pool-uri de Lichiditate',
    category: 'arbitrage',
    categoryLabel: 'Arbitraj Statistic',
    marketPairs: ['Toate Perechile Forex', 'Crypto (Binance vs Bybit)', 'Spot Gold'],
    winRate: 91.5,
    avgMonthlyReturn: 16.5,
    maxDrawdown: 2.1,
    profitFactor: 3.85,
    sharpeRatio: 4.15,
    totalTrades: 8940,
    verifiedPeriod: '12 Luni Verificate FIX API',
    priceLifetime: 799,
    priceMonthly: 99,
    badge: 'Nivel Instituțional',
    riskLevel: 'Scăzut',
    description:
      'Detectează micro-discrepanțe de preț între feed-ul de cotații LMAX / Currenex și brokerul tău de retail. Execuția se realizează instantaneu în microsecunde prin infrastructura noastră dedicată din Equinix LD4.',
    algorithmSummary:
      'Algoritm Triangulate & Latency Arbitrage. Ordinele sunt menținute de la câteva secunde la câteva minute, capitalizând pe întârzierile de propagare ale lichidității.',
    features: [
      'Win rate record de peste 90% datorită intrărilor la prețuri deja confirmate pe bursa mamă',
      'Include acces direct la bridge-ul de latență FIX API găzduit în Equinix LD4 Londra',
      'Zero expunere la volatilitate peste noapte (Toate pozițiile închise intraday)',
      'Suport dedicat pentru brokeri ECN cu spread 0.0 pips (Tickmill, IC Markets, Pepperstone)',
      'Protecție inteligentă împotriva brokerilor b-book (mascare inteligentă a ordinii de execuție)'
    ],
    platforms: ['MT4', 'MT5', 'FIX API'],
    propFirmCompatible: true,
    historicalReturns: [
      { month: 'Nov', year: 2026, returnPct: 5.4 },
      { month: 'Oct', year: 2026, returnPct: 17.2 },
      { month: 'Sep', year: 2026, returnPct: 15.8 },
      { month: 'Aug', year: 2026, returnPct: 16.9 },
      { month: 'Iul', year: 2026, returnPct: 18.1 },
      { month: 'Iun', year: 2026, returnPct: 15.5 }
    ],
    recentTrades: [
      {
        id: 'T-9815',
        symbol: 'EUR/USD',
        type: 'BUY',
        lots: 2.00,
        openPrice: 1.0832,
        currentPrice: 1.0841,
        pnl: 180.00,
        pips: 9,
        openTime: 'Acum 8 min',
        takeProfit: 1.0842,
        stopLoss: 1.0825
      }
    ]
  },
  {
    id: 'titan-breakout-hunter',
    name: 'Titan Breakout Hunter',
    tagline: 'Exploatarea Volumului Instituțional la Spargerea Nivelelor Cheie',
    category: 'breakout',
    categoryLabel: 'Breakout Momentum',
    marketPairs: ['GER40 (DAX)', 'US500 (S&P 500)', 'WTI Oil', 'XAU/USD'],
    winRate: 69.4,
    avgMonthlyReturn: 17.9,
    maxDrawdown: 5.9,
    profitFactor: 2.54,
    sharpeRatio: 2.88,
    totalTrades: 1890,
    verifiedPeriod: '16 Luni Verificate Myfxbook',
    priceLifetime: 479,
    priceMonthly: 65,
    badge: 'Volatilitate Mare',
    riskLevel: 'Moderat',
    description:
      'Proiectat special pentru active cu volatilitate ridicată (DAX40, S&P 500, Petrol). Identifică comprimările de preț (Price Squeeze) și deschide poziții cu volum calculat în momentul expansiunii.',
    algorithmSummary:
      'Filtrare Keltner Channels + Donchian Channels și analiză de flux de comenzi. Include trailing stop dinamic cu accelerare parabolică.',
    features: [
      'Randamente explozive în zilele cu trend puternic și mișcări direcționale clare',
      'Trailing Stop avansat care securizează profitul la fiecare pas de 15 pips',
      'Sistem anti-spargere falsă (False Breakout Rejection Filter)',
      'Compatibil cu conturi FTMO și challenge-uri de finanțare până la 200.000 $',
      'Instalare asistată în 5 minute prin fișier instalator dedicat și presetări testate'
    ],
    platforms: ['MT4', 'MT5'],
    propFirmCompatible: true,
    historicalReturns: [
      { month: 'Nov', year: 2026, returnPct: 6.2 },
      { month: 'Oct', year: 2026, returnPct: 19.4 },
      { month: 'Sep', year: 2026, returnPct: 16.8 },
      { month: 'Aug', year: 2026, returnPct: 20.3 },
      { month: 'Iul', year: 2026, returnPct: 15.9 }
    ],
    recentTrades: [
      {
        id: 'T-9814',
        symbol: 'GER40',
        type: 'SELL',
        lots: 0.75,
        openPrice: 19420.0,
        currentPrice: 19280.0,
        pnl: 1050.00,
        pips: 140,
        openTime: 'Acum 4 ore',
        takeProfit: 19200.0,
        stopLoss: 19490.0
      }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Mihai Radu',
    location: 'București, România',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'Trader Full-Time (Fost Analist Financiar)',
    verifiedProfit: '+42.800 € în 11 luni',
    usedBot: 'Aegis Scalper X & Neural Trend Pro',
    comment:
      'Folosesc roboții Nexus de aproape un an pe un cont de 50.000 € la Tickmill. Stabilitatea este incredibilă: drawdown-ul maxim nu a depășit niciodată 4.5%, iar execuția pe serverul Equinix LD4 din Londra este practic instantanee.',
    rating: 5,
    date: '28 Octombrie 2026'
  },
  {
    id: 't-2',
    name: 'Andrei Popescu',
    location: 'Cluj-Napoca, România',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    role: 'Prop Trader Finanțat FTMO 100k',
    verifiedProfit: 'Passed FTMO Challenge în 14 zile',
    usedBot: 'Neural Trend Pro',
    comment:
      'Am trecut două challenge-uri de prop firm (FTMO 100k și FundedNext 50k) exclusiv cu setările conservative ale Neural Trend Pro. Respectă cu sfințenie limitele zilnice de pierdere și ia doar setup-uri de mare calitate.',
    rating: 5,
    date: '14 Octombrie 2026'
  },
  {
    id: 't-3',
    name: 'Stefan Weber',
    location: 'Frankfurt, Germania',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    role: 'Quant Investor',
    verifiedProfit: '+18.4% randament mediu trimestrial',
    usedBot: 'Nexus Arbitrage HFT',
    comment:
      'Arbitrajul cu conexiune directă la nodul FR2 Frankfurt oferă un avantaj matematic real. Suportul tehnic m-a ajutat prin TeamViewer la configurarea nodului FIX API în 10 minute.',
    rating: 5,
    date: '3 Noiembrie 2026'
  }
];

export const getCustomBots = (): TradingBot[] => {
  try {
    const raw = localStorage.getItem('nexus_custom_bots');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
};

export const saveCustomBot = (bot: TradingBot): void => {
  try {
    const current = getCustomBots();
    const existingIndex = current.findIndex((b) => b.id === bot.id);
    let updated: TradingBot[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = bot;
    } else {
      updated = [bot, ...current];
    }
    localStorage.setItem('nexus_custom_bots', JSON.stringify(updated));
  } catch {
    // fallback
  }
};

export const deleteCustomBot = (id: string): void => {
  try {
    const current = getCustomBots();
    const filtered = current.filter((b) => b.id !== id);
    localStorage.setItem('nexus_custom_bots', JSON.stringify(filtered));
  } catch {
    // fallback
  }
};

export const getAllTradingBots = (): TradingBot[] => {
  const custom = getCustomBots();
  return [...custom, ...TRADING_BOTS];
};

