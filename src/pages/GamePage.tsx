import { useState, useEffect, useMemo } from 'react';
import PageShell from '@/components/PageShell';
import BingoCartela from '@/components/BingoCartela';
import { generateCartela, BINGO_LETTERS, PATTERNS, PatternName } from '@/lib/bingo';
import { Users, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamePage() {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentPattern] = useState<PatternName>('Full House');
  const playerCartela = useMemo(() => generateCartela(), []);
  const markedNumbers = useMemo(() => new Set(drawnNumbers), [drawnNumbers]);

  // Simulate drawing numbers
  useEffect(() => {
    const interval = setInterval(() => {
      setDrawnNumbers((prev) => {
        if (prev.length >= 30) return prev;
        let num: number;
        do {
          num = Math.floor(Math.random() * 75) + 1;
        } while (prev.includes(num));
        return [...prev, num];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const lastDrawn = drawnNumbers[drawnNumbers.length - 1];

  return (
    <PageShell title="Live Game">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-secondary" />
          <span className="text-foreground font-medium">24 players</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-primary font-display font-semibold">{currentPattern}</span>
        </div>
      </div>

      {/* Pattern description */}
      <div className="text-xs text-muted-foreground mb-4 bg-muted/50 rounded-lg px-3 py-2">
        Pattern: {PATTERNS[currentPattern]}
      </div>

      {/* Last Drawn */}
      <div className="text-center mb-4">
        <div className="text-xs text-muted-foreground mb-1">Last Drawn</div>
        <AnimatePresence mode="wait">
          {lastDrawn && (
            <motion.div
              key={lastDrawn}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-gold font-display text-2xl font-bold text-primary-foreground animate-pulse-gold"
            >
              {BINGO_LETTERS[Math.floor((lastDrawn - 1) / 15)]}{lastDrawn}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drawn numbers row */}
      <div className="mb-6">
        <div className="text-xs text-muted-foreground mb-2">Drawn Numbers ({drawnNumbers.length})</div>
        <div className="flex flex-wrap gap-1.5">
          {drawnNumbers.map((n) => (
            <div
              key={n}
              className="w-8 h-8 rounded-md bg-primary/20 text-primary text-xs font-display font-bold flex items-center justify-center"
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Player's Cartela */}
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-2">Your Cartela</div>
        <BingoCartela numbers={playerCartela} markedNumbers={markedNumbers} size="lg" />
      </div>
    </PageShell>
  );
}
