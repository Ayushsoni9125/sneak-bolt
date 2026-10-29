'use client';

import Link from 'next/link';

export function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-3">
              <span className="font-black text-base sm:text-lg tracking-[0.2em] text-zinc-950 uppercase">
                SNEAKERDROP
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                ATELIER & ARCHIVE // EDITION 2026
              </span>
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mb-6 font-sans">
              Independent limited-edition sneaker showcase and drop archive. Handcrafted from luxury leathers, custom vulcanized cupsoles, and serialized NFC authenticity ledger tags.
            </p>

            <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              CIVITANOVA MARCHE • FLORENCE • OKAYAMA
            </div>
          </div>

          {/* Column 1: Drops */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4 font-bold">
              DIRECTORY
            </p>
            <ul className="space-y-2.5 text-xs font-mono tracking-wider">
              {[
                { href: '/sneakers', label: 'THE VAULT [12]' },
                { href: '/sneakers?filter=available', label: 'AVAILABLE NOW' },
                { href: '/upcoming', label: 'RELEASE CALENDAR' },
                { href: '/sneakers?filter=sold_out', label: 'ARCHIVE GRAILS' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-zinc-600 hover:text-zinc-950 transition-colors uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Account */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4 font-bold">
              COLLECTOR
            </p>
            <ul className="space-y-2.5 text-xs font-mono tracking-wider">
              {[
                { href: '/login', label: 'SIGN IN' },
                { href: '/signup', label: 'REGISTER VAULT' },
                { href: '/account', label: 'LEDGER PROFILE' },
                { href: '/admin', label: 'ATELIER CONSOLE' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-zinc-600 hover:text-zinc-950 transition-colors uppercase"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Logistics */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 mb-4 font-bold">
              ASSURANCE
            </p>
            <ul className="space-y-2.5 text-xs font-mono tracking-wider text-zinc-500">
              <li>
                <span className="uppercase">NFC CRYPTO TAGS</span>
              </li>
              <li>
                <span className="uppercase">DHL EXPRESS AIR</span>
              </li>
              <li>
                <span className="uppercase">14-DAY VAULT RETURN</span>
              </li>
              <li>
                <span className="uppercase">TERMS OF SALE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-14 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono tracking-widest uppercase text-zinc-400">
          <p>© {year} SNEAKERDROP ARCHIVE INC. ALL RIGHTS RESERVED.</p>
          <p>AUTHENTICATED LUXURY FOOTWEAR PLATFORM</p>
        </div>
      </div>
    </footer>
  );
}
