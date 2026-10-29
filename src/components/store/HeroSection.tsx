import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-zinc-200/80">
      {/* Subtle radial luxury glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-amber-100/40 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-zinc-100/70 blur-3xl opacity-80 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold tracking-wide mb-6 w-fit animate-fade-in">
              <Flame className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
              <span>SPRING 2026 DROP ARCHIVE — 12 LIMITED SILHOUETTES</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 uppercase leading-[1.02] mb-6">
              ENGINEERED
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-zinc-800 to-amber-600">
                TO LEAD.
              </span>
              <br />
              BUILT TO LAST.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed mb-8">
              Explore our curated showcase of archival grails, limited production court silhouettes, and futuristic prototypes. Every pair is verified for authenticity and strictly capped.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href="/sneakers"
                id="hero-shop-cta"
                className="group inline-flex items-center justify-center gap-3 bg-zinc-950 hover:bg-amber-600 text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Explore All 12 Releases</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/upcoming"
                id="hero-upcoming-cta"
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-900 px-7 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 hover:border-zinc-400"
              >
                <Zap className="h-4 w-4 text-amber-600" />
                <span>Upcoming Waitlist</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-200 text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Limited Batches</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-zinc-900 shrink-0" />
                <span>Global Express</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative card */}
              <div className="relative rounded-3xl bg-zinc-50 p-4 border border-zinc-200/90 shadow-xl shadow-zinc-900/5">
                {/* Floating pill: Next Drop */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-900">
                    FEATURED RELEASE
                  </span>
                </div>

                {/* Sneaker Image Frame */}
                <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-200/60 flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=85"
                    alt="Court One Luxury Edition"
                    fill
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-4 px-2 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        In Stock • US 7 - 13
                      </p>
                      <h3 className="text-xl font-extrabold text-zinc-950 tracking-tight mt-0.5">
                        Court One Luxury
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400 font-medium">Retail</p>
                      <p className="text-xl font-black text-zinc-950">$195.00</p>
                    </div>
                  </div>

                  <Link
                    href="/sneakers/court-one"
                    className="mt-4 w-full py-3 bg-zinc-950 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Shoe Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="mt-14 lg:mt-20 border-y border-zinc-200 bg-zinc-50 py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-8 text-xs font-black tracking-widest uppercase text-zinc-600 shrink-0 pr-8">
              <span>✦ 100% VERIFIED AUTHENTIC</span>
              <span>✦ WORLDWIDE EXPRESS DISPATCH</span>
              <span>✦ 12 CURATED SILHOUETTES</span>
              <span>✦ ITALIAN FULL-GRAIN LEATHER</span>
              <span>✦ LIMITED RUN ARCHIVE 2026</span>
              <span>✦ SECURE ESCROW PROTECTION</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
