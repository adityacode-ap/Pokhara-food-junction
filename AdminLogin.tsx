import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: errMsg } = await signIn(email, password);
    setLoading(false);
    if (errMsg) {
      setError(errMsg);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <a href="/" className="inline-flex items-center gap-2 text-ink-400 hover:text-ember-400 transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to website
        </a>

        <div className="bg-ink-900 rounded-2xl p-8 border border-ink-800">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-ember-600 flex items-center justify-center mb-4">
              <UtensilsCrossed size={28} className="text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Staff Login</h1>
            <p className="text-ink-400 text-sm mt-1">Food Junction Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-ink-800 border border-ink-700 rounded-xl px-4 py-3 text-white placeholder-ink-500 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="staff@foodjunction.com.np"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-ink-800 border border-ink-700 rounded-xl px-4 py-3 text-white placeholder-ink-500 focus:border-ember-500 focus:outline-none focus:ring-1 focus:ring-ember-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ember-600 hover:bg-ember-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
