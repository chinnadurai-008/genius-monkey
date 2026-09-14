export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  monkeyHint?: string;
}

export type QuizCategory = 
  | 'RIT CSE & IT'
  | 'RIT AI & DS'
  | 'RIT ECE & EEE'
  | 'RIT Mech & Civil'
  | 'RIT Autonomous Syllabus'
  | 'Core Engineering'
  | 'RIT Campus Life'
  | 'Custom';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseTag: string; // e.g. "CS 101", "BIO 200", "CHEM 101"
  category: QuizCategory;
  questions: Question[];
  timePerQuestionSec?: number;
  createdAt: string;
  isCustom?: boolean;
  playsCount: number;
  bestScore?: number;
}

export type GameMode = 'quiz' | 'blitz' | 'flashcards' | 'match' | 'duel';

export interface StudentProfile {
  monkeyName: string;
  collegeName: string;
  major: string;
  bananas: number;
  streak: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  gamesPlayed: number;
  quizzesCreated: number;
  bookmarkedQuestionIds: string[];
}

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}
