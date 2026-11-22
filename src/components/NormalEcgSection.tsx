import React, { useRef, useState } from 'react';
import { Ruler, Info } from 'lucide-react';
import { WAVE_COMPONENTS, NORMAL_VALUES_TABLE } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

export const NormalEcgSection: React.FC = () => {
  const { t, isAr } = useLanguage();
  const [activeWaveId, setActiveWaveId] = useState<string>('p_wave');

  const gridRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [caliperStart, setCaliperStart] = useState<{ x: number; y: number }>({ x: 80, y: 120 });
  const [caliperEnd, setCaliperEnd] = useState<{ x: number; y: number }>({ x: 240, y: 60 });

  const activeWave =
    WAVE_COMPONENTS.find((w) => w.id === activeWaveId) ?? WAVE_COMPONENTS[0];

  const getRelCoords = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
    };
  };

  const handleGridPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getRelCoords(e);
    setCaliperStart(pt);
    setCaliperEnd(pt);
    setDragging(true);
  };

  const handleGridPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setCaliperEnd(getRelCoords(e));
  };

  const handleGridPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const dxPx = Math.abs(caliperEnd.x - caliperStart.x);
  const dyPx = Math.abs(caliperEnd.y - caliperStart.y);
  const smallBoxesX = dxPx / 20;
  const largeBoxesX = smallBoxesX / 5;
  const seconds = smallBoxesX * 0.04;
  const ms = Math.round(seconds * 1000);
  const smallBoxesY = dyPx / 20;
  const mv = smallBoxesY * 0.1;

  return (
    <section id="normal-ecg" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
            03 · NORMAL ECG WAVEFORM &amp; PAPER CALIBRATION
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
            {t(
              'مكونات موجة الـ ECG الطبيعية وورق التخطيط',
              'Normal ECG Waveforms & Calibration Grid'
            )}
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-[#EEF6F8]">
              {t(
                'تشريح الموجة التفاعلي (مرّر أو اضغط على أي جزء)',
                'Interactive Waveform Anatomy (Hover or Click)'
              )}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {WAVE_COMPONENTS.map((w) => {
                const active = w.id === activeWaveId;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setActiveWaveId(w.id)}
                    onMouseEnter={() => setActiveWaveId(w.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#E8552E] text-white'
                        : 'bg-white/8 text-[#B8D0D8] hover:bg-white/15 hover:text-white'
                    }`}
                    dir="ltr"
                  >
                    {w.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 ecg-paper-grid rounded-2xl border border-white/15 p-4 overflow-hidden">
              <svg
                viewBox="0 0 540 220"
                className="w-full h-auto"
                role="img"
                aria-label={t('رسم تفاعلي لمكونات موجة ECG الطبيعية', 'Interactive normal ECG waveform diagram')}
              >
                <rect
                  x={activeWave.xRange[0]}
                  y={14}
                  width={activeWave.xRange[1] - activeWave.xRange[0]}
                  height={192}
                  rx={8}
                  fill="rgba(242, 163, 58, 0.16)"
                  stroke="rgba(242, 163, 58, 0.55)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                <line
                  x1="20"
                  y1="145"
                  x2="520"
                  y2="145"
                  stroke="rgba(255,255,255,0.22)"
                  strokeDasharray="3 4"
                />

                <path
                  d="M25,145 L88,145 Q115,105 142,145 L195,145 L208,162 L224,32 L241,176 L254,145 L330,145 Q372,82 414,145 L424,145 Q442,126 460,145 L515,145"
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <g
                  onClick={() => setActiveWaveId('p_wave')}
                  onMouseEnter={() => setActiveWaveId('p_wave')}
                  className="cursor-pointer"
                >
                  <circle cx="115" cy="124" r="18" fill="transparent" />
                  <text x="115" y="96" textAnchor="middle" fill="#F2A33A" fontSize="13" fontWeight="700">
                    P
                  </text>
                </g>

                <g
                  onClick={() => setActiveWaveId('pr_interval')}
                  onMouseEnter={() => setActiveWaveId('pr_interval')}
                  className="cursor-pointer"
                >
                  <line x1="88" y1="184" x2="195" y2="184" stroke="#9CBAC4" strokeWidth="2" />
                  <line x1="88" y1="178" x2="88" y2="190" stroke="#9CBAC4" strokeWidth="2" />
                  <line x1="195" y1="178" x2="195" y2="190" stroke="#9CBAC4" strokeWidth="2" />
                  <text x="142" y="202" textAnchor="middle" fill="#EEF6F8" fontSize="11" fontWeight="600">
                    PR Interval
                  </text>
                </g>

                <g
                  onClick={() => setActiveWaveId('qrs_complex')}
                  onMouseEnter={() => setActiveWaveId('qrs_complex')}
                  className="cursor-pointer"
                >
                  <rect x="195" y="24" width="60" height="156" fill="transparent" />
                  <text x="205" y="176" textAnchor="middle" fill="#E8552E" fontSize="12" fontWeight="700">
                    Q
                  </text>
                  <text x="224" y="22" textAnchor="middle" fill="#E8552E" fontSize="13" fontWeight="700">
                    R
                  </text>
                  <text x="244" y="194" textAnchor="middle" fill="#E8552E" fontSize="12" fontWeight="700">
                    S
                  </text>
                </g>

                <g
                  onClick={() => setActiveWaveId('st_segment')}
                  onMouseEnter={() => setActiveWaveId('st_segment')}
                  className="cursor-pointer"
                >
                  <rect x="255" y="122" width="75" height="45" fill="transparent" />
                  <text x="292" y="133" textAnchor="middle" fill="#EEF6F8" fontSize="11" fontWeight="600">
                    ST Segment
                  </text>
                </g>

                <g
                  onClick={() => setActiveWaveId('t_wave')}
                  onMouseEnter={() => setActiveWaveId('t_wave')}
                  className="cursor-pointer"
                >
                  <circle cx="372" cy="112" r="24" fill="transparent" />
                  <text x="372" y="76" textAnchor="middle" fill="#F2A33A" fontSize="13" fontWeight="700">
                    T
                  </text>
                </g>

                <g
                  onClick={() => setActiveWaveId('qt_interval')}
                  onMouseEnter={() => setActiveWaveId('qt_interval')}
                  className="cursor-pointer"
                >
                  <line x1="195" y1="208" x2="414" y2="208" stroke="#2DD4BF" strokeWidth="2" />
                  <text x="305" y="203" textAnchor="middle" fill="#2DD4BF" fontSize="11" fontWeight="600">
                    QT Interval
                  </text>
                </g>

                <g
                  onClick={() => setActiveWaveId('u_wave')}
                  onMouseEnter={() => setActiveWaveId('u_wave')}
                  className="cursor-pointer"
                >
                  <circle cx="442" cy="134" r="18" fill="transparent" />
                  <text x="442" y="114" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700">
                    U
                  </text>
                </g>
              </svg>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#051F28]/80 border border-white/15 p-6 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="text-2xl font-bold text-[#EEF6F8]">
                  {isAr ? activeWave.nameAr : activeWave.nameEn}
                </h4>
                {isAr && (
                  <span className="font-display text-lg font-semibold text-[#F2A33A]" dir="ltr">
                    {activeWave.nameEn}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#2DD4BF]" dir="ltr">
                {activeWave.physiology}
              </p>
              <p className="text-sm text-[#B8D0D8] leading-relaxed">
                {isAr ? activeWave.descriptionAr : activeWave.descriptionEn}
              </p>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-1.5">
                <p className="text-xs font-semibold text-[#F2A33A]">
                  {t('القيم القياسية:', 'Normal Reference:')}
                </p>
                <p className="text-xs sm:text-sm text-[#EEF6F8] font-mono-num">
                  {isAr ? activeWave.durationOrAmpAr : activeWave.durationOrAmpEn}
                </p>
              </div>
              <div className="flex items-start gap-2 text-xs text-[#FB7185] leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{isAr ? activeWave.clinicalNoteAr : activeWave.clinicalNoteEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive ECG Paper Grid + Caliper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Ruler className="w-5 h-5 text-[#F2A33A]" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold text-[#EEF6F8]">
                    {t(
                      'أداة القياس على ورق الـ ECG (اسحب للقياس)',
                      'Interactive ECG Paper Caliper (Drag to Measure)'
                    )}
                  </h3>
                  <p className="text-xs text-[#9CBAC4]">
                    {t(
                      'اسحب بالماوس أو اللمس داخل الشبكة لقياس الزمن والفولت',
                      'Click and drag anywhere on the grid to measure time (s/ms) & voltage (mV)'
                    )}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-num text-[#2DD4BF]" dir="ltr">
                25 mm/s · 10 mm = 1 mV
              </span>
            </div>

            <div
              ref={gridRef}
              onPointerDown={handleGridPointerDown}
              onPointerMove={handleGridPointerMove}
              onPointerUp={handleGridPointerUp}
              className="relative h-60 w-full ecg-paper-grid rounded-2xl border border-[#E8552E]/40 overflow-hidden cursor-crosshair select-none touch-none"
            >
              <svg
                viewBox="0 0 600 240"
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,160 L20,160 L20,60 L60,60 L60,160 L110,160 Q125,138 140,160 L170,160 L178,172 L188,48 L198,186 L208,160 L250,160 Q280,115 310,160 L380,160 Q395,138 410,160 L440,160 L448,172 L458,48 L468,186 L478,160 L520,160 Q550,115 580,160 L600,160"
                  fill="none"
                  stroke="#2DD4BF"
                  strokeWidth="2.4"
                />
              </svg>

              <div
                className="absolute border-2 border-[#F2A33A] bg-[#F2A33A]/15 pointer-events-none"
                style={{
                  left: Math.min(caliperStart.x, caliperEnd.x),
                  top: Math.min(caliperStart.y, caliperEnd.y),
                  width: Math.max(2, Math.abs(caliperEnd.x - caliperStart.x)),
                  height: Math.max(2, Math.abs(caliperEnd.y - caliperStart.y)),
                }}
              />
              <div
                className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[#E8552E] border-2 border-white pointer-events-none"
                style={{ left: caliperStart.x, top: caliperStart.y }}
              />
              <div
                className="absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-[#F2A33A] border-2 border-white pointer-events-none"
                style={{ left: caliperEnd.x, top: caliperEnd.y }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-[11px] text-[#9CBAC4]">
                  {t('المربعات الصغيرة (أفقي)', 'Small Boxes (Horiz.)')}
                </p>
                <p className="text-base font-bold font-mono-num text-[#EEF6F8] mt-0.5" dir="ltr">
                  {smallBoxesX.toFixed(1)} mm
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-[11px] text-[#9CBAC4]">
                  {t('المربعات الكبيرة', 'Large Boxes')}
                </p>
                <p className="text-base font-bold font-mono-num text-[#F2A33A] mt-0.5" dir="ltr">
                  {largeBoxesX.toFixed(2)} boxes
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-[11px] text-[#9CBAC4]">
                  {t('المدة الزمنية', 'Duration')}
                </p>
                <p className="text-base font-bold font-mono-num text-[#2DD4BF] mt-0.5" dir="ltr">
                  {seconds.toFixed(2)} s ({ms} ms)
                </p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <p className="text-[11px] text-[#9CBAC4]">
                  {t('السعة العمودية (الجهد)', 'Amplitude (Voltage)')}
                </p>
                <p className="text-base font-bold font-mono-num text-[#E8552E] mt-0.5" dir="ltr">
                  {mv.toFixed(2)} mV
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <h3 className="text-lg font-bold text-[#EEF6F8]">
                {t('معايير ورق الـ ECG القياسية', 'Standard ECG Paper Calibration')}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <span className="text-[#9CBAC4] block text-[11px]">
                    {t('سرعة الورق', 'Paper Speed')}
                  </span>
                  <strong className="font-mono-num text-[#F2A33A]" dir="ltr">
                    25 mm/s
                  </strong>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <span className="text-[#9CBAC4] block text-[11px]">
                    {t('المعايرة القياسية', 'Standard Gain')}
                  </span>
                  <strong className="font-mono-num text-[#2DD4BF]" dir="ltr">
                    10 mm = 1 mV
                  </strong>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <span className="text-[#9CBAC4] block text-[11px]">
                    {t('المربع الصغير (1 mm)', 'Small Box (1 mm)')}
                  </span>
                  <strong className="font-mono-num text-[#EEF6F8]" dir="ltr">
                    0.04 s · 0.1 mV
                  </strong>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <span className="text-[#9CBAC4] block text-[11px]">
                    {t('المربع الكبير (5 mm)', 'Large Box (5 mm)')}
                  </span>
                  <strong className="font-mono-num text-[#EEF6F8]" dir="ltr">
                    0.20 s · 0.5 mV
                  </strong>
                </div>
              </div>
              <p className="text-xs text-[#B8D0D8]">
                <strong className="text-[#F2A33A]">
                  {t('5 مربعات كبيرة = 1 ثانية', '5 large boxes = 1 second')}
                </strong>{' '}
                ·{' '}
                <strong className="text-[#2DD4BF]">
                  {t('300 مربع كبير = 1 دقيقة (60 ثانية)', '300 large boxes = 1 minute (60 s)')}
                </strong>
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 flex-1 overflow-x-auto">
              <h3 className="text-lg font-bold text-[#EEF6F8] mb-3">
                {t('جدول القيم الطبيعية', 'Normal ECG Values Reference')}
              </h3>
              <table className={`w-full ${isAr ? 'text-right' : 'text-left'} border-collapse text-xs sm:text-sm`}>
                <thead>
                  <tr className="border-b border-white/15 text-[#9CBAC4]">
                    <th className="py-2 px-2 font-semibold">{t('المكون', 'Component')}</th>
                    <th className="py-2 px-2 font-semibold">{t('الارتفاع (Amplitude)', 'Amplitude')}</th>
                    <th className="py-2 px-2 font-semibold">{t('العرض (Duration)', 'Duration')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {NORMAL_VALUES_TABLE.map((row) => (
                    <tr key={row.wave} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-2 font-semibold text-[#F2A33A]" dir="ltr">
                        {row.wave}
                      </td>
                      <td className="py-2.5 px-2 text-[#EEF6F8] font-mono-num">
                        {isAr ? row.amplitudeAr : row.amplitudeEn}
                      </td>
                      <td className="py-2.5 px-2 text-[#2DD4BF] font-mono-num">
                        {isAr ? row.durationAr : row.durationEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
