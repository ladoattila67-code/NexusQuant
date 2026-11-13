import React, { useState } from 'react';
import { 
  X, CheckCircle, Download, Key, CreditCard, Send, Sparkles, 
  Copy, Check, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CryptoCoinKey,
  getCheckoutPaymentVisibility,
  getPaymentConfig,
  PaymentMethodKey,
  saveOrderRecord,
} from '../data/paymentConfig';
import { ROBOT_SOURCE_CODES } from '../data/robotCodes';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  isPackage?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  itemName,
  itemPrice,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mtAccount, setMtAccount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('revolut');
  const [cryptoCoin, setCryptoCoin] = useState<CryptoCoinKey>('usdc');
  const [cryptoTxid, setCryptoTxid] = useState('');
  const [cryptoCopied, setCryptoCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(getPaymentConfig());
  const [isCopied, setIsCopied] = useState(false);

  const visibility = React.useMemo(() => getCheckoutPaymentVisibility(paymentConfig), [paymentConfig]);

  // Re-read whenever modal opens & select first active configured channel
  React.useEffect(() => {
    if (isOpen) {
      const freshConfig = getPaymentConfig();
      const freshVis = getCheckoutPaymentVisibility(freshConfig);
      setPaymentConfig(freshConfig);
      if (freshVis.methods.length > 0 && !freshVis.methods.includes(paymentMethod)) {
        setPaymentMethod(freshVis.methods[0]);
      }
      if (freshVis.cryptoCoins.length > 0 && !freshVis.cryptoCoins.includes(cryptoCoin)) {
        setCryptoCoin(freshVis.cryptoCoins[0]);
      }
      setFormError('');
      setOrderRef(`NX-${Math.floor(100000 + Math.random() * 899999)}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const finalPrice = itemPrice;

  const copyFieldWithFeedback = (value: string, fieldId: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const getRevolutUrl = () => {
    const tag = (paymentConfig.revolutTag || '').trim();
    if (!tag) return '';
    if (tag.startsWith('http://') || tag.startsWith('https://')) return tag;
    return `https://revolut.me/${tag.replace(/^@/, '')}`;
  };

  const getCryptoAddress = () => {
    switch (cryptoCoin) {
      case 'btc':
        return (paymentConfig.cryptoBtc || '').trim();
      case 'eth':
        return (paymentConfig.cryptoEth || '').trim();
      case 'sol':
        return (paymentConfig.cryptoSol || '').trim();
      case 'usdc':
      default:
        return (paymentConfig.cryptoUsdtTrc20 || '').trim();
    }
  };

  const getCryptoNetwork = () => {
    switch (cryptoCoin) {
      case 'btc':
        return 'Bitcoin Mainnet (SegWit / Bech32)';
      case 'eth':
        return 'Ethereum (ERC-20)';
      case 'sol':
        return 'Solana Mainnet';
      case 'usdc':
      default:
        return 'USDC Stablecoin (ERC-20 / SOL / Base)';
    }
  };

  const handleCopyCrypto = () => {
    const addr = getCryptoAddress();
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setFormError('Te rugăm să completezi numele și adresa de email.');
      return;
    }

    setFormError('');
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const license = `NX-${randomHex}-${Math.floor(1000 + Math.random() * 9000)}-${mtAccount || 'LIVE'}-LD4`;
    const ref = orderRef || `NX-${Math.floor(100000 + Math.random() * 899999)}`;
    setOrderRef(ref);
    setGeneratedLicense(license);

    saveOrderRecord({
      id: `${Date.now()}`,
      orderRef: ref,
      createdAt: new Date().toISOString(),
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      mtAccount: mtAccount.trim() || 'Nedefinit',
      broker: 'Direct',
      itemName,
      amountEur: finalPrice,
      paymentMethod,
      cryptoCoin: paymentMethod === 'crypto' ? cryptoCoin.toUpperCase() : undefined,
      txid: cryptoTxid.trim() || undefined,
      licenseKey: license,
      status: 'PENDING_CONFIRMATION',
    });

    setIsCompleted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(generatedLicense);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const methodGridColsClass =
    visibility.methods.length === 1
      ? 'grid-cols-1'
      : visibility.methods.length === 2
      ? 'grid-cols-2'
      : visibility.methods.length === 3
      ? 'grid-cols-3'
      : visibility.methods.length === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : 'grid-cols-2 sm:grid-cols-5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 md:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <span>Finalizare Comandă Securizată</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">{itemName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isCompleted ? (
          <form onSubmit={handleSubmitOrder} className="p-5 md:p-6 space-y-4">
            {/* Price recap */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total de Plată:</div>
                <div className="text-2xl font-black font-mono text-white mt-0.5">{finalPrice} €</div>
              </div>
              <div className="text-right font-mono text-[11px] text-amber-300">
                Ref: {orderRef}
              </div>
            </div>

            {formError && (
              <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800 text-[11px] text-rose-300">
                {formError}
              </div>
            )}

            {/* Essential Buyer Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nume & Prenume:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Mihai Popa"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email (Livrare Licență):
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplu@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cont MT5 (Opțional):
                </label>
                <input
                  type="text"
                  value={mtAccount}
                  onChange={(e) => setMtAccount(e.target.value)}
                  placeholder="ex: 10842918"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Active Payment Method Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Date de Plată:
                </label>
              </div>

              <div className={`grid ${methodGridColsClass} gap-2 mb-3`}>
                {visibility.methods.includes('revolut') && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('revolut')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'revolut'
                        ? 'bg-blue-950/80 border-blue-400 text-blue-200 ring-1 ring-blue-500/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-extrabold text-blue-400 mb-0.5">R</div>
                    <div className="text-[11px] font-bold">Revolut</div>
                  </button>
                )}

                {visibility.methods.includes('bank') && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bank'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400 mb-0.5">IBAN</div>
                    <div className="text-[11px] font-bold">Transfer Bancar</div>
                  </button>
                )}

                {visibility.methods.includes('crypto') && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'crypto'
                        ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-1 ring-amber-500/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-400 mb-0.5">₿ / $</div>
                    <div className="text-[11px] font-bold">
                      {visibility.cryptoCoins.map((c) => c.toUpperCase()).join(' / ')}
                    </div>
                  </button>
                )}

                {visibility.methods.includes('card') && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 mx-auto mb-0.5 text-cyan-400" />
                    <div className="text-[11px] font-bold">
                      {visibility.showStripe && visibility.showPaypal
                        ? 'Card / PayPal'
                        : visibility.showStripe
                        ? 'Card (Stripe)'
                        : 'PayPal'}
                    </div>
                  </button>
                )}

                {visibility.methods.includes('gumroad') && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gumroad')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      paymentMethod === 'gumroad'
                        ? 'bg-pink-950/80 border-pink-400 text-pink-200 ring-1 ring-pink-500/50'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-black text-pink-400 mb-0.5">G</div>
                    <div className="text-[11px] font-bold">Gumroad</div>
                  </button>
                )}
              </div>

              {/* Only active payment details */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                {paymentMethod === 'gumroad' && visibility.showGumroad && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <div className="text-left w-full sm:w-auto">
                      <div className="text-xs font-bold text-white">Sumă: {finalPrice} €</div>
                      <div className="text-[10px] text-slate-400 font-mono">Ref: {orderRef}</div>
                    </div>
                    <a
                      href={paymentConfig.gumroadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all shrink-0"
                    >
                      <span>Plătește pe Gumroad</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {paymentMethod === 'crypto' && visibility.cryptoCoins.length > 0 && (
                  <div className="space-y-3 font-mono text-[11px]">
                    {visibility.cryptoCoins.length > 1 && (
                      <div
                        className={`grid gap-1.5 ${
                          visibility.cryptoCoins.length === 2
                            ? 'grid-cols-2'
                            : visibility.cryptoCoins.length === 3
                            ? 'grid-cols-3'
                            : 'grid-cols-4'
                        }`}
                      >
                        {visibility.cryptoCoins.map((coin) => (
                          <button
                            key={coin}
                            type="button"
                            onClick={() => setCryptoCoin(coin)}
                            className={`py-1.5 px-2 rounded-lg text-center transition-all text-[11px] font-bold ${
                              cryptoCoin === coin
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {coin.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Rețea:</span>
                        <span className="text-amber-400 font-bold">{getCryptoNetwork()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Sumă:</span>
                        <span className="text-white font-bold">
                          {cryptoCoin === 'usdc' ? `${finalPrice} USDC` : `Echivalentul a ${finalPrice} € în ${cryptoCoin.toUpperCase()}`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                        <span>Adresă Portofel {cryptoCoin.toUpperCase()}:</span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800 break-all">
                        <code className="text-xs text-amber-300 font-bold select-all">
                          {getCryptoAddress()}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyCrypto}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs shrink-0 ml-2 font-sans font-bold flex items-center gap-1 transition-colors"
                        >
                          {cryptoCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{cryptoCopied ? 'Copiat!' : 'Copiază'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        TXID / Hash Tranzacție (Opțional):
                      </label>
                      <input
                        type="text"
                        value={cryptoTxid}
                        onChange={(e) => setCryptoTxid(e.target.value)}
                        placeholder="Lipește hash-ul tranzacției dacă ai plătit deja"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (visibility.showIbanEur || visibility.showIbanRon) && (
                  <div className="space-y-2 font-mono text-[11px]">
                    {paymentConfig.sellerName && (
                      <div>Beneficiar: <span className="text-white font-bold">{paymentConfig.sellerName}</span></div>
                    )}
                    {paymentConfig.bankName && (
                      <div>Bancă: <span className="text-white">{paymentConfig.bankName}</span></div>
                    )}
                    {visibility.showIbanEur && (
                      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span>IBAN EUR: <strong className="text-emerald-400 select-all">{paymentConfig.ibanEur}</strong></span>
                        <button
                          type="button"
                          onClick={() => copyFieldWithFeedback(paymentConfig.ibanEur, 'ibanEur')}
                          className="text-cyan-400 hover:text-cyan-300 text-[10px] font-bold flex items-center gap-1"
                        >
                          {copiedField === 'ibanEur' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'ibanEur' ? 'Copiat!' : 'Copiază'}</span>
                        </button>
                      </div>
                    )}
                    {visibility.showIbanRon && (
                      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span>IBAN RON: <strong className="text-cyan-300 select-all">{paymentConfig.ibanRon}</strong></span>
                        <button
                          type="button"
                          onClick={() => copyFieldWithFeedback(paymentConfig.ibanRon, 'ibanRon')}
                          className="text-cyan-400 hover:text-cyan-300 text-[10px] font-bold flex items-center gap-1"
                        >
                          {copiedField === 'ibanRon' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'ibanRon' ? 'Copiat!' : 'Copiază'}</span>
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-[10px]">
                      <span className="text-slate-400">Sumă: <strong className="text-white">{finalPrice} €</strong> • Ref: <strong className="text-amber-300">{orderRef}</strong></span>
                      <button
                        type="button"
                        onClick={() => copyFieldWithFeedback(`${orderRef} ${itemName}`, 'orderRef')}
                        className="text-cyan-400 hover:underline"
                      >
                        {copiedField === 'orderRef' ? 'Copiat!' : 'Copiază Ref'}
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'revolut' && visibility.showRevolut && (
                  <div className="space-y-2.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Sumă: <strong className="text-white">{finalPrice} €</strong></span>
                      <span className="text-[10px] text-amber-300">Ref: {orderRef}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-base font-bold text-cyan-300 select-all">{paymentConfig.revolutTag}</span>
                      <button
                        type="button"
                        onClick={() => copyFieldWithFeedback(paymentConfig.revolutTag, 'revolut')}
                        className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
                      >
                        {copiedField === 'revolut' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'revolut' ? 'Copiat!' : 'Copiază Tag'}</span>
                      </button>
                    </div>
                    {getRevolutUrl() && (
                      <a
                        href={getRevolutUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>Plătește cu Revolut ({finalPrice} €)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {paymentMethod === 'card' && (visibility.showStripe || visibility.showPaypal) && (
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Sumă (Ref: {orderRef}):</span>
                      <span className="font-bold text-white font-mono">{finalPrice} EUR</span>
                    </div>
                    <div className={`grid gap-2 ${visibility.showStripe && visibility.showPaypal ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                      {visibility.showStripe && (
                        <a
                          href={paymentConfig.stripePaymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Plătește cu Cardul (Stripe)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {visibility.showPaypal && (
                        <a
                          href={paymentConfig.paypalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Plătește prin PayPal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {visibility.methods.length === 0 && (
                  <div className="text-center text-slate-300 text-xs py-2 space-y-1">
                    <div>Contact direct pentru detalii plată ({finalPrice} € • Ref: {orderRef}):</div>
                    <div className="font-mono text-cyan-300">{paymentConfig.sellerEmail}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all mt-4"
            >
              <span>Confirmă Comanda & Generează Licența</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Order Success / Instant Download State */
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white">Comandă Confirmată cu Succes!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Felicitări, {fullName}! Licența ta a fost activată și înregistrată în clusterul de autentificare Nexus Quant.
              </p>
            </div>

            {/* Generated License Key Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/60 text-left">
              <div className="text-[11px] font-mono text-cyan-400 flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Cheia Ta Unică de Licență:
                </span>
                <span className="text-[10px] text-emerald-400">ACTIVĂ</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <code className="text-sm md:text-base font-mono font-bold text-white break-all">
                  {generatedLicense}
                </code>
                <button
                  type="button"
                  onClick={handleCopyLicense}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors shrink-0"
                  title="Copiază cheia"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Copiază această cheie în câmpul `LicenseKey` din parametrii robotului în MetaTrader.
              </p>
            </div>

            {/* Instant Download Action Buttons */}
            <div className="space-y-2 text-left">
              <div className="text-xs font-semibold text-slate-300">
                Pachetul Tău de Descărcare Conține:
              </div>

              {/* Dynamic Robot Source Code Resolution */}
              {(() => {
                let resolvedKey = 'ar-nexus';
                const lowerName = itemName.toLowerCase();
                if (lowerName.includes('ar-nexus') || lowerName.includes('nexus')) resolvedKey = 'ar-nexus';
                else if (lowerName.includes('neural')) resolvedKey = 'neural-trend-pro';
                else if (lowerName.includes('grid')) resolvedKey = 'quantum-grid-sentinel';
                else if (lowerName.includes('titan')) resolvedKey = 'titan-breakout-hunter';
                else if (lowerName.includes('aegis')) resolvedKey = 'aegis-scalper-x';

                const targetBotSource = ROBOT_SOURCE_CODES[resolvedKey] || ROBOT_SOURCE_CODES['aegis-scalper-x'];
                const sanitizedAccount = mtAccount ? mtAccount.replace(/\D/g, '') || '0' : '0';
                const fullCodeWithLicense = targetBotSource.code
                  .replace(/InpLicenseKey\s*=\s*"[^"]*"/, `InpLicenseKey         = "${generatedLicense}"`)
                  .replace(/InpAllowedAccount\s*=\s*\d+/, `InpAllowedAccount     = ${sanitizedAccount}`);

                return (
                  <>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Download className="w-4 h-4 text-cyan-400" />
                        <div>
                          <span>Fișier Sursă Securizat ({targetBotSource.filename})</span>
                          {sanitizedAccount !== '0' && (
                            <span className="block text-[10px] text-cyan-400 font-mono">Legat de contul MT5: #{sanitizedAccount}</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const blob = new Blob([fullCodeWithLicense], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = targetBotSource.filename;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-mono text-[11px] border border-cyan-800 font-bold"
                      >
                        Descarcă .MQ5 Complet
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-200">
                        <Download className="w-4 h-4 text-emerald-400" />
                        <span>Preseturi Optimizate de Risc Prop Firm (.set files)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const setContent = `;+------------------------------------------------------------------+
;| Nexus Quant Systems - Preset Optimizat Prop Firm (${targetBotSource.name})
;| Cheie de licență: ${generatedLicense}
;| Cont Autorizat: ${sanitizedAccount}
;+------------------------------------------------------------------+
InpLicenseKey=${generatedLicense}
InpAllowedAccount=${sanitizedAccount}
InpExpirationDate=2026.12.31 23:59
InpLockToDemoOnly=false
InpEnableDailyGuard=true
InpMaxDailyLossPct=4.0
InpCloseOnWeekend=true
InpEnableNewsFilter=true
InpNewsPauseMins=30
InpCloseBeforeRedNews=false
InpMagicNumber=192837
InpLiqTF=15
InpSwingBars=5
InpUseHODLOD=true
InpMinSweepPoints=10
InpMaxInvalidatePts=400
InpAutoTrade=true
InpLots=0.10
InpRiskReward=3.5
InpSLBufferPts=30
InpMaxSpreadPts=35
`;
                          const blob = new Blob([setContent], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `${targetBotSource.id}_PropFirm_FTMO.set`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-mono text-[11px] border border-emerald-800 font-bold"
                      >
                        Descarcă .SET Optimizat
                      </button>
                    </div>
                  </>
                );
              })()}

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>Ghid Instalare MetaTrader 5 & Activare ({orderRef})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const guideText = `NEXUS QUANT SYSTEMS - GHID INSTALARE RAPIDA\nComanda: ${orderRef}\nProdus: ${itemName}\nLicenta: ${generatedLicense}\nCont MT4/MT5: ${mtAccount || 'Oricare'}\n\n1. Deschide MetaTrader 5 -> File -> Open Data Folder -> MQL5 -> Experts.\n2. Copiaza fisierul .mq5 descarcat in folderul Experts.\n3. Deschide MetaEditor (F4), deschide fisierul si apasa F7 (Compile).\n4. Ataseaza robotul pe grafic si lipeste cheia ${generatedLicense} la InpLicenseKey.\n5. Activeaza butonul Algo Trading din bara de sus.\n\nSuport VIP: WhatsApp +40762808899 (Grup NexusQuantum) | Telegram: t.me/NexusQuant | Email: ${paymentConfig.sellerEmail}`;
                    const blob = new Blob([guideText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `NexusQuant_Setup_Guide_${orderRef}.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] font-bold"
                >
                  Descarcă Ghid
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {(() => {
                const methodLabel = paymentMethod === 'gumroad'
                  ? 'Plată Gumroad'
                  : paymentMethod === 'crypto'
                  ? `Cripto ${cryptoCoin.toUpperCase()}${cryptoTxid ? ` (TXID: ${cryptoTxid})` : ''}`
                  : paymentMethod === 'revolut'
                  ? 'Revolut'
                  : paymentMethod === 'bank'
                  ? 'Transfer Bancar'
                  : 'Card Bancar / PayPal';

                const waMessage = `Bună ziua (NexusQuantum)! Am plasat comanda ${orderRef} pentru ${itemName}.\n• Licență: ${generatedLicense}\n• Metodă: ${methodLabel}\n• Sumă: ${finalPrice} €\n• Email: ${email}\nVă trimit confirmarea plății.`;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/${paymentConfig.sellerPhone.replace(/[^0-9]/g, '') || '40762808899'}?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Confirmă pe WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${paymentConfig.sellerEmail}?subject=${encodeURIComponent(`Confirmare Comandă ${orderRef} - ${itemName}`)}&body=${encodeURIComponent(waMessage)}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Confirmă pe Email</span>
                    </a>
                  </div>
                );
              })()}

              <div className="text-[11px] text-slate-400 text-center">
                Comandă <span className="text-amber-300 font-mono">{orderRef}</span> înregistrată pentru <span className="text-cyan-300 font-mono">{email}</span> • Notificare: <span className="text-slate-300 font-mono">{paymentConfig.sellerEmail}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Închide Fereastra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
