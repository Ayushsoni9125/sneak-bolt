'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldCheck, User } from 'lucide-react';
import { signup } from '@/features/auth/actions';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'collector' | 'admin'>('collector');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set('role', selectedRole);

    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 bg-[#fafafa]">
      <div className="w-full max-w-lg">
        <div className="bg-white p-8 sm:p-10 border border-zinc-200 shadow-sm">
          <div className="mb-6">
            <div className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              REGISTRATION // ACCOUNT CREATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase tracking-tight">
              CREATE YOUR ACCOUNT
            </h1>
            <p className="text-xs text-zinc-500 mt-2 font-sans">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-zinc-950 font-bold hover:underline transition-colors uppercase font-mono"
              >
                Sign In
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

            {/* Role Selection: Sign Up as User vs Admin */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block">
                SELECT ACCOUNT ROLE *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  id="role-user-btn"
                  onClick={() => setSelectedRole('collector')}
                  className={`p-3.5 border rounded-sm text-left transition-all cursor-pointer ${
                    selectedRole === 'collector'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User
                      className={`h-4 w-4 ${
                        selectedRole === 'collector' ? 'text-blue-400' : 'text-zinc-500'
                      }`}
                    />
                    <span className="font-mono text-xs uppercase font-bold tracking-wider">
                      Sign Up as User
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      selectedRole === 'collector' ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    Collector account to discover releases, order shoes, and view acquisition ledger.
                  </p>
                </button>

                <button
                  type="button"
                  id="role-admin-btn"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3.5 border rounded-sm text-left transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck
                      className={`h-4 w-4 ${
                        selectedRole === 'admin' ? 'text-amber-400' : 'text-zinc-500'
                      }`}
                    />
                    <span className="font-mono text-xs uppercase font-bold tracking-wider">
                      Sign Up as Admin
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      selectedRole === 'admin' ? 'text-zinc-300' : 'text-zinc-500'
                    }`}
                  >
                    Full administrator console access to manage products, customer orders, and waitlist.
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label
                htmlFor="signup-name"
                className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
              >
                FULL NAME *
              </label>
              <input
                id="signup-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder={selectedRole === 'admin' ? 'e.g. Curator Admin' : 'e.g. Alexander Rossi'}
                className="w-full px-4 py-3 bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-950 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
              >
                EMAIL ADDRESS *
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={selectedRole === 'admin' ? 'admin@yourdomain.com' : 'collector@yourdomain.com'}
                className="w-full px-4 py-3 bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-950 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="signup-password"
                className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block"
              >
                PASSWORD (MIN 8 CHARACTERS) *
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
              id="signup-submit-btn"
              className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs font-mono uppercase tracking-[0.25em] transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>CREATING ACCOUNT...</span>
                </>
              ) : selectedRole === 'admin' ? (
                <span>CREATE ADMIN ACCOUNT & ACCESS CONSOLE</span>
              ) : (
                <span>CREATE COLLECTOR ACCOUNT</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
