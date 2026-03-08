import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Heart, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { BINGO_LETTERS } from '@/lib/bingo';

const HEADER_COLORS = [
  'bg-blue-500 text-white',
  'bg-red-500 text-white',
  'bg-green-600 text-white',
  'bg-orange-500 text-white',
  'bg-purple-600 text-white',
];

interface CartelaCardProps {
  id: string;
  numbers: number[][];
  selected: boolean;
  isFavorite: boolean;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
}

export default function CartelaCard({
  id,
  numbers,
  selected,
  isFavorite,
  onToggleSelect,
  onToggleFavorite,
}: CartelaCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border-2 transition-all duration-200 overflow-hidden',
        selected
          ? 'border-primary bg-primary/5 glow-gold'
          : 'border-border bg-card hover:border-primary/40'
      )}
    >
      {/* Collapsed row — always visible */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
        onClick={onToggleSelect}
      >
        {/* Checkbox */}
        <div
          className={cn(
            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
            selected
              ? 'bg-primary border-primary'
              : 'border-muted-foreground/40'
          )}
        >
          {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
        </div>

        <span className="font-display font-bold text-foreground text-sm flex-1">
          #{id}
        </span>

        {/* Mini preview: first row numbers */}
        {!expanded && (
          <div className="flex gap-1 mr-1">
            {numbers[0]?.slice(0, 5).map((n, i) => (
              <span
                key={i}
                className="w-5 h-5 text-[8px] font-bold flex items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                {n}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1 shrink-0"
        >
          <Heart
            className={cn(
              'w-4 h-4',
              isFavorite
                ? 'fill-destructive text-destructive'
                : 'text-muted-foreground'
            )}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="p-1 shrink-0 text-muted-foreground"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded: full grid */}
      {expanded && (
        <div className="px-3 pb-3">
          <div className="bg-white dark:bg-background rounded-lg p-1.5">
            {/* BINGO header */}
            <div className="grid grid-cols-5 gap-0.5 mb-0.5">
              {BINGO_LETTERS.map((l, i) => (
                <div
                  key={l}
                  className={cn(
                    'flex items-center justify-center font-display font-bold rounded-md text-[10px] h-5',
                    HEADER_COLORS[i]
                  )}
                >
                  {l}
                </div>
              ))}
            </div>
            {/* Number grid */}
            {Array.from({ length: 5 }, (_, row) => (
              <div key={row} className="grid grid-cols-5 gap-0.5 mb-0.5 last:mb-0">
                {Array.from({ length: 5 }, (_, col) => {
                  const num = numbers[row]?.[col] ?? 0;
                  const isFree = row === 2 && col === 2;
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={cn(
                        'flex items-center justify-center font-display font-bold rounded-full w-6 h-6 text-[10px]',
                        isFree
                          ? 'bg-green-500 text-white'
                          : 'bg-muted/60 text-foreground'
                      )}
                    >
                      {isFree ? 'F' : num}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
