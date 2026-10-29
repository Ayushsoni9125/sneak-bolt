'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
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
      if (result?.error) setError(result.error);
      if (result?.success) setSuccess(result.success);
    });
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="label-xs text-accent mb-3">Join SneakerDrop</p>
          <h1 className="section-heading text-foreground text-4xl">Create Account</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:text-accent transition-colors underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>

        {success ? (
          <div className="flex items-start gap-3 p-5 border border-emerald-800/40 bg-emerald-950/40 rounded-sm">
            <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-emerald-300 font-semibold text-sm">Account created!</p>
              <p className="text-emerald-400/70 text-sm mt-1">{success}</p>
              <Link href="/login" className="label-xs text-emerald-400 mt-3 inline-block">
                Sign in now →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {error && (
              <div
                className="px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="signup-name" className="label-xs text-muted-foreground">
                Full Name
              </label>
              <input
                id="signup-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Alex Jordan"
                className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 focus:outline-none focus:border-foreground/50 transition-colors rounded-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="label-xs text-muted-foreground">
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 focus:outline-none focus:border-foreground/50 transition-colors rounded-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="signup-password" className="label-xs text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Minimum 8 characters"
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 pr-12 focus:outline-none focus:border-foreground/50 transition-colors rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="signup-submit"
              disabled={isPending}
              className="w-full bg-foreground text-background py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-sm inline-flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account…
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our terms of service and privacy policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
