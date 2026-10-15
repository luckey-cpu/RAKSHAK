'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/lib/types';
import { translations, getTranslation } from '@/lib/translations';

interface AccessibilitySettings {
  contrast: 'normal' | 'high';
  fontSize: 'normal' | 'large' | 'xlarge';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  accessibility: AccessibilitySettings;
  setContrast: (contrast: 'normal' | 'high') => void;
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    contrast: 'normal',
    fontSize: 'normal'
  });

  useEffect(() => {
    // Restore user preferences
    try {
      const savedLang = localStorage.getItem('rakshak_lang') as Language;
      if (savedLang && ['en', 'hi', 'hinglish'].includes(savedLang)) {
        setLanguageState(savedLang);
      }
      const savedContrast = localStorage.getItem('rakshak_contrast') as 'normal' | 'high';
      const savedFontSize = localStorage.getItem('rakshak_font') as 'normal' | 'large' | 'xlarge';
      if (savedContrast || savedFontSize) {
        setAccessibility({
          contrast: savedContrast || 'normal',
          fontSize: savedFontSize || 'normal'
        });
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('rakshak_lang', lang);
    } catch {}
  };

  const setContrast = (contrast: 'normal' | 'high') => {
    setAccessibility(prev => {
      const next = { ...prev, contrast };
      try {
        localStorage.setItem('rakshak_contrast', contrast);
      } catch {}
      return next;
    });

    if (contrast === 'high') {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const setFontSize = (fontSize: 'normal' | 'large' | 'xlarge') => {
    setAccessibility(prev => {
      const next = { ...prev, fontSize };
      try {
        localStorage.setItem('rakshak_font', fontSize);
      } catch {}
      return next;
    });

    document.documentElement.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSize === 'large') {
      document.documentElement.classList.add('font-size-large');
    } else if (fontSize === 'xlarge') {
      document.documentElement.classList.add('font-size-xlarge');
    }
  };

  const t = (key: keyof typeof translations['en']): string => {
    const dict = getTranslation(language);
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        accessibility,
        setContrast,
        setFontSize,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
