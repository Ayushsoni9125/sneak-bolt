import { WaitlistForm } from '@/components/forms/WaitlistForm';
import type { Product } from '@/types';
import { ShieldCheck } from 'lucide-react';

interface WaitlistCTAProps {
  products: Product[];
}

export function WaitlistCTA({ products }: WaitlistCTAProps) {
  const target =
    products.find((p) => p.availability === 'upcoming') ??
    products.find((p) => p.availability === 'sold_out') ??
    products[0];

  if (!target) return null;

  return (
    <section className="py-20 md:py-28 bg-[#fafafa] border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="bg-white border border-zinc-200 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-3">
                <span>EXCLUSIVE ACCESS</span>
                <span>{'//'}</span>
                <span>SERIAL ALLOCATIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight mb-4 leading-tight">
                PRIORITY ALLOCATION
                <br />
                NOTIFICATIONS.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-lg mb-8 font-sans">
                Each silhouette edition is capped at 500 numbered units worldwide. Receive encrypted private allocation links 15 minutes before public drop windows.
              </p>

              <div className="flex items-center gap-6 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-zinc-900" />
                  <span>PRIVATE LEDGER ONLY</span>
                </div>
                <span>• NO THIRD-PARTY SPAM</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-zinc-50 border border-zinc-200 p-6 sm:p-8">
              <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1">
                CURRENT ALLOCATION TARGET
              </p>
              <h3 className="text-base sm:text-lg font-black uppercase text-zinc-950 tracking-tight mb-4">
                {target.name}
              </h3>
              <WaitlistForm productId={target.id} productName={target.name} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
