import React, { useState } from 'react';
import { 
  X, Save, CheckCircle, ShieldCheck, CreditCard, Building2, Smartphone, DollarSign, Wallet,
  ExternalLink, Download, Copy, Check, HelpCircle, AlertTriangle 
} from 'lucide-react';
import { PaymentConfig } from '../types';
import { getPaymentConfig, savePaymentConfig } from '../data/paymentConfig';
import { ROBOT_SOURCE_CODES } from '../data/robotCodes';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (config: PaymentConfig) => void;
}

export const PaymentSettingsModal: React.FC<PaymentSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [config, setConfig] = useState<PaymentConfig>(getPaymentConfig());
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
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

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentConfig(config);
    onSaved(config);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 md:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Panou de Administrare Proprietar
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Configurare Conturi Bancare & Încasare Plăți
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 md:p-6 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            Aici introduci datele tale bancare, contul Revolut sau adresa Crypto. Când un cumpărător plasează o comandă pe site, aceste date îi vor fi afișate pentru a-ți trimite banii direct în contul tău!
          </p>

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
                placeholder="ex: Lado Attila sau Firma SRL"
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
                Număr WhatsApp (Confirmări & Dovezi Plată):
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
                Revolut Tag / Username:
              </label>
              <input
                type="text"
                value={config.revolutTag}
                onChange={(e) => setConfig({ ...config, revolutTag: e.target.value })}
                placeholder="ex: @attilalado sau număr Revolut"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                Numele Băncii Tale:
              </label>
              <input
                type="text"
                value={config.bankName}
                onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                placeholder="ex: Banca Transilvania / BCR / ING / Revolut Bank"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cont IBAN (EUR):
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
                Cont IBAN (RON):
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
                Adresă Portofel Crypto USDC (Stablecoin USD):
              </label>
              <input
                type="text"
                value={config.cryptoUsdtTrc20}
                onChange={(e) => setConfig({ ...config, cryptoUsdtTrc20: e.target.value })}
                placeholder="ex: 0x71C83D482f3C31A2D23c577D5b82Eb59f136eF70"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Adresă Bitcoin (BTC):
                </label>
                <input
                  type="text"
                  value={config.cryptoBtc || ''}
                  onChange={(e) => setConfig({ ...config, cryptoBtc: e.target.value })}
                  placeholder="bc1q..."
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Adresă Ethereum (ETH / ERC-20):
                </label>
                <input
                  type="text"
                  value={config.cryptoEth || ''}
                  onChange={(e) => setConfig({ ...config, cryptoEth: e.target.value })}
                  placeholder="0x..."
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Adresă Solana (SOL):
                </label>
                <input
                  type="text"
                  value={config.cryptoSol || ''}
                  onChange={(e) => setConfig({ ...config, cryptoSol: e.target.value })}
                  placeholder="SOL..."
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
                        <span>De ce Gumroad zice că „nu are modalitate de plată”?</span>
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
                      Gumroad nu te lasă să publici un produs plătit până când nu configurezi la <strong>Settings → Payouts</strong> unde să-ți trimită banii (contul de <strong>PayPal</strong> sau <strong>contul bancar IBAN</strong>). Odată completat, butonul de publicare devine activ imediat!
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
                      Robot de tranzacționare bazat pe lichiditate pură SMC (M15 & Daily), filtru automat de știri roșii, protecție Prop Firm (FTMO/Upcomers) și raport R:R 1:3.5 - 1:4.2.
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
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvează Datele de Încasare</span>
            </button>
            {isSavedNotice && (
              <p className="text-[11px] text-emerald-400 text-center mt-2 font-mono flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Datele de încasare au fost salvate și actualizate pe tot site-ul!
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
