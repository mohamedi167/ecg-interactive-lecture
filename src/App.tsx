import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { CirculationConductionSection } from './components/CirculationConductionSection';
import { NormalEcgSection } from './components/NormalEcgSection';
import { LeadsSection } from './components/LeadsSection';
import { RhythmAnalysisSection } from './components/RhythmAnalysisSection';
import { ProcedureSection } from './components/ProcedureSection';
import { LearningToolsSection } from './components/LearningToolsSection';

gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { t } = useLanguage();
  const [zeroG, setZeroG] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Reading progress tracker
  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress((window.scrollY / docHeight) * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Subtle GSAP scroll-reveal for sections (respecting prefers-reduced-motion)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('main > section:not(#hero)').forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        zeroG ? 'zero-g-active' : ''
      }`}
    >
      <AmbientBackdrop zeroG={zeroG} />
      <Navbar
        scrollProgress={scrollProgress}
        zeroG={zeroG}
        onToggleZeroG={() => setZeroG((z) => !z)}
      />

      <main className="relative z-10">
        <HeroSection />
        <IntroSection />
        <CirculationConductionSection />
        <NormalEcgSection />
        <LeadsSection />
        <RhythmAnalysisSection />
        <ProcedureSection />
        <LearningToolsSection />
      </main>

      {/* Closing Credits Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#041820]/85 backdrop-blur-md py-12 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-display text-2xl sm:text-3xl font-bold text-[#F2A33A]" dir="ltr">
            THANK YOU
          </p>
          <p className="text-sm sm:text-base text-[#EEF6F8] font-medium" dir="ltr">
            Dr. Ahmed Nabil · Supervised by Dr. Ahmed Abdelhafez
          </p>
          <p className="text-sm text-[#2DD4BF] font-medium">
            {t(
              'تصميم وتطوير الواجهة التفاعلية: Mohamed Ismael',
              'Interactive UI Designed & Built by Mohamed Ismael'
            )}
          </p>
          <p className="text-xs text-[#9CBAC4]">
            {t(
              'محاضرة تفاعلية تعليمية — تخطيط القلب الكهربائي (ECG)',
              'Interactive Medical Lecture — Electrocardiogram (ECG)'
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
