'use client';

import Link from 'next/link';

export function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="label-sm text-foreground mb-4">SNEAKERDROP</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium footwear crafted for those who understand that a great shoe
              is never accidental.
            </p>
          </div>
          <div>
            <p className="label-xs text-muted-foreground mb-4">Collection</p>
            <ul className="space-y-2">
              {[
                { href: '/sneakers', label: 'All Sneakers' },
                { href: '/upcoming', label: 'Upcoming Drops' },
                { href: '/sneakers?filter=available', label: 'In Stock' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-xs text-muted-foreground mb-4">Account</p>
            <ul className="space-y-2">
              {[
                { href: '/login', label: 'Sign In' },
                { href: '/signup', label: 'Create Account' },
                { href: '/account', label: 'My Account' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label-xs text-muted-foreground mb-4">Info</p>
            <ul className="space-y-2">
              {[
                { href: '#', label: 'Sizing Guide' },
                { href: '#', label: 'Returns Policy' },
                { href: '#', label: 'Authenticity' },
                { href: '#', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} SneakerDrop. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built to Stand Out.
          </p>
        </div>
      </div>
    </footer>
  );
}
