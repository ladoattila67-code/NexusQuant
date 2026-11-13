import React from 'react';
import { Activity, ShieldAlert, Mail, Send, PhoneCall, Lock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#05070c] border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-black text-white">
                NEXUS<span className="text-cyan-400">QUANT</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              {t.footer.brandDesc}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Equinix LD4 / NY4 HFT Nodes
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                18,430+ {t.common.totalVisits}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white mb-3">
              {t.footer.navTitle}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalog-roboti" className="hover:text-cyan-400 transition-colors">
                  {t.nav.bots}
                </a>
              </li>
              <li>
                <a href="#prop-firms" className="hover:text-cyan-400 transition-colors text-emerald-400 font-semibold">
                  {t.nav.propFirms}
                </a>
              </li>
              <li>
                <a href="#performanta-live" className="hover:text-cyan-400 transition-colors">
                  {t.nav.livePerformance}
                </a>
              </li>
              <li>
                <a href="#retea-servere" className="hover:text-cyan-400 transition-colors">
                  {t.nav.hftNetwork}
                </a>
              </li>
              <li>
                <a href="#calculator-profit" className="hover:text-cyan-400 transition-colors">
                  {t.calculator.badge}
                </a>
              </li>
              <li>
                <a href="#preturi" className="hover:text-cyan-400 transition-colors">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-400 transition-colors">
                  {t.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white mb-3">
              VIP Support
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <a href="mailto:nexusquantvip@gmail.com" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  nexusquantvip@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <a
                  href="https://t.me/NexusQuant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  Telegram Grup: NexusQuant
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/40762808899?text=Salut!%20Vreau%20s%C4%83%20intru%20%C3%AEn%20grupul%20NexusQuantum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: +40762808899 (Grup NexusQuantum)
                </a>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Mon - Fri: 08:00 - 22:00 UTC+2
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Financial Risk Disclosure */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-900 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t.footer.securityTitle}</span>
          </div>
          <p>
            {t.footer.disclaimer}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} {t.footer.rightsReserved}
          </div>
          <div className="flex items-center gap-4">
            <a href="#faq" className="hover:text-cyan-400">Terms</a>
            <a href="#faq" className="hover:text-cyan-400">Privacy</a>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors font-mono"
              >
                <Lock className="w-3 h-3 text-amber-500/80" />
                <span>{t.nav.admin}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
