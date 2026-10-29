'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/sneakers', label: 'Collection' },
  { href: '/upcoming', label: 'Upcoming' },
];

export function Navbar({ isAdmin, isLoggedIn }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <nav
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="label-sm text-foreground hover:text-accent transition-colors"
            >
              SNEAKERDROP
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'label-xs transition-colors',
                      pathname === href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className={cn(
                      'label-xs transition-colors',
                      pathname.startsWith('/admin')
                        ? 'text-accent'
                        : 'text-muted-foreground hover:text-accent'
                    )}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="label-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="label-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
              )}
              <Link href="/sneakers" aria-label="Shop">
                <ShoppingBag className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              {/* Mobile toggle */}
              <button
                className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16">
          <div className="flex flex-col px-6 py-8 gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'section-heading text-4xl',
                  pathname === href ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="section-heading text-4xl text-accent">
                Admin
              </Link>
            )}
            <div className="mt-4 border-t border-border pt-6">
              {isLoggedIn ? (
                <Link href="/account" className="label-sm text-muted-foreground">
                  Account
                </Link>
              ) : (
                <Link href="/login" className="label-sm text-muted-foreground">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
