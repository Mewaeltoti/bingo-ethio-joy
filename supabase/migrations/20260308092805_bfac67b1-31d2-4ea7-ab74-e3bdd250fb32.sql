
-- Chat messages table
CREATE TABLE public.game_chat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL DEFAULT 'current',
  user_id uuid NOT NULL,
  message text NOT NULL,
  is_reaction boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.game_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chat" ON public.game_chat FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own chat" ON public.game_chat FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Add to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_chat;

-- Add draw_speed column to games
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS draw_speed integer NOT NULL DEFAULT 10;

-- Add favorite column to cartelas
ALTER TABLE public.cartelas ADD COLUMN IF NOT EXISTS is_favorite boolean NOT NULL DEFAULT false;
