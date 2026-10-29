'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SneakerView {
  id: string;
  label: string;
  viewName: string;
  image: string;
  alt: string;
}

const COURT_ONE_VIEWS: SneakerView[] = [
  {
    id: 'hero',
    label: 'PERSPECTIVE 01',
    viewName: 'DUAL FLOATING ARCHITECTURE',
    image: '/images/court-one-hero.jpg',
    alt: 'Court One Luxury Minimalist Court Sneaker - Floating Pair View',
  },
  {
    id: 'quarter',
    label: 'PERSPECTIVE 02',
    viewName: 'DYNAMIC 45° STUDIO ANGLE',
    image: '/images/court-one-quarter.jpg',
    alt: 'Court One Luxury - Dynamic Quarter Studio View',
  },
  {
    id: 'profile',
    label: 'PERSPECTIVE 03',
    viewName: 'LATERAL PROFILE SILHOUETTE',
    image: '/images/court-one-profile.jpg',
    alt: 'Court One Luxury - Lateral Profile View',
  },
];

export function HeroSection() {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Automatically cycles sneaker images by themselves every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveViewIndex((prev) => (prev + 1) % COURT_ONE_VIEWS.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentView = COURT_ONE_VIEWS[activeViewIndex];

  return (
    <section className="relative bg-white pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-24 border-b border-zinc-200/80 overflow-hidden">
      {/* Subtle architectural ambient backdrop glow */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-[350px] w-[350px] sm:h-[550px] sm:w-[550px] rounded-full bg-zinc-100/70 blur-3xl opacity-70 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Architectural Statement */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            {/* Tag */}
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              <span>COLLECTION 2026 // LIMITED PRODUCTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-zinc-950 uppercase leading-[0.98] mb-4 sm:mb-6">
              ARCHITECTURAL
              <br />
              <span className="text-zinc-400">FOOTWEAR.</span>
              <br />
              MADE IN ITALY.
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 max-w-lg leading-relaxed mb-6 sm:mb-8 font-sans">
              A curated vault of serialized court silhouettes, archival high-tops, and experimental prototypes. Handcrafted from full-grain Tuscan calfskin with Italian vulcanized rubber cupsoles.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
              <Link
                href="/sneakers"
                id="hero-shop-cta"
                className="inline-flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-800 text-white px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors"
              >
                <span>EXPLORE VAULT [12]</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/upcoming"
                id="hero-upcoming-cta"
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors"
              >
                <span>RELEASE CALENDAR</span>
              </Link>
            </div>

            {/* Technical Indices */}
            <div className="grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 pt-5 sm:pt-6 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-zinc-500">
              <div className="pr-2 sm:pr-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">12</span>
                <span className="text-zinc-400">SILHOUETTES</span>
              </div>
              <div className="px-2 sm:px-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">500</span>
                <span className="text-zinc-400 truncate block">BATCH LIMIT</span>
              </div>
              <div className="pl-2 sm:pl-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">100%</span>
                <span className="text-zinc-400 truncate block">CALFSKIN</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heroic Floating Sneaker with Self-Changing Multiple Images (Zero Grid) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2">
            {/* Upper Perspective Live Indicator */}
            <div className="w-full max-w-md flex items-center justify-between mb-2 px-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-950 font-bold">
                  {`${currentView.label} // 0${COURT_ONE_VIEWS.length}`}
                </span>
              </div>
              <span className="text-zinc-400 text-[9px] tracking-wider">
                {currentView.viewName}
              </span>
            </div>

            {/* Floating Sneaker Showcase Viewport */}
            <div className="relative w-full max-w-lg">
              <Link
                href="/sneakers/court-one"
                className="group relative w-full flex flex-col items-center justify-center cursor-pointer select-none"
                aria-label="View Court One Luxury"
              >
                {/* Floating Sneaker Image Container with Smooth Crossfade */}
                <div className="relative w-full h-[280px] sm:h-[390px] lg:h-[460px] flex items-center justify-center">
                  <div
                    className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out ${
                      isTransitioning ? 'opacity-0 scale-95 -translate-y-1' : 'opacity-100 scale-100 translate-y-0'
                    } group-hover:scale-105 group-hover:-translate-y-2`}
                  >
                    <Image
                      src={currentView.image}
                      alt={currentView.alt}
                      fill
                      className="object-contain object-center transition-opacity duration-500"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Natural Soft Ground Contact Shadow */}
                <div
                  className={`w-3/4 h-6 sm:h-8 bg-zinc-900/10 rounded-full blur-xl -mt-2 sm:-mt-4 transition-all duration-700 ${
                    isTransitioning ? 'opacity-30 scale-90' : 'opacity-60 scale-100'
                  } group-hover:scale-95 group-hover:opacity-40`}
                />

                {/* Clean Minimalist Product Identifier Below */}
                <div className="mt-4 sm:mt-5 flex items-center justify-between w-full max-w-md px-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-zinc-950 group-hover:text-zinc-600 transition-colors">
                    <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                      COURT ONE LUXURY
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline">
                      {'//'} CHALK LEATHER
                    </span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>

                  <div className="flex items-baseline gap-1 font-bold text-zinc-950">
                    <span className="text-xs sm:text-sm font-mono">{formatPrice(28999)}</span>
                    <span className="text-[9px] text-zinc-400 font-normal uppercase tracking-wider">
                      INR
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Continuous Self-Changing Minimal Indicator Lines */}
            <div className="w-full max-w-md px-2 mt-4 flex items-center gap-2">
              {COURT_ONE_VIEWS.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex-1 py-1 flex flex-col"
                  aria-label={item.viewName}
                >
                  <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-zinc-950 transition-all duration-500 rounded-full ${
                        idx === activeViewIndex ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
