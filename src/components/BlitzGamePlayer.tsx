import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Zap, Timer, RotateCcw, Award, ArrowLeft, Flame } from 'lucide-react';
import { Quiz, Question } from '../types';
import { sound } from '../utils/storage';
import { GeniusMonkeyMascot } from './GeniusMonkeyMascot';

interface BlitzGamePlayerProps {
  quiz: Quiz;
  onFinish: (stats: { correctCount: number; totalCount: number; bananasEarned: number }) => void;
  onBack: () => void;
}

export const BlitzGamePlayer: React.FC<BlitzGamePlayerProps> = ({
  quiz,
  onFinish,
  onBack,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeBonusFeedback, setTimeBonusFeedback] = useState<string | null>(null);

  // Pool questions and cycle through them
  const pool = quiz.questions;
  const currentQ: Question = pool[questionIndex % pool.length];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameOver) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleEndGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver]);

  const handleEndGame = () => {
    setIsGameOver(true);
    sound.playFanfare();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
    const bananasEarned = Math.max(10, Math.floor(score / 50));
    onFinish({
      correctCount,
      totalCount: totalAttempted,
      bananasEarned,
    });
  };

  const handleAnswer = (selectedIndex: number) => {
    if (isGameOver) return;

    const isCorrect = selectedIndex === currentQ.correctAnswerIndex;
    setTotalAttempted((prev) => prev + 1);

    if (isCorrect) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      const addedSeconds = 3;
      setSecondsLeft((prev) => Math.min(prev + addedSeconds, 90));
      const points = 100 + newStreak * 25;
      setScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);

      setTimeBonusFeedback(`+${addedSeconds}s! 🍌`);
      setTimeout(() => setTimeBonusFeedback(null), 900);
    } else {
      sound.playWrong();
      setStreak(0);
      setSecondsLeft((prev) => Math.max(prev - 2, 0));
      setTimeBonusFeedback('-2s');
      setTimeout(() => setTimeBonusFeedback(null), 900);
    }

    setQuestionIndex((prev) => prev + 1);
  };

  if (isGameOver) {
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const bananasEarned = Math.max(10, Math.floor(score / 50));

    return (
      <div className="max-w-xl mx-auto py-8 text-center">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-400 via-amber-500 to-red-500" />

          <div className="flex justify-center mb-4">
            <GeniusMonkeyMascot size="lg" mood="excited" customQuote="Time's up! Fast reflexes, scholar!" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
            ⚡ Monkey Speed Blitz Complete
          </span>
          <h2 className="text-3xl font-extrabold font-display text-stone-900 mt-2 mb-6">
            Blitz Score: {score.toLocaleString()}
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <span className="text-xs font-semibold text-stone-500 uppercase">Correct</span>
              <div className="text-2xl font-extrabold text-stone-800">
                {correctCount} / {totalAttempted}
              </div>
              <span className="text-xs text-stone-400">{accuracy}% accuracy</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-xs font-semibold text-amber-800 uppercase">Bananas</span>
              <div className="text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                +{bananasEarned} 🍌
              </div>
              <span className="text-xs text-amber-600 font-medium">Bounty</span>
            </div>

            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <span className="text-xs font-semibold text-orange-800 uppercase">Max Streak</span>
              <div className="text-2xl font-extrabold text-orange-600 flex items-center justify-center gap-1">
                {maxStreak} <Flame className="w-4 h-4 fill-orange-500 inline" />
              </div>
              <span className="text-xs text-orange-500 font-medium">Combo</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSecondsLeft(60);
                setScore(0);
                setStreak(0);
                setMaxStreak(0);
                setQuestionIndex(0);
                setCorrectCount(0);
                setTotalAttempted(0);
                setIsGameOver(false);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-2xl shadow-sm transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Back to Games
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Blitz
        </button>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <div className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {streak}x Combo
            </div>
          )}
          <div className="text-sm font-extrabold text-stone-800 bg-white px-3.5 py-1 rounded-full border border-stone-200 shadow-xs">
            Score: <span className="text-amber-600">{score}</span>
          </div>
        </div>
      </div>

      {/* Speed Clock Display */}
      <div className="bg-stone-900 text-white rounded-3xl p-5 mb-6 shadow-md relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-stone-400 tracking-wider">
            {quiz.title} · Rapid Recall
          </span>
          <div className="text-xl font-bold flex items-center gap-2 mt-0.5">
            <span>Question #{totalAttempted + 1}</span>
          </div>
        </div>

        {/* Big Countdown */}
        <div className="flex items-center gap-3 relative">
          {timeBonusFeedback && (
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -15, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className={`text-lg font-black absolute -top-4 right-2 ${
                timeBonusFeedback.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {timeBonusFeedback}
            </motion.span>
          )}
          <div
            className={`flex items-center gap-2 text-3xl font-mono font-black px-4 py-1.5 rounded-2xl border ${
              secondsLeft <= 10
                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                : 'bg-stone-800 text-amber-400 border-stone-700'
            }`}
          >
            <Timer className="w-6 h-6" />
            <span>{secondsLeft}s</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-6 leading-snug">
          {currentQ.question}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="p-4 rounded-2xl border-2 border-stone-200 hover:border-amber-500 hover:bg-amber-50/40 text-stone-900 font-semibold text-left transition-all active:scale-95 cursor-pointer shadow-xs flex items-center gap-3 text-sm md:text-base"
            >
              <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
