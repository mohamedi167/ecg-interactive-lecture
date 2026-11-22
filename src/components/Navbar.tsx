import React from 'react';
import { Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  scrollProgress: number;
  zeroG: boolean;
  onToggleZeroG: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scrollProgress,
  zeroG,
  onToggleZeroG,
}) => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#051F28]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#hero"
          className="text-base sm:text-lg font-bold text-[#EEF6F8] hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
        >
          <span className="font-display tracking-wide" dir="ltr">
            ECG
          </span>
          <span className="mx-2 text-[#9CBAC4]">·</span>
          <span>{t('تخطيط القلب', 'Cardiac Lecture')}</span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label={t('التنقل الرئيسي', 'Main navigation')}
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#B8D0D8]"
        >
          <a
            href="#intro"
            className="hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
          >
            {t('المقدمة', 'Intro')}
          </a>
          <a
            href="#conduction"
            className="hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
          >
            {t('الدورة والتوصيل', 'Conduction')}
          </a>
          <a
            href="#normal-ecg"
            className="hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
          >
            {t('الموجة والورق', 'Waveforms')}
          </a>
          <a
            href="#leads"
            className="hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
          >
            {t('التوصيلات 3D', '3D Leads')}
          </a>
          <a
            href="#rhythm"
            className="hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
          >
            {t('التحليل والخطوات', 'Analysis')}
          </a>
          <a
            href="#quiz"
            className="hover:text-[#F2A33A] transition-colors whitespace-nowrap shrink-0"
          >
            {t('الاختبار', 'Quiz')}
          </a>
        </nav>

        {/* Zone 3: Language Switch + Zero-G Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('التبديل إلى النسخة الإنجليزية', 'Switch to Arabic version')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/8 hover:bg-white/15 border border-white/15 text-[#EEF6F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#2DD4BF]" aria-hidden="true" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleZeroG}
            aria-pressed={zeroG}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              zeroG
                ? 'bg-[#E8552E] text-white shadow-[0_8px_24px_-6px_rgba(232,85,46,0.65)] hover:bg-[#d54722]'
                : 'bg-white/10 text-[#EEF6F8] border border-white/20 hover:bg-white/15'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{zeroG ? t('Zero-G: مفعل', 'Zero-G: On') : t('Zero-G: متوقف', 'Zero-G: Off')}</span>
          </button>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="h-[2.5px] w-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-l from-[#E8552E] via-[#F2A33A] to-[#0E7C6B] transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress))}%` }}
        />
      </div>
    </header>
  );
};
