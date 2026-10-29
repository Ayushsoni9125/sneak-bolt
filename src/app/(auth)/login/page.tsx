'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { login } from '@/features/auth/actions';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-zinc-50/60">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-900/5">
          <div className="mb-8">
            <div className="h-10 w-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white font-black text-sm mb-4 shadow-sm">
              SD
            </div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Sign In</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-zinc-950 font-bold hover:text-amber-600 transition-colors underline underline-offset-4">
                Create one now
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
              <div
                className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="collector@sneakerdrop.com"
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm px-4 py-3.5 focus:outline-none focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-zinc-400" />
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm px-4 py-3.5 pr-11 focus:outline-none focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              id="login-submit-btn"
              className="w-full bg-zinc-950 hover:bg-amber-600 text-white py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-xl mt-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing In…</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
