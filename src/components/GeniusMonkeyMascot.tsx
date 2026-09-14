import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, GraduationCap, Lightbulb } from 'lucide-react';

interface GeniusMonkeyMascotProps {
  mood?: 'happy' | 'thinking' | 'excited' | 'puzzled' | 'academic';
  customQuote?: string;
  size?: 'sm' | 'md' | 'lg';
  showQuote?: boolean;
}

const COLLEGE_QUOTES = [
  "Welcome to Ramco Institute of Technology! Ace your RIT Autonomous semesters! 🍌",
  "RIT is an Autonomous Institution — mastering our modern industry-ready syllabus!",
  "RIT Autonomous Engineers study smarter with active recall and spaced repetition!",
  "Cramming is temporary, RIT Genius Monkey recall is forever! 🎓",
  "Don't stress over Continuous Internal Assessments (CIA) — let's conquer the RIT syllabus!",
  "From TechYuga symposiums to core campus placements, RIT brainpower leads the way!",
  "Big RIT Autonomous engineering energy detected. Let's solve some derivation challenges!",
  "Fun fact: Ramco Institute of Technology autonomous scholars excel with top industrial projects!",
];

export const GeniusMonkeyMascot: React.FC<GeniusMonkeyMascotProps> = ({
  mood = 'academic',
  customQuote,
  size = 'md',
  showQuote = true,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (customQuote) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % COLLEGE_QUOTES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [customQuote]);

  const currentQuote = customQuote || COLLEGE_QUOTES[quoteIndex];

  const sizeDimensions = {
    sm: { w: 'w-10 h-10', text: 'text-xs' },
    md: { w: 'w-16 h-16', text: 'text-sm' },
    lg: { w: 'w-24 h-24', text: 'text-base' },
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Mascot Graphic */}
      <motion.div
        className={`relative ${sizeDimensions[size].w} shrink-0`}
        whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-md flex items-center justify-center border-2 border-amber-300 relative overflow-visible">
          {/* Graduation Cap */}
          <div className="absolute -top-3.5 -right-2 transform rotate-12 text-stone-900 filter drop-shadow">
            <GraduationCap className={`${size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} text-amber-950 fill-amber-950`} />
          </div>

          {/* Monkey Face (SVG Custom Styled) */}
          <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
            {/* Monkey Ears */}
            <circle cx="20" cy="45" r="14" fill="#78350f" />
            <circle cx="20" cy="45" r="8" fill="#fde68a" />
            <circle cx="80" cy="45" r="14" fill="#78350f" />
            <circle cx="80" cy="45" r="8" fill="#fde68a" />

            {/* Head */}
            <circle cx="50" cy="50" r="32" fill="#78350f" />
            
            {/* Face Mask */}
            <ellipse cx="50" cy="56" rx="22" ry="18" fill="#fde68a" />
            
            {/* Scholar Glasses */}
            <circle cx="41" cy="50" r="8" fill="none" stroke="#1c1917" strokeWidth="2.5" />
            <circle cx="59" cy="50" r="8" fill="none" stroke="#1c1917" strokeWidth="2.5" />
            <line x1="49" y1="50" x2="51" y2="50" stroke="#1c1917" strokeWidth="2.5" />

            {/* Eyes */}
            {mood === 'happy' || mood === 'excited' ? (
              <>
                <path d="M 37 50 Q 41 46 45 50" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
                <path d="M 55 50 Q 59 46 63 50" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : mood === 'puzzled' ? (
              <>
                <circle cx="41" cy="49" r="2.5" fill="#1c1917" />
                <circle cx="59" cy="52" r="3.5" fill="#1c1917" />
              </>
            ) : (
              <>
                <circle cx="41" cy="50" r="2.5" fill="#1c1917" />
                <circle cx="59" cy="50" r="2.5" fill="#1c1917" />
              </>
            )}

            {/* Nose */}
            <ellipse cx="50" cy="58" rx="3.5" ry="2" fill="#78350f" />

            {/* Mouth */}
            {mood === 'excited' ? (
              <path d="M 44 63 Q 50 71 56 63 Z" fill="#b91c1c" stroke="#78350f" strokeWidth="1.5" />
            ) : mood === 'puzzled' ? (
              <circle cx="50" cy="64" r="2" fill="#78350f" />
            ) : (
              <path d="M 43 62 Q 50 67 57 62" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>

          {/* Banana Accessory Badge */}
          <span className="absolute -bottom-1 -left-1 text-xs">🍌</span>
        </div>
      </motion.div>

      {/* Speech Bubble */}
      {showQuote && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className={`relative bg-amber-100/80 border border-amber-200/90 text-amber-950 px-3.5 py-2 rounded-2xl rounded-tl-sm shadow-xs ${sizeDimensions[size].text} max-w-xs md:max-w-md backdrop-blur-xs flex items-center gap-2`}
          >
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 hidden sm:block" />
            <span className="font-medium leading-snug">{currentQuote}</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
