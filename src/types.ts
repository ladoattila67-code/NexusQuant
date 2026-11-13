export interface MonthlyReturn {
  month: string;
  year: number;
  returnPct: number;
}

export interface TradePosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  pnl: number;
  pips: number;
  openTime: string;
  takeProfit: number;
  stopLoss: number;
}

export interface H4InputSetting {
  name: string;
  value: string;
  start: string;
  step: string;
  stop: string;
}

export interface H4SymbolResult {
  pass: number;
  symbol: string;
  profit: string;
  trades: number;
  profitFactor: string;
  expectedPayoff: string;
  drawdownPct: string;
  recoveryFactor: string;
  sharpeRatio: string;
}

export interface H4OptimizationData {
  timeframe: string;
  platform: string;
  summary: string;
  inputs: H4InputSetting[];
  results: H4SymbolResult[];
}

export interface TradingBot {
  id: string;
  name: string;
  tagline: string;
  category: 'scalping' | 'trend' | 'grid' | 'arbitrage' | 'breakout';
  categoryLabel: string;
  marketPairs: string[];
  winRate: number; // percentage, e.g. 78.4
  avgMonthlyReturn: number; // percentage, e.g. 14.8
  maxDrawdown: number; // percentage, e.g. 5.2
  profitFactor: number; // e.g. 2.48
  sharpeRatio: number; // e.g. 3.12
  totalTrades: number;
  verifiedPeriod: string;
  priceLifetime: number;
  priceMonthly: number;
  isPopular?: boolean;
  badge?: string;
  riskLevel: 'Scăzut' | 'Moderat' | 'Dinamism Controlat';
  description: string;
  algorithmSummary: string;
  features: string[];
  platforms: ('MT4' | 'MT5' | 'cTrader' | 'FIX API' | 'TradingView Webhook')[];
  propFirmCompatible: boolean;
  historicalReturns: MonthlyReturn[];
  recentTrades: TradePosition[];
  h4Optimization?: H4OptimizationData;
  gridOptimization?: H4OptimizationData;
}

export interface ExecutionNode {
  id: string;
  name: string;
  datacenter: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pingMs: number;
  bandwidth: string;
  activeBots: number;
  status: 'ONLINE' | 'OPTIMAL';
  targetBrokers: string[];
  specs: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  role: string;
  verifiedProfit: string;
  usedBot: string;
  comment: string;
  rating: number;
  date: string;
}

export interface PaymentConfig {
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  bankName: string;
  ibanRon: string;
  ibanEur: string;
  revolutTag: string;
  cryptoUsdtTrc20: string;
  cryptoBtc?: string;
  cryptoEth?: string;
  cryptoSol?: string;
  gumroadUrl?: string;
  paypalUrl?: string;
  stripePaymentLink?: string;
}

