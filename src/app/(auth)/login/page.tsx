'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldCheck, UserCheck, Copy, Check } from 'lucide-react';
import { login } from '@/features/auth/actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  function handleAutoFill(type: 'admin' | 'collector') {
    setError(null);
    if (type === 'admin') {
      setEmail('admin@sneakerdrop.internal');
      setPassword('AdminPassword123!');
    } else {
      setEmail('collector@sneakerdrop.internal');
      setPassword('CollectorPassword123!');
    }
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 bg-[#fafafa]">
      <div className="w-full max-w-lg space-y-4">
        {/* Compact Upper Demo Credentials Grid */}
        <div className="bg-zinc-950 text-white p-3.5 sm:p-4 border border-zinc-800 rounded-sm shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-zinc-300 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>EVALUATOR DEMO CREDENTIALS</span>
            </div>
            <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-wider bg-emerald-950/60 px-2 py-0.5 border border-emerald-800/40 rounded-sm">
              1-Click Auto-Fill
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[10px] font-mono">
            {/* Admin (Curator) */}
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-amber-400 font-bold text-[9px] uppercase tracking-wider mb-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('admin@sneakerdrop.internal', 'admin_email')}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    title="Copy email"
                  >
                    {copiedKey === 'admin_email' ? (
                      <Check className="h-2.5 w-2.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-2.5 w-2.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-200 font-semibold truncate select-all">
                  admin@sneakerdrop.internal
                </p>
                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">AdminPassword123!</p>
              </div>

              <button
                type="button"
                id="autofill-admin-btn"
                onClick={() => handleAutoFill('admin')}
                className="mt-2.5 w-full py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Auto-Fill Admin
              </button>
            </div>

            {/* Collector (User) */}
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-blue-400 font-bold text-[9px] uppercase tracking-wider mb-1">
                  <span className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" /> User (Collector)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('collector@sneakerdrop.internal', 'user_email')}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    title="Copy email"
                  >
                    {copiedKey === 'user_email' ? (
                      <Check className="h-2.5 w-2.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-2.5 w-2.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-200 font-semibold truncate select-all">
                  collector@sneakerdrop.internal
                </p>
                <p className="text-[9px] text-zinc-500 font-mono mt-0.5">CollectorPassword123!</p>
              </div>

              <button
                type="button"
                id="autofill-collector-btn"
                onClick={() => handleAutoFill('collector')}
                className="mt-2.5 w-full py-1.5 bg-blue-400/10 hover:bg-blue-400/20 text-blue-300 border border-blue-400/30 text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Auto-Fill User
              </button>
            </div>
          </div>
        </div>

        {/* Main login card */}
        <div className="bg-white p-8 sm:p-10 border border-zinc-200 shadow-sm">
          <div className="mb-8">
            <div className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              AUTHENTICATION // PORTAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
              SIGN IN TO VAULT
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-sans">
              Don&apos;t have an account yet?{' '}
              <Link
                href="/signup"
                className="text-zinc-950 font-bold hover:underline transition-colors uppercase font-mono"
              >
                Register
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div
                className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="collector@domain.com"
                className="w-full px-4 py-3 bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-950 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
                >
                  PASSWORD
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-10 bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-950 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs font-mono uppercase tracking-[0.25em] transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AUTHORIZING...</span>
                </>
              ) : (
                <span>ACCESS VAULT ACCOUNT</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
