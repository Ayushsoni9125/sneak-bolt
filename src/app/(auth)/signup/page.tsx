'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signup } from '@/features/auth/actions';

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    });
  }

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-[#fafafa]">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-12 border border-zinc-200">
          <div className="mb-8">
            <div className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              REGISTRATION // COLLECTOR
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
              REGISTER VAULT ACCOUNT
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-sans">
              Already have a collector account?{' '}
              <Link
                href="/login"
                className="text-zinc-950 font-bold hover:underline transition-colors uppercase font-mono"
              >
                Sign In
              </Link>
            </p>
          </div>

          {success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
              <p className="font-bold mb-1">REGISTRATION INITIATED</p>
              <p>{success}</p>
              <Link
                href="/login"
                className="mt-3 inline-block font-bold underline"
              >
                PROCEED TO SIGN IN →
              </Link>
            </div>
          ) : (
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
                  htmlFor="signup-name"
                  className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
                >
                  FULL NAME
                </label>
                <input
                  id="signup-name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Alexander Rossi"
                  className="w-full px-4 py-3 bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-950 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="signup-email"
                  className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="collector@domain.com"
                  className="w-full px-4 py-3 bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-950 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="signup-password"
                  className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
                >
                  PASSWORD (MIN 8 CHARACTERS)
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
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
                    <span>CREATING ACCOUNT...</span>
                  </>
                ) : (
                  <span>CREATE VAULT MEMBERSHIP</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
