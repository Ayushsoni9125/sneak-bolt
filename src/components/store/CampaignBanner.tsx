import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CampaignBanner() {
  return (
    <section className="py-20 md:py-28 bg-[#fafafa] border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Campaign Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              <span>EDITORIAL</span>
              <span>{'//'}</span>
              <span>PROVENANCE & ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              MATERIALS OBSESSION
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-xl font-sans">
              From 14oz Okayama selvedge denim to vegetable-tanned Tuscan Vachetta. Every silhouette represents an uncompromising focus on tactile permanence.
            </p>
          </div>

          <div className="text-[11px] font-mono tracking-widest uppercase text-zinc-500">
            FLORENCE • OKAYAMA • CIVITANOVA
          </div>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Hero Lookbook */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 group flex flex-col justify-between">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span>PROVENANCE STUDY 01</span>
              <span>TUSCAN OILED CALFSKIN</span>
            </div>

            <div className="relative aspect-16/10 w-full overflow-hidden bg-white flex items-center justify-center p-6">
              <Image
                src="/images/obsidian-low.jpg"
                alt="Obsidian Low Prime Study"
                fill
                className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black uppercase text-zinc-950 tracking-tight">
                  The Obsidian Low Prime
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-md font-sans">
                  Double-needle seam reinforcement over an artisan natural gum rubber cupsole.
                </p>
              </div>

              <Link
                href="/sneakers/obsidian-low"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-zinc-950 hover:text-zinc-600 transition-colors shrink-0"
              >
                <span>SPECIFICATIONS</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Right Editorial Story Cards */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {/* Story 1 */}
            <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
                  <span>CRAFTSMANSHIP NOTE</span>
                  <span>MARGOM CUPSOLE</span>
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-zinc-950">
                  Vulcanized Italian Rubber
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed mt-2 font-sans">
                  Poured and vulcanized in Civitanova Marche since 1952. Provides 300% more abrasion resistance than standard compressed EVA foam soles.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                GUARANTEED RE-SOLEABLE LIFETIME SERVICE
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
                  <span>AUTHENTICITY LEDGER</span>
                  <span>ENCRYPTED NFC</span>
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-zinc-950">
                  Cryptographic Tangible Verification
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed mt-2 font-sans">
                  Tap any NFC-enabled smartphone to the interior tongue label to verify digital provenance, batch serial number, and collector registration.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                ZERO REPLICAS TOLERANCE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
