'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, CheckCircle, User, Mail, Lock } from 'lucide-react';
import { signup } from '@/features/auth/actions';

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-zinc-50/60">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-900/5 text-center">
          <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 border border-emerald-200">
            <CheckCircle className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-zinc-950 mb-2">Account Created</h2>
          <p className="text-sm text-zinc-600 mb-6">
            Welcome to the vault. Please check your email to confirm your account and begin collecting.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-zinc-950 hover:bg-amber-600 text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 bg-zinc-50/60">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-900/5">
          <div className="mb-8">
            <div className="h-10 w-10 bg-zinc-950 rounded-xl flex items-center justify-center text-white font-black text-sm mb-4 shadow-sm">
              SD
            </div>
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Create Account</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-zinc-950 font-bold hover:text-amber-600 transition-colors underline underline-offset-4">
                Sign in
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
              <label htmlFor="signup-name" className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                Full Name
              </label>
              <input
                id="signup-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Ayush Soni"
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm px-4 py-3.5 focus:outline-none focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                Email Address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="collector@sneakerdrop.com"
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-950 placeholder:text-zinc-400 text-sm px-4 py-3.5 focus:outline-none focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="text-xs font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-zinc-400" />
                Password (min. 8 characters)
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              id="signup-submit-btn"
              className="w-full bg-zinc-950 hover:bg-amber-600 text-white py-4 text-xs font-bold uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-xl mt-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account…</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
