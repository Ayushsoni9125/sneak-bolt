'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

const navLinks = [
  { href: '/sneakers', label: 'THE VAULT [12]' },
  { href: '/sneakers?filter=available', label: 'AVAILABLE' },
  { href: '/upcoming', label: 'CALENDAR' },
  { href: '/sneakers?filter=sold_out', label: 'ARCHIVE' },
];

const TICKER_ITEMS = [
  'COMPLIMENTARY WORLDWIDE EXPRESS DISPATCH',
  'SERIALIZED HANDCRAFTED FOOTWEAR',
  'COLLECTION 2026 // LIMITED PRODUCTION',
  'CIVITANOVA MARCHE // MADE IN ITALY',
  'AUTHENTICATED NFC ARCHIVAL HARDWARE',
  '100% FULL-GRAIN TUSCAN CALFSKIN',
  'LIMITED RUN OF 500 PAIRS WORLDWIDE',
];

export function Navbar({ isAdmin, isLoggedIn }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalCount } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
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
      {/* Top Luxury Announcement Ticker Marquee */}
      <header className="fixed top-0 inset-x-0 z-40 bg-zinc-950 text-white text-[9px] sm:text-[10px] font-mono uppercase h-[32px] overflow-hidden flex items-center border-b border-zinc-800/80 select-none">
        <div className="w-full overflow-hidden flex items-center">
          <div className="animate-marquee">
            <div className="flex items-center gap-6 sm:gap-10 shrink-0 pr-6 sm:pr-10">
              {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
                <span key={`ticker-a-${idx}`} className="flex items-center gap-6 sm:gap-10 shrink-0">
                  <span className="tracking-[0.2em] sm:tracking-[0.25em] font-medium whitespace-nowrap">{item}</span>
                  <span className="text-zinc-600 select-none">•</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6 sm:gap-10 shrink-0 pr-6 sm:pr-10" aria-hidden="true">
              {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
                <span key={`ticker-b-${idx}`} className="flex items-center gap-6 sm:gap-10 shrink-0">
                  <span className="tracking-[0.2em] sm:tracking-[0.25em] font-medium whitespace-nowrap">{item}</span>
                  <span className="text-zinc-600 select-none">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav
        className={cn(
          'fixed top-[32px] inset-x-0 z-40 transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-zinc-200/90',
          scrolled ? 'py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]' : 'py-3.5 sm:py-4'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="text-base sm:text-lg font-black tracking-[0.18em] text-zinc-950 uppercase group-hover:text-zinc-600 transition-colors">
                SNEAKERDROP
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href) && href.includes('filter') === false);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'text-xs font-mono tracking-[0.18em] uppercase transition-colors relative py-1',
                        isActive
                          ? 'text-zinc-950 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-950 font-medium'
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
                    className="text-xs font-mono tracking-[0.18em] uppercase text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    ADMIN
                  </Link>
                </li>
              )}
            </ul>

            {/* Right Actions: Account & Bag Button */}
            <div className="flex items-center gap-3 sm:gap-5">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="hidden sm:inline-block text-xs font-mono tracking-[0.15em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors"
                >
                  ACCOUNT
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-block text-xs font-mono tracking-[0.15em] uppercase text-zinc-600 hover:text-zinc-950 transition-colors"
                >
                  SIGN IN
                </Link>
              )}

              {/* Shopping Cart Trigger Button */}
              <button
                onClick={openCart}
                id="cart-trigger-btn"
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 border border-zinc-950 text-xs font-mono tracking-[0.15em] uppercase transition-colors cursor-pointer"
                aria-label={`Open shopping cart with ${totalCount} items`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>CART</span>
                <span className="font-bold text-emerald-400">[{totalCount}]</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-zinc-800 hover:text-zinc-950"
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
        <div className="fixed inset-0 z-50 bg-white pt-28 px-6 pb-10 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                DIRECTORY
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 text-zinc-500 hover:text-zinc-950"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xl font-bold tracking-tight text-zinc-950 hover:text-zinc-500 transition-colors"
              >
                {label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className="text-lg font-bold text-amber-700 flex items-center gap-2"
              >
                <ShieldCheck className="h-5 w-5" />
                ADMIN CONSOLE
              </Link>
            )}
          </div>

          <div className="border-t border-zinc-200 pt-6 flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
            {isLoggedIn ? (
              <Link
                href="/account"
                className="w-full text-center py-3.5 bg-zinc-950 text-white hover:bg-zinc-800 transition-colors"
              >
                VIEW ACCOUNT
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="text-center py-3 border border-zinc-300 text-zinc-950 hover:bg-zinc-50 transition-colors"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/signup"
                  className="text-center py-3 bg-zinc-950 text-white hover:bg-zinc-800 transition-colors"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
