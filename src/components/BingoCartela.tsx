import { BINGO_LETTERS } from '@/lib/bingo';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

interface BingoCartelaProps {
  numbers: number[][];
  markedNumbers?: Set<number>;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
  label?: string;
}

export default function BingoCartela({
  numbers,
  markedNumbers = new Set(),
  size = 'md',
  onClick,
  selected,
  isFavorite,
  onFavorite,
  label,
}: BingoCartelaProps) {
  const cellSize = size === 'sm' ? 'text-xs w-8 h-8' : size === 'lg' ? 'text-base w-12 h-12' : 'text-sm w-10 h-10';

  return (
    <div
      className={cn(
        'relative rounded-xl border-2 p-2 transition-all duration-200 gradient-card',
        selected ? 'border-primary glow-gold' : 'border-border hover:border-muted-foreground',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {label && (
        <div className="text-center text-xs font-display text-muted-foreground mb-1">{label}</div>
      )}
      {onFavorite && (
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
          className="absolute top-1 right-1 p-1 z-10"
        >
          <Heart className={cn('w-4 h-4', isFavorite ? 'fill-red-eth text-red-eth' : 'text-muted-foreground')} />
        </button>
      )}
      {/* Header */}
      <div className="grid grid-cols-5 gap-1 mb-1">
        {BINGO_LETTERS.map((l) => (
          <div key={l} className={cn('flex items-center justify-center font-display font-bold text-primary', cellSize)}>
            {l}
          </div>
        ))}
      </div>
     {/* Grid */}
<div className="grid grid-cols-5 gap-1">
  {Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => {
      const num = numbers[row]?.[col] ?? 0;
      const isFree = row === 2 && col === 2;
      const isMarked = isFree || markedNumbers.has(num);

      return (
        <div
          key={`${row}-${col}`}
          className={cn(
            'bingo-cell',
            cellSize,
            isFree
              ? 'bingo-cell-free'
              : isMarked
              ? 'bingo-cell-marked'
              : 'bingo-cell-default'
          )}
        >
          {isFree ? '★' : num}
        </div>
      );
    })
  )}
</div>
    </div>
  );
}
