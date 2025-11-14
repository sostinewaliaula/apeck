import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context';

export function AdminLoginPage() {
  const { login, authError, accessToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      navigate('/admin', { replace: true });
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F1EA] via-[#F1E3D4] to-[#E4D1BF] px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-white/60 p-10">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-widest text-[#B15C5C]">APECK CMS</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#2F1E1A]">Admin Portal</h1>
          <p className="text-sm text-[#6B4E3D]/80 mt-2">Sign in to manage site content.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#6B4E3D]">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-[#E7DED1] bg-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B4E3D]">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-[#E7DED1] bg-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B2332] focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {(localError || authError) && (
            <p className="text-sm text-red-600">{localError || authError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#8B2332] text-white py-3 font-semibold hover:bg-[#761c29] transition disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

