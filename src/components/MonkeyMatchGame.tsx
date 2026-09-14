import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Timer, Award, Check, Sparkles } from 'lucide-react';
import { Quiz } from '../types';
import { sound } from '../utils/storage';
import { GeniusMonkeyMascot } from './GeniusMonkeyMascot';

interface MatchTile {
  id: string; // unique tile id
  pairId: string; // shared pair id
  text: string;
  type: 'question' | 'answer';
  isMatched: boolean;
}

interface MonkeyMatchGameProps {
  quiz: Quiz;
  onFinish: (bananasEarned: number) => void;
  onBack: () => void;
}

export const MonkeyMatchGame: React.FC<MonkeyMatchGameProps> = ({
  quiz,
  onFinish,
  onBack,
}) => {
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize pairs from quiz
  useEffect(() => {
    // Select up to 6 questions for a good 12-tile matching grid
    const sampled = [...quiz.questions].slice(0, 6);
    const newTiles: MatchTile[] = [];

    sampled.forEach((q, idx) => {
      const pairId = `pair-${idx}`;
      const correctAns = q.options[q.correctAnswerIndex];

      // Question tile (shortened for tile fit)
      newTiles.push({
        id: `q-${idx}`,
        pairId,
        text: q.question,
        type: 'question',
        isMatched: false,
      });

      // Answer tile
      newTiles.push({
        id: `a-${idx}`,
        pairId,
        text: correctAns,
        type: 'answer',
        isMatched: false,
      });
    });

    // Shuffle tiles
    setTiles(newTiles.sort(() => 0.5 - Math.random()));
    setMatchedPairIds([]);
    setSelectedTileId(null);
    setElapsedSec(0);
    setMoves(0);
    setIsCompleted(false);
  }, [quiz]);

  // Game timer
  useEffect(() => {
    if (isCompleted || tiles.length === 0) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted, tiles.length]);

  const handleTileClick = (tile: MatchTile) => {
    if (tile.isMatched || isCompleted) return;

    // First selection
    if (!selectedTileId) {
      setSelectedTileId(tile.id);
      return;
    }

    // Clicked same tile
    if (selectedTileId === tile.id) {
      setSelectedTileId(null);
      return;
    }

    const firstTile = tiles.find((t) => t.id === selectedTileId);
    if (!firstTile) return;

    setMoves((prev) => prev + 1);

    // Check match
    if (firstTile.pairId === tile.pairId && firstTile.type !== tile.type) {
      // MATCH!
      sound.playCorrect();
      sound.playBanana();
      const updatedPairs = [...matchedPairIds, tile.pairId];
      setMatchedPairIds(updatedPairs);

      setTiles((prev) =>
        prev.map((t) =>
          t.pairId === tile.pairId ? { ...t, isMatched: true } : t
        )
      );
      setSelectedTileId(null);

      // Check win
      const totalPairs = tiles.length / 2;
      if (updatedPairs.length === totalPairs) {
        setIsCompleted(true);
        sound.playFanfare();
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
        const bananas = Math.max(25, 120 - elapsedSec * 2);
        onFinish(bananas);
      }
    } else {
      // MISMATCH
      sound.playWrong();
      setSelectedTileId(tile.id);
      setTimeout(() => {
        setSelectedTileId(null);
      }, 700);
    }
  };

  if (isCompleted) {
    const bananasEarned = Math.max(25, 120 - elapsedSec * 2);

    return (
      <div className="max-w-md mx-auto py-8 text-center">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-lg">
          <div className="flex justify-center mb-4">
            <GeniusMonkeyMascot size="lg" mood="excited" customQuote="All pairs matched! Fast cognitive synaptic linking." />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            🧩 Match Puzzle Solved
          </span>
          <h2 className="text-2xl font-bold font-display text-stone-900 mt-2 mb-2">
            Grid Cleared!
          </h2>
          <p className="text-stone-500 text-sm mb-6">
            Solved in {elapsedSec}s with {moves} moves.
          </p>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 mb-6 font-bold flex items-center justify-center gap-2">
            <span>+{bananasEarned} Bananas Earned</span>
            <span>🍌</span>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const sampled = [...quiz.questions].slice(0, 6);
                const newTiles: MatchTile[] = [];
                sampled.forEach((q, idx) => {
                  const pairId = `pair-${idx}`;
                  const correctAns = q.options[q.correctAnswerIndex];
                  newTiles.push({
                    id: `q-${idx}`,
                    pairId,
                    text: q.question,
                    type: 'question',
                    isMatched: false,
                  });
                  newTiles.push({
                    id: `a-${idx}`,
                    pairId,
                    text: correctAns,
                    type: 'answer',
                    isMatched: false,
                  });
                });
                setTiles(newTiles.sort(() => 0.5 - Math.random()));
                setMatchedPairIds([]);
                setSelectedTileId(null);
                setElapsedSec(0);
                setMoves(0);
                setIsCompleted(false);
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Rematch
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

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Match
        </button>

        <div className="flex items-center gap-4 text-xs font-bold text-stone-700 bg-white px-4 py-1.5 rounded-full border border-stone-200 shadow-xs">
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4 text-stone-400" />
            <span>{elapsedSec}s</span>
          </div>
          <div>Moves: {moves}</div>
          <div className="text-amber-600 font-black">
            {matchedPairIds.length} / {tiles.length / 2} Pairs
          </div>
        </div>
      </div>

      {/* Intro info */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
        <div className="text-xs text-amber-950 font-medium">
          <strong className="font-bold">How to play:</strong> Click a Question tile, then click its corresponding Answer tile to link them together!
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-0.5 rounded-md">
          {quiz.courseTag}
        </span>
      </div>

      {/* Grid of tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {tiles.map((tile) => {
          const isSelected = selectedTileId === tile.id;

          let style = 'bg-white border-stone-200 hover:border-amber-400 text-stone-800 shadow-xs';
          if (tile.isMatched) {
            style = 'bg-emerald-50/80 border-emerald-400 text-emerald-950 opacity-60 pointer-events-none';
          } else if (isSelected) {
            style = 'bg-amber-100 border-amber-500 text-amber-950 shadow-md ring-2 ring-amber-400/40';
          }

          return (
            <motion.button
              key={tile.id}
              whileHover={!tile.isMatched ? { scale: 1.02 } : {}}
              whileTap={!tile.isMatched ? { scale: 0.98 } : {}}
              onClick={() => handleTileClick(tile)}
              className={`min-h-[120px] p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer select-none ${style}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    tile.type === 'question'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {tile.type === 'question' ? 'Question' : 'Answer'}
                </span>

                {tile.isMatched && <Check className="w-4 h-4 text-emerald-600" />}
              </div>

              <div className="text-xs md:text-sm font-semibold leading-snug line-clamp-4">
                {tile.text}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
