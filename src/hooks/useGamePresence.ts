import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlayerPresence {
  id: string;
  name: string;
}

export function useGamePresence(userId?: string, displayName?: string) {
  const [players, setPlayers] = useState<PlayerPresence[]>([]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('game-presence', {
      config: { presence: { key: userId } },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const list: PlayerPresence[] = [];
        for (const [id, presences] of Object.entries(state)) {
          const p = (presences as any[])[0];
          list.push({ id, name: p?.name || 'Player' });
        }
        setPlayers(list);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ name: displayName || 'Player' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, displayName]);

  return players;
}
