import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Award, Flame, BookOpen, GraduationCap, CheckCircle, Bookmark, Trash2 } from 'lucide-react';
import { StudentProfile, Quiz } from '../types';
import { calculateMonkeyRank, MONKEY_RANKS } from '../data/starterQuizzes';

interface StudentProfileModalProps {
  profile: StudentProfile;
  quizzes: Quiz[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onClose: () => void;
  onSelectQuizToPlay: (quiz: Quiz) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  profile,
  quizzes,
  onUpdateProfile,
  onClose,
  onSelectQuizToPlay,
}) => {
  const [monkeyName, setMonkeyName] = useState(profile.monkeyName);
  const [collegeName, setCollegeName] = useState(profile.collegeName);
  const [major, setMajor] = useState(profile.major);
  const [isSaved, setIsSaved] = useState(false);

  const currentRank = calculateMonkeyRank(profile.bananas);
  const accuracy = profile.totalQuestionsAnswered > 0
    ? Math.round((profile.correctAnswers / profile.totalQuestionsAnswered) * 100)
    : 0;

  // Find next rank
  const currentRankIndex = MONKEY_RANKS.findIndex((r) => r.name === currentRank.name);
  const nextRank = currentRankIndex < MONKEY_RANKS.length - 1 ? MONKEY_RANKS[currentRankIndex + 1] : null;
  const progressToNext = nextRank
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round(
            ((profile.bananas - currentRank.minScore) /
              (nextRank.minScore - currentRank.minScore)) *
              100
          )
        )
      )
    : 100;

  // Bookmarked questions
  const bookmarkedQuestions = quizzes
    .flatMap((q) => q.questions.map((question) => ({ ...question, quizTitle: q.title, courseTag: q.courseTag })))
    .filter((q) => profile.bookmarkedQuestionIds.includes(q.id));

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      monkeyName: monkeyName.trim() || 'Smart Chimp',
      collegeName: collegeName.trim() || 'State College',
      major: major.trim() || 'General Studies',
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRemoveBookmark = (qId: string) => {
    onUpdateProfile({
      ...profile,
      bookmarkedQuestionIds: profile.bookmarkedQuestionIds.filter((id) => id !== qId),
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar and Rank */}
        <div className="flex items-start gap-4 mb-6 border-b border-stone-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-900 font-extrabold text-2xl flex items-center justify-center border-2 border-amber-300 shadow-md shrink-0">
            🐵
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-stone-900">
                {profile.monkeyName}
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {currentRank.name}
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-0.5">
              {profile.collegeName} · {profile.major}
            </p>

            {/* Rank Evolution Progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
                <span>Rank: {currentRank.name}</span>
                {nextRank ? (
                  <span>Next: {nextRank.name} ({profile.bananas}/{nextRank.minScore} 🍌)</span>
                ) : (
                  <span>Max Primate Rank Reached! 👑</span>
                )}
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-center">
            <div className="text-xs font-semibold text-stone-400 uppercase">Bananas</div>
            <div className="text-xl font-black text-amber-600 mt-0.5">
              {profile.bananas} 🍌
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-center">
            <div className="text-xs font-semibold text-stone-400 uppercase">Accuracy</div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">
              {accuracy}%
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-center">
            <div className="text-xs font-semibold text-stone-400 uppercase">Study Streak</div>
            <div className="text-xl font-black text-orange-600 mt-0.5 flex items-center justify-center gap-1">
              {profile.streak} <Flame className="w-4 h-4 fill-orange-500" />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-center">
            <div className="text-xs font-semibold text-stone-400 uppercase">Quizzes Made</div>
            <div className="text-xl font-black text-blue-600 mt-0.5">
              {profile.quizzesCreated}
            </div>
          </div>
        </div>

        {/* Student Profile Info Form */}
        <form onSubmit={handleSaveInfo} className="mb-6 bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            RIT Student Card & Department Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Scholar Nickname</label>
              <input
                type="text"
                value={monkeyName}
                onChange={(e) => setMonkeyName(e.target.value)}
                placeholder="e.g. RIT Tech Simian"
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Institution</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Ramco Institute of Technology"
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-500 mb-1">Engineering Branch / Dept</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
              >
                <option value="B.E. Computer Science & Engineering">B.E. Computer Science & Engineering</option>
                <option value="B.Tech Artificial Intelligence & Data Science">B.Tech Artificial Intelligence & Data Science</option>
                <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                <option value="B.E. Electronics & Communication Engineering">B.E. Electronics & Communication Engineering</option>
                <option value="B.E. Electrical & Electronics Engineering">B.E. Electrical & Electronics Engineering</option>
                <option value="B.E. Mechanical Engineering">B.E. Mechanical Engineering</option>
                <option value="B.E. Civil Engineering">B.E. Civil Engineering</option>
                <option value="B.Tech Computer Science & Business Systems">B.Tech Computer Science & Business Systems</option>
                <option value="First Year General Engineering">First Year General Engineering</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-600 font-medium">
              {isSaved ? 'RIT Student Card updated!' : ''}
            </span>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Update RIT Card
            </button>
          </div>
        </form>

        {/* Bookmarked Questions for Final Exam Cramming */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-amber-600" />
            Bookmarked Exam Questions ({bookmarkedQuestions.length})
          </h3>

          {bookmarkedQuestions.length === 0 ? (
            <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
              No bookmarked questions yet! While playing quizzes, tap the bookmark icon on tricky questions to review them here before exams.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {bookmarkedQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 bg-white border border-stone-200 rounded-xl text-xs flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                        {q.courseTag}
                      </span>
                      <span className="text-stone-400 text-[10px]">{q.quizTitle}</span>
                    </div>
                    <div className="font-semibold text-stone-800">{q.question}</div>
                    <div className="text-emerald-700 font-bold mt-1">
                      Answer: {q.options[q.correctAnswerIndex]}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveBookmark(q.id)}
                    className="text-stone-400 hover:text-red-500 p-1"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
