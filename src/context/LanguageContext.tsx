import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (ar: string, en: string) => string;
  isAr: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title =
      lang === 'ar'
        ? 'تخطيط القلب الكهربائي (ECG) — محاضرة تفاعلية | Dr. Ahmed Nabil'
        : 'Electrocardiogram (ECG) — Interactive Lecture | Dr. Ahmed Nabil';
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, toggleLang, t, isAr: lang === 'ar' }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
