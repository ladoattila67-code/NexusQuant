/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SetupGuideSection } from './components/SetupGuideSection';
import { LivePerformanceSection } from './components/LivePerformanceSection';
import { ExecutionNodesMap } from './components/ExecutionNodesMap';
import { BotMarketplace } from './components/BotMarketplace';
import { PropFirmsSection } from './components/PropFirmsSection';
import { EconomicCalendarSection } from './components/EconomicCalendarSection';
import { ProfitCalculator } from './components/ProfitCalculator';
import { LicensingPricing } from './components/LicensingPricing';
import { FaqAndTrustSection } from './components/FaqAndTrustSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { BotDetailModal } from './components/BotDetailModal';
import { DemoModal } from './components/DemoModal';
import { SourceCodeViewerModal } from './components/SourceCodeViewerModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { VisitorCounter } from './components/VisitorCounter';
import { PromoMarketingModal } from './components/PromoMarketingModal';
import { FloatingPromoButton } from './components/FloatingPromoButton';
import { ArNexusVideoModal } from './components/ArNexusVideoModal';
import { TRADING_BOTS, getAllTradingBots } from './data/tradingBots';
import { TradingBot } from './types';
import { Globe, ShieldCheck } from 'lucide-react';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [allBots, setAllBots] = useState<TradingBot[]>(getAllTradingBots());
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const refreshBots = () => {
    setAllBots(getAllTradingBots());
  };

  const [checkoutItem, setCheckoutItem] = useState<{
    name: string;
    price: number;
    isPackage?: boolean;
  }>({
    name: TRADING_BOTS[0].name,
    price: TRADING_BOTS[0].priceLifetime,
    isPackage: false
  });

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBotForDetail, setSelectedBotForDetail] = useState<TradingBot | null>(TRADING_BOTS[0]);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoInitialBotId, setDemoInitialBotId] = useState<string>(TRADING_BOTS[0].id);

  const handleOpenDemoForBot = (bot?: TradingBot) => {
    setDemoInitialBotId(bot ? bot.id : TRADING_BOTS[0].id);
    setIsDemoOpen(true);
  };

  // Google Maps demo quota detection listener
  useEffect(() => {
    const handleQuota = () => {
      setQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuota);
    };
  }, []);

  // Dynamic OpenGraph image & favicon sync with current host
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', `${origin}/og-image.jpg`);
      const ogImgSecure = document.querySelector('meta[property="og:image:secure_url"]');
      if (ogImgSecure) ogImgSecure.setAttribute('content', `${origin}/og-image.jpg`);
      const twImg = document.querySelector('meta[name="twitter:image"]');
      if (twImg) twImg.setAttribute('content', `${origin}/og-image.jpg`);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', origin);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', origin);
    }
  }, []);

  const handleSelectBotForCheckout = (bot: TradingBot, plan: 'lifetime' | 'monthly') => {
    setCheckoutItem({
      name: `${bot.name} (${plan === 'lifetime' ? 'Lifetime License' : 'Monthly Subscription'})`,
      price: plan === 'lifetime' ? bot.priceLifetime : bot.priceMonthly,
      isPackage: false
    });
    setIsCheckoutOpen(true);
  };

  const handleSelectPackageForCheckout = (packageName: string, price: number) => {
    setCheckoutItem({
      name: packageName,
      price: price,
      isPackage: true
    });
    setIsCheckoutOpen(true);
  };

  const handleOpenDetailModal = (bot: TradingBot) => {
    setSelectedBotForDetail(bot);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Google Maps Quota Warning Banner (if triggered) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Main Sticky Header */}
      <Header
        onOpenDemoModal={() => handleOpenDemoForBot()}
        onOpenSourceCodeModal={() => setIsSourceModalOpen(true)}
        onOpenPaymentSettings={() => setIsAdminPortalOpen(true)}
        onOpenPromoModal={() => setIsPromoModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection 
          onOpenDemoModal={() => handleOpenDemoForBot()} 
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
        />

        {/* 2. Interactive Setup Guide & Live MetaTrader Simulator */}
        <SetupGuideSection onOpenSourceCodeModal={() => setIsSourceModalOpen(true)} />

        {/* 3. Live Verified Performance Dashboard (Audit Myfxbook) */}
        <LivePerformanceSection />

        {/* 3. Global Co-Location & Execution Network (Google Maps Platform) */}
        <section id="retea-servere" className="py-16 md:py-24 bg-slate-950/80 border-t border-slate-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 mb-3">
                <Globe className="w-3.5 h-3.5" />
                <span>GOOGLE MAPS PLATFORM HFT INFRASTRUCTURE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Global Data Centers & Sub-Millisecond Execution
              </h2>
              <p className="text-slate-400 mt-3 text-base md:text-lg">
                Every millisecond matters in volatile markets. Our algorithms execute inside key Equinix nodes in London (LD4), New York (NY4), and Frankfurt (FR2) over private fiber links.
              </p>
            </div>

            {/* The Google Maps Component */}
            <ExecutionNodesMap />
          </div>
        </section>

        {/* 4. Trading Bots Marketplace & Catalog */}
        <BotMarketplace
          bots={allBots}
          onSelectBotForModal={handleOpenDetailModal}
          onSelectBotForCheckout={handleSelectBotForCheckout}
          onTryDemo={(bot) => handleOpenDemoForBot(bot)}
        />

        {/* 4.5. Top Prop Firms Comparison & Presets (FTMO, FundedNext, Funding Pips) */}
        <PropFirmsSection onOpenSourceModal={() => setIsSourceModalOpen(true)} />

        {/* 4.8. Economic Calendar & Red Folder News Guard */}
        <EconomicCalendarSection />

        {/* 5. Capital Growth & Profit Calculator */}
        <ProfitCalculator />

        {/* 6. Pricing & Licensing Packages */}
        <LicensingPricing onSelectTier={handleSelectPackageForCheckout} />

        {/* 7. FAQ, Testimonials & Guarantees */}
        <FaqAndTrustSection />
      </main>

      {/* Footer with Risk Disclaimers & Admin Login */}
      <Footer onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        itemName={checkoutItem.name}
        itemPrice={checkoutItem.price}
        isPackage={checkoutItem.isPackage}
      />

      <BotDetailModal
        bot={selectedBotForDetail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onBuy={(bot) => handleSelectBotForCheckout(bot, 'lifetime')}
        onTryDemo={(bot) => handleOpenDemoForBot(bot)}
      />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        initialBotId={demoInitialBotId}
      />

      <SourceCodeViewerModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
      />

      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
        onSaved={(newCfg) => console.log('Payment config updated:', newCfg)}
        onBotsUpdated={refreshBots}
      />

      {/* Promotion and Marketing Modal */}
      <PromoMarketingModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
      />

      {/* AR-Nexus Cinematic Video Presentation Modal */}
      <ArNexusVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onOpenCheckout={() => handleSelectBotForCheckout(allBots[0], 'lifetime')}
      />

      {/* Floating 1-Click Viral Promo and Quick Contact Button */}
      <FloatingPromoButton onOpenPromoModal={() => setIsPromoModalOpen(true)} />

      {/* Visitor Counter and Live Activity Notifications */}
      <VisitorCounter />
    </div>
  );
}
