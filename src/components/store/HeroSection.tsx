'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface VaultSneaker {
  id: string;
  slug: string;
  name: string;
  edition: string;
  price: number;
  tag: string;
  image: string;
  alt: string;
}

const PREMIUM_VAULT_SNEAKERS: VaultSneaker[] = [
  {
    id: 'court-one',
    slug: 'court-one',
    name: 'Court One Luxury',
    edition: 'Chalk White // Tuscan Calfskin',
    price: 28999,
    tag: 'CIVITANOVA MARCHE // LIMITED 500',
    image: '/images/court-one-hero.jpg',
    alt: 'Court One Luxury - Italian Margom vulcanized sneaker',
  },
  {
    id: 'element-zero',
    slug: 'element-zero',
    name: 'Element Zero Prototype',
    edition: 'Concrete Bone // Raw Vachetta',
    price: 38500,
    tag: 'DECONSTRUCTIVIST DECOUPLED SOLE',
    image: '/images/element-zero.jpg',
    alt: 'Element Zero Prototype - Ballistic nylon with decoupled split sole',
  },
  {
    id: 'shadow-high',
    slug: 'shadow-high',
    name: 'Shadow High Archive',
    edition: 'Triple Pitch Black // Oiled Nubuck',
    price: 34999,
    tag: 'CARBON FIBRE TORSION CHASSIS',
    image: '/images/shadow-high.jpg',
    alt: 'Shadow High Archive - Japanese oiled nubuck high top',
  },
  {
    id: 'komorebi-luxe',
    slug: 'komorebi-luxe',
    name: 'Komorebi Luxe Edition',
    edition: 'Indigo Selvedge // Natural Sashiko',
    price: 33000,
    tag: 'ARTISANAL OKAYAMA SASHIKO',
    image: '/images/komorebi-luxe.jpg',
    alt: 'Komorebi Luxe Edition - Okayama selvedge denim court sneaker',
  },
  {
    id: 'meridian-runner',
    slug: 'meridian-runner',
    name: 'Meridian Sculpt Runner',
    edition: 'Glacier Grey // Spacer Mesh',
    price: 32000,
    tag: 'DUAL-DENSITY ARCHITECTURAL CHASSIS',
    image: '/images/meridian-runner.jpg',
    alt: 'Meridian Sculpt Runner - Technical spacer mesh runner',
  },
  {
    id: 'obsidian-low',
    slug: 'obsidian-low',
    name: 'Obsidian Low Prime',
    edition: 'Obsidian Navy // Honey Gum Sole',
    price: 26000,
    tag: 'FRENCH TUMBLED CALFSKIN',
    image: '/images/obsidian-low.jpg',
    alt: 'Obsidian Low Prime - French calfskin with vulcanized honey gum',
  },
  {
    id: 'velocity',
    slug: 'velocity',
    name: 'Velocity Neo Racer',
    edition: 'Volt Citron // Supercritical Foam',
    price: 24500,
    tag: 'KINETIC PROPULSION RACER',
    image: '/images/velocity.jpg',
    alt: 'Velocity Neo Racer - Engineered aerodynamic knit runner',
  },
  {
    id: 'apex-trail-90',
    slug: 'apex-trail-90',
    name: 'Apex Trail 90',
    edition: 'Stone Beige // Cordura 500D & Vibram',
    price: 27500,
    tag: 'ALL-TERRAIN VIBRAM MEGAGRIP',
    image: '/images/apex-trail.jpg',
    alt: 'Apex Trail 90 - Waterproof Cordura with Vibram Megagrip',
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Automatically cycles through all the premium sneakers after a regular interval (3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % PREMIUM_VAULT_SNEAKERS.length);
        setIsTransitioning(false);
      }, 250);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentSneaker = PREMIUM_VAULT_SNEAKERS[currentIndex];

  return (
    <section className="relative bg-white pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-24 border-b border-zinc-200/80 overflow-hidden">
      {/* Subtle architectural ambient backdrop glow */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-[350px] w-[350px] sm:h-[550px] sm:w-[550px] rounded-full bg-zinc-100/70 blur-3xl opacity-70 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          {/* Left Column: Architectural Statement */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1">
            {/* Tag */}
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-zinc-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              <span>COLLECTION 2026 // LIMITED PRODUCTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-zinc-950 uppercase leading-[0.98] mb-4 sm:mb-6">
              ARCHITECTURAL
              <br />
              <span className="text-zinc-500">FOOTWEAR.</span>
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
                id="hero-explore-cta"
                className="inline-flex items-center justify-center gap-2.5 bg-zinc-950 hover:bg-zinc-800 text-white px-7 py-4 text-xs font-mono tracking-[0.2em] uppercase transition-all duration-200 shadow-xs group"
              >
                <span>EXPLORE ALL SNEAKERS [12]</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href={`/sneakers/${currentSneaker.slug}`}
                id="hero-view-details-cta"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-950 text-zinc-950 px-6 py-4 text-xs font-mono tracking-[0.18em] uppercase transition-all duration-200 shadow-xs"
              >
                <span>VIEW DROP DETAILS</span>
              </Link>
            </div>

            {/* Technical Indices */}
            <div className="grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 pt-5 sm:pt-6 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-zinc-600">
              <div className="pr-2 sm:pr-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">12</span>
                <span className="text-zinc-600">SILHOUETTES</span>
              </div>
              <div className="px-2 sm:px-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">500</span>
                <span className="text-zinc-600 truncate block">BATCH LIMIT</span>
              </div>
              <div className="pl-2 sm:pl-4">
                <span className="block text-zinc-950 font-bold text-xs sm:text-sm">100%</span>
                <span className="text-zinc-600 truncate block">CALFSKIN</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heroic Floating Sneaker with Hands-Free Self-Changing Rotation (Zero Grid) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2">
            {/* Upper Silhouette Live Status */}
            <div className="w-full max-w-md flex items-center justify-between mb-2 px-2 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-950 font-bold">
                  {`SILHOUETTE 0${currentIndex + 1} // 0${PREMIUM_VAULT_SNEAKERS.length}`}
                </span>
              </div>
              <span className="text-zinc-600 text-[9px] tracking-wider truncate max-w-[200px] text-right">
                {currentSneaker.tag}
              </span>
            </div>

            {/* Floating Sneaker Showcase Viewport (Zero Grid, 1 Single Hero) */}
            <div className="relative w-full max-w-lg">
              <Link
                href={`/sneakers/${currentSneaker.slug}`}
                className="group relative w-full flex flex-col items-center justify-center cursor-pointer select-none"
              >
                {/* Floating Sneaker Image Container with Smooth Crossfade */}
                <div className="relative w-full h-[240px] sm:h-[390px] lg:h-[460px] flex items-center justify-center">
                  <div
                    className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out ${
                      isTransitioning
                        ? 'opacity-0 scale-95 -translate-y-2'
                        : 'opacity-100 scale-100 translate-y-0'
                    } group-hover:scale-105 group-hover:-translate-y-3`}
                  >
                    <Image
                      src={currentSneaker.image}
                      alt={currentSneaker.alt}
                      fill
                      className="object-contain object-center transition-opacity duration-500"
                      priority
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
                    />
                  </div>
                </div>

                {/* Natural Soft Ground Contact Shadow */}
                <div
                  className={`w-3/4 h-5 sm:h-8 bg-zinc-900/10 rounded-full blur-xl -mt-2 sm:-mt-4 transition-all duration-700 ${
                    isTransitioning ? 'opacity-20 scale-85' : 'opacity-60 scale-100'
                  } group-hover:scale-95 group-hover:opacity-40`}
                />

                {/* Clean Minimalist Product Identifier Below */}
                <div className="mt-4 sm:mt-5 flex items-center justify-between w-full max-w-md px-1 sm:px-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-zinc-950 group-hover:text-zinc-600 transition-colors min-w-0">
                    <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs truncate">
                      {currentSneaker.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest hidden sm:inline truncate max-w-[150px]">
                      {`// ${currentSneaker.edition.split('//')[0]?.trim()}`}
                    </span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 shrink-0" />
                  </div>

                  <div className="flex items-baseline gap-1 font-bold text-zinc-950 shrink-0 ml-2">
                    <span className="text-xs sm:text-sm font-mono">
                      {formatPrice(currentSneaker.price)}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-normal uppercase tracking-wider">
                      INR
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Continuous Hands-Free Progress Indicators for all silhouettes */}
            <div
              className="w-full max-w-md px-2 mt-4 flex items-center gap-1.5"
              role="tablist"
              aria-label="Featured silhouettes"
            >
              {PREMIUM_VAULT_SNEAKERS.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className="flex-1 py-1.5 flex flex-col cursor-pointer focus:outline-none group/indicator"
                  role="tab"
                  aria-selected={idx === currentIndex}
                  aria-label={`Switch to silhouette ${idx + 1}: ${item.name}`}
                >
                  <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden group-hover/indicator:bg-zinc-300 transition-colors">
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
