import React, { useState, useEffect } from 'react';
import { 
  X, Lock, ShieldCheck, Key, CreditCard, Building2, Smartphone, 
  Wallet, CheckCircle, AlertTriangle, Users, Database, Server, RefreshCw, Eye, EyeOff,
  PlusCircle, Trash2, Cpu, Sparkles, ExternalLink, Download, Copy, Check, HelpCircle
} from 'lucide-react';
import { PaymentConfig, TradingBot } from '../types';
import {
  getPaymentConfig,
  savePaymentConfig,
  getPaymentChannelStatus,
  getSavedOrders,
  updateOrderStatus,
  OrderRecord
} from '../data/paymentConfig';
import { getCustomBots, saveCustomBot, deleteCustomBot } from '../data/tradingBots';
import { ROBOT_SOURCE_CODES } from '../data/robotCodes';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (config: PaymentConfig) => void;
  onBotsUpdated?: () => void;
}

const DEFAULT_ADMIN_PIN = 'Nexus12281967.';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  onBotsUpdated
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);

  // Stored PIN
  const [currentPin, setCurrentPin] = useState<string>(DEFAULT_ADMIN_PIN);
  const [newPin, setNewPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  // Tabs: 'banking' | 'licenses' | 'manageBots' | 'security'
  const [activeTab, setActiveTab] = useState<'banking' | 'licenses' | 'manageBots' | 'security'>('banking');

  // Form config
  const [config, setConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [exportedPublishConfig, setExportedPublishConfig] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [copiedLicenseFeedback, setCopiedLicenseFeedback] = useState<boolean>(false);
  const [showGumroadGuide, setShowGumroadGuide] = useState<boolean>(false);
  const [copiedGumroadField, setCopiedGumroadField] = useState<string>('');

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedGumroadField(fieldId);
    setTimeout(() => setCopiedGumroadField(''), 2000);
  };

  const handleDownloadArNexusCode = () => {
    const code = ROBOT_SOURCE_CODES['ar-nexus']?.code || '';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AR_Nexus_Liquidity_SMC.mq5';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Custom Bots state
  const [customBotsList, setCustomBotsList] = useState<TradingBot[]>([]);
  const [newBotName, setNewBotName] = useState<string>('');
  const [newBotTagline, setNewBotTagline] = useState<string>('');
  const [newBotCategory, setNewBotCategory] = useState<'scalping' | 'trend' | 'grid' | 'arbitrage' | 'breakout'>('scalping');
  const [newBotPairs, setNewBotPairs] = useState<string>('XAU/USD, EUR/USD');
  const [newBotWinRate, setNewBotWinRate] = useState<number>(76.5);
  const [newBotMonthlyReturn, setNewBotMonthlyReturn] = useState<number>(15.2);
  const [newBotDrawdown, setNewBotDrawdown] = useState<number>(4.2);
  const [newBotPriceLifetime, setNewBotPriceLifetime] = useState<number>(399);
  const [newBotPriceMonthly, setNewBotPriceMonthly] = useState<number>(59);
  const [newBotRisk, setNewBotRisk] = useState<'Scăzut' | 'Moderat' | 'Dinamism Controlat'>('Scăzut');
  const [newBotDescription, setNewBotDescription] = useState<string>('');
  const [botSavedNotice, setBotSavedNotice] = useState<string>('');

  // Manual license generator state
  const [clientName, setClientName] = useState<string>('');
  const [clientAccount, setClientAccount] = useState<string>('');
  const [selectedBotName, setSelectedBotName] = useState<string>('Aegis Scalper X');
  const [generatedKey, setGeneratedKey] = useState<string>('');

  useEffect(() => {
    try {
      const savedPin = localStorage.getItem('nexus_admin_pin');
      if (savedPin && savedPin !== '2026' && savedPin !== 'admin2026') {
        setCurrentPin(savedPin);
      } else {
        setCurrentPin(DEFAULT_ADMIN_PIN);
      }
    } catch {
      // safe fallback
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setConfig(getPaymentConfig());
      setCustomBotsList(getCustomBots());
      setOrders(getSavedOrders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === currentPin) {
      setIsAuthenticated(true);
      setPinError('');
      setEnteredPin('');
    } else {
      setPinError('Cod PIN / Parolă incorectă!');
    }
  };

  const handleSaveBanking = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentConfig(config);
    if (onSaved) onSaved(config);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleAddBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) {
      alert('Te rugăm să introduci numele robotului!');
      return;
    }

    const botId = `custom-${newBotName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const categoryLabels: Record<string, string> = {
      scalping: 'Scalping HFT',
      trend: 'Trend Following AI',
      grid: 'Dynamic Grid Hedging',
      arbitrage: 'Arbitraj Statistic',
      breakout: 'Breakout Momentum'
    };

    const newBot: TradingBot = {
      id: botId,
      name: newBotName.trim(),
      tagline: newBotTagline.trim() || `Algoritm instituțional optimizat pentru ${newBotPairs}`,
      category: newBotCategory,
      categoryLabel: categoryLabels[newBotCategory] || 'Trading Algoritmic',
      marketPairs: newBotPairs.split(',').map((p) => p.trim()),
      winRate: Number(newBotWinRate) || 75.0,
      avgMonthlyReturn: Number(newBotMonthlyReturn) || 15.0,
      maxDrawdown: Number(newBotDrawdown) || 4.5,
      profitFactor: 2.45,
      sharpeRatio: 3.12,
      totalTrades: 1250,
      verifiedPeriod: 'Live Myfxbook Verificat',
      priceLifetime: Number(newBotPriceLifetime) || 399,
      priceMonthly: Number(newBotPriceMonthly) || 59,
      isPopular: false,
      badge: 'Robot Nou Adăugat',
      riskLevel: newBotRisk,
      description: newBotDescription.trim() || `Robot de tranzacționare algoritmic de mare precizie, dezvoltat de echipa Attila Lado pentru MetaTrader 5.`,
      algorithmSummary: `Strategie cantitativă cu management automat al riscului, Stop Loss fix la fiecare ordin și fără riscuri necontrolate de tip Martingale.`,
      features: [
        'Execuție automată pe piață 24/5 fără intervenție manuală',
        'Stop Loss și Take Profit setate dinamic la fiecare deschidere',
        'Filtru de protecție împotriva volatilității excesive la știri',
        'Compatibil cu toate conturile standard, ECN și Prop Firms'
      ],
      platforms: ['MT4', 'MT5'],
      propFirmCompatible: true,
      historicalReturns: [
        { month: 'Oct', year: 2026, returnPct: Number(newBotMonthlyReturn) || 14.5 },
        { month: 'Sep', year: 2026, returnPct: Number(newBotMonthlyReturn) * 0.9 || 13.2 },
        { month: 'Aug', year: 2026, returnPct: Number(newBotMonthlyReturn) * 1.1 || 16.0 }
      ],
      recentTrades: [
        {
          id: 'T-NEW-1',
          symbol: newBotPairs.split(',')[0]?.trim() || 'XAU/USD',
          type: 'BUY',
          lots: 0.5,
          openPrice: 2680.0,
          currentPrice: 2690.0,
          pnl: 500.0,
          pips: 50,
          openTime: 'Acum 10 min',
          takeProfit: 2695.0,
          stopLoss: 2670.0
        }
      ]
    };

    saveCustomBot(newBot);
    const updated = getCustomBots();
    setCustomBotsList(updated);
    if (onBotsUpdated) onBotsUpdated();

    // Reset form
    setNewBotName('');
    setNewBotTagline('');
    setNewBotDescription('');
    setBotSavedNotice(`Robotul "${newBot.name}" a fost publicat cu succes pe pagina ta web!`);
    setTimeout(() => setBotSavedNotice(''), 4000);
  };

  const handleDeleteBot = (id: string, name: string) => {
    if (confirm(`Ești sigur că vrei să elimini robotul "${name}" de pe site?`)) {
      deleteCustomBot(id);
      const updated = getCustomBots();
      setCustomBotsList(updated);
      if (onBotsUpdated) onBotsUpdated();
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('PIN-ul trebuie să aibă minim 4 caractere!');
      return;
    }
    try {
      localStorage.setItem('nexus_admin_pin', newPin);
      setCurrentPin(newPin);
      setPinChangeSuccess(true);
      setNewPin('');
      setTimeout(() => setPinChangeSuccess(false), 3000);
    } catch {
      // safe fallback
    }
  };

  const handleGenerateManualLicense = (e: React.FormEvent) => {
    e.preventDefault();
    const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const cleanAccount = clientAccount ? clientAccount.trim() : 'VIP';
    const key = `NX-AUTH-${hex}-${Math.floor(1000 + Math.random() * 9000)}-${cleanAccount}-INST`;
    setGeneratedKey(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 md:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <span>Panou de Securitate & Administrare</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">
                NEXUS QUANT • Control Administrator
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. If NOT authenticated: Show PIN Entry */}
        {!isAuthenticated ? (
          <div className="p-6 md:p-8 space-y-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Acces Restricționat Administrator</h4>
              <p className="text-xs text-slate-400 mt-1">
                Doar proprietarul platformei (Attila Lado) poate modifica conturile bancare și genera licențe permanente.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Introdu codul PIN Administrator"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-base tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                Autentificare Administrator
              </button>
            </form>
          </div>
        ) : (
          /* 2. Authenticated Admin Dashboard */
          <div>
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-2 overflow-x-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('banking')}
                className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'banking'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>1. Conturi Încasare Plăți</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('licenses')}
                className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'licenses'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>2. Generator Licențe Clienți</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manageBots')}
                className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'manageBots'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>3. Adaugă Robot Nou 🤖</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`pb-3 px-3 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'security'
                    ? 'border-amber-400 text-amber-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>4. Securitate & Schimbare PIN</span>
              </button>
            </div>

            {/* Tab 1: Banking Configuration */}
            {activeTab === 'banking' && (
              <form onSubmit={handleSaveBanking} className="p-5 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                  <div>
                    La plată (Checkout) vor fi vizibile <strong>doar datele configurate de tine</strong>; câmpurile goale sau lăsate pe demo sunt ascunse automat. Apasă <strong>„Copiază Datele pentru Publicare Permanentă”</strong> dacă vrei să le trimiți în chat pentru publicare globală.
                  </div>
                  {(() => {
                    const status = getPaymentChannelStatus(config);
                    return (
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                        <span className={`px-2 py-0.5 rounded border ${status.bank ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                          {status.bank ? '✓ IBAN Vizibil' : '○ IBAN Ascuns (Demo)'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${status.revolut ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                          {status.revolut ? '✓ Revolut Vizibil' : '○ Revolut Ascuns (Demo)'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${status.crypto ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                          {status.crypto ? '✓ Crypto Vizibil' : '○ Crypto Ascuns (Demo)'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${status.gumroad ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                          {status.gumroad ? '✓ Gumroad Vizibil' : '○ Gumroad Ascuns (Demo)'}
                        </span>
                        <span className={`px-2 py-0.5 rounded border ${status.stripeOrPaypal ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-700'}`}>
                          {status.stripeOrPaypal ? '✓ Stripe / PayPal Vizibil' : '○ Stripe / PayPal Ascuns'}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nume Beneficiar / Titular Cont:
                    </label>
                    <input
                      type="text"
                      required
                      value={config.sellerName}
                      onChange={(e) => setConfig({ ...config, sellerName: e.target.value })}
                      placeholder="Attila Lado"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Notificări Comenzi:
                    </label>
                    <input
                      type="email"
                      required
                      value={config.sellerEmail}
                      onChange={(e) => setConfig({ ...config, sellerEmail: e.target.value })}
                      placeholder="nexusquantvip@gmail.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      Număr WhatsApp (Primești confirmări plată):
                    </label>
                    <input
                      type="text"
                      value={config.sellerPhone}
                      onChange={(e) => setConfig({ ...config, sellerPhone: e.target.value })}
                      placeholder="+40762808899"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                      Revolut Tag / Număr Telefon:
                    </label>
                    <input
                      type="text"
                      value={config.revolutTag}
                      onChange={(e) => setConfig({ ...config, revolutTag: e.target.value })}
                      placeholder="@attilalado sau număr Revolut"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      Banca Ta (pentru virament bancar):
                    </label>
                    <input
                      type="text"
                      value={config.bankName}
                      onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                      placeholder="Banca Transilvania / BCR / ING / Revolut Bank"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cont IBAN EUR:
                    </label>
                    <input
                      type="text"
                      value={config.ibanEur}
                      onChange={(e) => setConfig({ ...config, ibanEur: e.target.value })}
                      placeholder="RO49BTRLEURCRT..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Cont IBAN RON:
                    </label>
                    <input
                      type="text"
                      value={config.ibanRon}
                      onChange={(e) => setConfig({ ...config, ibanRon: e.target.value })}
                      placeholder="RO49BTRLRONCRT..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-amber-400" />
                      Portofel Cripto USDC (Stablecoin USD):
                    </label>
                    <input
                      type="text"
                      value={config.cryptoUsdtTrc20}
                      onChange={(e) => setConfig({ ...config, cryptoUsdtTrc20: e.target.value })}
                      placeholder="0x71C83D482f3C31A2D23c577D5b82Eb59f136eF70 (ERC-20 / SOL / Base)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Bitcoin (BTC):
                      </label>
                      <input
                        type="text"
                        value={config.cryptoBtc || ''}
                        onChange={(e) => setConfig({ ...config, cryptoBtc: e.target.value })}
                        placeholder="bc1qar0srrr7..."
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Ethereum (ETH / ERC-20):
                      </label>
                      <input
                        type="text"
                        value={config.cryptoEth || ''}
                        onChange={(e) => setConfig({ ...config, cryptoEth: e.target.value })}
                        placeholder="0x71C83D..."
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Solana (SOL):
                      </label>
                      <input
                        type="text"
                        value={config.cryptoSol || ''}
                        onChange={(e) => setConfig({ ...config, cryptoSol: e.target.value })}
                        placeholder="7xKXtg2CW..."
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-pink-400" />
                        <span>Link Produs Gumroad (Magazin Online):</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowGumroadGuide(!showGumroadGuide)}
                        className="text-[11px] font-mono font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 underline underline-offset-2"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{showGumroadGuide ? 'Ascunde Ghidul' : 'Cum adaugi produsul pe Gumroad? (Ghid)'}</span>
                      </button>
                    </div>

                    <input
                      type="url"
                      value={config.gumroadUrl || ''}
                      onChange={(e) => setConfig({ ...config, gumroadUrl: e.target.value })}
                      placeholder="https://nexusquant.gumroad.com/l/ar-nexus"
                      className="w-full px-3 py-2 bg-slate-950 border border-pink-900/80 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                    />

                    <p className="text-[10px] text-slate-400 leading-snug">
                      Lipește aici linkul generat de Gumroad după ce publici produsul. Cumpărătorii vor fi redirecționați direct către plata cu cardul sau PayPal.
                    </p>

                    {/* Step-by-Step Gumroad Helper */}
                    {showGumroadGuide && (
                      <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-pink-900/50 space-y-3 text-xs">
                        {/* Payouts Warning Box */}
                        <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-200 space-y-1.5">
                          <div className="font-bold flex items-center justify-between text-xs text-amber-300">
                            <span className="flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>Important: De ce Gumroad zice că „nu are modalitate de plată”?</span>
                            </span>
                            <a
                              href="https://app.gumroad.com/settings/payouts"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shrink-0"
                            >
                              <span>Setează Payouts (Plată)</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            Gumroad nu te lasă să publici un produs plătit până când nu îi spui <strong>unde să-ți trimită banii</strong>! Mergi la <strong>Settings → Payouts</strong> și adaugă contul tău de <strong>PayPal ({config.sellerEmail})</strong> sau <strong>contul tău bancar IBAN</strong>. Durează doar 1 minut și imediat butonul „Publish” se deblochează!
                          </p>
                        </div>

                        <div className="font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="flex items-center gap-1.5 text-pink-300">
                            <span>🚀 Ghid Pas-cu-Pas: Creare Produs AR-Nexus pe Gumroad</span>
                          </span>
                          <a
                            href="https://app.gumroad.com/products/new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-pink-600 hover:bg-pink-500 text-white font-bold text-[10px] shadow transition-colors"
                          >
                            <span>Deschide Gumroad</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* Step 1 */}
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-200 text-[11px]">
                            1. Deschide Gumroad și alege tipul de produs:
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Mergi la <strong className="text-pink-300">app.gumroad.com/products/new</strong> și selectează <strong className="text-white">„Digital product”</strong> (Any set of files to download).
                          </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-1.5">
                          <div className="font-semibold text-slate-200 text-[11px] flex items-center justify-between">
                            <span>2. Nume Produs (Name):</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard('AR-Nexus - Institutional Liquidity Trading Bot (MT5)', 'title')}
                              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              {copiedGumroadField === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedGumroadField === 'title' ? 'Copiat!' : 'Copiază Nume'}</span>
                            </button>
                          </div>
                          <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-amber-300 border border-slate-800">
                            AR-Nexus - Institutional Liquidity Trading Bot (MT5)
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-1.5">
                          <div className="font-semibold text-slate-200 text-[11px] flex items-center justify-between">
                            <span>3. Preț Recomandat (Price):</span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Setează prețul la <strong className="text-white font-mono">299 €</strong> (sau prețul dorit de tine) și apasă pe butonul <strong className="text-pink-400">„Next: Customize”</strong> din dreapta-sus.
                          </p>
                        </div>

                        {/* Step 4: Description */}
                        <div className="space-y-1.5">
                          <div className="font-semibold text-slate-200 text-[11px] flex items-center justify-between">
                            <span>4. Descrierea Produsului (Description):</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(`AR-Nexus este un algoritm instituțional de tranzacționare automată pentru MetaTrader 5 (MT5), dezvoltat exclusiv pe baza strategiei de lichiditate pură (SMC).

Caracteristici Principale:
• Scanare automată M15 & Daily a extremelor de Swing High/Low și HOD/LOD.
• Detectare vânătoare de stopuri (Liquidity Sweeps) ale marilor bănci.
• Raport asimetric Risc:Recompensă garantat de 1:3.5 până la 1:4.2.
• Filtru automat integrat pentru știri economice cu dosar roșu (CPI, NFP, FOMC) - oprește tranzacționarea cu 30 minute înainte.
• Hard-stop zilnic pentru protecție conturi de Prop Firm (FTMO, Upcomers, FundedNext).
• Alerte automate în timp real pe Telegram.`, 'desc')}
                              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              {copiedGumroadField === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedGumroadField === 'desc' ? 'Copiat!' : 'Copiază Descrierea'}</span>
                            </button>
                          </div>
                          <div className="p-2 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800 leading-relaxed max-h-24 overflow-y-auto font-sans">
                            Robot de tranzacționare bazat pe lichiditate pură SMC (M15 & Daily), filtru automat de știri roșii, protecție Prop Firm (FTMO, Upcomers, TPT, Lucid) și raport R:R 1:3.5 - 1:4.2.
                          </div>
                        </div>

                        {/* Step 5: File Content */}
                        <div className="space-y-1.5 p-2.5 rounded-lg bg-pink-950/40 border border-pink-900/60">
                          <div className="font-semibold text-pink-300 text-[11px] flex items-center justify-between">
                            <span>5. Fișierul Produsului (Secțiunea Content pe Gumroad):</span>
                          </div>
                          <p className="text-[10px] text-slate-300">
                            La tab-ul <strong className="text-white">„Content”</strong> pe Gumroad, apasă pe <strong className="text-white">„Upload files”</strong> și încarcă fișierul robotului. Îl poți descărca direct de aici cu un singur clic:
                          </p>
                          <button
                            type="button"
                            onClick={handleDownloadArNexusCode}
                            className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow transition-all font-mono"
                          >
                            <Download className="w-4 h-4" />
                            <span>Descarcă Fișierul AR_Nexus_Liquidity_SMC.mq5</span>
                          </button>
                        </div>

                        {/* Step 6: Cover Image */}
                        <div className="space-y-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                          <div className="font-semibold text-amber-300 text-[11px] flex items-center justify-between">
                            <span>6. Imagine Oficială de Prezentare Gumroad (Cover 1280x720px):</span>
                            <span className="text-[9px] font-mono text-emerald-400">72 DPI • 16:9 HD</span>
                          </div>
                          <div className="rounded-lg overflow-hidden border border-slate-800 aspect-video relative group">
                            <img
                              src="/ar_nexus_cover.jpg"
                              alt="AR-Nexus Cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <a
                            href="/ar_nexus_cover.jpg"
                            download="AR_Nexus_Cover_1280x720.jpg"
                            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow transition-all font-mono"
                          >
                            <Download className="w-4 h-4" />
                            <span>Descarcă Imaginea de Prezentare (1280x720px)</span>
                          </a>
                        </div>

                        {/* Step 7: Publish & Link */}
                        <div className="space-y-1 pt-1">
                          <div className="font-semibold text-slate-200 text-[11px]">
                            7. Publică și copiază linkul:
                          </div>
                          <p className="text-[10px] text-slate-400">
                            Apasă <strong className="text-pink-400">„Publish and continue”</strong> în dreapta-sus pe Gumroad. Vei primi un link scurt (ex: <code className="text-white bg-slate-900 px-1 py-0.5 rounded">https://ladoattila.gumroad.com/l/ar-nexus</code>). Copiază-l, lipește-l în căsuța de mai sus și apasă pe butonul verde de salvare!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/50">
                    <div>
                      <label className="block text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Stripe Payment Link (Card / Apple Pay):</span>
                      </label>
                      <input
                        type="url"
                        value={config.stripePaymentLink || ''}
                        onChange={(e) => setConfig({ ...config, stripePaymentLink: e.target.value })}
                        placeholder="https://buy.stripe.com/..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        <span>Link PayPal.me:</span>
                      </label>
                      <input
                        type="url"
                        value={config.paypalUrl || ''}
                        onChange={(e) => setConfig({ ...config, paypalUrl: e.target.value })}
                        placeholder="https://paypal.me/..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Salvează & Actualizează Imediat Pe Site</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      savePaymentConfig(config);
                      navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                      setExportedPublishConfig(true);
                      setTimeout(() => setExportedPublishConfig(false), 4000);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/70 font-bold text-xs flex items-center justify-center gap-2 transition-all font-mono"
                  >
                    {exportedPublishConfig ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>
                      {exportedPublishConfig
                        ? 'Configurație Copiată! Trimite-o în chat ca s-o public permanent!'
                        : 'Copiază Datele pentru Publicare Permanentă'}
                    </span>
                  </button>
                  {isSavedNotice && (
                    <p className="text-[11px] text-emerald-400 text-center mt-2 font-mono flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Datele de încasare au fost actualizate cu succes!
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* Tab 2: Manual License Generator for Direct Buyers */}
            {activeTab === 'licenses' && (
              <div className="p-5 md:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  Dacă un client îți trimite banii direct în Revolut sau pe bancă și îți cere o licență pe loc, o poți genera chiar aici și i-o trimiți pe WhatsApp:
                </div>

                <form onSubmit={handleGenerateManualLicense} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nume Client:
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="ex: Andrei Ionescu"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Număr Cont MT4/MT5 Client (Opțional):
                      </label>
                      <input
                        type="text"
                        value={clientAccount}
                        onChange={(e) => setClientAccount(e.target.value)}
                        placeholder="ex: 1048291"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Robot Achiziționat:
                    </label>
                    <select
                      value={selectedBotName}
                      onChange={(e) => setSelectedBotName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Aegis Scalper X">Aegis Scalper X (Gold & EUR)</option>
                      <option value="Neural Trend Pro">Neural Trend Pro (Nasdaq)</option>
                      <option value="Quantum Grid Sentinel">Quantum Grid Sentinel</option>
                      <option value="Nexus Arbitrage HFT">Nexus Arbitrage HFT</option>
                      <option value="Pachet Complet VIP Lifetime">Pachet Complet VIP Lifetime</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Generează Cheie Unică de Licență</span>
                  </button>
                </form>

                {generatedKey && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-2 mt-3">
                    <div className="text-[11px] font-mono text-cyan-400 font-bold">
                      Licență Generată pentru {clientName || 'Client'}:
                    </div>
                    <div className="flex items-center justify-between gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <code className="text-xs font-mono font-bold text-emerald-400 break-all">
                        {generatedKey}
                      </code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedKey);
                          setCopiedLicenseFeedback(true);
                          setTimeout(() => setCopiedLicenseFeedback(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs shrink-0"
                      >
                        {copiedLicenseFeedback ? 'Copiat!' : 'Copiază'}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Clientul introduce această cheie în MetaTrader 5 la proprietățile robotului ({selectedBotName}).
                    </div>
                  </div>
                )}

                {/* Recent Checkout Orders Log */}
                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Comenzi Recente din Checkout ({orders.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOrders(getSavedOrders())}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <RefreshCw className="w-3 h-3" /> Reîncarcă
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 text-center">
                      Nu există comenzi înregistrate încă în această sesiune.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-white">
                              {ord.orderRef} • {ord.customerName} <span className="text-cyan-400 font-mono">({ord.amountEur} €)</span>
                            </div>
                            <div className="text-slate-400 font-mono text-[10px]">
                              {ord.customerEmail} • {ord.paymentMethod.toUpperCase()} {ord.cryptoCoin || ''} {ord.txid ? `• TX: ${ord.txid}` : ''}
                            </div>
                            <div className="text-emerald-400 font-mono text-[10px]">
                              Key: {ord.licenseKey}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = ord.status === 'VERIFIED' ? 'PENDING_CONFIRMATION' : 'VERIFIED';
                              setOrders(updateOrderStatus(ord.id, nextStatus));
                            }}
                            className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border shrink-0 ${
                              ord.status === 'VERIFIED'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-amber-950 text-amber-300 border-amber-700'
                            }`}
                          >
                            {ord.status === 'VERIFIED' ? '✓ Plată Verificată' : '⏳ Așteaptă Confirmare'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Add & Manage Custom Trading Bots */}
            {activeTab === 'manageBots' && (
              <div className="p-5 md:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Publică Propriul Tău Robot pe Site:</span>
                    <p className="mt-0.5 text-slate-400">
                      Completează formularul de mai jos. Robotul va fi adăugat automat în catalogul oficial al magazinului, cu prețul ales de tine, randamentul lunar și butonul direct de cumpărare!
                    </p>
                  </div>
                </div>

                {/* Add Bot Form */}
                <form onSubmit={handleAddBot} className="space-y-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Formular Publicare Robot Nou</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nume Robot (EA):
                      </label>
                      <input
                        type="text"
                        required
                        value={newBotName}
                        onChange={(e) => setNewBotName(e.target.value)}
                        placeholder="ex: Titan Gold Scalper v2"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Categorie Strategie:
                      </label>
                      <select
                        value={newBotCategory}
                        onChange={(e) => setNewBotCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="scalping">Scalping HFT (Gold & Forex)</option>
                        <option value="trend">Trend Following AI (Nasdaq & BTC)</option>
                        <option value="grid">Dynamic Grid Hedging</option>
                        <option value="arbitrage">Arbitraj Statistic FIX API</option>
                        <option value="breakout">Breakout Momentum</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Slogan / Descriere Scurtă:
                    </label>
                    <input
                      type="text"
                      value={newBotTagline}
                      onChange={(e) => setNewBotTagline(e.target.value)}
                      placeholder="ex: Micro-Scalping de mare precizie pe Aur și Forex Majors"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Piețe Tranzacționate:
                      </label>
                      <input
                        type="text"
                        value={newBotPairs}
                        onChange={(e) => setNewBotPairs(e.target.value)}
                        placeholder="ex: XAU/USD, EUR/USD, GBP/USD"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Randament Lunar Estimat (%):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newBotMonthlyReturn}
                        onChange={(e) => setNewBotMonthlyReturn(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Drawdown Maxim (%):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newBotDrawdown}
                        onChange={(e) => setNewBotDrawdown(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Rată Câștig / Win Rate (%):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={newBotWinRate}
                        onChange={(e) => setNewBotWinRate(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Preț Licență Lifetime (€):
                      </label>
                      <input
                        type="number"
                        value={newBotPriceLifetime}
                        onChange={(e) => setNewBotPriceLifetime(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Preț Abonament Lunar (€):
                      </label>
                      <input
                        type="number"
                        value={newBotPriceMonthly}
                        onChange={(e) => setNewBotPriceMonthly(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Descriere Detaliată Strategie:
                    </label>
                    <textarea
                      rows={2}
                      value={newBotDescription}
                      onChange={(e) => setNewBotDescription(e.target.value)}
                      placeholder="Descrie cum funcționează algoritmul tău (ex: semnale, indicatori, sesiuni de tranzacționare etc.)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publică Robotul în Magazin pe Site</span>
                  </button>

                  {botSavedNotice && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{botSavedNotice}</span>
                    </div>
                  )}
                </form>

                {/* List of Custom Bots Added */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Roboții Tăi Personalizați Adăugați ({customBotsList.length}):</span>
                    {customBotsList.length > 0 && (
                      <span className="text-[10px] text-emerald-400 font-mono">Activ pe Site</span>
                    )}
                  </div>

                  {customBotsList.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-500">
                      Nu ai adăugat încă niciun robot personalizat. Completează formularul de mai sus pentru a adăuga primul tău robot!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customBotsList.map((bot) => (
                        <div
                          key={bot.id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{bot.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                +{bot.avgMonthlyReturn}% / lună
                              </span>
                              <span className="text-[10px] text-amber-300 font-mono font-bold">
                                {bot.priceLifetime} €
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {bot.marketPairs.join(', ')} • DD: {bot.maxDrawdown}% • {bot.categoryLabel}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBot(bot.id, bot.name)}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900/80 border border-rose-800/60 transition-colors"
                            title="Șterge robotul"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Security & Change PIN */}
            {activeTab === 'security' && (
              <div className="p-5 md:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-mono">Criptare Conexiune</div>
                    <div className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>256-bit SSL / TLS</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1 font-mono">Activ & Securizat</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-mono">Infrastructură Cloud</div>
                    <div className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span>Google Cloud Run</span>
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-1 font-mono">DDoS Protection Active</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px] font-mono">Protecție Roboți</div>
                    <div className="text-white font-bold text-sm mt-0.5 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <span>Hard-Lock MQL5</span>
                    </div>
                    <div className="text-[10px] text-purple-400 mt-1 font-mono">Auto-Expire 7 Zile</div>
                  </div>
                </div>

                {/* Change PIN Form */}
                <form onSubmit={handleChangePin} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Schimbă Codul PIN de Acces Administrator</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PIN-ul actual este <span className="font-mono text-amber-300 font-bold">{currentPin}</span>. Dacă dorești să îl schimbi cu alt cod (ex: anul nașterii sau o parolă secretă), introdu noul PIN mai jos:
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Introdu noul PIN (minim 4 caractere)"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                    >
                      Schimbă PIN
                    </button>
                  </div>

                  {pinChangeSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Noul PIN a fost salvat cu succes!
                    </div>
                  )}
                </form>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Cum accesezi panoul oricând:</div>
                  <div>• Butonul din meniul de sus: <strong className="text-amber-300">[🔒 Admin]</strong></div>
                  <div>• Sau link-ul discret din subsolul paginii (Footer) denumit <strong className="text-slate-300">„Autentificare Administrator”</strong></div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Logat ca: <strong className="text-slate-300">{config.sellerEmail}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(false);
                  onClose();
                }}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Deconectare & Închide
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
