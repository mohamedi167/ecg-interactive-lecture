import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, Play, Pause, Zap, Droplets } from 'lucide-react';
import { Heart3D } from './Heart3D';
import { CIRCULATION_STEPS, CONDUCTION_NODES } from '../data/ecgData';
import { sampleEcgValue } from './LiveEcgMonitor';
import { useLanguage } from '../context/LanguageContext';

export const CirculationConductionSection: React.FC = () => {
  const { t, isAr } = useLanguage();

  // Circulation state
  const [circStep, setCircStep] = useState<number>(1);
  const [circAutoPlay, setCircAutoPlay] = useState<boolean>(true);

  // Conduction state
  const [activeNodeId, setActiveNodeId] = useState<string>('sa');
  const [conductionPlaying, setConductionPlaying] = useState<boolean>(true);
  const [impulseProgress, setImpulseProgress] = useState<number>(0);

  const syncCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!circAutoPlay) return;
    const timer = window.setInterval(() => {
      setCircStep((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 3400);
    return () => clearInterval(timer);
  }, [circAutoPlay]);

  useEffect(() => {
    if (!conductionPlaying) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let rafId = 0;
    let last = performance.now();
    let progress = impulseProgress;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      progress = (progress + dt * 0.34) % 1;
      setImpulseProgress(progress);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [conductionPlaying]);

  useEffect(() => {
    const canvas = syncCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 360;
    const h = 150;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(232, 85, 46, 0.14)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const baseY = h * 0.66;
    const amp = h * 0.52;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x <= w; x += 2) {
      const p = x / w;
      const y = baseY - sampleEcgValue(p) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const activeEndX = Math.max(4, impulseProgress * w);
    ctx.beginPath();
    ctx.strokeStyle = '#F2A33A';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#F2A33A';
    ctx.shadowBlur = 10;
    for (let x = 0; x <= activeEndX; x += 2) {
      const p = x / w;
      const y = baseY - sampleEcgValue(p) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    const tipY = baseY - sampleEcgValue(impulseProgress) * amp;
    ctx.beginPath();
    ctx.fillStyle = '#E8552E';
    ctx.arc(activeEndX, tipY, 5, 0, Math.PI * 2);
    ctx.fill();
  }, [impulseProgress]);

  const currentCirc = CIRCULATION_STEPS[circStep - 1];
  const activeNode =
    CONDUCTION_NODES.find((n) => n.id === activeNodeId) ?? CONDUCTION_NODES[0];

  const getImpulseCoords = (p: number): { x: number; y: number; stageLabel: string } => {
    if (p < 0.16) {
      const t = p / 0.16;
      return {
        x: 118 + t * 50,
        y: 88 + t * 70,
        stageLabel: 'P Wave — Atrial Depolarization (SA → Atria)',
      };
    }
    if (p < 0.27) {
      return {
        x: 168,
        y: 158,
        stageLabel: 'PR Interval — Physiological Delay at AV Node',
      };
    }
    if (p < 0.42) {
      const t = (p - 0.27) / 0.15;
      return {
        x: 168 + t * 70,
        y: 158 + t * 130,
        stageLabel: 'QRS Complex — Ventricular Depolarization (His → Purkinje)',
      };
    }
    if (p < 0.52) {
      return {
        x: 238,
        y: 288,
        stageLabel: 'ST Segment — Isoelectric Ventricular Contraction',
      };
    }
    return {
      x: 225,
      y: 255,
      stageLabel: 'T Wave — Ventricular Repolarization',
    };
  };

  const pulsePos = getImpulseCoords(impulseProgress);

  return (
    <section id="conduction" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
            02 · CIRCULATION &amp; CONDUCTION SYSTEM
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
            {t(
              'الدورة الدموية ونظام التوصيل الكهربائي للقلب',
              'Cardiac Blood Circulation & Electrical Conduction System'
            )}
          </h2>
        </div>

        {/* PART A: 6-Step Interactive Blood Circulation with 3D Heart */}
        <div className="glass-card rounded-3xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0E7C6B]/30 border border-[#2DD4BF]/30 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#2DD4BF]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#EEF6F8]">
                  {t('مسار الدم عبر حجرات القلب (6 خطوات)', 'Cardiac Blood Flow Pathway (6 Steps)')}
                </h3>
                <p className="text-xs text-[#9CBAC4]">
                  {t(
                    'الكرات الزرقاء = دم غير مؤكسج · الكرات الحمراء = دم مؤكسج',
                    'Blue cells = Deoxygenated blood · Red cells = Oxygenated blood'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCircAutoPlay(false);
                  setCircStep((s) => (s <= 1 ? 6 : s - 1));
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/8 hover:bg-white/15 text-xs font-semibold text-[#EEF6F8] transition-colors cursor-pointer whitespace-nowrap"
              >
                {isAr ? (
                  <>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    <span>السابق</span>
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Prev</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCircAutoPlay((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E7C6B] hover:bg-[#0b685a] text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {circAutoPlay ? (
                  <>
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('إيقاف تلقائي', 'Pause Auto')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('تشغيل المسار', 'Play Flow')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCircAutoPlay(false);
                  setCircStep((s) => (s >= 6 ? 1 : s + 1));
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#E8552E] hover:bg-[#d54722] text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isAr ? (
                  <>
                    <span>التالي</span>
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 h-[340px] sm:h-[380px] rounded-2xl border border-white/10 bg-[#041921]/75 overflow-hidden">
              <Heart3D mode="circulation" circulationStep={circStep} bpm={68} />
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CIRCULATION_STEPS.map((st) => {
                  const active = st.step === circStep;
                  const isOx = st.oxygenState === 'oxygenated';
                  const isGas = st.oxygenState === 'gas_exchange';
                  return (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => {
                        setCircAutoPlay(false);
                        setCircStep(st.step);
                      }}
                      className={`${isAr ? 'text-right' : 'text-left'} p-3 rounded-xl border transition-all cursor-pointer ${
                        active
                          ? 'border-[#F2A33A] bg-white/12 shadow-lg'
                          : 'border-white/10 bg-white/4 hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono-num text-xs text-[#F2A33A] font-bold">
                          0{st.step}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isOx
                              ? 'text-[#FB7185]'
                              : isGas
                              ? 'text-[#2DD4BF]'
                              : 'text-[#38BDF8]'
                          }`}
                        >
                          {isOx
                            ? t('مؤكسج', 'Oxygenated')
                            : isGas
                            ? t('تبادل غازات', 'Gas Exchange')
                            : t('غير مؤكسج', 'Deoxygenated')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#EEF6F8] line-clamp-2">
                        {isAr ? st.titleAr : st.titleEn}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-[#051F28]/80 border border-white/15 p-5 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-lg font-bold text-[#EEF6F8]">
                    {t(`الخطوة ${currentCirc.step}: ${currentCirc.titleAr}`, `Step ${currentCirc.step}: ${currentCirc.titleEn}`)}
                  </h4>
                  {isAr && (
                    <span className="text-xs font-semibold text-[#F2A33A]" dir="ltr">
                      {currentCirc.titleEn}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#B8D0D8] leading-relaxed">
                  {isAr ? currentCirc.descriptionAr : currentCirc.descriptionEn}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PART B: Electrical Conduction System + Live Synchronized ECG */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 glass-card rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#EEF6F8]">
                  {t('مسار التوصيل الكهربائي (Conduction Pathway)', 'Electrical Conduction Pathway')}
                </h3>
                <p className="text-xs text-[#9CBAC4] mt-0.5">
                  {t(
                    'اضغط على أي عقدة لاستكشاف وظيفتها ومعدلها الطبيعي',
                    'Click any conduction node to inspect its intrinsic rate & ECG role'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConductionPlaying((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#EEF6F8] transition-colors cursor-pointer shrink-0"
              >
                {conductionPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#F2A33A]" aria-hidden="true" />
                    <span>{t('إيقاف النبضة', 'Pause Impulse')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#2DD4BF]" aria-hidden="true" />
                    <span>{t('تشغيل النبضة', 'Play Impulse')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center justify-center bg-[#041921]/70 rounded-2xl border border-white/10 p-4">
              <svg
                viewBox="0 0 360 350"
                className="w-full max-w-[360px] h-auto"
                role="img"
                aria-label={t('رسم تفاعلي لنظام التوصيل الكهربائي للقلب', 'Interactive cardiac conduction system')}
              >
                <defs>
                  <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M180,320 C115,285 68,225 68,145 C68,90 106,52 152,58 C170,60 180,74 185,84 C192,70 208,56 232,58 C278,62 302,102 296,158 C288,232 242,285 180,320 Z"
                  fill="rgba(184, 51, 42, 0.22)"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="2"
                />
                <path
                  d="M178,155 L178,295"
                  stroke="rgba(255, 255, 255, 0.16)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                <path
                  d="M118,88 Q145,105 168,158"
                  fill="none"
                  stroke="#F2A33A"
                  strokeWidth="2.5"
                  strokeOpacity="0.65"
                />
                <path
                  d="M118,88 Q112,135 168,158"
                  fill="none"
                  stroke="#F2A33A"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.55"
                />
                <path
                  d="M118,88 Q170,62 242,88"
                  fill="none"
                  stroke="#F2A33A"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                />
                <path d="M168,158 L178,196" fill="none" stroke="#2DD4BF" strokeWidth="4" />
                <path
                  d="M178,196 L154,262 Q125,286 102,240 Q90,210 92,182"
                  fill="none"
                  stroke="#F2A33A"
                  strokeWidth="2.8"
                />
                <path
                  d="M178,196 L205,258 Q242,292 268,242 Q278,210 272,175"
                  fill="none"
                  stroke="#F2A33A"
                  strokeWidth="3"
                />
                <path
                  d="M196,232 Q232,238 258,204"
                  fill="none"
                  stroke="#F2A33A"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />

                <circle cx={pulsePos.x} cy={pulsePos.y} r="9" fill="#F2A33A" filter="url(#goldGlow)" />

                {CONDUCTION_NODES.map((node) => {
                  const active = node.id === activeNodeId;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setActiveNodeId(node.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={active ? 13 : 9}
                        fill={active ? '#E8552E' : '#0B3B4A'}
                        stroke="#F2A33A"
                        strokeWidth={active ? 3 : 2}
                      />
                      <text
                        x={node.x}
                        y={node.y - 16}
                        textAnchor="middle"
                        fill="#EEF6F8"
                        fontSize="10"
                        fontWeight="700"
                      >
                        {node.nameEn}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#F2A33A]" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-[#EEF6F8]">
                    {t('مخطط الـ ECG المتزامن مع النبضة', 'Synchronized Live ECG Monitor')}
                  </h3>
                </div>
                <span className="text-xs font-mono-num text-[#2DD4BF]" dir="ltr">
                  Live Correlation
                </span>
              </div>

              <div className="rounded-xl bg-[#041921] border border-white/10 p-3">
                <canvas ref={syncCanvasRef} className="w-full h-[150px] block" />
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-xs text-[#9CBAC4]">
                  {t('الطور النشط حالياً:', 'Active Phase:')}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#F2A33A]" dir="ltr">
                  {pulsePos.stageLabel}
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 zg-float-b">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="text-lg font-bold text-[#EEF6F8]">
                  {isAr ? activeNode.nameAr : activeNode.nameEn}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono-num" dir="ltr">
                  {isAr && <span className="text-[#F2A33A] font-semibold">{activeNode.nameEn}</span>}
                  {isAr && <span className="text-[#9CBAC4]">·</span>}
                  <span className="text-[#2DD4BF]">{activeNode.rate}</span>
                </div>
              </div>
              <p className="text-sm text-[#B8D0D8] leading-relaxed">
                {isAr ? activeNode.descriptionAr : activeNode.descriptionEn}
              </p>
              <p className="text-xs text-[#E8552E] font-semibold mt-2" dir="ltr">
                ECG Mapping: {activeNode.ecgCorrelation}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-bold text-[#F2A33A] mb-1">
                  {t('1. الترتيب الانقباضي', '1. Sequential Contraction')}
                </p>
                <p className="text-xs text-[#B8D0D8] leading-relaxed">
                  {t(
                    'الأذينان ينقبضان قبل البطينين لضمان ضخ الدم من الأعلى للأسفل بكفاءة.',
                    'Atria contract before ventricles to ensure efficient top-to-bottom blood priming.'
                  )}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-bold text-[#2DD4BF] mb-1">
                  {t('2. توقف AV Node', '2. AV Node Pause')}
                </p>
                <p className="text-xs text-[#B8D0D8] leading-relaxed">
                  {t(
                    'التأخير الفسيولوجي يمنح البطينين وقتاً حيوياً للامتلاء الكامل بالدم.',
                    'Physiological delay provides vital time for complete ventricular filling.'
                  )}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-bold text-[#E8552E] mb-1">
                  {t('3. استجابة SA Node', '3. Autonomic Control')}
                </p>
                <p className="text-xs text-[#B8D0D8] leading-relaxed">
                  {t(
                    'يتأثر منظم القلب مباشرة بالجهاز العصبي السمبثاوي والباراسمبثاوي.',
                    'SA node firing rate responds rapidly to sympathetic and parasympathetic tone.'
                  )}
                </p>
              </div>
              <div className="glass-card rounded-2xl p-4">
                <p className="text-xs font-bold text-[#FB7185] mb-1">
                  {t('4. خلل التوصيل', '4. Conduction Blocks')}
                </p>
                <p className="text-xs text-[#B8D0D8] leading-relaxed">
                  {t(
                    'أي إحصار مثل Bundle Branch Block يسبب اتساع QRS وعدم انتظام التوصيل.',
                    'Disruptions such as Bundle Branch Block widen QRS and cause dyssynchrony.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
