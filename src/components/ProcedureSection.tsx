import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  ChevronDown,
  ClipboardCheck,
  HelpCircle,
} from 'lucide-react';
import { PROCEDURE_STEPS, PRACTICAL_QA } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

export const ProcedureSection: React.FC = () => {
  const { t, isAr } = useLanguage();
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);
  const [openQaId, setOpenQaId] = useState<string | null>(PRACTICAL_QA[0].id);

  const toggleStep = (num: number) => {
    setCompletedSteps((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const progressPct = Math.round((completedSteps.length / PROCEDURE_STEPS.length) * 100);

  return (
    <section id="procedure" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Title + Checklist Progress Bar */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
              06 · CLINICAL PROCEDURE (13 STEPS) &amp; PRACTICAL TROUBLESHOOTING
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
              {t(
                'خطوات إجراء تخطيط القلب السريرية (13 خطوة)',
                '13-Step Clinical ECG Procedure & Troubleshooting'
              )}
            </h2>
          </div>

          <div className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-4 min-w-[260px]">
            <ClipboardCheck className="w-5 h-5 text-[#2DD4BF] shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#B8D0D8]">
                  {t('قائمة التحقق السريرية', 'Clinical Checklist')}
                </span>
                <span className="font-mono-num font-bold text-[#F2A33A]" dir="ltr">
                  {completedSteps.length} / {PROCEDURE_STEPS.length} ({progressPct}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-[#2DD4BF] to-[#F2A33A] transition-all duration-300`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCompletedSteps([])}
              title={t('إعادة ضبط القائمة', 'Reset checklist')}
              aria-label={t('إعادة ضبط قائمة الخطوات', 'Reset procedure checklist')}
              className="p-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-[#9CBAC4] hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 13-Step Floating Glass Timeline / Interactive Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROCEDURE_STEPS.map((st, idx) => {
            const checked = completedSteps.includes(st.num);
            const floatClass =
              idx % 3 === 0 ? 'zg-float-a' : idx % 3 === 1 ? 'zg-float-b' : 'zg-float-c';
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => toggleStep(st.num)}
                aria-pressed={checked}
                className={`${isAr ? 'text-right' : 'text-left'} glass-card rounded-2xl p-5 flex flex-col justify-between gap-3 cursor-pointer transition-all hover:scale-[1.015] ${floatClass} ${
                  checked
                    ? 'border-[#2DD4BF]/55 bg-[#0E7C6B]/20'
                    : 'hover:border-white/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-mono-num text-xs font-bold text-[#F2A33A] shrink-0">
                      {st.num < 10 ? `0${st.num}` : st.num}
                    </span>
                    <span className="text-xs font-semibold text-[#9CBAC4]">
                      {isAr ? st.phaseAr : st.phaseEn}
                    </span>
                  </div>
                  {checked ? (
                    <CheckSquare className="w-5 h-5 text-[#2DD4BF] shrink-0" aria-hidden="true" />
                  ) : (
                    <Square className="w-5 h-5 text-[#9CBAC4] shrink-0" aria-hidden="true" />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#F2A33A] mb-0.5" dir="ltr">
                    {st.titleEn}
                  </p>
                  {isAr && (
                    <h3 className="text-base font-bold text-[#EEF6F8] mb-1.5">{st.titleAr}</h3>
                  )}
                  <p className="text-xs sm:text-sm text-[#B8D0D8] leading-relaxed">
                    {isAr ? st.detailAr : st.detailEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Practical Questions Accordion */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#E8552E]" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[#EEF6F8]">
              {t(
                'أسئلة عملية متكررة في الممارسة السريرية',
                'Common Clinical Troubleshooting Q&A'
              )}
            </h3>
          </div>

          <div className="space-y-3">
            {PRACTICAL_QA.map((qa) => {
              const isOpen = openQaId === qa.id;
              return (
                <div
                  key={qa.id}
                  className="rounded-2xl border border-white/15 bg-[#051F28]/70 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenQaId(isOpen ? null : qa.id)}
                    aria-expanded={isOpen}
                    className={`w-full px-5 py-4 flex items-center justify-between gap-4 ${
                      isAr ? 'text-right' : 'text-left'
                    } cursor-pointer hover:bg-white/5 transition-colors`}
                  >
                    <span className="text-sm sm:text-base font-bold text-[#EEF6F8]">
                      {isAr ? qa.questionAr : qa.questionEn}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#F2A33A] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#B8D0D8] leading-relaxed border-t border-white/10">
                      {isAr ? qa.answerAr : qa.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
