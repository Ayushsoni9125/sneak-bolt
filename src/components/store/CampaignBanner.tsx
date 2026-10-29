import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, Compass } from 'lucide-react';

export function CampaignBanner() {
  return (
    <section className="py-20 md:py-28 bg-zinc-50 border-y border-zinc-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Campaign Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Compass className="h-3.5 w-3.5 text-amber-600" />
              <span>Editorial Series 04</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight">
              Materials & Craftsmanship
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-xl">
              From Okayama selvedge denim to vegetable-tanned Italian Vachetta. Every silhouette represents an obsession with tactile permanence.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <Award className="h-4 w-4 text-amber-600" />
            <span>Limited Production Verified</span>
          </div>
        </div>

        {/* Asymmetric lookbook grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
          {/* Main Hero Card */}
          <div className="relative lg:col-span-7 overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm group">
            <div className="relative h-[380px] lg:h-full w-full">
              <Image
                src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85"
                alt="Campaign — Obsidian Low Prime"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider text-white inline-block mb-3">
                  STREETWEAR ARCHIVE
                </span>
                <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                  The Obsidian Low
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200 mt-1 max-w-md">
                  Tumbled oiled calfskin with reinforced double-stitch detailing and a natural gum cupsole.
                </p>
                <Link
                  href="/sneakers/obsidian-low"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-amber-400 transition-colors"
                >
                  <span>Explore Design Specs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Upper Card */}
            <div className="relative h-[250px] overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm group">
              <Image
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=85"
                alt="Velocity campaign shot"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  AERODYNAMIC LAB
                </span>
                <p className="text-xl font-black uppercase tracking-tight mt-0.5">
                  Velocity Neo Chassis
                </p>
                <Link
                  href="/sneakers/velocity"
                  className="text-xs font-bold text-zinc-300 hover:text-white mt-1 inline-flex items-center gap-1"
                >
                  View Prototype →
                </Link>
              </div>
            </div>

            {/* Lower Card */}
            <div className="relative h-[250px] overflow-hidden rounded-3xl bg-white border border-zinc-200 shadow-sm group">
              <Image
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=85"
                alt="Shadow High campaign shot"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                  VAULT ARCHIVE
                </span>
                <p className="text-xl font-black uppercase tracking-tight mt-0.5">
                  Shadow High Blackout
                </p>
                <Link
                  href="/sneakers/shadow-high"
                  className="text-xs font-bold text-zinc-300 hover:text-white mt-1 inline-flex items-center gap-1"
                >
                  Join Waitlist →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
