import { useEffect, useState } from 'react';
import PageShell from '@/components/PageShell';
import BingoCartela from '@/components/BingoCartela';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/lib/auth';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function GamePage() {
  const [playerCartelas, setPlayerCartelas] = useState<any[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const user = useUser();

  useEffect(() => {
    async function fetchPlayerCartelas() {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('cartelas')
        .select('*')
        .eq('owner_id', user.id)
        .order('id', { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setPlayerCartelas(data || []);
    }

    fetchPlayerCartelas();
  }, [user?.id]);

  // Draw numbers every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDrawnNumbers((prev) => {
        if (prev.length >= 75) return prev;
        let num;
        do {
          num = Math.floor(Math.random() * 75) + 1;
        } while (prev.includes(num));
        return [...prev, num];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell title="Live Game">
      <h2 className="mb-4 text-lg font-bold">Your Cartelas</h2>
      <div className="grid grid-cols-2 gap-4">
        {playerCartelas.map((c) => (
          <BingoCartela
            key={c.id}
            numbers={c.numbers}
            markedNumbers={new Set(drawnNumbers)}
          />
        ))}
      </div>
    </PageShell>
  );
}