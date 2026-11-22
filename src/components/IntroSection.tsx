import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Maximize2,
  FlaskConical,
  Pill,
  ShieldCheck,
} from 'lucide-react';
import { INDICATIONS } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

const INDICATION_ICONS: Record<string, React.ReactNode> = {
  ischemia: <HeartPulse className="w-6 h-6 text-[#E8552E]" aria-hidden="true" />,
  rhythm: <Activity className="w-6 h-6 text-[#F2A33A]" aria-hidden="true" />,
  enlargement: <Maximize2 className="w-6 h-6 text-[#2DD4BF]" aria-hidden="true" />,
  electrolytes: <FlaskConical className="w-6 h-6 text-[#38BDF8]" aria-hidden="true" />,
  toxicity: <Pill className="w-6 h-6 text-[#FB7185]" aria-hidden="true" />,
  therapy: <ShieldCheck className="w-6 h-6 text-[#2DD4BF]" aria-hidden="true" />,
};

export const IntroSection: React.FC = () => {
  const { t, isAr } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(INDICATIONS[0].id);
  const selectedItem = INDICATIONS.find((item) => item.id === selectedId) ?? INDICATIONS[0];

  return (
    <section id="intro" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header + Definition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
              01 · INTRODUCTION TO ECG
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
              {t('ما هو تخطيط القلب الكهربائي؟', 'What is an Electrocardiogram (ECG)?')}
            </h2>
          </div>

          <div className="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-8 zg-float-a">
            {isAr ? (
              <p className="text-base sm:text-lg text-[#EEF6F8] leading-relaxed">
                تخطيط القلب الكهربائي{' '}
                <span className="font-display text-[#F2A33A] font-semibold" dir="ltr">
                  (Electrocardiogram - ECG)
                </span>{' '}
                هو اختبار طبي غير باضع (Non-invasive) يقيس ويسجل النشاط الكهربائي للقلب عبر أقطاب سطحية على الجلد، مما يساعد في تقييم{' '}
                <strong className="text-[#2DD4BF]">معدل القلب (Heart Rate)</strong>، و
                <strong className="text-[#2DD4BF]">نظم القلب (Rhythm)</strong>، وكفاءة العضلة القلبية، وتشخيص الحالات الحرجة مثل{' '}
                <strong className="text-[#E8552E]">الجلطة القلبية</strong> و
                <strong className="text-[#E8552E]">مشاكل الصمامات</strong>.
              </p>
            ) : (
              <p className="text-base sm:text-lg text-[#EEF6F8] leading-relaxed">
                An <span className="font-display text-[#F2A33A] font-semibold">Electrocardiogram (ECG)</span> is a rapid, non-invasive diagnostic test that records the heart’s electrical activity via surface skin electrodes. It evaluates <strong className="text-[#2DD4BF]">Heart Rate</strong>, <strong className="text-[#2DD4BF]">Cardiac Rhythm</strong>, myocardial performance, and detects critical pathologies such as <strong className="text-[#E8552E]">Myocardial Infarction</strong> and <strong className="text-[#E8552E]">Valvular Heart Disease</strong>.
              </p>
            )}
          </div>
        </div>

        {/* Indications Grid (Floating Glassmorphism Icons) */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#EEF6F8]">
              {t('دواعي إجراء التخطيط (Indications)', 'Clinical Indications for ECG')}
            </h3>
            <p className="text-xs sm:text-sm text-[#9CBAC4]">
              {t('اضغط على أي بطاقة لاستعراض الدلالة السريرية', 'Click any card to inspect clinical significance')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDICATIONS.map((item, idx) => {
              const isSelected = item.id === selectedId;
              const floatClass =
                idx % 3 === 0 ? 'zg-float-a' : idx % 3 === 1 ? 'zg-float-b' : 'zg-float-c';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  aria-pressed={isSelected}
                  className={`${isAr ? 'text-right' : 'text-left'} glass-card rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] ${floatClass} ${
                    isSelected
                      ? 'ring-2 ring-[#E8552E] bg-[#0B3B4A]/70'
                      : 'hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/8 border border-white/15 flex items-center justify-center shrink-0">
                      {INDICATION_ICONS[item.id]}
                    </div>
                    <span className="text-xs font-mono-num text-[#9CBAC4]" dir="ltr">
                      0{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F2A33A] mb-1" dir="ltr">
                    {item.titleEn}
                  </h4>
                  {isAr && (
                    <p className="text-base font-bold text-[#EEF6F8] mb-2">{item.titleAr}</p>
                  )}
                  <p className="text-xs sm:text-sm text-[#B8D0D8] leading-relaxed">
                    {isAr ? item.descriptionAr : item.descriptionEn}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Focused Clinical Insight Bar */}
          <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#F2A33A] font-semibold mb-1" dir="ltr">
                {selectedItem.titleEn}
              </p>
              <p className="text-sm sm:text-base text-[#EEF6F8] font-medium">
                {isAr ? selectedItem.clinicalNoteAr : selectedItem.clinicalNoteEn}
              </p>
            </div>
            <span className="text-xs text-[#2DD4BF] shrink-0 font-semibold">
              {t('مؤشر سريري معتمد', 'Core Clinical Indication')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
