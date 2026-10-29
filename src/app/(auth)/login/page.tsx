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
      <div className="w-full max-w-lg space-y-6">
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

        {/* Demo & Evaluator Credentials Panel */}
        <div className="bg-zinc-950 text-white p-6 sm:p-7 border border-zinc-800 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-200">
                DEMO / EVALUATOR CREDENTIALS
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800/40 rounded-sm">
              Live Evaluation
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Reviewing this assignment? Use the 1-click auto-fill buttons below to instantly test the Admin Console or Collector Storefront.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Admin Credentials Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-3 w-3" /> Admin (Curator)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('admin@sneakerdrop.internal', 'admin_email')}
                  className="text-zinc-500 hover:text-zinc-300"
                  title="Copy email"
                >
                  {copiedKey === 'admin_email' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              <div className="text-[10px] sm:text-[11px] font-mono text-zinc-300 space-y-1">
                <p className="break-all select-all text-zinc-100 font-semibold">admin@sneakerdrop.internal</p>
                <p className="text-zinc-400 select-all font-bold">AdminPassword123!</p>
              </div>

              <button
                type="button"
                onClick={() => handleAutoFill('admin')}
                className="w-full mt-2 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Auto-Fill Admin
              </button>
            </div>

            {/* Collector Credentials Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                  <UserCheck className="h-3 w-3" /> Collector (User)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('collector@sneakerdrop.internal', 'user_email')}
                  className="text-zinc-500 hover:text-zinc-300"
                  title="Copy email"
                >
                  {copiedKey === 'user_email' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              <div className="text-[10px] sm:text-[11px] font-mono text-zinc-300 space-y-1">
                <p className="break-all select-all text-zinc-100 font-semibold">collector@sneakerdrop.internal</p>
                <p className="text-zinc-400 select-all font-bold">CollectorPassword123!</p>
              </div>

              <button
                type="button"
                onClick={() => handleAutoFill('collector')}
                className="w-full mt-2 py-2 bg-blue-400/10 hover:bg-blue-400/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Auto-Fill Collector
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
