import { useState } from 'react';
import PageShell from '@/components/PageShell';
import { Users, CreditCard, Gamepad2, Eye, Check, X } from 'lucide-react';
import { PATTERNS, PatternName } from '@/lib/bingo';
import { toast } from 'sonner';

const mockDeposits = [
  { id: 1, user: 'Abebe M.', bank: 'CBE', amount: 100, ref: 'FT123', status: 'pending' },
  { id: 2, user: 'Sara T.', bank: 'Telebirr', amount: 200, ref: 'TB456', status: 'pending' },
  { id: 3, user: 'Dawit K.', bank: 'Awash', amount: 50, ref: 'AW789', status: 'approved' },
];

const mockPlayers = [
  { name: 'Abebe M.', cartelas: 3, balance: 80 },
  { name: 'Sara T.', cartelas: 1, balance: 200 },
  { name: 'Dawit K.', cartelas: 2, balance: 30 },
];

export default function Admin() {
  const [tab, setTab] = useState<'deposits' | 'game' | 'players'>('deposits');
  const [pattern, setPattern] = useState<PatternName>('Full House');

  const tabs = [
    { key: 'deposits' as const, label: 'Deposits', icon: CreditCard },
    { key: 'game' as const, label: 'Game', icon: Gamepad2 },
    { key: 'players' as const, label: 'Players', icon: Users },
  ];

  return (
    <PageShell title="Admin Panel">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === key ? 'gradient-gold text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'deposits' && (
        <div className="space-y-3">
          {mockDeposits.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div>
                <div className="text-sm font-medium text-foreground">{d.user}</div>
                <div className="text-xs text-muted-foreground">{d.bank} · {d.ref} · {d.amount} ETB</div>
              </div>
              {d.status === 'pending' ? (
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Approved!')} className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => toast.error('Rejected')} className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-xs text-secondary font-medium">✓ Approved</span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'game' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Winning Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PATTERNS) as PatternName[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPattern(p)}
                  className={`p-3 rounded-xl text-sm font-medium text-left transition-colors ${
                    pattern === p ? 'gradient-gold text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => toast.success('New game started!')}
            className="w-full py-4 rounded-xl font-display font-bold bg-secondary text-secondary-foreground text-lg active:scale-95 transition-transform"
          >
            Start New Game
          </button>
        </div>
      )}

      {tab === 'players' && (
        <div className="space-y-2">
          {mockPlayers.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div>
                <div className="text-sm font-medium text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.cartelas} cartelas</div>
              </div>
              <div className="text-sm font-display font-bold text-primary">{p.balance} ETB</div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
