import { Wallet, ShoppingCart, History, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import BingoCartela from '@/components/BingoCartela';
import { generateCartela } from '@/lib/bingo';
import { motion } from 'framer-motion';

const mockCartelas = [generateCartela(), generateCartela()];
const mockTransactions = [
  { id: 1, type: 'Deposit', amount: 100, status: 'Approved', date: 'Mar 5' },
  { id: 2, type: 'Cartela Purchase', amount: -20, status: 'Completed', date: 'Mar 5' },
  { id: 3, type: 'Deposit', amount: 50, status: 'Pending', date: 'Mar 4' },
];

export default function Dashboard() {
  return (
    <PageShell title="My Wallet">
      {/* Balance */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="gradient-card rounded-2xl border border-border p-5 mb-6 glow-gold"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
          <Wallet className="w-4 h-4" /> Balance
        </div>
        <div className="font-display text-3xl font-bold text-primary">130.00 ETB</div>
        <div className="mt-3 flex gap-2">
          <Link
            to="/payment"
            className="flex-1 py-2 rounded-lg gradient-gold text-primary-foreground text-center text-sm font-semibold"
          >
            Deposit
          </Link>
          <Link
            to="/cartelas"
            className="flex-1 py-2 rounded-lg bg-secondary text-secondary-foreground text-center text-sm font-semibold"
          >
            Buy Cartela
          </Link>
        </div>
      </motion.div>

      {/* Purchased Cartelas */}
      <section className="mb-6">
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> My Cartelas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {mockCartelas.map((c, i) => (
            <BingoCartela key={i} numbers={c} size="sm" label={`#${i + 1}`} />
          ))}
        </div>
      </section>

      {/* Transactions */}
      <section>
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <History className="w-4 h-4" /> Transactions
        </h2>
        <div className="space-y-2">
          {mockTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <div className="text-sm font-medium text-foreground">{t.type}</div>
                <div className="text-xs text-muted-foreground">{t.date}</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-display font-bold ${t.amount > 0 ? 'text-secondary' : 'text-foreground'}`}>
                  {t.amount > 0 ? '+' : ''}{t.amount} ETB
                </div>
                <div className={`text-xs ${t.status === 'Pending' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {t.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
