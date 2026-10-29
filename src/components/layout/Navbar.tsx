'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sneakers', label: 'All Sneakers' },
  { href: '/upcoming', label: 'Upcoming Drops' },
  { href: '/sneakers?filter=sold_out', label: 'Vault Archive' },
];

export function Navbar({ isAdmin, isLoggedIn }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] py-3'
            : 'bg-white/70 backdrop-blur-sm border-b border-zinc-100 py-4'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="h-8 w-8 bg-zinc-950 rounded-lg flex items-center justify-center text-white font-black text-xs tracking-tighter group-hover:bg-amber-600 transition-colors shadow-sm">
                SD
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tighter text-zinc-950 uppercase group-hover:text-amber-600 transition-colors">
                  SNEAKERDROP
                </span>
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase -mt-1">
                  Edition 2026
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-zinc-100/80 p-1 rounded-full border border-zinc-200/60">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all',
                        isActive
                          ? 'bg-white text-zinc-950 shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className={cn(
                      'px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5',
                      pathname.startsWith('/admin')
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-amber-700 hover:bg-amber-100/70'
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/sneakers"
                className="hidden sm:flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>12 Releases</span>
              </Link>

              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="text-xs font-bold tracking-wide text-zinc-700 hover:text-zinc-950 px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-bold tracking-wide text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/sneakers"
                className="relative p-2 rounded-full hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors"
                aria-label="View catalogue bag"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 sm:px-10 flex flex-col justify-between pb-10">
          <div className="flex flex-col gap-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Navigation</p>
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-2xl font-extrabold tracking-tight transition-colors',
                  pathname === href ? 'text-amber-600' : 'text-zinc-900'
                )}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-2xl font-extrabold text-amber-600 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Admin Console
              </Link>
            )}
          </div>

          <div className="border-t border-zinc-200 pt-6 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link
                href="/account"
                className="w-full text-center py-3 bg-zinc-950 text-white font-bold text-sm rounded-xl"
              >
                My Account
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 text-center py-3 border border-zinc-300 font-bold text-sm text-zinc-900 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 text-center py-3 bg-zinc-950 text-white font-bold text-sm rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
