import React, { useState } from 'react';
import {
  RotateCw,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckCircle2,
  XCircle,
  RefreshCcw,
} from 'lucide-react';
import { FLASHCARDS, QUIZ_QUESTIONS } from '../data/ecgData';
import { useLanguage } from '../context/LanguageContext';

export const LearningToolsSection: React.FC = () => {
  const { t, isAr } = useLanguage();

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentCard = FLASHCARDS[cardIndex];
  const currentQ = QUIZ_QUESTIONS[qIndex];
  const chosenOption = selectedAnswers[currentQ.id];
  const hasAnsweredCurrent = chosenOption !== undefined;

  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const handleSelectOption = (optIdx: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const handleNextQuestion = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setQIndex(0);
    setQuizCompleted(false);
  };

  const activeOptions = isAr ? currentQ.optionsAr : currentQ.optionsEn;

  return (
    <section id="quiz" className="relative py-20 px-4 sm:px-6 z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* PART A: 3D Flip Flashcards */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-[#F2A33A]" dir="ltr">
                07 · 3D FLASHCARDS &amp; SELF-ASSESSMENT QUIZ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#EEF6F8] [text-wrap:balance]">
                {t(
                  'بطاقات المراجعة السريعة والاختبار التفاعلي',
                  '3D Study Flashcards & Self-Assessment Quiz'
                )}
              </h2>
            </div>

            <span className="font-mono-num text-sm text-[#9CBAC4]" dir="ltr">
              Card {cardIndex + 1} / {FLASHCARDS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 3D Flippable Card */}
            <div className="lg:col-span-7 perspective-1200">
              <button
                type="button"
                onClick={() => setIsFlipped((f) => !f)}
                className="relative w-full h-64 sm:h-72 text-center cursor-pointer focus:outline-none group"
                aria-label={t('اضغط لقلب البطاقة التعليمية', 'Click to flip flashcard')}
              >
                <div
                  className={`relative w-full h-full duration-500 preserve-3d transition-transform ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Face */}
                  <div className="absolute inset-0 backface-hidden glass-card rounded-3xl p-8 flex flex-col items-center justify-center gap-4">
                    <span className="text-xs font-semibold text-[#F2A33A]" dir="ltr">
                      {currentCard.category}
                    </span>
                    <h3
                      className="font-display text-3xl sm:text-4xl font-bold text-[#EEF6F8]"
                      dir="ltr"
                    >
                      {currentCard.termEn}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#9CBAC4] mt-2">
                      <RotateCw className="w-4 h-4 text-[#2DD4BF]" aria-hidden="true" />
                      <span>
                        {t('اضغط لقلب البطاقة ورؤية الشرح', 'Click to flip card & reveal explanation')}
                      </span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-3xl p-8 flex flex-col items-center justify-center gap-4 bg-[#0B3B4A]/85">
                    <span className="text-xs font-semibold text-[#2DD4BF]" dir="ltr">
                      {currentCard.termEn}
                    </span>
                    <p className="text-lg sm:text-xl font-bold text-[#EEF6F8] leading-snug">
                      {isAr ? currentCard.meaningAr : currentCard.meaningEn}
                    </p>
                    <p className="text-sm text-[#B8D0D8] max-w-lg leading-relaxed">
                      {isAr ? currentCard.detailAr : currentCard.detailEn}
                    </p>
                    <span className="text-[11px] text-[#F2A33A]">
                      {t('اضغط للعودة للوجه الأمامي', 'Click to flip back')}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Card Controls */}
            <div className="lg:col-span-5 glass-card rounded-3xl p-6 space-y-5">
              <h3 className="text-lg font-bold text-[#EEF6F8]">
                {t('مراجعة المصطلحات الطبية', 'Rapid Concept Review')}
              </h3>
              <p className="text-sm text-[#B8D0D8] leading-relaxed">
                {t(
                  'تنقل بين البطاقات الثماني لتثبيت الأرقام القياسية للموجات، توصيلات القلب، ومعايير ورق التخطيط.',
                  'Cycle through all 8 flashcards to reinforce normal ECG intervals, lead groups, and standard paper calibration.'
                )}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((i) => (i <= 0 ? FLASHCARDS.length - 1 : i - 1));
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white/8 hover:bg-white/15 text-sm font-semibold text-[#EEF6F8] cursor-pointer transition-colors"
                >
                  {isAr ? (
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{t('السابقة', 'Previous')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFlipped((f) => !f)}
                  className="py-2.5 px-4 rounded-xl bg-[#0E7C6B] hover:bg-[#0b685a] text-sm font-semibold text-white cursor-pointer transition-colors"
                >
                  {t('اقلب', 'Flip')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((i) => (i >= FLASHCARDS.length - 1 ? 0 : i + 1));
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#E8552E] hover:bg-[#d54722] text-sm font-semibold text-white cursor-pointer transition-colors"
                >
                  <span>{t('التالية', 'Next')}</span>
                  {isAr ? (
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PART B: 10-Question Interactive MCQ Quiz */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-[#F2A33A]" aria-hidden="true" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#EEF6F8]">
                  {t('اختبار المحاضرة (10 أسئلة MCQ)', 'Lecture Self-Assessment (10 MCQs)')}
                </h3>
                <p className="text-xs text-[#9CBAC4]">
                  {t(
                    'تصحيح فوري مع الشرح السريري لكل إجابة',
                    'Instant feedback with clinical rationale for every question'
                  )}
                </p>
              </div>
            </div>

            {!quizCompleted && (
              <div className="font-mono-num text-sm text-[#F2A33A]" dir="ltr">
                Question {qIndex + 1} / {QUIZ_QUESTIONS.length} · Score: {score}
              </div>
            )}
          </div>

          {quizCompleted ? (
            <div className="py-8 text-center space-y-6">
              <div className="inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-[#E8552E] to-[#F2A33A] items-center justify-center shadow-[0_0_45px_rgba(242,163,58,0.45)]">
                <span className="font-mono-num text-3xl font-extrabold text-white" dir="ltr">
                  {score}/{QUIZ_QUESTIONS.length}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl sm:text-3xl font-bold text-[#EEF6F8]">
                  {score >= 8
                    ? t(
                        'أداء ممتاز! إتقان متميز لتخطيط القلب الكهربائي',
                        'Outstanding! Excellent ECG Mastery'
                      )
                    : score >= 5
                    ? t(
                        'نتيجة جيدة! راجع النقاط التي أخطأت فيها',
                        'Good Effort! Review Missed Concepts'
                      )
                    : t(
                        'بداية موفقة! يمكنك مراجعة الأقسام وإعادة الاختبار',
                        'Solid Start! Revisit the Sections & Retry'
                      )}
                </h4>
                <p className="text-sm text-[#B8D0D8]">
                  {t('نسبتك النهائية:', 'Final Score:')}{' '}
                  <strong className="font-mono-num text-[#2DD4BF]" dir="ltr">
                    {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%
                  </strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E8552E] hover:bg-[#d54722] text-white font-bold text-sm cursor-pointer transition-colors"
              >
                <RefreshCcw className="w-4 h-4" aria-hidden="true" />
                <span>{t('إعادة الاختبار من جديد', 'Retake Quiz')}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E8552E] to-[#F2A33A] transition-all duration-300"
                  style={{
                    width: `${((qIndex + (hasAnsweredCurrent ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              <h4 className="text-lg sm:text-xl font-bold text-[#EEF6F8] leading-relaxed">
                {currentQ.id}. {isAr ? currentQ.questionAr : currentQ.questionEn}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeOptions.map((opt, idx) => {
                  const isCorrect = idx === currentQ.correctIndex;
                  const isChosen = idx === chosenOption;

                  let btnStyle =
                    'border-white/15 bg-white/5 hover:bg-white/10 text-[#EEF6F8]';
                  if (hasAnsweredCurrent) {
                    if (isCorrect) {
                      btnStyle =
                        'border-[#2DD4BF] bg-[#0E7C6B]/40 text-white font-semibold';
                    } else if (isChosen) {
                      btnStyle =
                        'border-[#E8552E] bg-[#E8552E]/30 text-white';
                    } else {
                      btnStyle = 'border-white/10 bg-white/3 text-[#9CBAC4] opacity-70';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(idx)}
                      className={`${
                        isAr ? 'text-right' : 'text-left'
                      } p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        hasAnsweredCurrent ? 'cursor-default' : 'cursor-pointer'
                      } ${btnStyle}`}
                    >
                      <span className="text-sm sm:text-base">{opt}</span>
                      {hasAnsweredCurrent && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#2DD4BF] shrink-0" aria-hidden="true" />
                      )}
                      {hasAnsweredCurrent && isChosen && !isCorrect && (
                        <XCircle className="w-5 h-5 text-[#E8552E] shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {hasAnsweredCurrent && (
                <div className="rounded-2xl bg-[#051F28]/85 border border-white/15 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#F2A33A]">
                      {chosenOption === currentQ.correctIndex
                        ? t('إجابة صحيحة', 'Correct Answer')
                        : t('التوضيح الصحيح', 'Clinical Explanation')}
                    </p>
                    <p className="text-sm text-[#B8D0D8] leading-relaxed">
                      {isAr ? currentQ.explanationAr : currentQ.explanationEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8552E] hover:bg-[#d54722] text-white text-sm font-bold shrink-0 cursor-pointer transition-colors"
                  >
                    <span>
                      {qIndex < QUIZ_QUESTIONS.length - 1
                        ? t('السؤال التالي', 'Next Question')
                        : t('عرض النتيجة النهائية', 'View Final Score')}
                    </span>
                    {isAr ? (
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
