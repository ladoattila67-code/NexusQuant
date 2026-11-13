export type Language = 'en' | 'ro' | 'hu' | 'de' | 'es' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

export interface TranslationDictionary {
  nav: {
    bots: string;
    propFirms: string;
    calendar: string;
    howItWorks: string;
    livePerformance: string;
    hftNetwork: string;
    pricing: string;
    faq: string;
    admin: string;
    mql5Files: string;
    demo14Days: string;
    promote: string;
    buyLicense: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    ctaBuy: string;
    ctaDemo: string;
    ctaVideo: string;
    statWinRate: string;
    statMonthly: string;
    statProp: string;
    statDrawdown: string;
    statExecution: string;
    statVerifiedTrades: string;
  };
  marketplace: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterSMC: string;
    filterScalping: string;
    filterTrend: string;
    filterGrid: string;
    btnBuy: string;
    btnRent: string;
    btnDetails: string;
    btnDemo: string;
    lifetime: string;
    monthly: string;
    verifiedPass: string;
    officialBotBadge: string;
    riskLow: string;
    riskModerate: string;
    riskDynamic: string;
  };
  propFirms: {
    badge: string;
    title: string;
    titleHighlight1: string;
    titleTo: string;
    titleHighlight2: string;
    subtitle: string;
    selectSize: string;
    fee: string;
    target: string;
    whyIdeal: string;
    recommendedBot: string;
    downloadPreset: string;
    downloadPresetDesc: string;
    rulesTitle: string;
    eaAllowed: string;
    profitTarget: string;
    maxDailyLoss: string;
    maxTotalLoss: string;
    minTradingDays: string;
    leverage: string;
    guardTitle: string;
    guardDesc: string;
    strategyTitle: string;
    strategySubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    officialSite: string;
  };
  calendar: {
    badge: string;
    titlePart1: string;
    titleRed: string;
    titlePart2: string;
    subtitle: string;
    statusActive: string;
    statusSafe: string;
    statusActiveDesc: string;
    statusSafeDesc: string;
    telegramAlertSent: string;
    newsImpactHigh: string;
    newsImpactMedium: string;
    newsImpactLow: string;
    filterActiveTag: string;
    filterSafeTag: string;
  };
  performance: {
    badge: string;
    title: string;
    subtitle: string;
    auditedNote: string;
    monthlyReturn: string;
    sharpeRatio: string;
    profitFactor: string;
    winRate: string;
  };
  setup: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    tabLifetime: string;
    tabMonthly: string;
    mostPopular: string;
    btnOrder: string;
    includesTitle: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
  };
  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    initialCapital: string;
    monthlyReturn: string;
    periodMonths: string;
    projectedBalance: string;
    totalProfit: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
  };
  footer: {
    brandDesc: string;
    navTitle: string;
    securityTitle: string;
    disclaimer: string;
    rightsReserved: string;
  };
  common: {
    onlineUsers: string;
    totalVisits: string;
    telegramVip: string;
    whatsapp: string;
    promote: string;
    close: string;
    copy: string;
    copied: string;
  };
}
