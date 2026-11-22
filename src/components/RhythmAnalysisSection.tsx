import React, { useState } from 'react';
import { Calculator, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { RHYTHM_STEPS } from '../data/ecgData';
import { LiveEcgMonitor } from './LiveEcgMonitor';
import { useLanguage } from '../context/LanguageContext';

export const RhythmAnalysisSection: React.FC = () => {
  const { t, isAr } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [rhythmType, setRhythmType] = useState<'regular' | 'irregular'>('regular');
  const [largeBoxes, setLargeBoxes] = useState<number>(4);
  const [qrsIn6Sec, setQrsIn6Sec] = useState<number>(8);

  const calculatedRate =
    rhythmType === 'regular'
      ? largeBoxes > 0
        ? Math.round(300 / largeBoxes)
        : 0
      : Math.round(qrsIn6Sec * 10);

  const getRateStatus = (hr: number) => {
    if (hr < 60) {
      return {
        labelEn: 'Bradycardia (< 60 bpm)',
        labelAr: 'بطء ضربات القلب (< 60 bpm)',
        colorClass: 'text-[#38BDF8] border-[#38BDF8]/40 bg-[#38BDF8]/10',
        icon: <AlertTriangle className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />,
      };
    }
    if (hr <= 100) {
      return {
        labelEn: 'Normal Rate (60 – 100 bpm)',
        labelAr: 'معدل طبيعي (60 – 100 bpm)',
        colorClass: 'text-[#2DD4BF] border-[#2DD4BF]/40 bg-[#2DD4BF]/10',
        icon: <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" aria-hidden="true" />,
      };
    }
    return {
      labelEn: 'Tachycardia (> 100 bpm)',
      labelAr: 'تسارع ضربات القلب (> 100 bpm)',
      colorClass: 'text-[#E8552E] border-[#E8552E]/40 bg-[#E8552E]/10',
      icon: <AlertTriangle className="w-4 h-4 text-[#E8552E]" aria-hidden="true" />,
    };
  };

  const rateStatus = getRateStatus(calculatedRate);
  const currentStepData = RHYTHM_STEPS[activeStep - 1];

  return (
    <section id="rhythm" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
            05 · RHYTHM ANALYSIS (HOW TO READ AN ECG)
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
            {t(
              'كيف تقرأ تخطيط القلب؟ (تحليل النظم وحساب المعدل)',
              'Systematic ECG Interpretation & Heart Rate Calculation'
            )}
          </h2>
        </div>

        {/* 5-Step Systematic Stepper + Interactive Heart Rate Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 5-Step Stepper */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-xl font-bold text-[#EEF6F8] mb-1">
                {t('الخطوات الخمس المنهجية للقراءة', '5-Step Systematic ECG Approach')}
              </h3>
              <p className="text-xs text-[#9CBAC4]">
                {t(
                  'اتبع الترتيب التالي في كل ورقة ECG لضمان عدم إغفال أي علامة مرضية',
                  'Follow this sequence on every ECG strip to avoid missing critical findings'
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {RHYTHM_STEPS.map((st) => {
                const active = st.step === activeStep;
                return (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => setActiveStep(st.step)}
                    className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E8552E] border-[#E8552E] text-white'
                        : 'bg-white/5 border-white/10 text-[#B8D0D8] hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono-num block text-[11px] opacity-80">
                      Step {st.step}
                    </span>
                    <span className="truncate block">{isAr ? st.titleAr : st.titleEn}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#051F28]/85 border border-white/15 p-5 space-y-3 flex-1 flex flex-col justify-center">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-lg font-bold text-[#EEF6F8]">
                  {currentStepData.step}. {isAr ? currentStepData.titleAr : currentStepData.titleEn}
                </h4>
                {isAr && (
                  <span className="text-xs font-semibold text-[#F2A33A]" dir="ltr">
                    {currentStepData.titleEn}
                  </span>
                )}
              </div>
              <p className="text-xs font-mono-num text-[#2DD4BF]" dir="ltr">
                Focus: {currentStepData.focusLead}
              </p>
              <p className="text-sm text-[#B8D0D8] leading-relaxed">
                {isAr ? currentStepData.detailAr : currentStepData.detailEn}
              </p>
            </div>
          </div>

          {/* Interactive Heart Rate Calculator */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 flex flex-col justify-between gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-[#F2A33A]" aria-hidden="true" />
                <h3 className="text-xl font-bold text-[#EEF6F8]">
                  {t('حاسبة معدل القلب التفاعلية', 'Interactive Heart Rate Calculator')}
                </h3>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/8 border border-white/15">
                <button
                  type="button"
                  onClick={() => setRhythmType('regular')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    rhythmType === 'regular'
                      ? 'bg-[#0E7C6B] text-white'
                      : 'text-[#B8D0D8] hover:text-white'
                  }`}
                >
                  {t('منتظم (Regular)', 'Regular')}
                </button>
                <button
                  type="button"
                  onClick={() => setRhythmType('irregular')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    rhythmType === 'irregular'
                      ? 'bg-[#E8552E] text-white'
                      : 'text-[#B8D0D8] hover:text-white'
                  }`}
                >
                  {t('غير منتظم (Irregular)', 'Irregular')}
                </button>
              </div>
            </div>

            {rhythmType === 'regular' ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label htmlFor="large-boxes-input" className="text-[#EEF6F8] font-medium">
                      {t('عدد المربعات الكبيرة بين R–R:', 'Large boxes between R–R:')}
                    </label>
                    <span className="font-mono-num text-[#F2A33A] font-bold" dir="ltr">
                      300 ÷ {largeBoxes} = {calculatedRate} bpm
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      id="large-boxes-input"
                      type="range"
                      min={1.5}
                      max={10}
                      step={0.5}
                      value={largeBoxes}
                      onChange={(e) => setLargeBoxes(Number(e.target.value))}
                      className="flex-1 accent-[#F2A33A] cursor-pointer"
                    />
                    <input
                      type="number"
                      min={1}
                      max={15}
                      step={0.5}
                      value={largeBoxes}
                      onChange={(e) => setLargeBoxes(Math.max(1, Number(e.target.value)))}
                      aria-label={t('إدخال عدد المربعات الكبيرة', 'Enter number of large boxes')}
                      className="w-20 rounded-lg bg-[#041921] border border-white/20 px-2.5 py-1.5 text-center font-mono-num text-sm text-[#EEF6F8]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label htmlFor="qrs-6s-input" className="text-[#EEF6F8] font-medium">
                      {t(
                        'عدد مركّبات QRS في 6 ثوانٍ (30 مربعاً كبيراً):',
                        'QRS complexes in 6 seconds (30 large boxes):'
                      )}
                    </label>
                    <span className="font-mono-num text-[#F2A33A] font-bold" dir="ltr">
                      {qrsIn6Sec} × 10 = {calculatedRate} bpm
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      id="qrs-6s-input"
                      type="range"
                      min={2}
                      max={20}
                      step={1}
                      value={qrsIn6Sec}
                      onChange={(e) => setQrsIn6Sec(Number(e.target.value))}
                      className="flex-1 accent-[#E8552E] cursor-pointer"
                    />
                    <input
                      type="number"
                      min={1}
                      max={30}
                      step={1}
                      value={qrsIn6Sec}
                      onChange={(e) => setQrsIn6Sec(Math.max(1, Number(e.target.value)))}
                      aria-label={t(
                        'إدخال عدد مركبات QRS في 6 ثوانٍ',
                        'Enter QRS complexes in 6 seconds'
                      )}
                      className="w-20 rounded-lg bg-[#041921] border border-white/20 px-2.5 py-1.5 text-center font-mono-num text-sm text-[#EEF6F8]"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Result Readout + Classification */}
            <div className="rounded-2xl bg-[#051F28]/85 border border-white/15 p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#9CBAC4]">
                  {t('المعدل المحسوب', 'Calculated Heart Rate')}
                </p>
                <p className="text-3xl font-bold font-mono-num text-[#EEF6F8]" dir="ltr">
                  {calculatedRate}{' '}
                  <span className="text-sm font-normal text-[#9CBAC4]">beats/min</span>
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold ${rateStatus.colorClass}`}
              >
                {rateStatus.icon}
                <span>{isAr ? rateStatus.labelAr : rateStatus.labelEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison: Normal vs Irregular Heartbeat */}
        <div className="glass-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#2DD4BF]" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[#EEF6F8]">
              {t(
                'مقارنة حية: النبض الطبيعي المنتظم مقابل النبض غير المنتظم',
                'Live Comparison: Regular Sinus vs. Irregular Rhythm'
              )}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <LiveEcgMonitor
                bpm={72}
                irregular={false}
                strokeColor="#2DD4BF"
                height={115}
                label="Normal Sinus Rhythm (Regular R–R + Clear P)"
              />
              <p className="text-xs sm:text-sm text-[#B8D0D8] leading-relaxed">
                <strong className="text-[#2DD4BF]">
                  {t('النظم الجيبي الطبيعي:', 'Normal Sinus Rhythm:')}
                </strong>{' '}
                {t(
                  'مسافات R–R متساوية تماماً، وكل مركب QRS تسبقه موجة P متشابهة.',
                  'R–R intervals are completely equidistant, and every QRS complex is preceded by a uniform upright P wave.'
                )}
              </p>
            </div>

            <div className="space-y-3">
              <LiveEcgMonitor
                bpm={96}
                irregular={true}
                strokeColor="#E8552E"
                height={115}
                label="Irregular Rhythm (Variable R–R · Absent P)"
              />
              <p className="text-xs sm:text-sm text-[#B8D0D8] leading-relaxed">
                <strong className="text-[#E8552E]">
                  {t('النظم غير المنتظم:', 'Irregular Rhythm:')}
                </strong>{' '}
                {t(
                  'اختلاف واضح في المسافات بين R–R وغياب موجة P المنتظمة (يُحسب بطريقة الـ 6 ثوانٍ × 10).',
                  'Marked variation in R–R spacing without consistent P waves (calculate rate via 6-second strip × 10).'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
