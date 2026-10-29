import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-white pt-32 pb-20 lg:pt-40 lg:pb-28 border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Monospace Atelier Tag */}
            <div className="flex items-center gap-3 mb-6 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
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

            <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed mb-10 font-sans">
              A curated vault of serialized court silhouettes, archival high-tops, and experimental prototypes. Each edition is crafted from full-grain Tuscan calfskin with Italian vulcanized rubber cupsoles. Strictly limited production.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <Link
                href="/sneakers"
                id="hero-shop-cta"
                className="inline-flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-800 text-white px-8 py-4 text-xs font-mono tracking-[0.2em] uppercase transition-colors"
              >
                <span>EXPLORE THE VAULT [12]</span>
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

          {/* Right Column: Hero Visual Product Frame */}
          <div className="lg:col-span-5 relative">
            <Link
              href="/sneakers/court-one"
              className="group block relative bg-[#f7f7f8] border border-zinc-200 transition-all duration-300 hover:border-zinc-950"
            >
              {/* Product Status Bar */}
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase">
                <span className="text-zinc-500">FEATURED SILHOUETTE</span>
                <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  AVAILABLE NOW
                </span>
              </div>

              {/* Sneaker Image */}
              <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85"
                  alt="Court One Luxury"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Bottom Meta */}
              <div className="p-5 border-t border-zinc-200 bg-white flex items-baseline justify-between">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-950 uppercase group-hover:text-zinc-600 transition-colors">
                    Court One Luxury
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase mt-0.5">
                    REF: SD-CR01-ITA // Nappa Calfskin
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-zinc-950">
                    $340.00
                  </span>
                  <span className="block text-[9px] font-mono text-zinc-400 tracking-wider">
                    USD
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
