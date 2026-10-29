'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative bg-white pt-32 pb-16 lg:pt-40 lg:pb-24 border-b border-zinc-200/80 overflow-hidden">
      {/* Subtle architectural ambient backdrop */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-[550px] w-[550px] rounded-full bg-zinc-100/70 blur-3xl opacity-70 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Architectural Editorial Statement */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Monospace Atelier Tag */}
            <div className="flex items-center gap-3 mb-5 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              <span>COLLECTION 2026 // LIMITED PRODUCTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 uppercase leading-[0.98] mb-6">
              ARCHITECTURAL
              <br />
              <span className="text-zinc-400">FOOTWEAR.</span>
              <br />
              MADE IN ITALY.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed mb-8 font-sans">
              A curated vault of serialized court silhouettes, archival high-tops, and experimental prototypes. Handcrafted from full-grain Tuscan calfskin with Italian vulcanized rubber cupsoles.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/sneakers"
                id="hero-shop-cta"
                className="inline-flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors"
              >
                <span>EXPLORE VAULT [12]</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/upcoming"
                id="hero-upcoming-cta"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 px-8 py-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors"
              >
                <span>RELEASE CALENDAR</span>
              </Link>
            </div>

            {/* Atelier Technical Indices */}
            <div className="grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 pt-6 text-[10px] font-mono tracking-widest uppercase text-zinc-500">
              <div className="pr-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">12</span>
                <span className="text-zinc-400">SILHOUETTES</span>
              </div>
              <div className="px-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">500</span>
                <span className="text-zinc-400">MAX BATCH LIMIT</span>
              </div>
              <div className="pl-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">100%</span>
                <span className="text-zinc-400">TUSCAN CALFSKIN</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heroic Floating Sneaker (Zero grid, zero text clutter) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <Link
              href="/sneakers/court-one"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative w-full flex flex-col items-center justify-center cursor-pointer select-none"
              aria-label="View Court One Luxury"
            >
              {/* Floating Sneaker Image Container - Absolutely NO grid borders or boxes */}
              <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-3">
                <Image
                  src={isHovered ? '/images/court-one-quarter.jpg' : '/images/court-one-hero.jpg'}
                  alt="Court One Luxury Minimalist Court Sneaker"
                  fill
                  className="object-contain object-center transition-opacity duration-500"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Natural Soft Ground Contact Shadow */}
              <div className="w-3/4 h-8 bg-zinc-900/10 rounded-full blur-xl -mt-4 transition-all duration-700 group-hover:scale-95 group-hover:opacity-60" />

              {/* Clean Minimalist Product Identifier Below */}
              <div className="mt-6 flex items-center justify-between w-full max-w-md px-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-950 group-hover:text-zinc-600 transition-colors">
                  <span className="font-bold uppercase tracking-wider">
                    COURT ONE LUXURY
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline">
                    {'//'} CHALK LEATHER
                  </span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>

                <div className="flex items-baseline gap-1 font-bold text-zinc-950">
                  <span className="text-sm font-mono">{formatPrice(28999)}</span>
                  <span className="text-[9px] text-zinc-400 font-normal uppercase tracking-wider">
                    INR
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
