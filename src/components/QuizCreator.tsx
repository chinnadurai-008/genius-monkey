import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Plus, Trash2, BookOpen, CheckCircle2, 
  ArrowLeft, FileText, Code2, HelpCircle, Save, AlertCircle, RefreshCw
} from 'lucide-react';
import { Quiz, Question, QuizCategory, QuestionType } from '../types';
import { COLLEGE_SUBJECTS } from '../data/starterQuizzes';

interface QuizCreatorProps {
  onSaveQuiz: (newQuiz: Quiz) => void;
  onCancel: () => void;
  initialQuiz?: Quiz | null;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({
  onSaveQuiz,
  onCancel,
  initialQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'import'>(initialQuiz ? 'manual' : 'ai');

  // Quiz metadata
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [courseTag, setCourseTag] = useState(initialQuiz?.courseTag || '');
  const [category, setCategory] = useState<QuizCategory>(initialQuiz?.category || 'Computer Science');
  const [timePerQuestionSec, setTimePerQuestionSec] = useState(initialQuiz?.timePerQuestionSec || 25);

  // Questions
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions || [
      {
        id: `q-${Date.now()}-1`,
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        monkeyHint: '',
      },
    ]
  );

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [aiNotes, setAiNotes] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // JSON Import state
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Handle AI generation
  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim() && !aiNotes.trim()) {
      setAiError('Please enter a topic or paste lecture notes.');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          notes: aiNotes,
          count: aiQuestionCount,
          difficulty: aiDifficulty,
          courseTag: courseTag || 'STUDY 101',
          questionType: 'multiple_choice',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.quiz) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      const generated = data.quiz;
      if (generated.title && !title) setTitle(generated.title);
      if (generated.description && !description) setDescription(generated.description);
      if (generated.courseTag && !courseTag) setCourseTag(generated.courseTag);

      if (generated.questions && Array.isArray(generated.questions) && generated.questions.length > 0) {
        setQuestions(generated.questions);
        setActiveTab('manual'); // Switch to editor so student can preview & tweak
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Something went wrong while generating with Genius Monkey.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Add Question Manually
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}-${questions.length + 1}`,
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        monkeyHint: '',
      },
    ]);
  };

  // Delete Question
  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('A quiz must have at least one question!');
      return;
    }
    const updated = questions.filter((_, idx) => idx !== index);
    setQuestions(updated);
  };

  // Update Question Content
  const handleUpdateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // Update Option Content
  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[optIndex] = value;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  // Change Question Type
  const handleTypeChange = (qIndex: number, newType: QuestionType) => {
    const updated = [...questions];
    if (newType === 'true_false') {
      updated[qIndex] = {
        ...updated[qIndex],
        type: newType,
        options: ['True', 'False'],
        correctAnswerIndex: 0,
      };
    } else {
      updated[qIndex] = {
        ...updated[qIndex],
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
      };
    }
    setQuestions(updated);
  };

  // Handle JSON Import
  const handleImportJson = () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('JSON must include a "questions" array with at least one question.');
      }
      if (parsed.title) setTitle(parsed.title);
      if (parsed.description) setDescription(parsed.description);
      if (parsed.courseTag) setCourseTag(parsed.courseTag);
      if (parsed.category) setCategory(parsed.category);
      setQuestions(parsed.questions);
      setActiveTab('manual');
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON format');
    }
  };

  // Final Validation and Save
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question #${i + 1} cannot be empty.`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Question #${i + 1} has an empty option.`);
          return;
        }
      }
    }

    const newQuiz: Quiz = {
      id: initialQuiz?.id || `quiz-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Created by college student on Genius Monkey',
      courseTag: courseTag.trim() || 'STUDY 101',
      category,
      timePerQuestionSec: Number(timePerQuestionSec) || 25,
      createdAt: initialQuiz?.createdAt || new Date().toISOString().split('T')[0],
      isCustom: true,
      playsCount: initialQuiz?.playsCount || 0,
      bestScore: initialQuiz?.bestScore || 0,
      questions,
    };

    onSaveQuiz(newQuiz);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-amber-100/60 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Quiz & Earn 50 🍌
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 md:p-8 shadow-xs">
        {/* Title & Metadata Card */}
        <div className="mb-8 border-b border-stone-100 pb-6">
          <h2 className="text-2xl font-bold font-display text-stone-900 flex items-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-amber-500" />
            {initialQuiz ? 'Edit Your Quiz' : 'Create Your Own Quiz & Knowledge Deck'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Quiz Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Organic Chemistry Midterm Review, CS Algorithms Prep"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Course Tag (e.g. CS106B)
              </label>
              <input
                type="text"
                value={courseTag}
                onChange={(e) => setCourseTag(e.target.value)}
                placeholder="e.g. BIO 101, CHEM 204"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-stone-900 uppercase"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Description / Purpose
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key concepts, syllabus chapters, or dorm study group focus..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Engineering Discipline
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as QuizCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 font-medium text-stone-900 bg-white"
              >
                {COLLEGE_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pathway Tabs */}
        <div className="flex border-b border-stone-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            AI Notes to Quiz (Fast)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Questions Editor ({questions.length})
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Import / Export JSON
          </button>
        </div>

        {/* TAB 1: AI GENERATOR */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
              <span className="text-2xl">🐵</span>
              <div className="text-sm text-amber-950">
                <strong className="font-bold">RIT Genius Monkey AI Assistant:</strong> Paste your RIT Autonomous course syllabus, lecture slides, or lab notes below! Genius Monkey analyzes engineering concepts and generates rigorous quiz questions aligned with RIT autonomous regulations.
              </div>
            </div>

            {/* Quick RIT Subject Presets */}
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Quick RIT Subject Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: 'CS3351', topic: 'Data Structures & Object Oriented Programming', name: 'RIT CSE DSA' },
                  { tag: 'AD3401', topic: 'Deep Learning & Neural Architectures', name: 'RIT AI & DS' },
                  { tag: 'EC3354', topic: 'Signals and Systems & DSP', name: 'RIT ECE Signals' },
                  { tag: 'ME3391', topic: 'Thermodynamics & Fluid Mechanics', name: 'RIT Mech Thermo' },
                  { tag: 'GE3151', topic: 'Problem Solving and Python Programming', name: 'RIT 1st Year Python' },
                ].map((preset) => (
                  <button
                    key={preset.tag}
                    type="button"
                    onClick={() => {
                      setAiTopic(preset.topic);
                      setCourseTag(preset.tag);
                      if (!title) setTitle(`${preset.name} - Unit Review`);
                    }}
                    className="px-2.5 py-1 bg-amber-100/70 hover:bg-amber-200 text-stone-800 text-xs font-semibold rounded-lg border border-amber-300 transition-colors cursor-pointer"
                  >
                    + {preset.name} ({preset.tag})
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Topic or Exam Chapter
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. Dynamic Programming, Transformer Attention, Carnot Cycle, Nyquist Theorem"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Paste Lecture Notes / Textbook Summary (Optional but recommended)
              </label>
              <textarea
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                rows={5}
                placeholder="Paste bullet points from your professor's slides, article excerpts, or vocabulary lists..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900 font-mono text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Target Academic Difficulty
                </label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 font-medium text-stone-900 bg-white"
                >
                  <option value="Easy">Introductory / Freshman (Concepts & Recall)</option>
                  <option value="Medium">Standard College Midterm (Application)</option>
                  <option value="Hard">Advanced Seminar / Upper Division</option>
                  <option value="Professor Mode">Professor Mode (Tricky Edge Cases & Proofs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                  Number of Questions
                </label>
                <select
                  value={aiQuestionCount}
                  onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 font-medium text-stone-900 bg-white"
                >
                  <option value={3}>3 Questions (Quick Check)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={8}>8 Questions (Deep Practice)</option>
                  <option value={10}>10 Questions (Full Midterm Mock)</option>
                </select>
              </div>
            </div>

            {aiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            <button
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-900 font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-base transition-all disabled:opacity-60 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Genius Monkey is generating questions from your notes...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Quiz Questions with AI
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: MANUAL QUESTION EDITOR */}
        {activeTab === 'manual' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-600">
                {questions.length} Question{questions.length === 1 ? '' : 's'} in Deck
              </span>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Another Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id || qIndex}
                className="p-5 border border-stone-200 rounded-2xl bg-stone-50/50 space-y-4 relative"
              >
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-900 font-extrabold text-sm flex items-center justify-center">
                      #{qIndex + 1}
                    </span>
                    <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-0.5 text-xs font-medium text-stone-600">
                      <button
                        type="button"
                        onClick={() => handleTypeChange(qIndex, 'multiple_choice')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          q.type === 'multiple_choice' ? 'bg-amber-500 text-stone-900 font-bold' : 'hover:text-stone-900'
                        }`}
                      >
                        Multiple Choice
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTypeChange(qIndex, 'true_false')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          q.type === 'true_false' ? 'bg-amber-500 text-stone-900 font-bold' : 'hover:text-stone-900'
                        }`}
                      >
                        True / False
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Question Text
                  </label>
                  <textarea
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                    placeholder="Enter question (e.g. Which algorithm has O(n log n) average time complexity?)"
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-900 text-sm font-medium bg-white"
                  />
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Options (Select the radio button for the correct answer)
                  </label>

                  {q.options.map((opt, optIndex) => (
                    <div
                      key={optIndex}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                        q.correctAnswerIndex === optIndex
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`q-${qIndex}-opt-${optIndex}`}
                        name={`correct-answer-${qIndex}`}
                        checked={q.correctAnswerIndex === optIndex}
                        onChange={() => handleUpdateQuestion(qIndex, 'correctAnswerIndex', optIndex)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="w-6 text-xs font-bold text-stone-500 uppercase">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        className="flex-1 bg-transparent border-none focus:outline-hidden text-sm font-medium text-stone-900"
                        disabled={q.type === 'true_false'}
                      />
                      {q.correctAnswerIndex === optIndex && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation & Hint */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Academic Explanation (Why it's right)
                    </label>
                    <textarea
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                      placeholder="Explain the mechanism, theorem, or textbook rule..."
                      rows={2}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-800 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      Genius Monkey Hint (Optional clue)
                    </label>
                    <textarea
                      value={q.monkeyHint || ''}
                      onChange={(e) => handleUpdateQuestion(qIndex, 'monkeyHint', e.target.value)}
                      placeholder="Witty clue to help students eliminate wrong options..."
                      rows={2}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 text-stone-800 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl text-stone-600 hover:text-amber-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Question #{questions.length + 1}
            </button>
          </div>
        )}

        {/* TAB 3: IMPORT/EXPORT JSON */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-mono text-stone-600">
              Share decks with classmates in your major! Paste JSON here to import or export this quiz deck.
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
                Paste Quiz JSON
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"title": "Organic Chem 1", "questions": [...]}'
                rows={8}
                className="w-full p-4 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 font-mono text-xs text-stone-900 bg-stone-50"
              />
            </div>

            {jsonError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleImportJson}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Import from JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  const exportData = {
                    title,
                    description,
                    courseTag,
                    category,
                    questions,
                  };
                  navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
                  alert('Quiz JSON copied to clipboard! Share it with your classmates.');
                }}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Copy Current Quiz JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
