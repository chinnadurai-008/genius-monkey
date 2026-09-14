import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Users, Swords, ArrowLeft, RotateCcw, Award, CheckCircle2, XCircle } from 'lucide-react';
import { Quiz, Question } from '../types';
import { sound } from '../utils/storage';
import { GeniusMonkeyMascot } from './GeniusMonkeyMascot';

interface DormDuelPlayerProps {
  quiz: Quiz;
  onFinish: (bananasEarned: number) => void;
  onBack: () => void;
}

export const DormDuelPlayer: React.FC<DormDuelPlayerProps> = ({
  quiz,
  onFinish,
  onBack,
}) => {
  const [p1Name, setP1Name] = useState('Roommate 1');
  const [p2Name, setP2Name] = useState('Roommate 2');
  const [hasStarted, setHasStarted] = useState(false);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQ: Question = quiz.questions[currentQIndex] || quiz.questions[0];

  const handleStartDuel = () => {
    setHasStarted(true);
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      sound.playCorrect();
      sound.playBanana();
      if (activePlayer === 1) {
        setP1Score((prev) => prev + 100);
      } else {
        setP2Score((prev) => prev + 100);
      }
    } else {
      sound.playWrong();
    }
  };

  const handleNextTurn = () => {
    if (currentQIndex + 1 < quiz.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setActivePlayer((prev) => (prev === 1 ? 2 : 1));
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsGameOver(true);
      sound.playFanfare();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
      onFinish(50);
    }
  };

  if (!hasStarted) {
    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-lg">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-900 flex items-center justify-center text-3xl shadow-md">
              ⚔️
            </div>
          </div>

          <h2 className="text-2xl font-bold font-display text-stone-900 mb-1">
            RIT Hostel Roommate Duel
          </h2>
          <p className="text-stone-500 text-xs mb-6">
            Pass-and-play engineering quiz battle for RIT hostel study buddies!
          </p>

          <div className="space-y-4 mb-8 text-left">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Player 1 (Chimp 🐒)
              </label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold text-stone-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Player 2 (Gorilla 🦍)
              </label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold text-stone-900 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleStartDuel}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl text-sm shadow-sm transition-colors cursor-pointer"
            >
              Start Dorm Duel!
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    let winner = 'Tie!';
    let winnerSubtitle = 'Both roommates share the curve!';
    if (p1Score > p2Score) {
      winner = `${p1Name} Wins! 👑`;
      winnerSubtitle = `${p1Name} takes the Dorm Academic Crown.`;
    } else if (p2Score > p1Score) {
      winner = `${p2Name} Wins! 👑`;
      winnerSubtitle = `${p2Name} takes the Dorm Academic Crown.`;
    }

    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-lg">
          <div className="flex justify-center mb-3">
            <GeniusMonkeyMascot size="lg" mood="excited" customQuote="A battle of monumental intellect! Roommate bragging rights sealed." />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Dorm Duel Finished
          </span>
          <h2 className="text-3xl font-extrabold font-display text-stone-900 mt-2 mb-1">
            {winner}
          </h2>
          <p className="text-stone-500 text-xs mb-6">{winnerSubtitle}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-2xl border ${p1Score >= p2Score ? 'bg-amber-50 border-amber-300' : 'bg-stone-50 border-stone-200'}`}>
              <span className="text-xs font-bold text-stone-500">{p1Name}</span>
              <div className="text-2xl font-black text-amber-700">{p1Score} pts</div>
            </div>
            <div className={`p-4 rounded-2xl border ${p2Score >= p1Score ? 'bg-amber-50 border-amber-300' : 'bg-stone-50 border-stone-200'}`}>
              <span className="text-xs font-bold text-stone-500">{p2Name}</span>
              <div className="text-2xl font-black text-amber-700">{p2Score} pts</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setCurrentQIndex(0);
                setActivePlayer(1);
                setP1Score(0);
                setP2Score(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setIsGameOver(false);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Rematch
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeName = activePlayer === 1 ? p1Name : p2Name;

  return (
    <div className="max-w-2xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Duel
        </button>

        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Question {currentQIndex + 1} of {quiz.questions.length}
        </span>
      </div>

      {/* Scoreboard Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            activePlayer === 1
              ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/30'
              : 'border-stone-200 bg-white opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🐒</span>
              <span className="font-bold text-xs md:text-sm text-stone-900">{p1Name}</span>
            </div>
            {activePlayer === 1 && (
              <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-stone-900 px-2 py-0.5 rounded-full">
                Turn
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{p1Score} pts</div>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            activePlayer === 2
              ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-400/30'
              : 'border-stone-200 bg-white opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦍</span>
              <span className="font-bold text-xs md:text-sm text-stone-900">{p2Name}</span>
            </div>
            {activePlayer === 2 && (
              <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-stone-900 px-2 py-0.5 rounded-full">
                Turn
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{p2Score} pts</div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
          {activeName}'s Turn to Answer
        </div>
        <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-6 leading-snug">
          {currentQ.question}
        </h3>

        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let style = 'border-stone-200 hover:border-amber-400 bg-white';
            if (isAnswered) {
              if (isCorrect) {
                style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrect) {
                style = 'border-red-400 bg-red-50 text-red-950';
              } else {
                style = 'border-stone-200 opacity-50 bg-stone-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-left font-medium text-sm md:text-base flex items-center justify-between gap-3 transition-all ${style} ${
                  !isAnswered ? 'cursor-pointer hover:shadow-xs' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs flex items-center justify-center shrink-0">
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

        {isAnswered && (
          <button
            onClick={handleNextTurn}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold rounded-2xl shadow-md transition-colors cursor-pointer"
          >
            {currentQIndex + 1 < quiz.questions.length ? 'Pass to Next Roommate ➡️' : 'View Duel Final Results 🏆'}
          </button>
        )}
      </div>
    </div>
  );
};
