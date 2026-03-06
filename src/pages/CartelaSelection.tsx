import { useState, useMemo } from 'react';
import PageShell from '@/components/PageShell';
import BingoCartela from '@/components/BingoCartela';
import { generateCartelaSet } from '@/lib/bingo';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CartelaSelection() {
  const cartelas = useMemo(() => generateCartelaSet(12), []);
  const [selected, setSelected] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBuy = () => {
    if (!selected) {
      toast.error('Select a cartela first');
      return;
    }
    toast.success('Cartela purchased!');
    setSelected(null);
  };

  return (
    <PageShell title="Choose Cartela">
      <p className="text-sm text-muted-foreground mb-4">Select a cartela to purchase (20 ETB each)</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {cartelas.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <BingoCartela
              numbers={c.numbers}
              size="sm"
              label={`#${i + 1}`}
              selected={selected === c.id}
              onClick={() => setSelected(c.id)}
              isFavorite={favorites.has(c.id)}
              onFavorite={() => toggleFavorite(c.id)}
            />
          </motion.div>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-20 left-4 right-4 z-40"
        >
          <button
            onClick={handleBuy}
            className="w-full py-4 rounded-xl font-display font-bold gradient-gold text-primary-foreground text-lg active:scale-95 transition-transform"
          >
            Buy Cartela — 20 ETB
          </button>
        </motion.div>
      )}
    </PageShell>
  );
}
