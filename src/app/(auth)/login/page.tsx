'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-12 border border-zinc-200">
          <div className="mb-8">
            <div className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              AUTHENTICATION // COLLECTOR
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
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs font-mono uppercase tracking-[0.25em] transition-colors flex items-center justify-center gap-2 mt-6"
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
