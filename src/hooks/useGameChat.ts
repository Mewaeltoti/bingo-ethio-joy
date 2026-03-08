import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_reaction: boolean;
  created_at: string;
  display_name?: string;
}

const REACTIONS = ['🎉', '😂', '🔥', '👏', '😱', '💪'];

export { REACTIONS };

export function useGameChat(userId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Fetch recent messages
    supabase
      .from('game_chat')
      .select('*')
      .eq('game_id', 'current')
      .order('created_at', { ascending: true })
      .limit(50)
      .then(({ data }) => setMessages((data || []) as ChatMessage[]));

    const channel = supabase
      .channel('game-chat-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'game_chat' },
        (payload: any) => {
          setMessages((prev) => [...prev.slice(-49), payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const sendMessage = useCallback(async (message: string, isReaction = false) => {
    if (!userId) return;
    await supabase.from('game_chat').insert({
      user_id: userId,
      message,
      is_reaction: isReaction,
      game_id: 'current',
    } as any);
  }, [userId]);

  return { messages, sendMessage };
}
