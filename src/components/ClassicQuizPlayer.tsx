import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, 
  Sparkles, Award, Zap, Timer, Bookmark, BookmarkCheck, ArrowLeft
} from 'lucide-react';
import { Quiz, Question } from '../types';
import { sound } from '../utils/storage';
import { GeniusMonkeyMascot } from './GeniusMonkeyMascot';

interface ClassicQuizPlayerProps {
  quiz: Quiz;
  onFinish: (stats: { correctCount: number; totalCount: number; bananasEarned: number }) => void;
  onBack: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (qId: string) => void;
}

export const ClassicQuizPlayer: React.FC<ClassicQuizPlayerProps> = ({
  quiz,
  onFinish,
  onBack,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bananasEarned, setBananasEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.timePerQuestionSec || 25);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [hintText, setHintText] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [used5050, setUsed5050] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'excited' | 'puzzled' | 'academic'>('academic');
  const [mascotQuote, setMascotQuote] = useState<string | undefined>(undefined);

  const currentQ: Question = quiz.questions[currentIndex] || quiz.questions[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isAnswered || isCompleted) return;

    setTimeLeft(quiz.timePerQuestionSec || 25);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, isCompleted]);

  // Handle timeout
  const handleTimeUp = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setStreak(0);
    sound.playWrong();
    setMascotMood('puzzled');
    setMascotQuote("Time expired! College professors love strict exam clocks. Let's inspect the explanation.");
  };

  // Lifeline: 50/50
  const handleUse5050 = () => {
    if (used5050 || isAnswered || currentQ.options.length <= 2) return;
    setUsed5050(true);
    const wrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctAnswerIndex);

    // Pick 2 wrong indices to eliminate
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffled.slice(0, 2));
    setMascotMood('thinking');
    setMascotQuote("Eliminated 2 distractors! You've got a 50% probability now.");
  };

  // Lifeline: Ask Genius Monkey for a Hint
  const handleRequestHint = async () => {
    if (hintText || isAnswered) return;
    if (currentQ.monkeyHint) {
      setHintText(currentQ.monkeyHint);
      setMascotMood('thinking');
      setMascotQuote(`Hint: ${currentQ.monkeyHint}`);
      return;
    }

    setIsLoadingHint(true);
    try {
      const res = await fetch('/api/monkey-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          options: currentQ.options,
        }),
      });
      const data = await res.json();
      setHintText(data.hint || 'Focus on the fundamental definitions and mechanism.');
      setMascotMood('thinking');
      setMascotQuote(data.hint || 'Think through first principles!');
    } catch {
      setHintText('Analyze the options by eliminating the most extreme claim.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Select Option
  const handleSelectOption = (index: number) => {
    if (isAnswered || eliminatedOptions.includes(index)) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctAnswerIndex;

    if (isCorrect) {
      sound.playCorrect();
      sound.playBanana();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 10 + Math.min(newStreak * 2, 10);
      setBananasEarned((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);
      setMascotMood('excited');
      setMascotQuote(
        newStreak >= 3
          ? `🔥 ${newStreak} IN A ROW! Genius tier memory activated!`
          : 'Spot on! High marks for that one.'
      );
    } else {
      sound.playWrong();
      setStreak(0);
      setMascotMood('puzzled');
      setMascotQuote('Ouch, not quite! Good learning opportunity for the exam review.');
    }
  };

  // Next Question or Finish
  const handleNext = () => {
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setEliminatedOptions([]);
      setHintText(null);
      setMascotMood('academic');
      setMascotQuote(undefined);
    } else {
      setIsCompleted(true);
      sound.playFanfare();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
      onFinish({
        correctCount: correctCount + (selectedOption === currentQ.correctAnswerIndex ? 1 : 0),
        totalCount: quiz.questions.length,
        bananasEarned,
      });
    }
  };

  // Completion Scorecard Screen
  if (isCompleted) {
    const totalQ = quiz.questions.length;
    const finalScorePct = Math.round((correctCount / totalQ) * 100);
    let grade = 'A+';
    let gradeColor = 'text-emerald-600';
    if (finalScorePct < 60) {
      grade = 'C-';
      gradeColor = 'text-amber-700';
    } else if (finalScorePct < 75) {
      grade = 'B';
      gradeColor = 'text-blue-600';
    } else if (finalScorePct < 90) {
      grade = 'A';
      gradeColor = 'text-emerald-600';
    }

    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          
          <div className="flex justify-center mb-4">
            <GeniusMonkeyMascot size="lg" mood="excited" customQuote="Quiz conquered! Look at those marks." />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            {quiz.courseTag} · {quiz.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-stone-900 mt-2 mb-1">
            {quiz.title}
          </h2>
          <p className="text-stone-500 text-sm mb-6">Course Knowledge Review Complete</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-xs font-semibold text-stone-500 uppercase">Grade</span>
              <div className={`text-3xl font-extrabold ${gradeColor}`}>{grade}</div>
              <span className="text-xs text-stone-500">{finalScorePct}% Accuracy</span>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-100">
              <span className="text-xs font-semibold text-amber-800 uppercase">Bananas</span>
              <div className="text-3xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                +{bananasEarned} <span className="text-xl">🍌</span>
              </div>
              <span className="text-xs text-amber-700 font-medium">Earned</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-xs font-semibold text-stone-500 uppercase">Correct</span>
              <div className="text-3xl font-extrabold text-stone-800">
                {correctCount}/{totalQ}
              </div>
              <span className="text-xs text-stone-500">Mastered</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setStreak(0);
                setBananasEarned(0);
                setIsCompleted(false);
                setEliminatedOptions([]);
                setUsed5050(false);
                setHintText(null);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-2xl shadow-sm transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Return to Library
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isBookmarked = bookmarkedIds.includes(currentQ.id);

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quit Quiz
        </button>

        {/* Bananas & Streak counter */}
        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 bg-orange-100 border border-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-orange-500" />
              {streak}x Streak
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-amber-100/90 text-amber-950 font-extrabold px-3.5 py-1 rounded-full text-xs border border-amber-300">
            <span>🍌</span>
            <span>+{bananasEarned}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Timer */}
      <div className="bg-white/80 backdrop-blur-xs border border-stone-200 rounded-2xl p-4 shadow-xs mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-2">
          <span>
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-sm">
            <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-red-500 animate-bounce' : 'text-stone-400'}`} />
            <span className={timeLeft <= 5 ? 'text-red-600 font-bold' : 'text-stone-700'}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress Fill */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Mascot Live React banner */}
      <div className="mb-4">
        <GeniusMonkeyMascot size="sm" mood={mascotMood} customQuote={mascotQuote} />
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs relative"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
            {quiz.courseTag}
          </span>

          <div className="flex items-center gap-2">
            {/* Lifelines */}
            <button
              onClick={handleUse5050}
              disabled={used5050 || isAnswered || currentQ.options.length <= 2}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                used5050
                  ? 'opacity-40 bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 cursor-pointer'
              }`}
              title="Eliminate two wrong answers"
            >
              ✂️ 50/50
            </button>

            <button
              onClick={handleRequestHint}
              disabled={!!hintText || isAnswered || isLoadingHint}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                hintText
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 cursor-pointer'
              }`}
              title="Get a hint from Genius Monkey"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Hint
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
              }`}
              title="Bookmark for exam review"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold font-display text-stone-900 leading-snug mb-6">
          {currentQ.question}
        </h3>

        {/* Hint Callout */}
        {hintText && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <div>
              <strong className="font-bold">Genius Monkey Clue:</strong> {hintText}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let optionStyle = 'border-stone-200 hover:border-amber-400 bg-white text-stone-800';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-red-400 bg-red-50 text-red-950';
              } else {
                optionStyle = 'border-stone-200 opacity-50 bg-stone-50';
              }
            } else if (isEliminated) {
              optionStyle = 'opacity-30 line-through border-stone-200 bg-stone-100 cursor-not-allowed';
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isEliminated}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 text-sm md:text-base font-medium ${optionStyle} ${
                  !isAnswered && !isEliminated ? 'cursor-pointer hover:shadow-xs active:scale-[0.99]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isAnswered && isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl mb-6 text-sm text-amber-950"
          >
            <div className="flex items-center gap-2 font-bold mb-1.5 text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Academic Explanation & Key Takeaway:
            </div>
            <p className="leading-relaxed text-stone-800 text-xs md:text-sm">
              {currentQ.explanation}
            </p>
          </motion.div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <motion.button
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-colors cursor-pointer"
          >
            {currentIndex + 1 < quiz.questions.length ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Finish Quiz & View Report
                <Award className="w-4 h-4" />
              </>
            )}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};
