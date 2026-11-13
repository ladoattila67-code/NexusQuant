import React, { useState } from 'react';
import { X, Code2, Download, Copy, Check, FileCode, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { ROBOT_SOURCE_CODES } from '../data/robotCodes';

interface SourceCodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceCodeViewerModal: React.FC<SourceCodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedBotId, setSelectedBotId] = useState<string>('ar-nexus');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRobot = ROBOT_SOURCE_CODES[selectedBotId] || ROBOT_SOURCE_CODES['ar-nexus'];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRobot.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentRobot.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentRobot.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 md:p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                COD SURSĂ MQL5 NATIV
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                ✓ Compilabil în MetaEditor (F7)
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white">
              Structura & Fișierele de Cod ale Roboților
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Roboții sunt algoritmi matematici scriși în MQL5 (MetaQuotes Language) și C++, special concepuți pentru a rula în terminalul MetaTrader 4 & 5.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Robot Source Tabs */}
        <div className="flex items-center gap-2 px-5 pt-4 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
          {Object.values(ROBOT_SOURCE_CODES).map((robot) => (
            <button
              key={robot.id}
              onClick={() => setSelectedBotId(robot.id)}
              className={`pb-3 px-3 text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
                selectedBotId === robot.id
                  ? 'border-cyan-400 text-cyan-300 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{robot.filename}</span>
            </button>
          ))}
        </div>

        {/* Code Content View */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 bg-[#070b13] font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
            <div>
              Fișier: <span className="text-white font-bold">{currentRobot.filename}</span> • Simbol țintă:{' '}
              <span className="text-cyan-400">{currentRobot.targetSymbol}</span> • Timeframe:{' '}
              <span className="text-emerald-400">{currentRobot.timeframe}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copiat!' : 'Copiază'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadFile}
                className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1 transition-colors font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descarcă {currentRobot.filename}</span>
              </button>
            </div>
          </div>

          <pre className="overflow-x-auto p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] leading-relaxed text-slate-300 font-mono">
            <code>{currentRobot.code}</code>
          </pre>

          {/* Compilation Instructions Box */}
          <div className="mt-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Cum transformi acest cod într-un robot activ în MetaTrader:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed text-[11px]">
              <li>Descarcă fișierul <code className="text-cyan-300 font-bold">{currentRobot.filename}</code> folosind butonul de mai sus.</li>
              <li>Deschide <strong>MetaTrader 5</strong> și apasă tasta <strong className="text-white">F4</strong> (se va deschide editorul MetaEditor).</li>
              <li>Apasă <strong className="text-white">File ➔ New ➔ Expert Advisor (template)</strong> sau lipește codul într-un fișier nou salvat în folderul <code className="text-slate-300">MQL5/Experts/</code>.</li>
              <li>Apasă tasta <strong className="text-emerald-400">F7 (Compile)</strong>. MetaEditor va compila codul sursă și va genera automat fișierul executabil <code className="text-white font-bold">{currentRobot.filename.replace('.mq5', '.ex5')}</code> fără nicio eroare!</li>
              <li>Robotul apare instant în panoul <strong>Navigator</strong> din MetaTrader, gata de atașat pe grafic.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Licență comercială Nexus Quant • Drept de utilizare inclus
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Închide Fereastra
          </button>
        </div>
      </div>
    </div>
  );
};
