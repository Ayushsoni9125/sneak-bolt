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
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="label-xs text-accent mb-3">Welcome Back</p>
          <h1 className="section-heading text-foreground text-4xl">Sign In</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-foreground hover:text-accent transition-colors underline underline-offset-4">
              Create one
            </Link>
          </p>
        </div>

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
            <label htmlFor="login-email" className="label-xs text-muted-foreground">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="your@email.com"
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 focus:outline-none focus:border-foreground/50 transition-colors rounded-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="label-xs text-muted-foreground">
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
            id="login-submit"
            disabled={isPending}
            className="w-full bg-foreground text-background py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-sm inline-flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
