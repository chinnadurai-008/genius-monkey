import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Plus, BookOpen, Flame, Award, 
  Sparkles, Layers, RefreshCw 
} from 'lucide-react';
import { Quiz, GameMode, StudentProfile } from './types';
import { 
  getStoredQuizzes, saveQuizzes, 
  getStoredProfile, saveProfile, sound 
} from './utils/storage';
import { calculateMonkeyRank } from './data/starterQuizzes';
import { QuizLibrary } from './components/QuizLibrary';
import { QuizCreator } from './components/QuizCreator';
import { ClassicQuizPlayer } from './components/ClassicQuizPlayer';
import { BlitzGamePlayer } from './components/BlitzGamePlayer';
import { FlashcardsPlayer } from './components/FlashcardsPlayer';
import { MonkeyMatchGame } from './components/MonkeyMatchGame';
import { DormDuelPlayer } from './components/DormDuelPlayer';
import { StudentProfileModal } from './components/StudentProfileModal';

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentView, setCurrentView] = useState<'library' | 'create' | 'game'>('library');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('quiz');
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Initialize storage
  useEffect(() => {
    const loadedQuizzes = getStoredQuizzes();
    const loadedProfile = getStoredProfile();
    setQuizzes(loadedQuizzes);
    setProfile(loadedProfile);
  }, []);

  // Sync quizzes to storage
  const updateQuizzes = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes);
    saveQuizzes(newQuizzes);
  };

  // Sync profile to storage
  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Start a game mode
  const handleStartGame = (quiz: Quiz, mode: GameMode) => {
    setActiveQuiz(quiz);
    setActiveGameMode(mode);
    setCurrentView('game');
  };

  // Create new quiz
  const handleOpenCreateQuiz = () => {
    setEditingQuiz(null);
    setCurrentView('create');
  };

  // Edit existing quiz
  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setCurrentView('create');
  };

  // Delete custom quiz
  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Are you sure you want to delete this quiz deck?')) {
      const updated = quizzes.filter((q) => q.id !== quizId);
      updateQuizzes(updated);
    }
  };

  // Duplicate quiz
  const handleDuplicateQuiz = (quiz: Quiz) => {
    const duplicated: Quiz = {
      ...quiz,
      id: `quiz-dup-${Date.now()}`,
      title: `Copy of ${quiz.title}`,
      isCustom: true,
      playsCount: 0,
      bestScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      questions: quiz.questions.map((q, idx) => ({
        ...q,
        id: `q-dup-${Date.now()}-${idx}`,
      })),
    };
    const updated = [duplicated, ...quizzes];
    updateQuizzes(updated);
  };

  // Save new or edited quiz
  const handleSaveQuiz = (savedQuiz: Quiz) => {
    let updated: Quiz[];
    const existingIndex = quizzes.findIndex((q) => q.id === savedQuiz.id);

    if (existingIndex >= 0) {
      updated = [...quizzes];
      updated[existingIndex] = savedQuiz;
    } else {
      updated = [savedQuiz, ...quizzes];
      // Reward bananas for creating a quiz deck
      if (profile) {
        updateProfile({
          ...profile,
          bananas: profile.bananas + 50,
          quizzesCreated: profile.quizzesCreated + 1,
        });
        sound.playBanana();
      }
    }

    updateQuizzes(updated);
    setCurrentView('library');
    setEditingQuiz(null);
  };

  // Bookmark toggle
  const handleToggleBookmark = (qId: string) => {
    if (!profile) return;
    const isBookmarked = profile.bookmarkedQuestionIds.includes(qId);
    const updatedBookmarks = isBookmarked
      ? profile.bookmarkedQuestionIds.filter((id) => id !== qId)
      : [...profile.bookmarkedQuestionIds, qId];

    updateProfile({
      ...profile,
      bookmarkedQuestionIds: updatedBookmarks,
    });
  };

  // Game completed stats handler
  const handleGameFinished = (stats: {
    correctCount: number;
    totalCount: number;
    bananasEarned: number;
  }) => {
    if (!profile || !activeQuiz) return;

    const scorePct = stats.totalCount > 0 ? Math.round((stats.correctCount / stats.totalCount) * 100) : 0;
    const bestScore = Math.max(activeQuiz.bestScore || 0, scorePct);

    // Update quiz metadata
    const updatedQuizzes = quizzes.map((q) => {
      if (q.id === activeQuiz.id) {
        return {
          ...q,
          playsCount: (q.playsCount || 0) + 1,
          bestScore,
        };
      }
      return q;
    });
    updateQuizzes(updatedQuizzes);

    // Update student profile stats
    updateProfile({
      ...profile,
      bananas: profile.bananas + stats.bananasEarned,
      totalQuestionsAnswered: profile.totalQuestionsAnswered + stats.totalCount,
      correctAnswers: profile.correctAnswers + stats.correctCount,
      gamesPlayed: profile.gamesPlayed + 1,
    });
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const currentRank = calculateMonkeyRank(profile.bananas);

  return (
    <div className="min-h-screen bg-stone-100/60 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <button
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-3 hover:opacity-95 transition-opacity cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-xs border border-amber-300 relative">
              <GraduationCap className="w-4 h-4 text-amber-950 absolute -top-1.5 -right-1" />
              🐵
            </div>
            <div>
              <div className="font-extrabold font-display text-lg tracking-tight text-stone-900 flex items-center gap-1.5">
                GENIUS MONKEY
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 shadow-2xs">
                  RIT Autonomous
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium truncate max-w-[200px] sm:max-w-none">
                Ramco Institute of Technology (Autonomous) · {profile.major}
              </div>
            </div>
          </button>

          {/* Center / Right Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Create Quiz Shortcut */}
            <button
              onClick={handleOpenCreateQuiz}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Quiz</span>
            </button>

            {/* Banana Points Counter */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1.5 bg-amber-100/80 hover:bg-amber-100 border border-amber-300/80 text-amber-950 font-extrabold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              title="Click to view Monkey Student Card"
            >
              <span className="text-sm">🍌</span>
              <span>{profile.bananas}</span>
            </button>

            {/* Streak Counter */}
            <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 text-stone-700 font-bold px-2.5 py-1.5 rounded-xl text-xs">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.streak}d</span>
            </div>

            {/* Student Profile Avatar */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-amber-100 border border-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
              title="Student Profile & Bookmarks"
            >
              🎓
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          {/* VIEW: QUIZ LIBRARY */}
          {currentView === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <QuizLibrary
                quizzes={quizzes}
                onStartGame={handleStartGame}
                onCreateQuiz={handleOpenCreateQuiz}
                onEditQuiz={handleEditQuiz}
                onDeleteQuiz={handleDeleteQuiz}
                onDuplicateQuiz={handleDuplicateQuiz}
                bananas={profile.bananas}
                streak={profile.streak}
                onOpenProfile={() => setIsProfileModalOpen(true)}
              />
            </motion.div>
          )}

          {/* VIEW: CREATE / EDIT QUIZ */}
          {currentView === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <QuizCreator
                onSaveQuiz={handleSaveQuiz}
                onCancel={() => setCurrentView('library')}
                initialQuiz={editingQuiz}
              />
            </motion.div>
          )}

          {/* VIEW: GAME PLAYERS */}
          {currentView === 'game' && activeQuiz && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {activeGameMode === 'quiz' && (
                <ClassicQuizPlayer
                  quiz={activeQuiz}
                  onFinish={handleGameFinished}
                  onBack={() => setCurrentView('library')}
                  bookmarkedIds={profile.bookmarkedQuestionIds}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}

              {activeGameMode === 'blitz' && (
                <BlitzGamePlayer
                  quiz={activeQuiz}
                  onFinish={handleGameFinished}
                  onBack={() => setCurrentView('library')}
                />
              )}

              {activeGameMode === 'flashcards' && (
                <FlashcardsPlayer
                  quiz={activeQuiz}
                  onFinish={(bananasEarned) =>
                    handleGameFinished({
                      correctCount: activeQuiz.questions.length,
                      totalCount: activeQuiz.questions.length,
                      bananasEarned,
                    })
                  }
                  onBack={() => setCurrentView('library')}
                />
              )}

              {activeGameMode === 'match' && (
                <MonkeyMatchGame
                  quiz={activeQuiz}
                  onFinish={(bananasEarned) =>
                    handleGameFinished({
                      correctCount: Math.min(6, activeQuiz.questions.length),
                      totalCount: Math.min(6, activeQuiz.questions.length),
                      bananasEarned,
                    })
                  }
                  onBack={() => setCurrentView('library')}
                />
              )}

              {activeGameMode === 'duel' && (
                <DormDuelPlayer
                  quiz={activeQuiz}
                  onFinish={(bananasEarned) =>
                    handleGameFinished({
                      correctCount: Math.ceil(activeQuiz.questions.length / 2),
                      totalCount: activeQuiz.questions.length,
                      bananasEarned,
                    })
                  }
                  onBack={() => setCurrentView('library')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Profile & Bookmarks Modal */}
      {isProfileModalOpen && (
        <StudentProfileModal
          profile={profile}
          quizzes={quizzes}
          onUpdateProfile={updateProfile}
          onClose={() => setIsProfileModalOpen(false)}
          onSelectQuizToPlay={(quiz) => {
            setIsProfileModalOpen(false);
            handleStartGame(quiz, 'quiz');
          }}
        />
      )}
    </div>
  );
}
