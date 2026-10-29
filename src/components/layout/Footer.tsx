'use client';

import Link from 'next/link';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-7 w-7 bg-zinc-950 rounded-lg flex items-center justify-center text-white font-black text-xs tracking-tighter">
                SD
              </div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-950 uppercase">
                SNEAKERDROP
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mb-6">
              Independent limited-edition sneaker showcase and drop archive. Handcrafted from luxury leathers, custom midsoles, and verified authenticity.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Authenticity Guaranteed</span>
            </div>
          </div>

          {/* Column 1: Drops */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Collection</p>
            <ul className="space-y-3">
              {[
                { href: '/sneakers', label: 'All 12 Releases' },
                { href: '/sneakers?filter=available', label: 'Available Now' },
                { href: '/upcoming', label: 'Upcoming Drops' },
                { href: '/sneakers?filter=sold_out', label: 'Vault Archive' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Account */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Account</p>
            <ul className="space-y-3">
              {[
                { href: '/login', label: 'Sign In' },
                { href: '/signup', label: 'Create Account' },
                { href: '/account', label: 'Profile Vault' },
                { href: '/admin', label: 'Admin Console' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Trust */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Assurance</p>
            <ul className="space-y-3">
              {[
                { label: 'Shoe Sizing Guide' },
                { label: 'Escrow Verification' },
                { label: 'Worldwide Shipping' },
                { label: 'Terms & Conditions' },
              ].map(({ label }) => (
                <li key={label}>
                  <span className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer flex items-center gap-1">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-14 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-400">
          <p>© {year} SneakerDrop Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-zinc-500">
            Crafted with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for sneaker culture enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
