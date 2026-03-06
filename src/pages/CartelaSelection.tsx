import { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import BingoCartela from '@/components/BingoCartela';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CartelaSelection({ playerId, gameId }: { playerId: string; gameId: string }) {
  const [cartelas, setCartelas] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch available cartelas from Supabase
  useEffect(() => {
    const fetchCartelas = async () => {
      const { data, error } = await supabase
        .from('cartelas')
        .select('*')
        .eq('is_used', false)
        .limit(12); // fetch 12 for display
      if (error) {
        toast.error('Error fetching cartelas');
        console.error(error);
        setLoading(false);
        return;
      }
      setCartelas(data || []);
      setLoading(false);
    };

    fetchCartelas();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBuy = async () => {
    if (!selected) {
      toast.error('Select a cartela first');
      return;
    }

    // Mark cartela as used and link to player
    const { error } = await supabase
      .from('player_cartelas')
      .insert([{ user_id: playerId, cartela_id: selected, gameId }]);
    if (error) {
      toast.error('Failed to purchase cartela');
      console.error(error);
      return;
    }

    // Mark the cartela as used
    await supabase.from('cartelas').update({ is_used: true }).eq('id', selected);

    toast.success('Cartela purchased!');
    setSelected(null);

    // Refresh cartelas list
    setCartelas((prev) => prev.filter((c) => c.id !== selected));
  };

  if (loading) return <p>Loading cartelas...</p>;

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