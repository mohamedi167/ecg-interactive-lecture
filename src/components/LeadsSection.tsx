import React, { useState } from 'react';
import { Compass, Layers, Heart } from 'lucide-react';
import {
  ELECTRODES,
  HEXAXIAL_LEADS,
  CORONARY_TERRITORIES,
  type CoronaryTerritory,
} from '../data/ecgData';
import { Heart3D } from './Heart3D';
import { BodyLeads3D } from './BodyLeads3D';
import { useLanguage } from '../context/LanguageContext';

export const LeadsSection: React.FC = () => {
  const { t, isAr } = useLanguage();
  const [planeMode, setPlaneMode] = useState<'all' | 'limb' | 'chest'>('all');
  const [selectedElectrodeId, setSelectedElectrodeId] = useState<string>('V4');
  const [activeHexLeadId, setActiveHexLeadId] = useState<string>('II');
  const [activeTerritoryId, setActiveTerritoryId] =
    useState<CoronaryTerritory['id']>('inferior');

  const selectedElectrode =
    ELECTRODES.find((e) => e.id === selectedElectrodeId) ?? ELECTRODES[0];
  const activeHexLead =
    HEXAXIAL_LEADS.find((l) => l.id === activeHexLeadId) ?? HEXAXIAL_LEADS[1];
  const activeTerritory =
    CORONARY_TERRITORIES.find((item) => item.id === activeTerritoryId) ??
    CORONARY_TERRITORIES[0];

  const visibleElectrodes = ELECTRODES.filter((el) => {
    if (planeMode === 'all') return true;
    if (planeMode === 'limb') return el.category === 'limb';
    return el.category === 'chest' || el.category === 'right' || el.category === 'posterior';
  });

  return (
    <section id="leads" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Title */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
              04 · 12-LEAD ECG, EINTHOVEN &amp; CORONARY TERRITORIES
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
              {t(
                'التوصيلات الكهربائية (Leads) ومناطق الشرايين التاجية',
                '12-Lead Electrode Placements & Coronary Territories'
              )}
            </h2>
          </div>

          {/* Plane Toggle: Limb (Coronal) vs Chest (Transverse) */}
          <div
            className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-white/8 border border-white/15"
            role="group"
            aria-label={t('تبديل مستوى التوصيلات', 'Switch ECG lead plane')}
          >
            <button
              type="button"
              onClick={() => setPlaneMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                planeMode === 'all'
                  ? 'bg-[#E8552E] text-white'
                  : 'text-[#B8D0D8] hover:text-white'
              }`}
            >
              {t('جميع الأقطاب (14 موضعاً)', 'All Electrodes (14 Views)')}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaneMode('limb');
                setSelectedElectrodeId('LA');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                planeMode === 'limb'
                  ? 'bg-[#0E7C6B] text-white'
                  : 'text-[#B8D0D8] hover:text-white'
              }`}
            >
              Limb (Coronal Plane)
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaneMode('chest');
                setSelectedElectrodeId('V4');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                planeMode === 'chest'
                  ? 'bg-[#F2A33A] text-[#051F28]'
                  : 'text-[#B8D0D8] hover:text-white'
              }`}
            >
              Chest (Transverse Plane)
            </button>
          </div>
        </div>

        {/* PART A: 3D Anatomical Human Body Electrode Placement + Einthoven & Hexaxial Wheel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 3D Human Body & Ribcage Atlas for Chest/Limb Electrodes */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2DD4BF]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#EEF6F8]">
                  {t(
                    'مواضع الأقطاب على الجسم البشري ثلاثي الأبعاد',
                    '3D Anatomical Body & Ribcage Electrode Map'
                  )}
                </h3>
              </div>
              <span className="text-xs text-[#9CBAC4]" dir="ltr">
                {planeMode === 'limb'
                  ? 'Coronal Plane (6 Limb Leads)'
                  : planeMode === 'chest'
                  ? 'Transverse Plane (V1–V6, V4R, V7–V9)'
                  : '10 Standard + Right/Posterior Views'}
              </span>
            </div>

            <div className="h-[410px] sm:h-[440px] rounded-2xl border border-white/15 bg-[#041921]/85 overflow-hidden">
              <BodyLeads3D
                planeMode={planeMode}
                selectedElectrodeId={selectedElectrodeId}
                onSelectElectrode={setSelectedElectrodeId}
              />
            </div>

            {/* Quick Electrode Chips + Selected Readout */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {visibleElectrodes.map((el) => (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => setSelectedElectrodeId(el.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-num font-bold cursor-pointer transition-colors ${
                      el.id === selectedElectrodeId
                        ? 'bg-[#E8552E] text-white'
                        : 'bg-white/8 text-[#B8D0D8] hover:bg-white/15'
                    }`}
                    dir="ltr"
                  >
                    {el.label}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-[#051F28]/85 border border-white/15 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-block w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: selectedElectrode.color }}
                    />
                    <span className="text-base sm:text-lg font-bold font-mono-num text-[#F2A33A]" dir="ltr">
                      {selectedElectrode.label}
                    </span>
                    <span className="text-xs text-[#2DD4BF] font-medium" dir="ltr">
                      · {selectedElectrode.viewArea}
                    </span>
                  </div>
                  <p className="text-sm text-[#EEF6F8] leading-relaxed">
                    {isAr ? selectedElectrode.locationAr : selectedElectrode.locationEn}
                  </p>
                </div>
                {isAr && (
                  <span className="text-xs font-semibold text-[#9CBAC4] shrink-0" dir="ltr">
                    {selectedElectrode.locationEn}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Einthoven Triangle + Hexaxial Reference System */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#F2A33A]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-[#EEF6F8]">
                  {t('مثلث آينتهوفن والنظام السداسي', "Einthoven's Triangle & Hexaxial Wheel")}
                </h3>
              </div>
            </div>

            <div className="bg-[#041921]/80 rounded-2xl border border-white/10 p-4 flex justify-center">
              <svg
                viewBox="-130 -130 260 260"
                className="w-full max-w-[250px] h-auto"
                role="img"
                aria-label={t(
                  'دائرة النظام السداسي المرجعي لتوصيلات الأطراف',
                  'Hexaxial reference circle for limb leads'
                )}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="95"
                  fill="rgba(11, 59, 74, 0.35)"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="3 4"
                />

                {/* Axis lines for all 6 limb leads */}
                {HEXAXIAL_LEADS.map((lead) => {
                  const rad = (lead.angle * Math.PI) / 180;
                  const x2 = Math.cos(rad) * 92;
                  const y2 = Math.sin(rad) * 92;
                  const x1 = -Math.cos(rad) * 92;
                  const y1 = -Math.sin(rad) * 92;
                  const lx = Math.cos(rad) * 110;
                  const ly = Math.sin(rad) * 110;
                  const active = lead.id === activeHexLeadId;

                  return (
                    <g
                      key={lead.id}
                      onClick={() => setActiveHexLeadId(lead.id)}
                      className="cursor-pointer"
                    >
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={active ? '#F2A33A' : 'rgba(156, 186, 196, 0.3)'}
                        strokeWidth={active ? 3 : 1.2}
                      />
                      <circle
                        cx={x2}
                        cy={y2}
                        r={active ? 7 : 4.5}
                        fill={active ? '#E8552E' : '#2DD4BF'}
                      />
                      <text
                        x={lx}
                        y={ly + 3}
                        textAnchor="middle"
                        fill={active ? '#F2A33A' : '#B8D0D8'}
                        fontSize="10"
                        fontWeight="700"
                      >
                        {lead.id}
                      </text>
                    </g>
                  );
                })}
                <circle cx="0" cy="0" r="6" fill="#EEF6F8" />
              </svg>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-1.5">
                {HEXAXIAL_LEADS.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setActiveHexLeadId(lead.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono-num font-bold cursor-pointer transition-colors ${
                      lead.id === activeHexLeadId
                        ? 'bg-[#F2A33A] text-[#051F28]'
                        : 'bg-white/8 text-[#B8D0D8] hover:bg-white/15'
                    }`}
                    dir="ltr"
                  >
                    {lead.id} ({lead.angle > 0 ? `+${lead.angle}°` : `${lead.angle}°`})
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-[#051F28]/85 border border-white/15 p-4 space-y-2">
                <p className="text-sm font-bold text-[#F2A33A]" dir="ltr">
                  {activeHexLead.label}
                </p>
                <p className="text-xs text-[#2DD4BF] font-mono-num" dir="ltr">
                  Polarity: {activeHexLead.polarity}
                </p>
                <p className="text-xs text-[#B8D0D8] leading-relaxed">
                  {t(
                    `التصنيف: ${activeHexLead.groupAr}. قانون آينتهوفن: Lead II = Lead I + Lead III.`,
                    `Category: ${activeHexLead.groupEn}. Einthoven’s Law: Lead II = Lead I + Lead III.`
                  )}
                </p>
                <p className="text-xs font-mono-num text-[#EEF6F8]" dir="ltr">
                  I: RA− → LA+ | II: RA− → LL+ | III: LA− → LL+
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PART B: Coronary Artery Territories + Live 3D Heart Region Highlighter */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#E8552E]" aria-hidden="true" />
              <h3 className="text-xl font-bold text-[#EEF6F8]">
                {t(
                  'مناطق الشرايين التاجية على القلب 3D',
                  'Coronary Artery Territories on 3D Heart'
                )}
              </h3>
            </div>
            <p className="text-xs text-[#9CBAC4]">
              {t(
                'اختر منطقة من الجدول لتلوين الجزء المقابل لها على مجسم القلب ثلاثي الأبعاد',
                'Select any territory to highlight its anatomical region on the 3D heart'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#051F28]/60">
                <table
                  className={`w-full ${isAr ? 'text-right' : 'text-left'} border-collapse text-xs sm:text-sm`}
                >
                  <thead>
                    <tr className="border-b border-white/15 text-[#9CBAC4]">
                      <th className="py-3 px-4 font-semibold">
                        {t('المنطقة (Wall)', 'Cardiac Wall')}
                      </th>
                      <th className="py-3 px-4 font-semibold">
                        {t('التوصيلات (Leads)', 'Contiguous Leads')}
                      </th>
                      <th className="py-3 px-4 font-semibold">
                        {t('الشريان التاجي', 'Culprit Artery')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {CORONARY_TERRITORIES.map((item) => {
                      const active = item.id === activeTerritoryId;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setActiveTerritoryId(item.id)}
                          className={`cursor-pointer transition-colors ${
                            active ? 'bg-white/12' : 'hover:bg-white/6'
                          }`}
                        >
                          <td className="py-3 px-4 font-bold text-[#EEF6F8]">
                            <span
                              className={`inline-block w-2.5 h-2.5 rounded-full ${
                                isAr ? 'ml-2' : 'mr-2'
                              }`}
                              style={{ backgroundColor: item.color }}
                            />
                            {isAr ? item.regionAr : item.regionEn}{' '}
                            {isAr && (
                              <span className="text-xs text-[#9CBAC4]" dir="ltr">
                                ({item.regionEn})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono-num text-[#F2A33A]" dir="ltr">
                            {item.leads}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#2DD4BF]" dir="ltr">
                            {item.arteryEn}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl bg-[#051F28]/85 border border-white/15 p-5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-base font-bold text-[#EEF6F8]">
                    {isAr
                      ? `${activeTerritory.regionAr} · ${activeTerritory.arteryAr}`
                      : `${activeTerritory.regionEn} · ${activeTerritory.arteryEn}`}
                  </h4>
                  <span className="text-xs font-mono-num text-[#F2A33A]" dir="ltr">
                    Leads: {activeTerritory.leads}
                  </span>
                </div>
                <p className="text-sm text-[#B8D0D8] leading-relaxed">
                  {isAr ? activeTerritory.descriptionAr : activeTerritory.descriptionEn}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 h-[330px] sm:h-[360px] rounded-2xl border border-white/15 bg-[#041921]/75 overflow-hidden">
              <Heart3D
                mode="territory"
                activeTerritory={activeTerritoryId}
                bpm={68}
              />
            </div>
          </div>
        </div>

        {/* PART C: Special Leads (Right-Sided V1R-V6R & Posterior V7-V9) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-3 zg-float-a">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#EEF6F8]">
                {t('التوصيلات اليمنى', 'Right-Sided Chest Leads')}{' '}
                <span className="font-display text-base text-[#F2A33A]" dir="ltr">
                  (V1R–V6R / V4R)
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPlaneMode('all');
                  setSelectedElectrodeId('V4R');
                }}
                className="text-xs font-mono-num font-bold px-2.5 py-1 rounded-lg bg-[#F2A33A]/20 text-[#F2A33A] hover:bg-[#F2A33A]/30 cursor-pointer transition-colors"
                dir="ltr"
              >
                {t('عرض V4R على 3D', 'Focus V4R in 3D')}
              </button>
            </div>
            {isAr ? (
              <>
                <p className="text-sm text-[#B8D0D8] leading-relaxed">
                  تُوضع في الجهة اليمنى من الصدر بصورة مرآوية للتوصيلات الصدرية المعتادة (وأهمها{' '}
                  <strong className="text-[#F2A33A]" dir="ltr">
                    V4R
                  </strong>{' '}
                  في الورب الخامس يمين خط منتصف الترقوة).
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#EEF6F8] list-disc list-inside">
                  <li>
                    دواعيها: الاشتباه في <strong dir="ltr">RV MI</strong> بالتزامن مع{' '}
                    <strong dir="ltr">Inferior STEMI</strong>.
                  </li>
                  <li>
                    ارتفاع <span dir="ltr">ST</span> في <span dir="ltr">Lead III &gt; Lead II</span>.
                  </li>
                  <li>
                    تأكيد <span dir="ltr">ST elevation</span> في{' '}
                    <strong className="text-[#E8552E]" dir="ltr">
                      V4R
                    </strong>
                    .
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-sm text-[#B8D0D8] leading-relaxed">
                  Placed in mirror-image positions across the right chest wall, led by{' '}
                  <strong className="text-[#F2A33A]">V4R</strong> at the 5th ICS, right mid-clavicular line.
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#EEF6F8] list-disc list-inside">
                  <li>
                    Indication: Suspected <strong>RV Infarction</strong> accompanying{' '}
                    <strong>Inferior STEMI</strong>.
                  </li>
                  <li>ST elevation in Lead III &gt; Lead II (RCA occlusion sign).</li>
                  <li>
                    Diagnostic goal: Confirm ST elevation ≥ 1 mm in{' '}
                    <strong className="text-[#E8552E]">V4R</strong>.
                  </li>
                </ul>
              </>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 zg-float-b">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#EEF6F8]">
                {t('التوصيلات الخلفية', 'Posterior Chest Leads')}{' '}
                <span className="font-display text-base text-[#2DD4BF]" dir="ltr">
                  (V7–V9)
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPlaneMode('all');
                  setSelectedElectrodeId('V8');
                }}
                className="text-xs font-mono-num font-bold px-2.5 py-1 rounded-lg bg-[#2DD4BF]/20 text-[#2DD4BF] hover:bg-[#2DD4BF]/30 cursor-pointer transition-colors"
                dir="ltr"
              >
                {t('عرض V7–V9 على 3D', 'Rotate to Back in 3D')}
              </button>
            </div>
            {isAr ? (
              <>
                <p className="text-sm text-[#B8D0D8] leading-relaxed">
                  تُوضع على الظهر بمستوى V4–V6: <strong dir="ltr">V7</strong> (Posterior Axillary)،{' '}
                  <strong dir="ltr">V8</strong> (Mid-Scapular)، و <strong dir="ltr">V9</strong>{' '}
                  (Para-Vertebral).
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#EEF6F8] list-disc list-inside">
                  <li>
                    دواعيها: <span dir="ltr">ST depression</span> في <span dir="ltr">V1–V3</span> مع{' '}
                    <span dir="ltr">Tall R wave</span>.
                  </li>
                  <li>
                    وجود <span dir="ltr">Inferior / Lateral MI</span> أو ألم صدري يمتد للظهر.
                  </li>
                  <li>
                    الهدف: تأكيد <strong className="text-[#2DD4BF]" dir="ltr">ST elevation</strong> في{' '}
                    <span dir="ltr">V7–V9</span>.
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-sm text-[#B8D0D8] leading-relaxed">
                  Placed along the left posterior chest at the 5th ICS level: <strong>V7</strong>{' '}
                  (posterior axillary), <strong>V8</strong> (mid-scapular), and <strong>V9</strong>{' '}
                  (para-vertebral).
                </p>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#EEF6F8] list-disc list-inside">
                  <li>Indication: Reciprocal ST depression in V1–V3 with tall R waves.</li>
                  <li>Associated with Inferior/Lateral MI or chest pain radiating to the back.</li>
                  <li>
                    Diagnostic goal: Confirm ST elevation ≥ 0.5 mm in{' '}
                    <strong className="text-[#2DD4BF]">V7–V9</strong>.
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
