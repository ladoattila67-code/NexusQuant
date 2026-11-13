import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Shield, Sparkles, Copy, Check, Download } from 'lucide-react';
import { TRADING_BOTS } from '../data/tradingBots';
import { ROBOT_SOURCE_CODES } from '../data/robotCodes';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBotId?: string;
}

interface DemoCopy {
  badge: string;
  title: string;
  desc: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  botLabel: string;
  platformLabel: string;
  platformRec: string;
  noCard: string;
  submitBtn: string;
  errRequired: string;
  successTitle: string;
  successDesc: string;
  keyLabel: string;
  copyBtn: string;
  copiedBtn: string;
  downloadBtn: string;
  validityNote: string;
  closeBtn: string;
}

const DEMO_COPY: Record<Language, DemoCopy> = {
  en: {
    badge: 'Free Access • No Commitment',
    title: 'Claim Your Free 7-Day Demo',
    desc: 'Get an instant 7-day license key for any MetaTrader Demo account and full Strategy Tester optimization with preset configurations included.',
    nameLabel: 'Full Name:',
    namePlaceholder: 'e.g. Alex Carter',
    emailLabel: 'Email Address (for demo key & presets):',
    emailPlaceholder: 'alex@example.com',
    botLabel: 'Select Trading Bot:',
    platformLabel: 'Platform:',
    platformRec: 'MetaTrader 5 (Recommended)',
    noCard: 'No credit card required. Your 7-day Free Demo key activates immediately.',
    submitBtn: 'Activate 7-Day Free Demo',
    errRequired: 'Please enter both your name and a valid email address.',
    successTitle: 'Your 7-Day Free Demo is Ready!',
    successDesc: 'Paste this license key into InpLicenseKey in MetaTrader (valid 7 days on any Demo account + unlimited Strategy Tester).',
    keyLabel: 'Free 7-Day Demo Key:',
    copyBtn: 'Copy Key',
    copiedBtn: 'Copied!',
    downloadBtn: 'Download MQL5 File',
    validityNote: 'Active for 7 days on MT4/MT5 Demo Accounts • Full Strategy Tester enabled',
    closeBtn: 'Done, Close Window',
  },
  ro: {
    badge: 'Acces Gratuit • Fără Angajament',
    title: 'Activează Demo Gratuit 7 Zile',
    desc: 'Primești instant o cheie de test valabilă 7 zile pentru orice cont Demo MetaTrader și Strategy Tester nelimitat, cu toate funcțiile și presetările optimizate.',
    nameLabel: 'Nume Complet:',
    namePlaceholder: 'ex: Alex Moldovan',
    emailLabel: 'Adresă de Email (pentru cheia demo & setări):',
    emailPlaceholder: 'alex@exemplu.ro',
    botLabel: 'Robotul Dorit pentru Test:',
    platformLabel: 'Platforma Ta:',
    platformRec: 'MetaTrader 5 (Recomandat)',
    noCard: 'Nu este necesar card bancar. Licența Demo 7 Zile se activează instantaneu.',
    submitBtn: 'Activează Demo Gratuit 7 Zile',
    errRequired: 'Te rugăm să completezi numele și o adresă de email validă.',
    successTitle: 'Licența Demo 7 Zile a fost Generată!',
    successDesc: 'Lipește cheia de mai jos în parametrul InpLicenseKey din MetaTrader (valabilă 7 zile pe orice cont Demo + Strategy Tester nelimitat).',
    keyLabel: 'Cheie Demo Gratuit 7 Zile:',
    copyBtn: 'Copiază Cheia',
    copiedBtn: 'Copiat!',
    downloadBtn: 'Descarcă Fișier MQL5',
    validityNote: 'Valabilă 7 zile pe conturi Demo MT4/MT5 • Strategy Tester nelimitat',
    closeBtn: 'Am înțeles, închide',
  },
  hu: {
    badge: 'Ingyenes Hozzáférés • Kötelezettség Nélkül',
    title: '7 Napos Ingyenes Demó Aktiválása',
    desc: 'Azonnali 7 napos próbakulcsot kapsz bármely MetaTrader Demó számlához és Strategy Tester optimalizáláshoz, teljes funkcionalitással.',
    nameLabel: 'Teljes Név:',
    namePlaceholder: 'pl. Kovács Ádám',
    emailLabel: 'E-mail Cím (demó kulcshoz):',
    emailPlaceholder: 'adam@pelda.hu',
    botLabel: 'Választott Kereskedő Robot:',
    platformLabel: 'Platform:',
    platformRec: 'MetaTrader 5 (Ajánlott)',
    noCard: 'Bankkártya nem szükséges. A 7 napos Ingyenes Demó azonnal aktiválódik.',
    submitBtn: '7 Napos Ingyenes Demó Aktiválása',
    errRequired: 'Kérjük, add meg a neved és egy érvényes e-mail címet.',
    successTitle: 'A 7 Napos Demó Licenc Elkészült!',
    successDesc: 'Illeszd be az alábbi kulcsot az InpLicenseKey mezőbe a MetaTraderben (7 napig aktív Demó számlán + korlátlan Strategy Tester).',
    keyLabel: '7 Napos Ingyenes Demó Kulcs:',
    copyBtn: 'Kulcs Másolása',
    copiedBtn: 'Másolva!',
    downloadBtn: 'MQL5 Fájl Letöltése',
    validityNote: '7 napig érvényes MT4/MT5 Demó számlán • Korlátlan Strategy Tester',
    closeBtn: 'Rendben, bezárás',
  },
  de: {
    badge: 'Kostenloser Zugang • Unverbindlich',
    title: '7-Tage-Demo Kostenlos Aktivieren',
    desc: 'Erhalte sofort einen 7-Tage-Testschlüssel für jedes MetaTrader-Demokonto sowie unbegrenzte Strategy-Tester-Optimierung mit optimierten Presets.',
    nameLabel: 'Vollständiger Name:',
    namePlaceholder: 'z. B. Lukas Weber',
    emailLabel: 'E-Mail-Adresse (für Demo-Schlüssel):',
    emailPlaceholder: 'lukas@beispiel.de',
    botLabel: 'Trading-Roboter auswählen:',
    platformLabel: 'Plattform:',
    platformRec: 'MetaTrader 5 (Empfohlen)',
    noCard: 'Keine Kreditkarte erforderlich. Dein 7-Tage-Demo-Schlüssel wird sofort aktiviert.',
    submitBtn: '7-Tage-Demo Kostenlos Starten',
    errRequired: 'Bitte gib deinen Namen und eine gültige E-Mail-Adresse ein.',
    successTitle: 'Deine 7-Tage-Demo ist Bereit!',
    successDesc: 'Füge diesen Schlüssel in MetaTrader unter InpLicenseKey ein (7 Tage gültig auf Demo-Konten + unbegrenzter Strategy Tester).',
    keyLabel: '7-Tage-Demo-Schlüssel:',
    copyBtn: 'Schlüssel Kopieren',
    copiedBtn: 'Kopiert!',
    downloadBtn: 'MQL5-Datei Herunterladen',
    validityNote: '7 Tage aktiv auf MT4/MT5 Demokonten • Strategy Tester aktiviert',
    closeBtn: 'Fertig, schließen',
  },
  es: {
    badge: 'Acceso Gratuito • Sin Compromiso',
    title: 'Activa tu Demo Gratis de 7 Días',
    desc: 'Obtén al instante una clave de prueba de 7 días para cualquier cuenta Demo de MetaTrader y optimización completa en Strategy Tester con presets incluidos.',
    nameLabel: 'Nombre Completo:',
    namePlaceholder: 'ej. Carlos Mendoza',
    emailLabel: 'Correo Electrónico (para recibir la clave):',
    emailPlaceholder: 'carlos@ejemplo.com',
    botLabel: 'Selecciona el Robot:',
    platformLabel: 'Plataforma:',
    platformRec: 'MetaTrader 5 (Recomendado)',
    noCard: 'No requiere tarjeta de crédito. Tu licencia Demo de 7 días se activa al instante.',
    submitBtn: 'Activar Demo Gratis 7 Días',
    errRequired: 'Por favor, completa tu nombre y un correo electrónico válido.',
    successTitle: '¡Tu Demo Gratis de 7 Días está Lista!',
    successDesc: 'Pega esta clave en InpLicenseKey dentro de MetaTrader (válida 7 días en cuentas Demo + Strategy Tester ilimitado).',
    keyLabel: 'Clave Demo Gratis 7 Días:',
    copyBtn: 'Copiar Clave',
    copiedBtn: '¡Copiado!',
    downloadBtn: 'Descargar Archivo MQL5',
    validityNote: 'Válido 7 días en cuentas Demo MT4/MT5 • Strategy Tester ilimitado',
    closeBtn: 'Entendido, cerrar',
  },
  zh: {
    badge: '免费试用 • 无需绑定银行卡',
    title: '免费激活 7 天模拟试用',
    desc: '立即获取适用于任意 MetaTrader 模拟账户的 7 天试用授权密钥，支持完整 EA 功能及 Strategy Tester 参数回测优化。',
    nameLabel: '您的姓名：',
    namePlaceholder: '例如：张伟',
    emailLabel: '电子邮箱（接收试用密钥）：',
    emailPlaceholder: 'name@example.com',
    botLabel: '选择交易机器人：',
    platformLabel: '交易平台：',
    platformRec: 'MetaTrader 5（推荐）',
    noCard: '无需信用卡，7 天免费模拟授权密钥即时生成激活。',
    submitBtn: '立即激活 7 天免费模拟试用',
    errRequired: '请填写您的姓名和有效的电子邮箱地址。',
    successTitle: '7 天免费试用密钥已生成！',
    successDesc: '将下方密钥粘贴至 MetaTrader 参数 InpLicenseKey 中（支持所有模拟盘试用 7 天 + 无限次策略测试）。',
    keyLabel: '7 天免费试用密钥：',
    copyBtn: '复制密钥',
    copiedBtn: '已复制！',
    downloadBtn: '下载 MQL5 源码文件',
    validityNote: '支持 MT4/MT5 模拟账户免费使用 7 天 • 支持策略回测优化',
    closeBtn: '完成并关闭',
  },
};

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, initialBotId }) => {
  const { language } = useLanguage();
  const copy = DEMO_COPY[language] || DEMO_COPY.en;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedBotId, setSelectedBotId] = useState(initialBotId || TRADING_BOTS[0].id);
  const [platform, setPlatform] = useState('MT5');
  const [isSuccess, setIsSuccess] = useState(false);
  const [demoKey, setDemoKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialBotId) {
        setSelectedBotId(initialBotId);
      }
      setErrorMsg('');
    }
  }, [isOpen, initialBotId]);

  if (!isOpen) return null;

  const matchedSource =
    ROBOT_SOURCE_CODES[selectedBotId] ||
    (selectedBotId.includes('titan') ? ROBOT_SOURCE_CODES['titan-breakout-hunter'] : undefined) ||
    (selectedBotId.includes('neural') ? ROBOT_SOURCE_CODES['neural-trend'] : undefined) ||
    (selectedBotId.includes('quantum') ? ROBOT_SOURCE_CODES['quantum-grid-sentinel'] : undefined) ||
    (selectedBotId.includes('aegis') ? ROBOT_SOURCE_CODES['aegis-scalper'] : undefined) ||
    ROBOT_SOURCE_CODES['ar-nexus'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg(copy.errRequired);
      return;
    }

    setErrorMsg('');
    const key = `DEMO-7D-${Math.random().toString(36).substring(2, 7).toUpperCase()}-NEXUS`;
    setDemoKey(key);
    setIsSuccess(true);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(demoKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadDemoBot = () => {
    const codeWithDemoKey = matchedSource.code.replace(
      /(input\s+string\s+InpLicenseKey\s*=\s*")[^"]*(")/,
      `$1${demoKey}$2`
    );
    const blob = new Blob([codeWithDemoKey], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = matchedSource.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        <div className="p-5 md:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              {copy.badge}
            </div>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {copy.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              {copy.desc}
            </p>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {copy.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.namePlaceholder}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {copy.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.emailPlaceholder}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {copy.botLabel}
                </label>
                <select
                  value={selectedBotId}
                  onChange={(e) => setSelectedBotId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {TRADING_BOTS.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name} ({bot.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {copy.platformLabel}
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="MT5">{copy.platformRec}</option>
                  <option value="MT4">MetaTrader 4</option>
                  <option value="cTrader">cTrader</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{copy.noCard}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all mt-2"
            >
              <span>{copy.submitBtn}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">{copy.successTitle}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {copy.successDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2">
              <div className="text-[11px] font-mono text-cyan-400">{copy.keyLabel}</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm font-mono font-bold text-white bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                  {demoKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? copy.copiedBtn : copy.copyBtn}</span>
                </button>
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                ✓ {copy.validityNote}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadDemoBot}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{copy.downloadBtn} ({matchedSource.filename})</span>
            </button>

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              {copy.closeBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
