import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock, Mail } from 'lucide-react';

import { useAuth } from '../auth-context';
import { requestPasswordReset, resetPassword } from '../api';

type Mode = 'login' | 'forgot' | 'reset';

export function AdminLoginPage() {
  const { login, authError, accessToken } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      navigate('/admin', { replace: true });
    }
  }, [accessToken, navigate]);

  const resetState = () => {
    setLocalMessage(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalMessage(null);

    if (mode === 'login') {
      setIsSubmitting(true);
      try {
        await login(email, password);
        navigate('/admin', { replace: true });
      } catch (err) {
        setLocalMessage(err instanceof Error ? err.message : 'Unable to sign in');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'forgot') {
      setIsSubmitting(true);
      try {
        const response = await requestPasswordReset(resetEmail);
        setLocalMessage(response.message || 'If the email exists, a code has been sent.');
        setMode('reset');
      } catch (err) {
        setLocalMessage(err instanceof Error ? err.message : 'Unable to send code right now.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'reset') {
      if (newPassword !== confirmPassword) {
        setLocalMessage('Passwords do not match.');
        return;
      }
      setIsSubmitting(true);
      try {
        await resetPassword({
          email: resetEmail,
          code: resetCode,
          newPassword,
        });
        setLocalMessage('Password updated. You can log in now.');
        setMode('login');
        setPassword('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (err) {
        setLocalMessage(err instanceof Error ? err.message : 'Invalid code or password.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F1EA] via-[#F1E3D4] to-[#E4D1BF] px-4">
      <div className="max-w-md w-full bg-white/85 backdrop-blur rounded-3xl shadow-xl border border-white/60 p-10">
        <div className="text-center mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-[#B15C5C]">APECK CMS</p>
          <h1 className="text-2xl font-semibold text-[#2F1E1A]">Admin Portal</h1>
          <p className="text-sm text-[#6B4E3D]/80">
            {mode === 'login'
              ? 'Sign in to manage site content.'
              : mode === 'forgot'
                ? 'Enter the email tied to your admin account.'
                : 'Enter the verification code we emailed you and set a new password.'}
          </p>
        </div>

        {(localMessage || authError) && (
          <div className="mb-4 rounded-xl border border-[#F8E0CC] bg-[#FFF6EE] px-4 py-3 text-sm text-[#8B2332]">
            {localMessage || authError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {(mode === 'login' || mode === 'forgot' || mode === 'reset') && (
            <label className="block text-sm font-medium text-[#6B4E3D]">
              Email
              <div className="mt-1 flex items-center rounded-xl border border-[#E7DED1] bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-[#8B2332]">
                <Mail size={16} className="text-[#B08A6D]" />
                <input
                  type="email"
                  className="ml-2 flex-1 border-0 bg-transparent text-sm focus:outline-none"
                  value={mode === 'login' ? email : resetEmail}
                  onChange={(e) => (mode === 'login' ? setEmail(e.target.value) : setResetEmail(e.target.value))}
                  required
                />
              </div>
            </label>
          )}

          {mode === 'login' && (
            <label className="block text-sm font-medium text-[#6B4E3D]">
              Password
              <div className="mt-1 flex items-center rounded-xl border border-[#E7DED1] bg-white px-3 py/2 focus-within:ring-2 focus-within:ring-[#8B2332]">
                <Lock size={16} className="text-[#B08A6D]" />
                <input
                  type="password"
                  className="ml-2 flex-1 border-0 bg-transparent text-sm focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </label>
          )}

          {mode === 'reset' && (
            <>
              <label className="block text-sm font-medium text-[#6B4E3D]">
                Verification code
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-[#6B4E3D]">
                New password
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-[#6B4E3D]">
                Confirm password
                <input
                  type="password"
                  className="mt-1 w-full rounded-xl border border-[#E7DED1] px-3 py-2 text-sm"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B2332] py-3 text-white font-semibold hover:bg-[#761c29] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {mode === 'login' ? 'Signing in…' : mode === 'forgot' ? 'Sending…' : 'Updating…'}
              </>
            ) : mode === 'login' ? (
              <>
                <Lock size={16} />
                Sign in
              </>
            ) : mode === 'forgot' ? (
              'Send code'
            ) : (
              'Reset password'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-[#6B4E3D]">
          {mode === 'login' ? (
            <button
              type="button"
              className="font-semibold text-[#8B2332] hover:underline"
              onClick={() => {
                resetState();
                setMode('forgot');
                setResetEmail(email);
              }}
            >
              Forgot password?
            </button>
          ) : (
            <button
              type="button"
              className="font-semibold text-[#8B2332] hover:underline"
              onClick={() => {
                resetState();
                setMode('login');
              }}
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

