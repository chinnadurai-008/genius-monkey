import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  RotateCw, Check, AlertCircle, ArrowLeft, ArrowRight, 
  RotateCcw, Sparkles, BookOpen, CheckCircle2 
} from 'lucide-react';
import { Quiz, Question } from '../types';
import { sound } from '../utils/storage';
import { GeniusMonkeyMascot } from './GeniusMonkeyMascot';

interface FlashcardsPlayerProps {
  quiz: Quiz;
  onFinish: (bananasEarned: number) => void;
  onBack: () => void;
}

export const FlashcardsPlayer: React.FC<FlashcardsPlayerProps> = ({
  quiz,
  onFinish,
  onBack,
}) => {
  const [deck, setDeck] = useState<Question[]>([...quiz.questions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMastered = () => {
    sound.playCorrect();
    sound.playBanana();
    setMasteredCount((prev) => prev + 1);
    nextCard(true);
  };

  const handleReviewAgain = () => {
    sound.playWrong();
    // Put current card at end of deck to practice again
    setDeck((prev) => [...prev, currentQ]);
    nextCard(false);
  };

  const nextCard = (wasMastered: boolean) => {
    setIsFlipped(false);
    if (currentIndex + 1 < deck.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sound.playFanfare();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
      onFinish(quiz.questions.length * 15);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-lg">
          <div className="flex justify-center mb-4">
            <GeniusMonkeyMascot size="lg" mood="excited" customQuote="All cards mastered! Synapses firing at maximum capacity." />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Deck Completed
          </span>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-2 mb-2">
            Flashcard Session Done!
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Mastered {quiz.questions.length} college study concepts.
          </p>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 mb-6 font-bold flex items-center justify-center gap-2">
            <span>+{quiz.questions.length * 15} Bananas Earned</span>
            <span>🍌</span>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setDeck([...quiz.questions]);
                setCurrentIndex(0);
                setIsFlipped(false);
                setMasteredCount(0);
                setIsFinished(false);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Repeat Deck
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((currentIndex) / deck.length) * 100);

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Flashcards
        </button>

        <div className="text-xs font-bold text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200">
          Card {currentIndex + 1} of {deck.length} · {masteredCount} Mastered
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-2 bg-stone-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3D Flip Card */}
      <div className="relative min-h-[340px] md:min-h-[380px] w-full cursor-pointer perspective-1000 mb-6" onClick={handleFlip}>
        <motion.div
          className="w-full h-full min-h-[340px] md:min-h-[380px] rounded-3xl p-8 border-2 flex flex-col justify-between transition-all select-none shadow-md bg-white relative"
          style={{
            borderColor: isFlipped ? '#f59e0b' : '#e7e5e4',
          }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              {quiz.courseTag}
            </span>
            <div className="flex items-center gap-1 text-xs text-stone-400 font-semibold">
              <RotateCw className="w-3.5 h-3.5" />
              Click card to {isFlipped ? 'view question' : 'flip answer'}
            </div>
          </div>

          {/* Card Body */}
          <div className="my-auto py-6">
            {!isFlipped ? (
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">
                  Question / Concept
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-display text-stone-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                    Correct Answer
                  </span>
                  <div className="text-xl md:text-2xl font-extrabold text-stone-900">
                    {currentQ.options[currentQ.correctAnswerIndex]}
                  </div>
                </div>

                <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs md:text-sm text-stone-800 leading-relaxed">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Deep Academic Context:
                  </div>
                  {currentQ.explanation}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="text-center text-xs text-stone-400 font-medium">
            {isFlipped ? 'Rate your recall below' : 'Tap anywhere to reveal answer'}
          </div>
        </motion.div>
      </div>

      {/* Response Action Controls */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleReviewAgain}
          className="py-3.5 px-4 rounded-2xl border-2 border-stone-300 hover:border-amber-400 hover:bg-amber-50 text-stone-700 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          Review Again (Needs Work)
        </button>
        <button
          onClick={handleMastered}
          className="py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          Got It! (Mastered) +10 🍌
        </button>
      </div>
    </div>
  );
};
