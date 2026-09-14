import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Search, BookOpen, Zap, Layers, Puzzle, Users, 
  Sparkles, Trash2, Edit, Copy, Share2, Award, Flame, Filter
} from 'lucide-react';
import { Quiz, QuizCategory, GameMode } from '../types';
import { COLLEGE_SUBJECTS } from '../data/starterQuizzes';
import { GeniusMonkeyMascot } from './GeniusMonkeyMascot';

interface QuizLibraryProps {
  quizzes: Quiz[];
  onStartGame: (quiz: Quiz, mode: GameMode) => void;
  onCreateQuiz: () => void;
  onEditQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onDuplicateQuiz: (quiz: Quiz) => void;
  bananas: number;
  streak: number;
  onOpenProfile: () => void;
}

export const QuizLibrary: React.FC<QuizLibraryProps> = ({
  quizzes,
  onStartGame,
  onCreateQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onDuplicateQuiz,
  bananas,
  streak,
  onOpenProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.courseTag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Custom' ? quiz.isCustom : quiz.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* College Welcome Banner with Genius Monkey */}
      <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-6 md:p-8 text-stone-950 shadow-md relative overflow-hidden border-2 border-amber-300">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-stone-950 text-amber-300 px-3 py-1 rounded-full">
                RIT Autonomous Institution 🏛️
              </span>
              <span className="text-xs font-bold text-amber-950/90 bg-amber-300/60 px-2.5 py-0.5 rounded-full">
                Ramco Institute of Technology
              </span>
              <span className="text-xs font-bold text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                RIT Autonomous Regulations
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-stone-950">
              RIT Autonomous Engineering Quizzes & Knowledge Games
            </h1>

            <p className="text-stone-900/90 text-sm md:text-base font-medium leading-relaxed">
              Exclusively for Ramco Institute of Technology — An Autonomous Institution! Generate custom exam study decks from your RIT Autonomous syllabus, lab manuals & lecture notes, or challenge your classmates in rapid-fire technical duels.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onCreateQuiz}
                className="bg-stone-950 hover:bg-stone-900 text-amber-300 font-extrabold px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md flex items-center gap-2 text-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                Create RIT Quiz / AI Notes
              </button>
              <button
                onClick={onOpenProfile}
                className="bg-amber-300/80 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2.5 rounded-2xl text-sm border border-amber-400 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                RIT Student Card ({bananas} 🍌)
              </button>
            </div>
          </div>

          {/* Interactive Mascot Quote Bubble */}
          <div className="shrink-0 flex justify-center md:justify-end">
            <GeniusMonkeyMascot size="lg" mood="excited" />
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code, topic, or quiz..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 shadow-xs"
            />
          </div>

          {/* Quick Create Link */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onCreateQuiz}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-4 py-2 rounded-2xl text-sm transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              + New Quiz Deck
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-stone-900 text-amber-300 shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Engineering Decks ({quizzes.length})
          </button>
          <button
            onClick={() => setSelectedCategory('Custom')}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'Custom'
                ? 'bg-amber-500 text-stone-900 shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            My Custom Engineering Quizzes ({quizzes.filter((q) => q.isCustom).length})
          </button>
          {COLLEGE_SUBJECTS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-900 shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-stone-200 rounded-3xl p-8">
          <div className="text-4xl mb-3">🐵🔎</div>
          <h3 className="text-lg font-bold text-stone-800 mb-1">No quizzes found</h3>
          <p className="text-stone-500 text-sm mb-6 max-w-sm mx-auto">
            Try adjusting your search query, or create a brand new custom quiz using your lecture notes!
          </p>
          <button
            onClick={onCreateQuiz}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-2xl text-sm transition-colors cursor-pointer"
          >
            Create First Quiz Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Header tags & actions */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-200/80">
                      {quiz.courseTag}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                      {quiz.category}
                    </span>
                    {quiz.isCustom && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Custom
                      </span>
                    )}
                  </div>

                  {/* Actions for custom quiz */}
                  {quiz.isCustom && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditQuiz(quiz)}
                        className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Edit quiz"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDuplicateQuiz(quiz)}
                        className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Duplicate quiz"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteQuiz(quiz.id)}
                        className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-base md:text-lg font-display text-stone-900 leading-snug mb-1.5 line-clamp-2">
                  {quiz.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4 line-clamp-2">
                  {quiz.description}
                </p>

                {/* Meta stats */}
                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium mb-5 pb-4 border-b border-stone-100">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    {quiz.questions.length} Questions
                  </span>
                  {quiz.bestScore ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      Best: {quiz.bestScore}%
                    </span>
                  ) : null}
                  <span>{quiz.playsCount} plays</span>
                </div>
              </div>

              {/* Game Mode Launch Buttons */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Choose Game Mode:
                </div>

                {/* Primary Quick Quiz */}
                <button
                  onClick={() => onStartGame(quiz, 'quiz')}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold rounded-xl shadow-xs text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-stone-900" />
                  Classic Quiz Mode (Lifelines & Hints)
                </button>

                {/* Mini Mode Grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => onStartGame(quiz, 'blitz')}
                    className="p-2 bg-stone-100 hover:bg-orange-100 hover:text-orange-900 text-stone-700 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="60-Second Rapid Sprint"
                  >
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <span>Blitz</span>
                  </button>

                  <button
                    onClick={() => onStartGame(quiz, 'flashcards')}
                    className="p-2 bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="Spaced Recall Cards"
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cards</span>
                  </button>

                  <button
                    onClick={() => onStartGame(quiz, 'match')}
                    className="p-2 bg-stone-100 hover:bg-purple-100 hover:text-purple-900 text-stone-700 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="Connect Terminology Pairs"
                  >
                    <Puzzle className="w-3.5 h-3.5 text-purple-600" />
                    <span>Match</span>
                  </button>

                  <button
                    onClick={() => onStartGame(quiz, 'duel')}
                    className="p-2 bg-stone-100 hover:bg-amber-200 hover:text-amber-950 text-stone-700 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    title="2-Player Dorm Roommate Battle"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>Duel</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
