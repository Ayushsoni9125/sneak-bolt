'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Store,
  ShoppingBag,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { logout } from '@/features/auth/actions';

interface AdminShellProps {
  profile: {
    id: string;
    email?: string;
    role?: string;
    full_name?: string;
  };
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/waitlist', label: 'Waitlist', icon: Users },
];

export function AdminShell({ profile, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile drawer whenever pathname changes during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const isLinkActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview';
    if (pathname.startsWith('/admin/orders')) return 'Orders';
    if (pathname.startsWith('/admin/products/new')) return 'New Product';
    if (pathname.includes('/edit')) return 'Edit Product';
    if (pathname.startsWith('/admin/products')) return 'Products';
    if (pathname.startsWith('/admin/waitlist')) return 'Waitlist';
    return 'Console';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Mobile Drawer Backdrop & Panel ───────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin Navigation Menu"
            className="relative z-10 w-72 max-w-[85vw] bg-sidebar border-r border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-250"
          >
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-sidebar">
              <div>
                <p className="label-sm text-foreground font-black tracking-widest">SNEAKERDROP</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="h-3 w-3 text-amber-500" />
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Admin Console
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-sm hover:bg-sidebar-accent transition-colors"
                aria-label="Close admin menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Mobile admin navigation">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isLinkActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3.5 py-3 text-sm rounded-sm transition-all duration-150 ${
                      active
                        ? 'bg-foreground text-background font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border space-y-2 bg-sidebar/50">
              <div className="px-3 py-2 bg-background/60 border border-border/80 rounded-sm mb-2">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-foreground truncate mt-0.5">
                  {profile.full_name || profile.email || 'Admin'}
                </p>
              </div>

              <Link
                href="/"
                className="flex items-center justify-between px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-sm transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  View Storefront
                </span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* ── Desktop Fixed Sidebar (lg+) ──────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 fixed inset-y-0 left-0 z-30 border-r border-border flex-col bg-sidebar">
        <div className="px-6 py-5 border-b border-border">
          <Link href="/admin" className="block focus:outline-none">
            <p className="label-sm text-foreground font-black tracking-widest">SNEAKERDROP</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto" aria-label="Desktop admin navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-sm transition-all duration-150 ${
                  active
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border space-y-1.5 bg-sidebar/50">
          <div className="px-3 py-2 bg-background/60 border border-border/80 rounded-sm mb-2">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Administrator
            </p>
            <p className="text-xs font-semibold text-foreground truncate mt-0.5">
              {profile.full_name || profile.email || 'Admin'}
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              View Storefront
            </span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-left cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Layout Column ───────────────────────────────────────────── */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-foreground hover:bg-sidebar-accent rounded-sm transition-colors cursor-pointer"
              aria-label="Open admin menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Section Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono min-w-0 truncate">
              <span className="text-muted-foreground hidden sm:inline">ADMIN</span>
              <span className="text-muted-foreground hidden sm:inline">/</span>
              <span className="font-bold text-foreground uppercase tracking-wider truncate">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Live Store link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground/30 rounded-sm transition-colors"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Storefront</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </Link>

            {/* Admin status pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-sidebar border border-border rounded-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-mono text-foreground font-medium truncate max-w-[120px] sm:max-w-[180px]">
                {profile.full_name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
