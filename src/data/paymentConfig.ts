import { PaymentConfig } from '../types';

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  sellerName: 'Attila Lado / Nexus Quant Systems',
  sellerEmail: 'nexusquantvip@gmail.com',
  sellerPhone: '+40762808899',
  bankName: 'Banking Circle SA',
  ibanEur: 'DE19202208000047819179',
  ibanRon: '',
  revolutTag: '',
  cryptoUsdtTrc20: '0xcF211E63C41c2f46950E507ffd672793e5b1b035',
  cryptoBtc: '36yfpcFaLzbZSmyUipKv19EvAtqDAv9Wzt',
  cryptoEth: '0xcF211E63C41c2f46950E507ffd672793e5b1b035',
  cryptoSol: 'HdE7HPyLSDrtFo2wrN5aMdVFi47kMPgyafpJMZ1NNKTu',
  gumroadUrl: 'https://attilalado.gumroad.com/l/urznia',
  paypalUrl: '',
  stripePaymentLink: ''
};

export const PAYMENT_CONFIG = DEFAULT_PAYMENT_CONFIG;

export const getPaymentConfig = (): PaymentConfig => {
  try {
    const stored = localStorage.getItem('nexus_payment_config');
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = { ...DEFAULT_PAYMENT_CONFIG, ...parsed };
      if (!parsed.sellerEmail || parsed.sellerEmail === 'ladoattila67@gmail.com') {
        merged.sellerEmail = DEFAULT_PAYMENT_CONFIG.sellerEmail;
      }
      if (!parsed.sellerPhone || parsed.sellerPhone === '+40 720 000 000' || parsed.sellerPhone === '+40720000000') {
        merged.sellerPhone = DEFAULT_PAYMENT_CONFIG.sellerPhone;
      }
      if (parsed.stripePaymentLink === 'https://buy.stripe.com/demo_nexus_quant') {
        merged.stripePaymentLink = '';
      }
      if (parsed.paypalUrl === 'https://paypal.me/attilalado') {
        merged.paypalUrl = '';
      }
      return merged;
    }
  } catch {
    // fallback
  }
  return DEFAULT_PAYMENT_CONFIG;
};

export const savePaymentConfig = (config: PaymentConfig): void => {
  try {
    localStorage.setItem('nexus_payment_config', JSON.stringify(config));
    window.dispatchEvent(new Event('nexus-payment-config-updated'));
  } catch {
    // fallback
  }
};

export interface OrderRecord {
  id: string;
  orderRef: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  mtAccount: string;
  broker: string;
  itemName: string;
  amountEur: number;
  paymentMethod: 'gumroad' | 'crypto' | 'card' | 'revolut' | 'bank';
  cryptoCoin?: string;
  txid?: string;
  licenseKey: string;
  status: 'PENDING_CONFIRMATION' | 'VERIFIED';
}

export const getSavedOrders = (): OrderRecord[] => {
  try {
    const raw = localStorage.getItem('nexus_orders');
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
};

export const saveOrderRecord = (order: OrderRecord): void => {
  try {
    const existing = getSavedOrders();
    localStorage.setItem('nexus_orders', JSON.stringify([order, ...existing].slice(0, 50)));
  } catch {
    // fallback
  }
};

export const updateOrderStatus = (id: string, status: OrderRecord['status']): OrderRecord[] => {
  const updated = getSavedOrders().map((o) => (o.id === id ? { ...o, status } : o));
  try {
    localStorage.setItem('nexus_orders', JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
};

export type PaymentMethodKey = 'gumroad' | 'crypto' | 'card' | 'revolut' | 'bank';
export type CryptoCoinKey = 'usdc' | 'btc' | 'eth' | 'sol';

const DEMO_PLACEHOLDERS = {
  ibanEur: ['RO49BTRLEURCRT0000000001'],
  ibanRon: ['RO49BTRLRONCRT0000000001'],
  revolutTag: ['@attilalado'],
  usdc: ['TQ9x7Y12bLpKa9MnVzQ8fC5xPq7eRs3XyZ', '0x71C83D482f3C31A2D23c577D5b82Eb59f136eF70'],
  btc: ['bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'],
  eth: ['0x71C83D482f3C31A2D23c577D5b82Eb59f136eF70'],
  sol: ['7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'],
  gumroadUrl: ['https://nexusquant.gumroad.com/l/ar-nexus'],
  stripePaymentLink: ['https://buy.stripe.com/demo_nexus_quant'],
  paypalUrl: ['https://paypal.me/attilalado'],
};

const isReal = (val: string | undefined, demos: string[]): boolean => {
  const trimmed = (val || '').trim();
  return trimmed.length > 0 && !demos.includes(trimmed);
};

const isNonEmpty = (val: string | undefined): boolean => (val || '').trim().length > 0;

export interface CheckoutVisibility {
  hasAnyRealChannel: boolean;
  methods: PaymentMethodKey[];
  showIbanEur: boolean;
  showIbanRon: boolean;
  showRevolut: boolean;
  cryptoCoins: CryptoCoinKey[];
  showGumroad: boolean;
  showStripe: boolean;
  showPaypal: boolean;
}

export const getCheckoutPaymentVisibility = (cfg: PaymentConfig): CheckoutVisibility => {
  const realIbanEur = isReal(cfg.ibanEur, DEMO_PLACEHOLDERS.ibanEur);
  const realIbanRon = isReal(cfg.ibanRon, DEMO_PLACEHOLDERS.ibanRon);
  const realRevolut = isReal(cfg.revolutTag, DEMO_PLACEHOLDERS.revolutTag);
  const realUsdc = isReal(cfg.cryptoUsdtTrc20, DEMO_PLACEHOLDERS.usdc);
  const realBtc = isReal(cfg.cryptoBtc, DEMO_PLACEHOLDERS.btc);
  const realEth = isReal(cfg.cryptoEth, DEMO_PLACEHOLDERS.eth);
  const realSol = isReal(cfg.cryptoSol, DEMO_PLACEHOLDERS.sol);
  const realGumroad = isReal(cfg.gumroadUrl, DEMO_PLACEHOLDERS.gumroadUrl);
  const realStripe = isReal(cfg.stripePaymentLink, DEMO_PLACEHOLDERS.stripePaymentLink);
  const realPaypal = isReal(cfg.paypalUrl, DEMO_PLACEHOLDERS.paypalUrl);

  const hasAnyRealChannel =
    realIbanEur ||
    realIbanRon ||
    realRevolut ||
    realUsdc ||
    realBtc ||
    realEth ||
    realSol ||
    realGumroad ||
    realStripe ||
    realPaypal;

  // Once the seller enters any real payment detail, hide all untouched demo placeholders
  const showIbanEur = hasAnyRealChannel ? realIbanEur : isNonEmpty(cfg.ibanEur);
  const showIbanRon = hasAnyRealChannel ? realIbanRon : isNonEmpty(cfg.ibanRon);
  const showRevolut = hasAnyRealChannel ? realRevolut : isNonEmpty(cfg.revolutTag);
  const showGumroad = hasAnyRealChannel ? realGumroad : isNonEmpty(cfg.gumroadUrl);
  const showStripe = hasAnyRealChannel ? realStripe : isNonEmpty(cfg.stripePaymentLink);
  const showPaypal = hasAnyRealChannel ? realPaypal : isNonEmpty(cfg.paypalUrl);

  const cryptoCoins: CryptoCoinKey[] = [];
  if (hasAnyRealChannel ? realUsdc : isNonEmpty(cfg.cryptoUsdtTrc20)) cryptoCoins.push('usdc');
  if (hasAnyRealChannel ? realBtc : isNonEmpty(cfg.cryptoBtc)) cryptoCoins.push('btc');
  if (hasAnyRealChannel ? realEth : isNonEmpty(cfg.cryptoEth)) cryptoCoins.push('eth');
  if (hasAnyRealChannel ? realSol : isNonEmpty(cfg.cryptoSol)) cryptoCoins.push('sol');

  const methods: PaymentMethodKey[] = [];
  if (showRevolut) methods.push('revolut');
  if (showIbanEur || showIbanRon) methods.push('bank');
  if (cryptoCoins.length > 0) methods.push('crypto');
  if (showStripe || showPaypal) methods.push('card');
  if (showGumroad) methods.push('gumroad');

  return {
    hasAnyRealChannel,
    methods,
    showIbanEur,
    showIbanRon,
    showRevolut,
    cryptoCoins,
    showGumroad,
    showStripe,
    showPaypal,
  };
};

export const getPaymentChannelStatus = (cfg: PaymentConfig) => {
  return {
    bank: isReal(cfg.ibanEur, DEMO_PLACEHOLDERS.ibanEur) || isReal(cfg.ibanRon, DEMO_PLACEHOLDERS.ibanRon),
    revolut: isReal(cfg.revolutTag, DEMO_PLACEHOLDERS.revolutTag),
    crypto:
      isReal(cfg.cryptoUsdtTrc20, DEMO_PLACEHOLDERS.usdc) ||
      isReal(cfg.cryptoBtc, DEMO_PLACEHOLDERS.btc) ||
      isReal(cfg.cryptoEth, DEMO_PLACEHOLDERS.eth) ||
      isReal(cfg.cryptoSol, DEMO_PLACEHOLDERS.sol),
    gumroad: isReal(cfg.gumroadUrl, DEMO_PLACEHOLDERS.gumroadUrl),
    stripeOrPaypal:
      isReal(cfg.stripePaymentLink, DEMO_PLACEHOLDERS.stripePaymentLink) ||
      isReal(cfg.paypalUrl, DEMO_PLACEHOLDERS.paypalUrl),
  };
};

