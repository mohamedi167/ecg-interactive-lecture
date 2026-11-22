import React, { useState } from 'react';
import { ArrowDown, Activity, RotateCcw } from 'lucide-react';
import { Heart3D } from './Heart3D';
import { LiveEcgMonitor } from './LiveEcgMonitor';
import { HEART_PARTS_INFO, type HeartPartInfo } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t, isAr } = useLanguage();
  const [selectedPart, setSelectedPart] = useState<HeartPartInfo['id']>('sa_node');
  const [bpm, setBpm] = useState<number>(72);

  const activeInfo = HEART_PARTS_INFO[selectedPart];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-24 pb-16 px-4 sm:px-6 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Primary Column: Typography, Attribution, Live ECG & CTA */}
        <div className="lg:col-span-5 flex flex-col gap-5 z-10">
          <div className="text-xs sm:text-sm text-[#9CBAC4] flex flex-wrap items-center gap-2">
            <span>{t('تقديم Dr. Ahmed Nabil', 'Presented by Dr. Ahmed Nabil')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('إشراف Dr. Ahmed Abdelhafez', 'Supervised by Dr. Ahmed Abdelhafez')}</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-5xl xl:text-[54px] font-bold tracking-tight text-[#EEF6F8] leading-[1.12] [text-wrap:balance]"
            dir="ltr"
          >
            ELECTROCARDIOGRAM <span className="text-[#E8552E]">(ECG)</span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold text-[#F2A33A]">
            {t(
              'تخطيط القلب الكهربائي — رحلة بصرية ثلاثية الأبعاد',
              'Interactive 3D Cardiac Electrophysiology & Clinical Guide'
            )}
          </p>

          <p className="text-sm sm:text-base text-[#B8D0D8] leading-relaxed max-w-xl">
            {t(
              'استكشف كيف ينبض القلب، وكيف تنتقل الشرارة الكهربائية من SA Node إلى ألياف Purkinje، وكيف تقرأ الـ 12-Lead ECG بمنهجية سريرية دقيقة.',
              'Explore realistic 3D cardiac anatomy, trace electrical impulses from the SA Node to Purkinje Fibers, visualize blood flow across all four valves, and master 12-Lead ECG interpretation.'
            )}
          </p>

          {/* Synchronized Live ECG Strip */}
          <div className="glass-card rounded-2xl p-4 zg-float-a">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-[#EEF6F8]">
                <Activity className="w-4 h-4 text-[#E8552E]" aria-hidden="true" />
                <span>
                  {t(
                    'نبض القلب المباشر (متزامن مع المجسم 3D)',
                    'Live ECG Strip (Synced with 3D Heart)'
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="hero-bpm" className="text-[11px] text-[#9CBAC4]">
                  {t('السرعة:', 'Rate:')}
                </label>
                <input
                  id="hero-bpm"
                  type="range"
                  min={45}
                  max={135}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-20 accent-[#E8552E] cursor-pointer"
                />
                <span className="text-xs font-mono-num text-[#F2A33A] w-14 text-left" dir="ltr">
                  {bpm} bpm
                </span>
              </div>
            </div>
            <LiveEcgMonitor bpm={bpm} strokeColor="#2DD4BF" height={86} />
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#intro"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#E8552E] hover:bg-[#d64923] text-white font-bold text-sm sm:text-base shadow-[0_14px_34px_-8px_rgba(232,85,46,0.7)] transition-all hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <span>{t('ابدأ الرحلة', 'Start the Journey')}</span>
              <ArrowDown className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#quiz"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-[#EEF6F8] font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
            >
              {t('اختبر معلوماتك (10 أسئلة)', 'Take the 10-Question Quiz')}
            </a>
          </div>
        </div>

        {/* Center/Left Column: Interactive 3D Beating Heart Stage + Part Inspector */}
        <div className="lg:col-span-7 flex flex-col gap-4 z-10">
          <div className="relative h-[430px] sm:h-[500px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#0B3B4A]/35 to-[#041921]/75 overflow-hidden shadow-[0_28px_70px_-20px_rgba(0,0,0,0.85)]">
            <Heart3D
              mode="hero"
              bpm={bpm}
              selectedPart={selectedPart}
              onSelectPart={setSelectedPart}
            />

            {/* Bottom instruction & quick anatomical part/node selector inside viewport dock */}
            <div className="absolute bottom-3 inset-x-3 webgl-hud-surface rounded-2xl p-2.5 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'sa_node', ar: 'SA Node', en: 'SA Node' },
                    { id: 'bachmann', ar: 'Bachmann', en: "Bachmann's" },
                    { id: 'av_node', ar: 'AV Node', en: 'AV Node' },
                    { id: 'his_bundle', ar: 'Bundle of His', en: 'Bundle of His' },
                    { id: 'purkinje', ar: 'Purkinje', en: 'Purkinje' },
                    { id: 'ra_tv', ar: 'الأذين الأيمن + الثلاثي', en: 'RA + Tricuspid' },
                    { id: 'rv_pv', ar: 'البطين الأيمن + الرئوي', en: 'RV + Pulmonary' },
                    { id: 'la_mv', ar: 'الأذين الأيسر + الميترالي', en: 'LA + Mitral' },
                    { id: 'lv_av', ar: 'البطين الأيسر + الأورطي', en: 'LV + Aortic' },
                    { id: 'vessels', ar: 'الأوعية الكبرى', en: 'Great Vessels' },
                  ] as Array<{ id: HeartPartInfo['id']; ar: string; en: string }>
                ).map((item) => {
                  const active = selectedPart === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPart(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#E8552E] text-white'
                          : 'bg-white/6 text-[#B8D0D8] hover:bg-white/14 hover:text-white'
                      }`}
                    >
                      {isAr ? item.ar : item.en}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between gap-2 text-[11px] text-[#9CBAC4] px-1">
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#F2A33A]" aria-hidden="true" />
                  <span>
                    {t(
                      'اسحب للتدوير · كبّر بالعجلة · اضغط على أي عقدة أو حجرة',
                      'Drag to rotate · Scroll to zoom · Click any node or chamber'
                    )}
                  </span>
                </div>
                <span className="hidden sm:inline text-[#2DD4BF]" dir="ltr">
                  Blue = Deoxygenated · Red = Oxygenated
                </span>
              </div>
            </div>
          </div>

          {/* Selected Part Detail Card */}
          <div className="glass-card rounded-2xl p-4 sm:p-5 zg-float-b">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
              <h2 className="text-base sm:text-lg font-bold text-[#EEF6F8]">
                {isAr ? activeInfo.titleAr : activeInfo.titleEn}
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold" dir="ltr">
                {isAr && <span className="text-[#F2A33A]">{activeInfo.titleEn}</span>}
                {activeInfo.rateOrMetric && (
                  <>
                    {isAr && <span className="text-[#9CBAC4]">·</span>}
                    <span className="font-mono-num text-[#2DD4BF]">{activeInfo.rateOrMetric}</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-[#B8D0D8] leading-relaxed">
              {isAr ? activeInfo.roleAr : activeInfo.roleEn}
            </p>
            <p className="text-xs text-[#2DD4BF] mt-2 font-medium">
              {isAr ? activeInfo.ecgLinkAr : activeInfo.ecgLinkEn}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
