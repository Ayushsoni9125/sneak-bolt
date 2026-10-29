'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ShowcaseSneaker {
  id: string;
  slug: string;
  name: string;
  edition: string;
  price: number;
  tag: string;
  image: string;
  hoverImage?: string;
  spec: string;
}

const SHOWCASE_SNEAKERS: ShowcaseSneaker[] = [
  {
    id: 'court-one',
    slug: 'court-one',
    name: 'Court One Luxury',
    edition: 'Chalk White // Tuscan Calfskin',
    price: 28999,
    tag: 'LIMITED TO 500 PAIRS',
    image: '/images/court-one-hero.jpg',
    hoverImage: '/images/court-one-quarter.jpg',
    spec: 'HANDMADE IN CIVITANOVA MARCHE',
  },
  {
    id: 'shadow-high',
    slug: 'shadow-high',
    name: 'Shadow High Archive',
    edition: 'Triple Pitch Black // Oiled Nubuck',
    price: 34999,
    tag: 'ARCHIVAL RE-ISSUE',
    image: '/images/shadow-high.jpg',
    hoverImage: '/images/court-one-profile.jpg',
    spec: 'CARBON FIBRE TORSION CHASSIS',
  },
  {
    id: 'obsidian-low',
    slug: 'obsidian-low',
    name: 'Obsidian Low Prime',
    edition: 'Obsidian Navy // Honey Gum',
    price: 26000,
    tag: 'FRENCH CALFSKIN',
    image: '/images/obsidian-low.jpg',
    spec: 'NATURAL VULCANIZED GUM SOLE',
  },
  {
    id: 'meridian-runner',
    slug: 'meridian-runner',
    name: 'Meridian Sculpt Runner',
    edition: 'Glacier Grey // Spacer Mesh',
    price: 32000,
    tag: 'DUAL-DENSITY CHASSIS',
    image: '/images/meridian-runner.jpg',
    spec: 'OPEN-CELL SPACER MESH',
  },
  {
    id: 'velocity',
    slug: 'velocity',
    name: 'Velocity Neo Racer',
    edition: 'Volt Citron // Mono-Weave Knit',
    price: 24500,
    tag: 'SUPERCRITICAL FOAM',
    image: '/images/velocity.jpg',
    spec: 'KINETIC PROPULSION RACER',
  },
  {
    id: 'komorebi-luxe',
    slug: 'komorebi-luxe',
    name: 'Komorebi Luxe',
    edition: 'Raw Suede // Natural Latex',
    price: 29500,
    tag: 'HAND-CRAFTED MARGOM',
    image: '/images/komorebi-luxe.jpg',
    spec: 'JAPANESE MINIMALIST GEOMETRY',
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentSneaker = SHOWCASE_SNEAKERS[currentIndex];

  const nextSneaker = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SNEAKERS.length);
      setIsTransitioning(false);
    }, 250);
  }, []);

  const prevSneaker = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + SHOWCASE_SNEAKERS.length) % SHOWCASE_SNEAKERS.length);
      setIsTransitioning(false);
    }, 250);
  }, []);

  // Continuous auto-rotation every 4 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSneaker();
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, nextSneaker]);

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

          {/* Right Column: Heroic Floating Sneaker — Continuous 1-by-1 Presentation (Zero Grid) */}
          <div
            className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Upper Badge & Rotation Status Bar */}
            <div className="w-full max-w-md flex items-center justify-between mb-2 px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-950 font-bold">
                  {`SILHOUETTE 0${currentIndex + 1} // 0${SHOWCASE_SNEAKERS.length}`}
                </span>
              </div>
              <span className="text-zinc-400 text-[9px] hidden sm:inline">
                {currentSneaker.tag}
              </span>
            </div>

            {/* Floating Sneaker Showcase Viewport */}
            <div className="relative w-full max-w-lg">
              <Link
                href={`/sneakers/${currentSneaker.slug}`}
                className="group relative w-full flex flex-col items-center justify-center cursor-pointer select-none"
                aria-label={`View ${currentSneaker.name}`}
              >
                {/* Floating Sneaker Image with Crossfade */}
                <div className="relative w-full h-[280px] sm:h-[390px] lg:h-[460px] flex items-center justify-center">
                  <div
                    className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out ${
                      isTransitioning ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'
                    } group-hover:scale-105 group-hover:-translate-y-3`}
                  >
                    <Image
                      src={
                        isHovered && currentSneaker.hoverImage
                          ? currentSneaker.hoverImage
                          : currentSneaker.image
                      }
                      alt={currentSneaker.name}
                      fill
                      className="object-contain object-center transition-all duration-500"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Natural Soft Ground Contact Shadow */}
                <div
                  className={`w-3/4 h-6 sm:h-8 bg-zinc-900/10 rounded-full blur-xl -mt-2 sm:-mt-4 transition-all duration-700 ${
                    isTransitioning ? 'opacity-20 scale-75' : 'opacity-60 scale-100'
                  } group-hover:scale-95 group-hover:opacity-40`}
                />

                {/* Minimalist Product Identifier Below */}
                <div className="mt-4 sm:mt-5 flex items-center justify-between w-full max-w-md px-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-zinc-950 group-hover:text-zinc-600 transition-colors">
                    <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                      {currentSneaker.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest hidden sm:inline">
                      {'//'} {currentSneaker.edition.split('//')[0]?.trim()}
                    </span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>

                  <div className="flex items-baseline gap-1 font-bold text-zinc-950">
                    <span className="text-xs sm:text-sm font-mono">
                      {formatPrice(currentSneaker.price)}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-normal uppercase tracking-wider">
                      INR
                    </span>
                  </div>
                </div>
              </Link>

              {/* Prev / Next Interactive Touch Targets on Sides */}
              <button
                type="button"
                onClick={prevSneaker}
                aria-label="Previous silhouette"
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-zinc-950 hover:text-white border border-zinc-200 text-zinc-700 rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 cursor-pointer -ml-2 sm:-ml-4 z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={nextSneaker}
                aria-label="Next silhouette"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-zinc-950 hover:text-white border border-zinc-200 text-zinc-700 rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 cursor-pointer -mr-2 sm:-mr-4 z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Continuous Architectural Progress Strip */}
            <div className="w-full max-w-md px-3 mt-4 flex items-center gap-1.5">
              {SHOWCASE_SNEAKERS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setIsTransitioning(false);
                    }, 200);
                  }}
                  className="flex-1 group py-2 flex flex-col cursor-pointer"
                  aria-label={`Jump to ${item.name}`}
                >
                  <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden transition-colors group-hover:bg-zinc-300">
                    <div
                      className={`h-full bg-zinc-950 transition-all duration-500 rounded-full ${
                        idx === currentIndex ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
