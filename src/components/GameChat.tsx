import { useState, useRef, useEffect } from 'react';
import { useGameChat, REACTIONS } from '@/hooks/useGameChat';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameChatProps {
  userId?: string;
  isSpectator?: boolean;
}

export default function GameChat({ userId, isSpectator }: GameChatProps) {
  const { messages, sendMessage } = useGameChat(userId);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText('');
  };

  // Floating reactions
  const recentReactions = messages.filter(m => m.is_reaction).slice(-5);

  return (
    <>
      {/* Floating reactions overlay */}
      <div className="fixed bottom-24 right-4 z-30 pointer-events-none">
        <AnimatePresence>
          {recentReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -60, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="text-2xl"
            >
              {r.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Chat toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
            {Math.min(messages.length, 99)}
          </span>
        )}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-4 left-4 z-40 max-w-sm ml-auto rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
            style={{ maxHeight: '50vh' }}
          >
            {/* Messages */}
            <div ref={scrollRef} className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: '35vh' }}>
              {messages.filter(m => !m.is_reaction).map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'text-xs rounded-lg px-3 py-1.5 max-w-[80%]',
                    m.user_id === userId
                      ? 'bg-primary/20 text-primary ml-auto'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {m.message}
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No messages yet</p>
              )}
            </div>

            {/* Reactions bar */}
            <div className="flex gap-1 px-3 py-2 border-t border-border">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendMessage(emoji, true)}
                  className="text-lg hover:scale-125 active:scale-95 transition-transform"
                  disabled={isSpectator}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input */}
            {!isSpectator && (
              <div className="flex gap-2 p-3 border-t border-border">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-lg bg-muted text-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
