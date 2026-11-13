import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageOption, SUPPORTED_LANGUAGES, TranslationDictionary } from './types';
import { en } from './translations/en';
import { ro } from './translations/ro';
import { hu } from './translations/hu';
import { de } from './translations/de';
import { es } from './translations/es';
import { zh } from './translations/zh';

const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en,
  ro,
  hu,
  de,
  es,
  zh,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  languages: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TITLES: Record<Language, string> = {
  en: 'Nexus Quant - Algorithmic Trading Bots MT5 | AR-Nexus & Prop Firms',
  ro: 'Nexus Quant - Roboți de Tranzacționare Algoritmică MT5 | AR-Nexus & Prop Firms',
  hu: 'Nexus Quant - Algoritmikus Kereskedési Robotok MT5 | AR-Nexus & Prop Cégek',
  de: 'Nexus Quant - Algorithmische Trading-Bots MT5 | AR-Nexus & Prop-Trading',
  es: 'Nexus Quant - Robots de Trading Algorítmico MT5 | AR-Nexus y Prop Firms',
  zh: 'Nexus Quant - MT5 量化算法自动化交易机器人 | AR-Nexus 与自营考核',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('nexus_language') as Language;
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en'; // Default primary language is English
  });

  const setLanguage = (lang: Language) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem('nexus_language', lang);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      if (TITLES[language]) {
        document.title = TITLES[language];
      }
    }
  }, [language]);

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language] || TRANSLATIONS.en,
        languages: SUPPORTED_LANGUAGES,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
