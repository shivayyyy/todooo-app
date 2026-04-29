import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const { login, signup, checkUsername, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLogin && username.length > 2) {
      const delayFn = setTimeout(async () => {
        const available = await checkUsername(username);
        setUsernameAvailable(available);
      }, 500);
      return () => clearTimeout(delayFn);
    } else {
      setUsernameAvailable(null);
    }
  }, [username, isLogin, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login({ username, password });
      } else {
        if (usernameAvailable === false) {
          setError('Username is taken');
          return;
        }
        await signup({ username, password, phone });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] px-4">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl border border-[#2A3447] p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle animated gradient orb */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1)_0%,rgba(0,0,0,0)_50%)] animate-pulse pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#C9A84C] to-[#e8c870] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(201,168,76,0.4)] mb-4">
            <Flame className="text-[#0A0F1E]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">CivicTask Pro</h1>
          <p className="text-[#A0AEC0] text-sm mt-1">Your UPSC Command Center</p>
        </div>

        {error && (
          <div className="bg-[#EF4444] bg-opacity-10 border border-[#EF4444] border-opacity-30 text-[#EF4444] text-sm px-4 py-2 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div>
            <label className="block text-[10px] text-[#A0AEC0] uppercase tracking-widest mb-1.5 ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-[#1C2333] border border-[#2A3447] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="ArjunSharma123"
            />
            {!isLogin && username.length > 2 && usernameAvailable !== null && (
              <span className={`text-xs mt-1 ml-1 ${usernameAvailable ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {usernameAvailable ? '✓ Username available' : '✗ Username taken'}
              </span>
            )}
          </div>

          <div>
            <label className="block text-[10px] text-[#A0AEC0] uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1C2333] border border-[#2A3447] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[10px] text-[#A0AEC0] uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-[#1C2333] border border-[#2A3447] rounded-xl px-4 py-3 text-[#F1F5F9] text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                placeholder="+91 9876543210"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-br from-[#C9A84C] to-[#e8c870] text-[#0A0F1E] font-bold py-3 rounded-xl shadow-[0_4px_16px_rgba(201,168,76,0.3)] hover:brightness-110 transition-all"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setUsernameAvailable(null); }}
            className="text-[#A0AEC0] hover:text-[#F1F5F9] text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
