import { Quiz, StudentProfile } from '../types';
import { STARTER_QUIZZES } from '../data/starterQuizzes';

const STORAGE_QUIZZES_KEY = 'genius_monkey_rit_quizzes_v3';
const STORAGE_PROFILE_KEY = 'genius_monkey_rit_profile_v3';

export const DEFAULT_PROFILE: StudentProfile = {
  monkeyName: 'RIT Tech Simian',
  collegeName: 'Ramco Institute of Technology (Autonomous)',
  major: 'B.E. Computer Science & Engineering',
  bananas: 200,
  streak: 5,
  totalQuestionsAnswered: 18,
  correctAnswers: 16,
  gamesPlayed: 4,
  quizzesCreated: 0,
  bookmarkedQuestionIds: [],
};

export function getStoredQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_QUIZZES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(STARTER_QUIZZES));
      return STARTER_QUIZZES;
    }
    const parsed: Quiz[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return STARTER_QUIZZES;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load quizzes from storage:', e);
    return STARTER_QUIZZES;
  }
}

export function saveQuizzes(quizzes: Quiz[]): void {
  try {
    localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(quizzes));
  } catch (e) {
    console.error('Failed to save quizzes to storage:', e);
  }
}

export function getStoredProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

// Web Audio synthesizer for crisp, instant feedback sounds (no external audio files needed)
class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (_) {}
  }

  playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (_) {}
  }

  playBanana() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (_) {}
  }

  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (_) {}
  }
}

export const sound = new SoundManager();
