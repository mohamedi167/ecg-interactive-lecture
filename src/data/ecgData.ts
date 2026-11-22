export interface IndicationItem {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionAr: string;
  descriptionEn: string;
  clinicalNoteAr: string;
  clinicalNoteEn: string;
}

export interface HeartPartInfo {
  id:
    | 'sa_node'
    | 'bachmann'
    | 'av_node'
    | 'his_bundle'
    | 'purkinje'
    | 'ra_tv'
    | 'rv_pv'
    | 'la_mv'
    | 'lv_av'
    | 'vessels'
    | 'atria'
    | 'ventricles';
  titleEn: string;
  titleAr: string;
  roleAr: string;
  roleEn: string;
  ecgLinkAr: string;
  ecgLinkEn: string;
  rateOrMetric?: string;
}

export interface CirculationStep {
  step: number;
  titleEn: string;
  titleAr: string;
  oxygenState: 'deoxygenated' | 'oxygenated' | 'gas_exchange';
  descriptionAr: string;
  descriptionEn: string;
  pathKey: string;
}

export interface ConductionNode {
  id: string;
  nameEn: string;
  nameAr: string;
  rate: string;
  ecgCorrelation: string;
  descriptionAr: string;
  descriptionEn: string;
  x: number;
  y: number;
}

export interface WaveComponent {
  id: string;
  nameEn: string;
  nameAr: string;
  physiology: string;
  durationOrAmpAr: string;
  durationOrAmpEn: string;
  descriptionAr: string;
  descriptionEn: string;
  clinicalNoteAr: string;
  clinicalNoteEn: string;
  xRange: [number, number];
}

export interface LeadElectrode {
  id: string;
  label: string;
  category: 'limb' | 'chest' | 'right' | 'posterior';
  locationEn: string;
  locationAr: string;
  viewArea: string;
  // 3D normalized anatomical target on Z-Anatomy body (meters relative to body origin)
  pos3d: [number, number, number];
  rayDir3d: [number, number, number];
  color: string;
}

export interface CoronaryTerritory {
  id: 'inferior' | 'septal' | 'anterior' | 'lateral';
  regionEn: string;
  regionAr: string;
  leads: string;
  arteryEn: string;
  arteryAr: string;
  color: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface QuizQuestion {
  id: number;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
}

export interface FlashcardItem {
  id: string;
  termEn: string;
  category: string;
  meaningAr: string;
  meaningEn: string;
  detailAr: string;
  detailEn: string;
}

export const HEART_PARTS_INFO: Record<HeartPartInfo['id'], HeartPartInfo> = {
  sa_node: {
    id: 'sa_node',
    titleEn: 'Sinoatrial (SA) Node',
    titleAr: 'العقدة الجيبية الأذينية (منظم القلب الطبيعي)',
    roleAr:
      'تقع في أعلى الجدار الخلفي للأذين الأيمن قرب الوريد الأجوف العلوي، وهي منظم ضربات القلب الطبيعي (Natural Pacemaker) وتستجيب مباشرة للجهاز العصبي السمبثاوي والباراسمبثاوي.',
    roleEn:
      'Located at the junction of the Superior Vena Cava and upper Right Atrium, it serves as the heart’s natural pacemaker and responds directly to autonomic nervous system control.',
    ecgLinkAr: 'تطلق الشرارة الأولى التي تنتشر في الأذينين فتصنع موجة P Wave (60–100 نبضة/دقيقة).',
    ecgLinkEn: 'Initiates atrial depolarization, generating the P Wave at an intrinsic rate of 60–100 bpm.',
    rateOrMetric: '60 – 100 bpm',
  },
  bachmann: {
    id: 'bachmann',
    titleEn: "Bachmann's Bundle & Internodal Tracts",
    titleAr: 'حزمة باخمان والمسارات بين العقدية',
    roleAr:
      'مسارات توصيل أذينية متخصصة تنقل الشرارة الكهربائية من SA Node إلى الأذين الأيسر (عبر حزمة باخمان) وإلى AV Node عبر ثلاث حزم أمامية ووسطى وخلفية.',
    roleEn:
      'Specialized atrial conduction pathways delivering impulses from the SA Node to the Left Atrium (via Bachmann’s Bundle) and to the AV Node through three internodal tracts.',
    ecgLinkAr: 'تضمن انقباض الأذينين الأيمن والأيسر بتزامن تام لتكوين موجة P متناسقة.',
    ecgLinkEn: 'Ensures synchronized right and left atrial contraction, forming a smooth upright P Wave.',
    rateOrMetric: 'Atrial Spread ~ 0.08 s',
  },
  av_node: {
    id: 'av_node',
    titleEn: 'Atrioventricular (AV) Node',
    titleAr: 'العقدة الأذينية البطينية',
    roleAr:
      'تقع في أسفل الحاجز بين الأذينين قرب الصمام ثلاثي الشرفات، وتعمل كبوابة تُحدث تأخيراً فسيولوجياً حيوياً لكي يفرغ الأذينان دمهما ويمتلئ البطينان بالكامل قبل الانقباض.',
    roleEn:
      'Situated at the lower interatrial septum, it introduces a crucial physiological delay so the ventricles finish filling with blood before contracting.',
    ecgLinkAr: 'يظهر هذا التأخير كفترة PR Interval (0.12 – 0.20 s)؛ وإذا تعطل الـ SA تعمل كاحتياط بمعدل 40–60 نبضة/دقيقة.',
    ecgLinkEn: 'Seen on ECG as the PR Interval (0.12–0.20 s); serves as a backup pacemaker at 40–60 bpm.',
    rateOrMetric: '40 – 60 bpm (Delay ~0.10 s)',
  },
  his_bundle: {
    id: 'his_bundle',
    titleEn: 'Bundle of His & Bundle Branches',
    titleAr: 'حزمة هيس والتفرعان الأيمن والأيسر',
    roleAr:
      'حزمة هيس هي الجسر الكهربائي الوحيد بين الأذينين والبطينين، وتنقسم في الحاجز إلى الفرع الأيمن (RBB) والفرع الأيسر (LBB بحزيمتيه الأمامية والخلفية).',
    roleEn:
      'The sole electrical bridge crossing the fibrous skeleton into the ventricles, dividing into the Right Bundle Branch and Left Bundle Branch (anterior & posterior fascicles).',
    ecgLinkAr: 'أي إحصار في هذه الفروع (Bundle Branch Block) يطيل عرض QRS ليصبح ≥ 0.12 ثانية.',
    ecgLinkEn: 'Blockage in either branch (Bundle Branch Block) widens the QRS complex to ≥ 0.12 seconds.',
    rateOrMetric: 'High-Speed Conduction',
  },
  purkinje: {
    id: 'purkinje',
    titleEn: 'Purkinje Fibers',
    titleAr: 'ألياف بركنجي',
    roleAr:
      'شبكة ألياف فائقة السرعة تنتشر في جدار البطينين من القمة (Apex) صعوداً للأعلى، لتضمن انقباض البطينين معاً من الأسفل للأعلى لدفع الدم بقوة نحو الصمامات الخارجة.',
    roleEn:
      'Ultra-fast subendocardial network spreading upward from the apex through both ventricular walls for coordinated bottom-to-top ejection.',
    ecgLinkAr: 'مسؤولة عن إزالة الاستقطاب السريع للبطينين وتشكيل مركّب QRS الضيق، ومعدلها الاحتياطي 20–40 bpm.',
    ecgLinkEn: 'Drives rapid ventricular depolarization (narrow QRS); serves as escape pacemaker at 20–40 bpm.',
    rateOrMetric: '20 – 40 bpm (4 m/s)',
  },
  ra_tv: {
    id: 'ra_tv',
    titleEn: 'Right Atrium & Tricuspid Valve',
    titleAr: 'الأذين الأيمن والصمام ثلاثي الشرفات',
    roleAr:
      'يستقبل الأذين الأيمن الدم غير المؤكسج العائد من الجسم عبر الوريدين الأجوفين العلوي والسفلي، ثم يضخه عبر الصمام ثلاثي الشرفات إلى البطين الأيمن.',
    roleEn:
      'Receives systemic deoxygenated blood from the Superior and Inferior Vena Cava and directs it across the Tricuspid Valve into the Right Ventricle.',
    ecgLinkAr: 'يمتلئ البطين الأيمن أثناء الانبساط ويستجيب الأذين الأيمن لموجة P.',
    ecgLinkEn: 'Right atrial depolarization initiates the first half of the P Wave.',
    rateOrMetric: 'Deoxygenated Inflow',
  },
  rv_pv: {
    id: 'rv_pv',
    titleEn: 'Right Ventricle & Pulmonary Valve',
    titleAr: 'البطين الأيمن والصمام الرئوي',
    roleAr:
      'يضخ البطين الأيمن الدم غير المؤكسج عبر الصمام الرئوي إلى الشريان الرئوي متجهاً إلى الرئتين لإتمام عملية تبادل الغازات وتنقية الدم بالأكسجين.',
    roleEn:
      'Pumps deoxygenated blood through the Pulmonary Valve into the Pulmonary Trunk toward the lungs for oxygenation.',
    ecgLinkAr: 'ينقبض مع موجة QRS؛ وتظهر تغيرات جلطة البطين الأيمن في التوصيلات اليمنى V4R.',
    ecgLinkEn: 'Contracts during QRS systole; RV infarction is detected via right-sided V4R lead.',
    rateOrMetric: 'Pulmonary Circulation',
  },
  la_mv: {
    id: 'la_mv',
    titleEn: 'Left Atrium & Mitral Valve',
    titleAr: 'الأذين الأيسر والصمام الميترالي',
    roleAr:
      'يستقبل الأذين الأيسر الدم المؤكسج القادم من الرئتين عبر الأوردة الرئوية الأربعة، ويمرره عبر الصمام الميترالي (ثنائي الشرفات) إلى البطين الأيسر.',
    roleEn:
      'Receives oxygen-rich blood from the four Pulmonary Veins and channels it through the Mitral (bicuspid) Valve into the Left Ventricle.',
    ecgLinkAr: 'نهاية موجة P تعكس انقباض الأذين الأيسر لإكمال ملء البطين الأيسر.',
    ecgLinkEn: 'Left atrial activation completes the terminal portion of the P Wave.',
    rateOrMetric: 'Oxygenated Inflow',
  },
  lv_av: {
    id: 'lv_av',
    titleEn: 'Left Ventricle & Aortic Valve',
    titleAr: 'البطين الأيسر والصمام الأورطي',
    roleAr:
      'أقوى حجرات القلب وأسمكها جداراً؛ يضخ الدم المؤكسج بضغط عالٍ عبر الصمام الأورطي إلى الشريان الأورطي لتغذية الجسم كله وعضلة القلب نفسه.',
    roleEn:
      'The thickest, highest-pressure chamber; ejects oxygenated blood across the Aortic Valve into the Aorta to perfuse the body and coronary arteries.',
    ecgLinkAr: 'يهيمن على شكل مركب QRS وتظهر تغيرات ترويته عبر التوصيلات الصدرية V1–V6 و I, aVL.',
    ecgLinkEn: 'Dominates the QRS electrical vector; ischemia localizes across V1–V6 and limb leads.',
    rateOrMetric: 'Systemic Pump',
  },
  vessels: {
    id: 'vessels',
    titleEn: 'Great Vessels (Aorta, PA, Vena Cava)',
    titleAr: 'الأوعية الدموية الكبرى',
    roleAr:
      'تشمل قوس الأورطي (Aorta) لتوزيع الدم المؤكسج، الشريان الرئوي (Pulmonary Trunk) للرئتين، والوريدين الأجوفين (SVC / IVC) لإرجاع الدم الوريدي.',
    roleEn:
      'Includes the Aortic Arch for systemic arterial outflow, Pulmonary Trunk to the lungs, and Superior/Inferior Vena Cava for venous return.',
    ecgLinkAr: 'تندفع موجات الدم خلالها مباشرة بعد انقباض البطينين في طور QRS–ST.',
    ecgLinkEn: 'Mechanical systolic ejection peaks immediately following the QRS complex.',
    rateOrMetric: 'Systemic & Pulmonary Trunks',
  },
  atria: {
    id: 'atria',
    titleEn: 'Atria (RA & LA)',
    titleAr: 'الأذينان (الأيمن والأيسر)',
    roleAr:
      'الحجرتان العلويتان لاستقبال الدم العائد من الجسم والرئتين وضخه إلى البطينين قبل الانقباض البطيني.',
    roleEn: 'Upper receiving chambers that prime the ventricles prior to ventricular systole.',
    ecgLinkAr: 'يمثل انقباضهما وإزالة استقطابهما موجة P wave على تخطيط القلب.',
    ecgLinkEn: 'Atrial depolarization corresponds to the P Wave.',
  },
  ventricles: {
    id: 'ventricles',
    titleEn: 'Ventricles (RV & LV)',
    titleAr: 'البطينان (الأيمن والأيسر)',
    roleAr:
      'الحجرتان السفليتان المسؤولتان عن ضخ الدم بقوة إلى الرئتين (البطين الأيمن) وإلى سائر الجسم عبر الأورطي (البطين الأيسر).',
    roleEn: 'Lower pumping chambers driving pulmonary and systemic circulation.',
    ecgLinkAr: 'يمثل إزالة استقطابهما مركّب QRS، وإعادة استقطابهما موجة T wave.',
    ecgLinkEn: 'Ventricular depolarization produces QRS; repolarization produces the T Wave.',
  },
};

export const INDICATIONS: IndicationItem[] = [
  {
    id: 'ischemia',
    titleEn: 'Myocardial Ischemia & Infarction',
    titleAr: 'نقص التروية والجلطة القلبية',
    descriptionAr:
      'الكشف السريع عن تغيرات ST segment و T wave و Q wave لتحديد وجود نقص تروية أو احتشاء عضلة القلب (STEMI / NSTEMI).',
    descriptionEn:
      'Rapid detection of ST-segment shifts, T-wave inversions, and pathological Q waves to identify ischemia or acute myocardial infarction (STEMI / NSTEMI).',
    clinicalNoteAr: 'يساعد في تحديد الشريان التاجي المصاب بدقة عبر توزيع الـ Leads.',
    clinicalNoteEn: 'Localizes the culprit coronary artery using contiguous ECG lead territories.',
  },
  {
    id: 'rhythm',
    titleEn: 'Rhythm & Conduction Disturbances',
    titleAr: 'اضطرابات النظم والتوصيل الكهربائي',
    descriptionAr:
      'تشخيص تسارع أو تباطؤ القلب (Tachycardia / Bradycardia)، الرجفان الأذيني (AFib)، وإحصار الحزم (Bundle Branch Block) أو AV Block.',
    descriptionEn:
      'Diagnoses arrhythmias (Tachycardia, Bradycardia, Atrial Fibrillation) and conduction blocks such as AV Block or Bundle Branch Block.',
    clinicalNoteAr: 'يُعد Lead II المعيار الأساسي لتحليل انتظام النبض.',
    clinicalNoteEn: 'Lead II serves as the primary rhythm strip for assessing regularity and P waves.',
  },
  {
    id: 'enlargement',
    titleEn: 'Chamber Enlargement',
    titleAr: 'تضخم حجرات القلب',
    descriptionAr:
      'رصد زيادة سمك جدار البطين (LVH / RVH) أو اتساع الأذينين عبر تغيرات سعة وشكل موجات P و QRS.',
    descriptionEn:
      'Detects ventricular hypertrophy (LVH / RVH) and atrial dilation via characteristic voltage and morphological changes in P and QRS waves.',
    clinicalNoteAr: 'زيادة ارتفاع موجة R في V5/V6 مع عمق S في V1/V2 يشير لتضخم البطين الأيسر.',
    clinicalNoteEn: 'Tall R waves in V5/V6 paired with deep S waves in V1/V2 suggest LVH.',
  },
  {
    id: 'electrolytes',
    titleEn: 'Electrolyte Disturbances',
    titleAr: 'اختلال الأملاح (خاصة Low K⁺ / Ca²⁺)',
    descriptionAr:
      'رصد تأثير نقص أو زيادة البوتاسيوم (Hypokalemia: ظهور U wave وتسطح T) والكالسيوم (تغير فترة QT).',
    descriptionEn:
      'Identifies potassium imbalances (e.g., prominent U waves and flat T waves in hypokalemia) and calcium shifts affecting the QT interval.',
    clinicalNoteAr: 'علامة إنذار مبكرة لتجنب اضطرابات النظم الخطيرة.',
    clinicalNoteEn: 'Provides early warning before life-threatening ventricular arrhythmias occur.',
  },
  {
    id: 'toxicity',
    titleEn: 'Drug Toxicity (Digoxin)',
    titleAr: 'تسمم الأدوية (مثل الديجوكسين)',
    descriptionAr:
      'تظهر علامات مميزة لتأثير وتسمم الديجوكسين مثل انحدار ST المقعّر (Scooped ST segment) وتباطؤ التوصيل.',
    descriptionEn:
      'Reveals classic medication effects and toxicity such as down-sloping "scooped" ST segments and AV conduction slowing with Digoxin.',
    clinicalNoteAr: 'يُستخدم لمتابعة أمان الأدوية المؤثرة على كهرباء القلب.',
    clinicalNoteEn: 'Essential for monitoring cardiac safety during antiarrhythmic or digoxin therapy.',
  },
  {
    id: 'therapy',
    titleEn: 'Evaluating Therapeutic Intervention',
    titleAr: 'تقييم الاستجابة للعلاج والتدخلات',
    descriptionAr:
      'متابعة فعالية أدوية إذابة الجلطات، القسطرة العلاجية، أو أجهزة تنظيم ضربات القلب (Pacemakers) بعد التدخل.',
    descriptionEn:
      'Evaluates effectiveness of thrombolytics, percutaneous coronary intervention (PCI), or implanted pacemaker function.',
    clinicalNoteAr: 'عودة ST segment إلى خط الأساس تؤكد نجاح إعادة التروية.',
    clinicalNoteEn: 'Resolution of ST elevation confirms successful myocardial reperfusion.',
  },
];

export const CIRCULATION_STEPS: CirculationStep[] = [
  {
    step: 1,
    titleEn: 'Vena Cava → Right Atrium',
    titleAr: 'الأذين الأيمن (Right Atrium)',
    oxygenState: 'deoxygenated',
    descriptionAr:
      'يصل الدم غير المؤكسج (Deoxygenated) من الجسم عبر الوريد الأجوف العلوي والسفلي (SVC / IVC) إلى الأذين الأيمن.',
    descriptionEn:
      'Deoxygenated blood returns from the systemic circulation via the Superior and Inferior Vena Cava into the Right Atrium.',
    pathKey: 'ra',
  },
  {
    step: 2,
    titleEn: 'Tricuspid Valve → Right Ventricle',
    titleAr: 'الصمام ثلاثي الشرفات ← البطين الأيمن',
    oxygenState: 'deoxygenated',
    descriptionAr:
      'ينقبض الأذين الأيمن فيعبر الدم عبر الصمام ثلاثي الشرفات (Tricuspid Valve) ليملأ البطين الأيمن.',
    descriptionEn:
      'Atrial contraction pushes blood across the Tricuspid Valve to fill the Right Ventricle.',
    pathKey: 'rv',
  },
  {
    step: 3,
    titleEn: 'Pulmonary Valve & Artery → Lungs',
    titleAr: 'الصمام والشريان الرئوي ← الرئتان',
    oxygenState: 'gas_exchange',
    descriptionAr:
      'يضخ البطين الأيمن الدم عبر الصمام الرئوي إلى الشريان الرئوي نحو الرئتين لتتم عملية تبادل الغازات والتأكسج.',
    descriptionEn:
      'The Right Ventricle ejects blood through the Pulmonary Valve into the Pulmonary Artery toward the lungs for gas exchange.',
    pathKey: 'lungs',
  },
  {
    step: 4,
    titleEn: 'Pulmonary Veins → Left Atrium',
    titleAr: 'الأوردة الرئوية ← الأذين الأيسر',
    oxygenState: 'oxygenated',
    descriptionAr:
      'يعود الدم الغني بالأكسجين (Oxygenated) من الرئتين عبر الأوردة الرئوية الأربعة ليصب في الأذين الأيسر.',
    descriptionEn:
      'Oxygen-rich blood returns from the lungs via the four Pulmonary Veins into the Left Atrium.',
    pathKey: 'la',
  },
  {
    step: 5,
    titleEn: 'Mitral Valve → Left Ventricle',
    titleAr: 'الصمام الميترالي ← البطين الأيسر',
    oxygenState: 'oxygenated',
    descriptionAr:
      'يتدفق الدم المؤكسج من الأذين الأيسر عبر الصمام الميترالي (Mitral Valve) إلى البطين الأيسر ذي الجدار العضلي السميك.',
    descriptionEn:
      'Oxygenated blood flows through the Mitral (Bicuspid) Valve into the thick-walled Left Ventricle.',
    pathKey: 'lv',
  },
  {
    step: 6,
    titleEn: 'Aortic Valve → Aorta → Body',
    titleAr: 'الصمام الأورطي ← الأورطي ← الجسم',
    oxygenState: 'oxygenated',
    descriptionAr:
      'ينقبض البطين الأيسر بقوة ليدفع الدم المؤكسج عبر الصمام الأورطي إلى الشريان الأورطي (Aorta) ومنه لجميع أنحاء الجسم.',
    descriptionEn:
      'Left ventricular systole ejects oxygenated blood across the Aortic Valve into the Aorta to supply the entire body.',
    pathKey: 'aorta',
  },
];

export const CONDUCTION_NODES: ConductionNode[] = [
  {
    id: 'sa',
    nameEn: 'SA Node',
    nameAr: 'العقدة الجيبية الأذينية',
    rate: '60 – 100 bpm',
    ecgCorrelation: 'P Wave Start',
    descriptionAr:
      'منظم القلب الرئيسي، تبدأ الشرارة الكهربائية فيها وتنتشر عبر الأذينين فتصنع موجة P.',
    descriptionEn:
      'Primary pacemaker of the heart; initiates impulses spreading across both atria to form the P wave.',
    x: 118,
    y: 88,
  },
  {
    id: 'bachmann',
    nameEn: "Bachmann's Bundle",
    nameAr: 'حزمة باخمان',
    rate: 'Fast Atrial Track',
    ecgCorrelation: 'P Wave Completion',
    descriptionAr:
      'حزمة توصيل سريعة تنقل الإشارة الكهربائية مباشرة من الأذين الأيمن إلى الأذين الأيسر لينقبضا معاً بتناغم.',
    descriptionEn:
      'High-speed interatrial tract conducting impulses from the right to the left atrium for synchronized atrial contraction.',
    x: 200,
    y: 74,
  },
  {
    id: 'av',
    nameEn: 'AV Node',
    nameAr: 'العقدة الأذينية البطينية',
    rate: '40 – 60 bpm (Backup)',
    ecgCorrelation: 'PR Interval (Delay)',
    descriptionAr:
      'تُبطئ الإشارة الكهربائية (~0.1 ثانية) لإتاحة الفرصة للبطينين للامتلاء بالدم قبل انقباضهما.',
    descriptionEn:
      'Slows conduction (~0.1 s physiological delay) allowing complete ventricular filling prior to systole.',
    x: 168,
    y: 158,
  },
  {
    id: 'his',
    nameEn: 'Bundle of His',
    nameAr: 'حزمة هيس',
    rate: 'AV-Ventricular Bridge',
    ecgCorrelation: 'End of PR / Start Q',
    descriptionAr:
      'الجسر الكهربائي الوحيد الذي يخترق الحاجز الليفي بين الأذينين والبطينين ليصل إلى الحاجز بين البطينين.',
    descriptionEn:
      'The only normal electrical connection traversing the fibrous ring into the interventricular septum.',
    x: 178,
    y: 196,
  },
  {
    id: 'branches',
    nameEn: 'Right & Left Bundle Branches',
    nameAr: 'الحزمة اليمنى واليسرى (Anterior & Posterior Fascicles)',
    rate: 'High Velocity',
    ecgCorrelation: 'QRS Complex',
    descriptionAr:
      'تنقسم حزمة هيس إلى فرع أيمن وفرع أيسر (يتفرع لحزيمة أمامية وخلفية) لتوصيل الكهرباء سريعاً لكلا البطينين.',
    descriptionEn:
      'Divides into Right and Left Bundle Branches (Anterior & Posterior fascicles) for rapid septal and ventricular activation.',
    x: 178,
    y: 252,
  },
  {
    id: 'purkinje',
    nameEn: 'Purkinje Fibers',
    nameAr: 'ألياف بركنجي',
    rate: '20 – 40 bpm (Escape)',
    ecgCorrelation: 'QRS Peak & Termination',
    descriptionAr:
      'شبكة ألياف دقيقة تنتشر في جدار البطينين من الأسفل للأعلى فتضمن انقباضاً متزامناً وقوياً يدفع الدم للأعلى.',
    descriptionEn:
      'Terminal subendocardial network sweeping upward from the apex to coordinate forceful ventricular contraction.',
    x: 238,
    y: 288,
  },
];

export const WAVE_COMPONENTS: WaveComponent[] = [
  {
    id: 'p_wave',
    nameEn: 'P Wave',
    nameAr: 'موجة P',
    physiology: 'Atrial Depolarization',
    durationOrAmpAr: 'الارتفاع ≤ 2.5 مربع صغير · العرض ≤ 2.5 مربع صغير (≤ 0.10 s)',
    durationOrAmpEn: 'Height ≤ 2.5 small boxes · Width ≤ 2.5 small boxes (≤ 0.10 s)',
    descriptionAr: 'تمثل إزالة الاستقطاب الكهربائي للأذينين (بداية من SA Node) مما يسبق الانقباض الأذيني.',
    descriptionEn: 'Represents atrial depolarization originating from the SA Node, preceding atrial contraction.',
    clinicalNoteAr: 'غيابها أو تغير شكلها يشير إلى اضطرابات أذينية مثل AFib أو Junctional rhythm.',
    clinicalNoteEn: 'Absence or abnormal morphology suggests atrial arrhythmias such as AFib or junctional rhythm.',
    xRange: [85, 145],
  },
  {
    id: 'pr_interval',
    nameEn: 'PR Interval',
    nameAr: 'فترة PR',
    physiology: 'AV Node Delay (Atrial → Ventricular Conduction)',
    durationOrAmpAr: '3 – 5 مربعات صغيرة (0.12 – 0.20 s)',
    durationOrAmpEn: '3 – 5 small boxes (0.12 – 0.20 s)',
    descriptionAr:
      'تُقاس من بداية موجة P حتى بداية مركب QRS، وتعكس الوقت اللازم لعبور الإشارة وتأخيرها في الـ AV Node.',
    descriptionEn:
      'Measured from the onset of the P wave to the start of the QRS complex, reflecting AV node conduction delay.',
    clinicalNoteAr: 'إطالتها (> 0.20 s) تعني First-Degree AV Block، وقصرها يشير لمسار إضافي مثل WPW.',
    clinicalNoteEn: 'Prolongation (> 0.20 s) indicates First-Degree AV Block; shortening suggests pre-excitation (WPW).',
    xRange: [85, 195],
  },
  {
    id: 'qrs_complex',
    nameEn: 'QRS Complex',
    nameAr: 'مركّب QRS',
    physiology: 'Ventricular Depolarization',
    durationOrAmpAr: 'الارتفاع 1 – 5 مربعات كبيرة · العرض < 3 مربعات صغيرة (< 0.12 s)',
    durationOrAmpEn: 'Height 1 – 5 large boxes · Width < 3 small boxes (< 0.12 s)',
    descriptionAr:
      'يمثل إزالة استقطاب البطينين السريع والقوي؛ موجة Q هابطة، R صاعدة، و S هابطة بعد R.',
    descriptionEn:
      'Represents rapid ventricular depolarization: Q (first negative), R (positive), and S (negative after R).',
    clinicalNoteAr: 'اتساع QRS (≥ 0.12 s) يدل على Bundle Branch Block أو منشأ بطيني للإشارة.',
    clinicalNoteEn: 'A wide QRS (≥ 0.12 s) points to Bundle Branch Block or a ventricular origin.',
    xRange: [195, 255],
  },
  {
    id: 'st_segment',
    nameEn: 'ST Segment',
    nameAr: 'قطعة ST',
    physiology: 'Isoelectric Period (Early Ventricular Repolarization)',
    durationOrAmpAr: 'على خط الأساس (Isoelectric Line)',
    durationOrAmpEn: 'Isoelectric Baseline (Flat)',
    descriptionAr:
      'تمتد من نهاية S (نقطة J) إلى بداية موجة T، وتكون في الحالة الطبيعية مستوية على خط الأساس.',
    descriptionEn:
      'Spans from the J point (end of S) to the onset of the T wave, normally sitting flat on the isoelectric line.',
    clinicalNoteAr: 'ارتفاعها (ST Elevation) علامة رئيسية للجلطة الحادة STEMI، وانخفاضها يدل على Ischemia.',
    clinicalNoteEn: 'ST elevation is a hallmark of acute STEMI, while ST depression indicates myocardial ischemia.',
    xRange: [255, 330],
  },
  {
    id: 't_wave',
    nameEn: 'T Wave',
    nameAr: 'موجة T',
    physiology: 'Ventricular Repolarization',
    durationOrAmpAr: 'الارتفاع ≤ 2 مربع كبير · العرض ≤ 6 مربعات صغيرة',
    durationOrAmpEn: 'Height ≤ 2 large boxes · Width ≤ 6 small boxes',
    descriptionAr:
      'تمثل إعادة الاستقطاب الكهربائي للبطينين (استعداد العضلة للنبضة التالية) وتكون غير متماثلة وموجبة عادة.',
    descriptionEn:
      'Represents ventricular repolarization as myocardial cells reset electrically; normally upright and asymmetric.',
    clinicalNoteAr: 'انقلابها (T-wave inversion) يظهر في نقص التروية، وتطاولها المدبب في Hyperkalemia.',
    clinicalNoteEn: 'Inversion suggests ischemia; tall peaked T waves are classic for hyperkalemia.',
    xRange: [330, 415],
  },
  {
    id: 'qt_interval',
    nameEn: 'QT Interval',
    nameAr: 'فترة QT',
    physiology: 'Total Ventricular Depolarization + Repolarization',
    durationOrAmpAr: 'تختلف مع معدل القلب (QTc طبيعي ~ 0.35 – 0.44 s)',
    durationOrAmpEn: 'Rate-dependent (Normal QTc ~ 0.35 – 0.44 s)',
    descriptionAr:
      'تمتد من بداية مركب QRS إلى نهاية موجة T، وتمثل كامل النشاط الكهربائي للبطينين.',
    descriptionEn:
      'Extends from the beginning of the QRS complex to the end of the T wave, capturing total ventricular electrical activity.',
    clinicalNoteAr: 'تطاول QT يزيد خطورة حدوث اضطراب نظم بطيني خطير (Torsades de Pointes).',
    clinicalNoteEn: 'Prolonged QT increases the risk of Torsades de Pointes arrhythmia.',
    xRange: [195, 415],
  },
  {
    id: 'u_wave',
    nameEn: 'U Wave',
    nameAr: 'موجة U',
    physiology: 'Late Repolarization (Purkinje / Papillary Muscles)',
    durationOrAmpAr: 'موجة صغيرة بعد T (أحياناً غير ظاهرة)',
    durationOrAmpEn: 'Small deflection following the T wave',
    descriptionAr:
      'تموج صغير يظهر أحياناً بعد موجة T بنفس اتجاهها، ويزداد وضوحه عند بطء القلب أو نقص البوتاسيوم.',
    descriptionEn:
      'A small low-amplitude deflection occasionally seen right after the T wave, representing late repolarization.',
    clinicalNoteAr: 'شائعة ومميزة جداً في حالات نقص البوتاسيوم (Hypokalemia).',
    clinicalNoteEn: 'Prominent U waves are classically associated with Hypokalemia.',
    xRange: [420, 465],
  },
];

export const NORMAL_VALUES_TABLE = [
  {
    wave: 'P Wave',
    amplitudeAr: '≤ 2.5 مربع صغير (≤ 0.25 mV)',
    amplitudeEn: '≤ 2.5 small boxes (≤ 0.25 mV)',
    durationAr: '≤ 2.5 مربع صغير (≤ 0.10 s)',
    durationEn: '≤ 2.5 small boxes (≤ 0.10 s)',
    meaning: 'Atrial depolarization',
  },
  {
    wave: 'PR Interval',
    amplitudeAr: 'خط الأساس (Isoelectric)',
    amplitudeEn: 'Isoelectric baseline',
    durationAr: '3 – 5 مربعات صغيرة (0.12 – 0.20 s)',
    durationEn: '3 – 5 small boxes (0.12 – 0.20 s)',
    meaning: 'AV node conduction delay',
  },
  {
    wave: 'QRS Complex',
    amplitudeAr: '1 – 5 مربعات كبيرة (0.5 – 2.5 mV)',
    amplitudeEn: '1 – 5 large boxes (0.5 – 2.5 mV)',
    durationAr: '< 3 مربعات صغيرة (< 0.12 s)',
    durationEn: '< 3 small boxes (< 0.12 s)',
    meaning: 'Ventricular depolarization',
  },
  {
    wave: 'T Wave',
    amplitudeAr: '≤ 2 مربع كبير (≤ 1.0 mV)',
    amplitudeEn: '≤ 2 large boxes (≤ 1.0 mV)',
    durationAr: '≤ 6 مربعات صغيرة (≤ 0.24 s)',
    durationEn: '≤ 6 small boxes (≤ 0.24 s)',
    meaning: 'Ventricular repolarization',
  },
];

// 3D Anatomical coordinates matched to Z-Anatomy / Svitylo human_body.glb (+Y meters from floor, +Z anterior, -X right side of body, +X left side of body)
export const ELECTRODES: LeadElectrode[] = [
  {
    id: 'RA',
    label: 'RA',
    category: 'limb',
    locationEn: 'Right Arm / Wrist / Subclavicular Fossa',
    locationAr: 'الذراع الأيمن (أو أسفل الترقوة اليمنى)',
    viewArea: 'Limb Reference (−)',
    pos3d: [-0.28, 0.92, 0.03],
    rayDir3d: [-0.5, 0, 1],
    color: '#EF4444',
  },
  {
    id: 'LA',
    label: 'LA',
    category: 'limb',
    locationEn: 'Left Arm / Wrist / Subclavicular Fossa',
    locationAr: 'الذراع الأيسر (أو أسفل الترقوة اليسرى)',
    viewArea: 'Limb Lead I (+)',
    pos3d: [0.28, 0.92, 0.03],
    rayDir3d: [0.5, 0, 1],
    color: '#F2A33A',
  },
  {
    id: 'RL',
    label: 'RL',
    category: 'limb',
    locationEn: 'Right Leg / Ankle (Ground / Neutral)',
    locationAr: 'الساق اليمنى (القطب الأرضي Ground)',
    viewArea: 'Electrical Ground',
    pos3d: [-0.11, 0.18, 0.04],
    rayDir3d: [-0.2, 0, 1],
    color: '#64748B',
  },
  {
    id: 'LL',
    label: 'LL',
    category: 'limb',
    locationEn: 'Left Leg / Ankle / Lower Abdomen',
    locationAr: 'الساق اليسرى (القطب السفلي)',
    viewArea: 'Inferior Leads II, III, aVF (+)',
    pos3d: [0.11, 0.18, 0.04],
    rayDir3d: [0.2, 0, 1],
    color: '#10B981',
  },
  {
    id: 'V1',
    label: 'V1',
    category: 'chest',
    locationEn: '4th ICS, Right Sternal Border',
    locationAr: 'الورب الرابع (4th ICS) يمين عظمة القص',
    viewArea: 'Septal (LAD)',
    pos3d: [-0.032, 1.32, 0.12],
    rayDir3d: [-0.15, 0, 1],
    color: '#E8552E',
  },
  {
    id: 'V2',
    label: 'V2',
    category: 'chest',
    locationEn: '4th ICS, Left Sternal Border',
    locationAr: 'الورب الرابع (4th ICS) يسار عظمة القص',
    viewArea: 'Septal (LAD)',
    pos3d: [0.032, 1.32, 0.12],
    rayDir3d: [0.15, 0, 1],
    color: '#F2A33A',
  },
  {
    id: 'V3',
    label: 'V3',
    category: 'chest',
    locationEn: 'Midway between V2 and V4',
    locationAr: 'في المنتصف تماماً بين V2 و V4',
    viewArea: 'Anterior (LAD)',
    pos3d: [0.068, 1.29, 0.12],
    rayDir3d: [0.3, 0, 1],
    color: '#10B981',
  },
  {
    id: 'V4',
    label: 'V4',
    category: 'chest',
    locationEn: '5th ICS, Left Mid-Clavicular Line',
    locationAr: 'الورب الخامس (5th ICS) عند خط منتصف الترقوة الأيسر',
    viewArea: 'Anterior (LAD)',
    pos3d: [0.105, 1.255, 0.11],
    rayDir3d: [0.45, 0, 1],
    color: '#38BDF8',
  },
  {
    id: 'V5',
    label: 'V5',
    category: 'chest',
    locationEn: '5th ICS Level, Left Anterior Axillary Line',
    locationAr: 'بمستوى V4 عند الخط الإبطي الأمامي (Anterior Axillary)',
    viewArea: 'Lateral (Circumflex)',
    pos3d: [0.145, 1.255, 0.065],
    rayDir3d: [0.8, 0, 0.6],
    color: '#A855F7',
  },
  {
    id: 'V6',
    label: 'V6',
    category: 'chest',
    locationEn: '5th ICS Level, Left Mid-Axillary Line',
    locationAr: 'بمستوى V4 عند الخط الإبطي الأوسط (Mid-Axillary)',
    viewArea: 'Lateral (Circumflex)',
    pos3d: [0.16, 1.255, 0.015],
    rayDir3d: [1, 0, 0.1],
    color: '#2DD4BF',
  },
  {
    id: 'V4R',
    label: 'V4R',
    category: 'right',
    locationEn: '5th ICS, Right Mid-Clavicular Line',
    locationAr: 'الورب الخامس يمين خط منتصف الترقوة (لتشخيص RV MI)',
    viewArea: 'Right Ventricle',
    pos3d: [-0.105, 1.255, 0.11],
    rayDir3d: [-0.45, 0, 1],
    color: '#FBBF24',
  },
  {
    id: 'V7',
    label: 'V7',
    category: 'posterior',
    locationEn: '5th ICS Level, Left Posterior Axillary Line',
    locationAr: 'بمستوى V4 عند الخط الإبطي الخلفي (Posterior Axillary)',
    viewArea: 'Posterior Wall',
    pos3d: [0.14, 1.255, -0.05],
    rayDir3d: [0.7, 0, -0.7],
    color: '#FB7185',
  },
  {
    id: 'V8',
    label: 'V8',
    category: 'posterior',
    locationEn: '5th ICS Level, Left Mid-Scapular Line',
    locationAr: 'بمستوى V4 أسفل لوح الكتف الأيسر (Mid-Scapular)',
    viewArea: 'Posterior Wall',
    pos3d: [0.085, 1.255, -0.08],
    rayDir3d: [0.35, 0, -1],
    color: '#FB7185',
  },
  {
    id: 'V9',
    label: 'V9',
    category: 'posterior',
    locationEn: '5th ICS Level, Left Para-Vertebral Border',
    locationAr: 'بمستوى V4 يسار العمود الفقري مباشرة (Para-Vertebral)',
    viewArea: 'Posterior Wall',
    pos3d: [0.032, 1.255, -0.09],
    rayDir3d: [0.1, 0, -1],
    color: '#FB7185',
  },
];

export const HEXAXIAL_LEADS = [
  { id: 'I', angle: 0, label: 'Lead I (0°)', polarity: 'RA (−) → LA (+)', groupAr: 'ثنائي القطب (Bipolar Limb)', groupEn: 'Bipolar Limb' },
  { id: 'II', angle: 60, label: 'Lead II (+60°)', polarity: 'RA (−) → LL (+)', groupAr: 'ثنائي القطب (Bipolar Limb)', groupEn: 'Bipolar Limb' },
  { id: 'aVF', angle: 90, label: 'aVF (+90°)', polarity: 'LL (+) vs (RA+LA)', groupAr: 'أحادي القطب معزّز (Augmented)', groupEn: 'Augmented Unipolar' },
  { id: 'III', angle: 120, label: 'Lead III (+120°)', polarity: 'LA (−) → LL (+)', groupAr: 'ثنائي القطب (Bipolar Limb)', groupEn: 'Bipolar Limb' },
  { id: 'aVR', angle: -150, label: 'aVR (−150°)', polarity: 'RA (+) vs (LA+LL)', groupAr: 'أحادي القطب معزّز (Augmented)', groupEn: 'Augmented Unipolar' },
  { id: 'aVL', angle: -30, label: 'aVL (−30°)', polarity: 'LA (+) vs (RA+LL)', groupAr: 'أحادي القطب معزّز (Augmented)', groupEn: 'Augmented Unipolar' },
];

export const CORONARY_TERRITORIES: CoronaryTerritory[] = [
  {
    id: 'inferior',
    regionEn: 'Inferior Wall',
    regionAr: 'الجدار السفلي',
    leads: 'II, III, aVF',
    arteryEn: 'RCA (Right Coronary Artery)',
    arteryAr: 'الشريان التاجي الأيمن',
    color: '#F2A33A',
    descriptionAr:
      'تظهر تغيرات الجلطة السفلية في التوصيلات السفلية II و III و aVF، ويُغذى غالباً عبر RCA (ويستدعي فحص V4R لاستبعاد إصابة البطين الأيمن).',
    descriptionEn:
      'Inferior MI appears in leads II, III, and aVF, predominantly supplied by the RCA (prompting a V4R check for RV infarction).',
  },
  {
    id: 'septal',
    regionEn: 'Septal Wall',
    regionAr: 'الحاجز بين البطينين',
    leads: 'V1, V2',
    arteryEn: 'LAD (Left Anterior Descending)',
    arteryAr: 'الشريان النازل الأمامي الأيسر',
    color: '#E8552E',
    descriptionAr:
      'التوصيلتان V1 و V2 تواجهان الحاجز البطيني مباشرةً، وتغيراتهما تشير لإصابة فروع الـ LAD.',
    descriptionEn:
      'Leads V1 and V2 directly face the interventricular septum, reflecting proximal septal branches of the LAD.',
  },
  {
    id: 'anterior',
    regionEn: 'Anterior Wall',
    regionAr: 'الجدار الأمامي',
    leads: 'V3, V4',
    arteryEn: 'LAD (Left Anterior Descending)',
    arteryAr: 'الشريان النازل الأمامي الأيسر',
    color: '#FB7185',
    descriptionAr:
      'التوصيلتان V3 و V4 تعكسان الجدار الأمامي للبطين الأيسر المغذى بشريان LAD.',
    descriptionEn:
      'Leads V3 and V4 look directly at the anterior left ventricular wall supplied by the LAD.',
  },
  {
    id: 'lateral',
    regionEn: 'Lateral Wall',
    regionAr: 'الجدار الجانبي',
    leads: 'I, aVL, V5, V6',
    arteryEn: 'LCx (Left Circumflex Artery)',
    arteryAr: 'الشريان المنعطف الأيسر',
    color: '#2DD4BF',
    descriptionAr:
      'تشمل High Lateral (I, aVL) و Low Lateral (V5, V6)، وتُغذى بالشريان المنعطف Circumflex.',
    descriptionEn:
      'Includes High Lateral (I, aVL) and Low Lateral (V5, V6) territories perfused by the Left Circumflex artery.',
  },
];

export const RHYTHM_STEPS = [
  {
    step: 1,
    titleEn: 'Rhythm & Regularity',
    titleAr: 'النظم والانتظام',
    focusLead: 'Lead II Rhythm Strip',
    detailAr:
      'افحص المسافات بين قمم R المتتالية (R–R intervals) في Lead II. إذا كانت متساوية فالنظم منتظم (Regular)، وإذا اختلفت المسافات فالنظم غير منتظم (Irregular).',
    detailEn:
      'Inspect consecutive R–R intervals on the Lead II rhythm strip. Equal spacing indicates a Regular rhythm; varying spacing indicates an Irregular rhythm.',
  },
  {
    step: 2,
    titleEn: 'Heart Rate Calculation',
    titleAr: 'حساب معدل ضربات القلب',
    focusLead: '300 ÷ Large Boxes / 6-Sec × 10',
    detailAr:
      'في النظم المنتظم: 300 ÷ عدد المربعات الكبيرة بين R و R. في النظم غير المنتظم: عدد مركبات QRS في 6 ثوانٍ (30 مربعاً كبيراً) × 10.',
    detailEn:
      'For regular rhythms: divide 300 by the number of large boxes between R–R. For irregular rhythms: count QRS complexes in 6 seconds (30 large boxes) and multiply by 10.',
  },
  {
    step: 3,
    titleEn: 'P Wave Evaluation',
    titleAr: 'فحص موجة P',
    focusLead: 'Present? Upright in II? 1:1 with QRS?',
    detailAr:
      'تأكد من وجود موجة P قبل كل QRS، وأن شكلها متشابه وموجب في Lead II، وأن فترة PR ثابتة بين 0.12 و 0.20 ثانية.',
    detailEn:
      'Verify a uniform upright P wave in Lead II precedes every QRS complex in a 1:1 ratio with a constant PR interval (0.12–0.20 s).',
  },
  {
    step: 4,
    titleEn: 'QRS Complex Duration',
    titleAr: 'عرض وشكل مركب QRS',
    focusLead: 'Narrow (< 0.12 s) vs Wide (≥ 0.12 s)',
    detailAr:
      'العرض الطبيعي أقل من 3 مربعات صغيرة (< 0.12 ثانية). اتساعه يدل على إحصار حزمة التوصيل أو بؤرة بطينية.',
    detailEn:
      'Normal QRS duration is < 3 small boxes (< 0.12 s). Widening indicates a Bundle Branch Block or ventricular ectopic rhythm.',
  },
  {
    step: 5,
    titleEn: 'ST Segment & T Wave',
    titleAr: 'قطعة ST وموجة T',
    focusLead: 'Isoelectric ST & Upright T',
    detailAr:
      'تأكد من استواء ST على خط الأساس وعدم وجود ارتفاع أو انخفاض (Ischemia / STEMI) ولاحظ اتجاه وشكل موجة T.',
    detailEn:
      'Confirm an isoelectric ST segment (check for elevation/depression) and examine T-wave polarity and symmetry.',
  },
];

export const PROCEDURE_STEPS = [
  {
    num: 1,
    phaseAr: 'التحضيرات الأربع',
    phaseEn: '4 Preparations',
    titleEn: 'Nurse, Equipment, Patient & Environment',
    titleAr: 'تجهيز الممرض، الجهاز، المريض، والبيئة',
    detailAr:
      'غسل الأيدي وتعريف المريض وشرح الإجراء، فحص جاهزية الجهاز والورق والأقطاب، توفير الخصوصية والإضاءة والدفء المناسبين.',
    detailEn:
      'Perform hand hygiene, explain the procedure, verify ECG machine/paper/electrodes, and ensure a warm, private environment.',
  },
  {
    num: 2,
    phaseAr: 'الوضعية',
    phaseEn: 'Position',
    titleEn: 'Supine Position (≤ 30°)',
    titleAr: 'استلقاء المريض بزاوية ≤ 30 درجة',
    detailAr:
      'يستلقي المريض مسترخياً على ظهره مع إسناد الرأس بزاوية لا تتجاوز 30° لمنع شد عضلات البطن والصدر.',
    detailEn:
      'Place the patient supine and relaxed with head elevation ≤ 30° to prevent somatic muscle tension artifacts.',
  },
  {
    num: 3,
    phaseAr: 'الخصوصية',
    phaseEn: 'Privacy',
    titleEn: 'Expose Chest with Privacy',
    titleAr: 'كشف الصدر والأطراف مع الحفاظ على الخصوصية',
    detailAr:
      'كشف المناطق المطلوبة فقط لوضع الأقطاب وتغطية بقية الجسم بغطاء نظيف احتراماً لخصوصية المريض.',
    detailEn:
      'Expose only the necessary chest and limb sites while draping the rest of the body respectfully.',
  },
  {
    num: 4,
    phaseAr: 'الجلد',
    phaseEn: 'Skin Prep',
    titleEn: 'Skin Preparation',
    titleAr: 'تحضير وتنظيف الجلد',
    detailAr:
      'تنظيف الجلد وتجفيفه من العرق والزيوت (أو إزالة الشعر الزائد عند الضرورة) لتقليل المقاومة الكهربائية.',
    detailEn:
      'Clean and dry skin (removing oils or excess hair if needed) to minimize electrical skin impedance.',
  },
  {
    num: 5,
    phaseAr: 'الأقطاب',
    phaseEn: 'Electrodes',
    titleEn: 'Apply Gel & Attach 10 Electrodes (12 Leads)',
    titleAr: 'وضع الجل وتثبيت الأقطاب الـ 10 (لتسجيل 12 Leads)',
    detailAr:
      'تثبيت 4 أقطاب للأطراف (RA, LA, RL, LL) و6 أقطاب صدرية (V1–V6) في مواضعها التشريحية بدقة مع جل موصل.',
    detailEn:
      'Apply conductive gel and attach 4 limb electrodes (RA, LA, RL, LL) and 6 precordial chest electrodes (V1–V6) accurately.',
  },
  {
    num: 6,
    phaseAr: 'الأسلاك',
    phaseEn: 'Lead Wires',
    titleEn: 'Connect Lead Wires',
    titleAr: 'توصيل الأسلاك بالأقطاب حسب الألوان والرموز',
    detailAr:
      'التأكد من مطابقة كل سلك لرمزه الصحيح وعدم شد الأسلاك أو التوائها فوق الصدر.',
    detailEn:
      'Match each color-coded cable to its exact electrode label without tension or crossing over the chest.',
  },
  {
    num: 7,
    phaseAr: 'الجهاز',
    phaseEn: 'Machine Setup',
    titleEn: 'Power On & Enter Patient Data',
    titleAr: 'تشغيل الجهاز وإدخال بيانات المريض',
    detailAr:
      'إدخال الاسم، الرقم الطبي، العمر، والوقت بدقة قبل بدء التسجيل.',
    detailEn:
      'Power on the ECG machine and enter patient name, medical ID, age, and timestamp accurately.',
  },
  {
    num: 8,
    phaseAr: 'التعليمات',
    phaseEn: 'Instructions',
    titleEn: 'Instruct Patient to Stay Still',
    titleAr: 'توجيه المريض بالثبات وعدم الحركة أو الكلام',
    detailAr:
      'الطلب من المريض التنفس بهدوء وعدم الحركة أو الكلام لثوانٍ معدودة لتجنب Somatic Tremor Artifact.',
    detailEn:
      'Ask the patient to breathe normally, remain still, and avoid talking during acquisition to prevent tremor artifact.',
  },
  {
    num: 9,
    phaseAr: 'التسجيل',
    phaseEn: 'Acquisition',
    titleEn: 'Acquire ECG (25 mm/s · 10 mm/mV)',
    titleAr: 'تسجيل التخطيط بالمعايرة القياسية',
    detailAr:
      'التحقق من سرعة الورق 25 mm/s والمعايرة القياسية 10 mm = 1 mV ثم الضغط على Acquire / Record.',
    detailEn:
      'Verify standard settings (25 mm/s speed, 10 mm = 1 mV calibration) and press Acquire to capture the 12-lead trace.',
  },
  {
    num: 10,
    phaseAr: 'المراجعة',
    phaseEn: 'Quality Check',
    titleEn: 'Review Trace Quality',
    titleAr: 'مراجعة وضوح التخطيط وخلوه من التشويش',
    detailAr:
      'فحص ظهور جميع الـ 12 Leads بوضوح دون تذبذب خط الأساس أو انقطاع أي توصيل.',
    detailEn:
      'Inspect all 12 leads for baseline stability, clear waveforms, and absence of electrical or motion artifact.',
  },
  {
    num: 11,
    phaseAr: 'الطباعة',
    phaseEn: 'Print',
    titleEn: 'Print & Label',
    titleAr: 'طباعة الورقة والتوقيع عليها',
    detailAr:
      'طباعة التخطيط كاملاً والتأكد من وجود بيانات المريض والوقت والتاريخ عليه.',
    detailEn:
      'Print the finalized tracing and verify patient identifiers, date, and clinical notes.',
  },
  {
    num: 12,
    phaseAr: 'الإنهاء',
    phaseEn: 'Cleanup',
    titleEn: 'Remove Electrodes & Clean Skin',
    titleAr: 'إزالة الأقطاب وتنظيف الجل عن الجلد',
    detailAr:
      'نزع الأقطاب بلطف ومسح بقايا الجل وإعادة تغطية المريض ومساعدته للراحة.',
    detailEn:
      'Gently remove electrodes, wipe off residual gel, assist the patient to dress, and ensure comfort.',
  },
  {
    num: 13,
    phaseAr: 'التوثيق',
    phaseEn: 'Escalation',
    titleEn: 'Document & Urgent Escalation (STEMI / VT)',
    titleAr: 'التوثيق والإبلاغ الفوري عن الحالات الحرجة',
    detailAr:
      'حفظ التخطيط في ملف المريض والإبلاغ الطبي العاجل فور رصد علامات خطيرة مثل STEMI أو Ventricular Tachycardia.',
    detailEn:
      'File the ECG in the chart and immediately notify the physician if critical findings (STEMI, VT) are detected.',
  },
];

export const PRACTICAL_QA = [
  {
    id: 'single_suction',
    questionAr: 'لو عندك قطب شفط واحد فقط (Single Suction Electrode) للصدر، كيف تسجل ECG كامل؟',
    questionEn: 'If you only have a single chest suction electrode, how do you record a full 12-lead ECG?',
    answerAr:
      'نُبقي أقطاب الأطراف الأربعة (RA, LA, LL, RL) متصلة بشكل طبيعي لتسجيل Limb Leads (I, II, III, aVR, aVL, aVF). ثم نستخدم قطب الشفط الصدري الوحيد على الموضع V1 ونسجل، ثم ننقله يدوياً إلى V2 ونسجل، وهكذا بالتتابع حتى V6 (في الأجهزة التي تدعم التسجيل اليدوي Lead-by-lead).',
    answerEn:
      'Keep all 4 limb electrodes (RA, LA, LL, RL) attached to capture the 6 limb leads normally. Then switch the ECG machine to manual mode, place the single suction electrode at V1 and record a strip, move it sequentially to V2, V3, V4, V5, and V6, recording each precordial lead one by one.',
  },
  {
    id: 'interference',
    questionAr: 'ماذا تفعل عند وجود تشويش (Interference / Artifact) على ورقة التخطيط؟',
    questionEn: 'What steps should you take if electrical or motion interference (artifact) appears on the ECG?',
    answerAr:
      '1) تحقّق من سبب التشويش: هل هو Somatic Tremor (ارتعاش/حركة عضلية ← هدّئ المريض وأدفئه وتأكد من استلقائه مسترخياً)، أم 60Hz AC Interference (تداخل كهربائي ← أبعد الهواتف والأجهزة المعدنية وتأكد من توصيل RL الأرضي جيداً)، أم Wandering Baseline (تذبذب خط الأساس ← نظّف الجلد وجففه وأضف جل جديد وثبّت الأقطاب بإحكام).',
    answerEn:
      'Identify the artifact type: (1) Somatic Tremor: warm and relax the patient in supine position; (2) AC Electrical Interference: remove nearby phones/metal, check cable shielding, and verify the RL ground lead; (3) Wandering Baseline: clean/dry skin, apply fresh gel, and secure loose electrodes.',
  },
];

export const FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc1',
    termEn: 'P Wave',
    category: 'Waveforms',
    meaningAr: 'إزالة استقطاب الأذينين (Atrial Depolarization)',
    meaningEn: 'Atrial Depolarization (SA Node → Atria)',
    detailAr: 'ارتفاعها وعرضها الطبيعيان لا يتجاوزان 2.5 مربع صغير (≤ 0.10 ثانية).',
    detailEn: 'Normal height and width are ≤ 2.5 small boxes (≤ 0.10 seconds).',
  },
  {
    id: 'fc2',
    termEn: 'PR Interval',
    category: 'Intervals',
    meaningAr: 'التأخير الفسيولوجي في العقدة الأذينية البطينية (AV Node Delay)',
    meaningEn: 'Physiological Delay at the AV Node',
    detailAr: 'مدتها الطبيعية 3 إلى 5 مربعات صغيرة (0.12 – 0.20 ثانية).',
    detailEn: 'Normal duration is 3 to 5 small boxes (0.12 – 0.20 seconds).',
  },
  {
    id: 'fc3',
    termEn: 'QRS Complex',
    category: 'Waveforms',
    meaningAr: 'إزالة استقطاب البطينين (Ventricular Depolarization)',
    meaningEn: 'Rapid Ventricular Depolarization',
    detailAr: 'عرضها الطبيعي أقل من 3 مربعات صغيرة (< 0.12 ثانية).',
    detailEn: 'Normal duration is less than 3 small boxes (< 0.12 seconds).',
  },
  {
    id: 'fc4',
    termEn: 'U Wave',
    category: 'Electrolytes',
    meaningAr: 'موجة صغيرة تظهر بعد موجة T في نقص البوتاسيوم (Hypokalemia)',
    meaningEn: 'Late Repolarization Wave Seen in Hypokalemia',
    detailAr: 'تمثل إعادة استقطاب متأخرة لألياف بركنجي والعضلات الحليمية.',
    detailEn: 'Follows the T wave and is a hallmark sign of low serum potassium.',
  },
  {
    id: 'fc5',
    termEn: "Einthoven's Triangle",
    category: 'Leads',
    meaningAr: 'مثلث التوصيلات ثنائية القطب حول القلب (Leads I, II, III)',
    meaningEn: 'Bipolar Limb Lead Triangle Around the Heart',
    detailAr: 'قانونه الرياضي الشهير: Lead II = Lead I + Lead III.',
    detailEn: "Einthoven's Law states: Lead II = Lead I + Lead III.",
  },
  {
    id: 'fc6',
    termEn: 'Right-Sided Leads (V4R)',
    category: 'Special Leads',
    meaningAr: 'توصيلات الجهة اليمنى للصدر لتشخيص جلطة البطين الأيمن (RV MI)',
    meaningEn: 'Right Chest Leads for Detecting RV Infarction',
    detailAr: 'تُطلب عند وجود Inferior STEMI أو ارتفاع ST في Lead III أكبر من Lead II.',
    detailEn: 'Indicated in Inferior STEMI when ST elevation in Lead III > Lead II.',
  },
  {
    id: 'fc7',
    termEn: 'Posterior Leads (V7–V9)',
    category: 'Special Leads',
    meaningAr: 'توصيلات الظهر لتأكيد الجلطة الخلفية (Posterior MI)',
    meaningEn: 'Back Leads for Confirming Posterior Wall MI',
    detailAr: 'تُطلب عند رؤية ST depression مع Tall R في V1–V3، للبحث عن ST elevation في V7–V9.',
    detailEn: 'Ordered when V1–V3 show ST depression with tall R waves to confirm ST elevation in V7–V9.',
  },
  {
    id: 'fc8',
    termEn: 'Standard Calibration',
    category: 'ECG Paper',
    meaningAr: 'سرعة الورق 25 mm/s والمعايرة 10 mm = 1 mV',
    meaningEn: 'Paper Speed 25 mm/s · Gain 10 mm = 1 mV',
    detailAr: 'المربع الصغير = 0.04 ثانية، والمربع الكبير = 0.20 ثانية (5 مربعات كبيرة = 1 ثانية).',
    detailEn: '1 small box = 0.04 s; 1 large box = 0.20 s; 5 large boxes = 1 second.',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionAr: 'ما هو الحدث الكهربائي الذي تمثله موجة P Wave على تخطيط القلب؟',
    questionEn: 'Which electrical event does the P Wave represent on an ECG?',
    optionsAr: [
      'Ventricular depolarization',
      'Atrial depolarization',
      'Ventricular repolarization',
      'Delay at the AV node',
    ],
    optionsEn: [
      'Ventricular depolarization',
      'Atrial depolarization',
      'Ventricular repolarization',
      'Delay at the AV node',
    ],
    correctIndex: 1,
    explanationAr: 'موجة P تمثل إزالة استقطاب الأذينين (Atrial depolarization) ابتداءً من SA node.',
    explanationEn: 'The P wave represents atrial depolarization originating from the SA node.',
  },
  {
    id: 2,
    questionAr: 'ما هي المدة الزمنية للمربع الصغير الواحد (1 mm) والمربع الكبير (5 mm) عند سرعة ورق 25 mm/s؟',
    questionEn: 'At a standard paper speed of 25 mm/s, what is the duration of 1 small box and 1 large box?',
    optionsAr: [
      '0.02 s للصغير و 0.10 s للكبير',
      '0.04 s للصغير و 0.20 s للكبير',
      '0.08 s للصغير و 0.40 s للكبير',
      '0.10 s للصغير و 0.50 s للكبير',
    ],
    optionsEn: [
      '0.02 s (small) and 0.10 s (large)',
      '0.04 s (small) and 0.20 s (large)',
      '0.08 s (small) and 0.40 s (large)',
      '0.10 s (small) and 0.50 s (large)',
    ],
    correctIndex: 1,
    explanationAr: 'عند سرعة 25 mm/s: كل 1 mm (مربع صغير) = 0.04 ثانية، وكل 5 mm (مربع كبير) = 0.20 ثانية.',
    explanationEn: 'At 25 mm/s, each 1 mm small box equals 0.04 seconds and each 5 mm large box equals 0.20 seconds.',
  },
  {
    id: 3,
    questionAr: 'ما هو السبب الرئيسي للتأخير الفسيولوجي في العقدة الأذينية البطينية (AV Node)؟',
    questionEn: 'What is the main physiological purpose of the conduction delay at the AV Node?',
    optionsAr: [
      'لتقليل سرعة الدم في الشريان الأورطي',
      'لإعطاء البطينين وقتاً كافياً للامتلاء بالدم قبل انقباضهما',
      'لإعادة استقطاب ألياف بركنجي',
      'لتنشيط العصب الحائر مباشرة',
    ],
    optionsEn: [
      'To decrease aortic blood velocity',
      'To allow the ventricles enough time to fill with blood before contracting',
      'To repolarize Purkinje fibers',
      'To stimulate the vagus nerve directly',
    ],
    correctIndex: 1,
    explanationAr: 'توقف الإشارة المؤقت في الـ AV Node يضمن تفريغ الأذينين وامتلاء البطينين بالكامل قبل الانقباض البطيني.',
    explanationEn: 'The AV node delay ensures complete atrial emptying and ventricular filling before ventricular systole.',
  },
  {
    id: 4,
    questionAr: 'أي من التوصيلات التالية تعكس الجدار السفلي (Inferior Wall) المغذى غالباً بـ RCA؟',
    questionEn: 'Which group of ECG leads reflects the Inferior Wall, typically supplied by the RCA?',
    optionsAr: ['V1, V2', 'V3, V4', 'II, III, aVF', 'I, aVL, V5, V6'],
    optionsEn: ['V1, V2', 'V3, V4', 'II, III, aVF', 'I, aVL, V5, V6'],
    correctIndex: 2,
    explanationAr: 'التوصيلات السفلية II و III و aVF تنظر إلى الجدار السفلي للقلب وتُغذى غالباً عبر الشريان التاجي الأيمن RCA.',
    explanationEn: 'Leads II, III, and aVF view the inferior cardiac wall, usually supplied by the Right Coronary Artery (RCA).',
  },
  {
    id: 5,
    questionAr: 'أين يوضع القطب الصدري V4 بدقة تشريحية؟',
    questionEn: 'What is the exact anatomical placement for chest electrode V4?',
    optionsAr: [
      '4th ICS يمين عظمة القص',
      '4th ICS يسار عظمة القص',
      '5th ICS على خط منتصف الترقوة الأيسر (Mid-clavicular line)',
      '5th ICS على الخط الإبطي الأوسط',
    ],
    optionsEn: [
      '4th ICS, right sternal border',
      '4th ICS, left sternal border',
      '5th ICS, left mid-clavicular line',
      '5th ICS, left mid-axillary line',
    ],
    correctIndex: 2,
    explanationAr: 'يوضع القطب V4 في الورب الخامس (5th ICS) عند خط منتصف الترقوة الأيسر.',
    explanationEn: 'V4 is placed at the 5th intercostal space (ICS) along the left mid-clavicular line.',
  },
  {
    id: 6,
    questionAr: 'في نظام التوصيلات السداسي المحاور (Hexaxial Reference System)، ما هي زاوية Lead II وزاوية aVL؟',
    questionEn: 'In the Hexaxial Reference System, what are the angles for Lead II and aVL?',
    optionsAr: [
      'Lead II = +60° و aVL = −30°',
      'Lead II = 0° و aVL = +90°',
      'Lead II = +120° و aVL = −150°',
      'Lead II = +90° و aVL = +60°',
    ],
    optionsEn: [
      'Lead II = +60° and aVL = −30°',
      'Lead II = 0° and aVL = +90°',
      'Lead II = +120° and aVL = −150°',
      'Lead II = +90° and aVL = +60°',
    ],
    correctIndex: 0,
    explanationAr: 'في النظام السداسي: Lead I = 0°، Lead II = +60°، aVF = +90°، Lead III = +120°، aVL = −30°، aVR = −150°.',
    explanationEn: 'On the hexaxial wheel: I = 0°, II = +60°, aVF = +90°, III = +120°, aVL = −30°, and aVR = −150°.',
  },
  {
    id: 7,
    questionAr: 'إذا كان النظم منتظماً والمسافة بين R و R هي 4 مربعات كبيرة، فكم يبلغ معدل القلب؟',
    questionEn: 'If a rhythm is regular and the R–R interval spans 4 large boxes, what is the heart rate?',
    optionsAr: ['60 نبضة/دقيقة', '75 نبضة/دقيقة', '100 نبضة/دقيقة', '120 نبضة/دقيقة'],
    optionsEn: ['60 bpm', '75 bpm', '100 bpm', '120 bpm'],
    correctIndex: 1,
    explanationAr: 'بقسمة 300 على عدد المربعات الكبيرة (300 ÷ 4) نحصل على 75 نبضة في الدقيقة (Normal Sinus Rate).',
    explanationEn: 'Using 300 ÷ large boxes: 300 ÷ 4 = 75 bpm (normal sinus rate).',
  },
  {
    id: 8,
    questionAr: 'متى يُنصح بشدة بتسجيل Posterior Leads (V7–V9)؟',
    questionEn: 'When are Posterior Leads (V7–V9) strongly indicated?',
    optionsAr: [
      'عند وجود ST elevation في V1–V2 فقط',
      'عند وجود ST depression في V1–V3 مع Tall R wave',
      'عند وجود U wave في Lead II',
      'عند ارتفاع موجة P أكثر من 2.5 mm',
    ],
    optionsEn: [
      'Isolated ST elevation in V1–V2 only',
      'ST depression in V1–V3 accompanied by a tall R wave',
      'Presence of a U wave in Lead II',
      'P wave amplitude > 2.5 mm',
    ],
    correctIndex: 1,
    explanationAr: 'وجود ST depression مع Tall R في V1–V3 قد يكون صورة مرآوية لجلطة خلفية تستدعي تأكيد ST elevation في V7–V9.',
    explanationEn: 'ST depression with tall R waves in V1–V3 can be a reciprocal mirror image of posterior MI, confirmed by ST elevation in V7–V9.',
  },
  {
    id: 9,
    questionAr: 'ما القيمة الطبيعية لعرض مركب QRS وفترة PR Interval؟',
    questionEn: 'What are the normal durations for the QRS complex and PR interval?',
    optionsAr: [
      'QRS < 3 مربعات صغيرة، PR = 3–5 مربعات صغيرة',
      'QRS = 5–7 مربعات صغيرة، PR = 1–2 مربع صغير',
      'QRS > 4 مربعات صغيرة، PR > 6 مربعات صغيرة',
      'QRS < 1 مربع صغير، PR = 2 مربع كبير',
    ],
    optionsEn: [
      'QRS < 3 small boxes, PR = 3–5 small boxes',
      'QRS = 5–7 small boxes, PR = 1–2 small boxes',
      'QRS > 4 small boxes, PR > 6 small boxes',
      'QRS < 1 small box, PR = 2 large boxes',
    ],
    correctIndex: 0,
    explanationAr: 'العرض الطبيعي لمركب QRS أقل من 3 مربعات صغيرة (< 0.12 s)، وفترة PR الطبيعية بين 3 و 5 مربعات صغيرة (0.12–0.20 s).',
    explanationEn: 'Normal QRS duration is < 3 small boxes (< 0.12 s) and normal PR interval is 3–5 small boxes (0.12–0.20 s).',
  },
  {
    id: 10,
    questionAr: 'ظهور موجة U Wave واضحة مع تسطح موجة T يشير غالباً إلى:',
    questionEn: 'A prominent U wave accompanied by flattened T waves most commonly points to:',
    optionsAr: [
      'Hypercalcemia',
      'Hypokalemia (نقص البوتاسيوم)',
      'Left Ventricular Hypertrophy',
      'Right Bundle Branch Block',
    ],
    optionsEn: [
      'Hypercalcemia',
      'Hypokalemia (low potassium)',
      'Left Ventricular Hypertrophy',
      'Right Bundle Branch Block',
    ],
    correctIndex: 1,
    explanationAr: 'تُعد موجة U الظاهرة علامة كلاسيكية لنقص البوتاسيوم في الدم (Hypokalemia).',
    explanationEn: 'Prominent U waves with flattened T waves are a classic ECG hallmark of hypokalemia.',
  },
];
