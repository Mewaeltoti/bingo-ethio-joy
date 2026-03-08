import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedPhone = phone.startsWith('+') ? phone : `+251${phone.replace(/^0/, '')}`;
    const fakeEmail = `${formattedPhone.replace('+', '')}@bingo.local`;

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error('Invalid phone or password');
      return;
    }

    if (signInData.user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', signInData.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleData) {
        toast.success('Welcome, Admin!');
        navigate('/admin');
        return;
      }
    }

    toast.success('Welcome back!');
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full"
        >
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold">
              <span className="text-secondary">Bingo</span>{' '}
              <span className="text-primary">Ethio</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2">Sign in to play</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium">+251</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9XXXXXXXX"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-muted text-foreground text-base outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-muted text-foreground text-base outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-display font-bold text-lg gradient-gold text-primary-foreground active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Forgot password? Contact an admin to reset it.
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
