import { WaitlistForm } from '@/components/forms/WaitlistForm';
import type { Product } from '@/types';
import { ShieldCheck, Flame } from 'lucide-react';

interface WaitlistCTAProps {
  products: Product[];
}

export function WaitlistCTA({ products }: WaitlistCTAProps) {
  // Pick an upcoming or sold-out product for the homepage CTA
  const target =
    products.find((p) => p.availability === 'upcoming') ??
    products.find((p) => p.availability === 'sold_out') ??
    products[0];

  if (!target) return null;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="bg-white rounded-3xl border border-zinc-200/90 p-8 sm:p-12 lg:p-16 shadow-xl shadow-zinc-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold tracking-wide mb-4">
                <Flame className="h-3.5 w-3.5 text-amber-600" />
                <span>LIMITED RUN ACCESS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight mb-4">
                Never Miss
                <br />
                A Vault Drop.
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-lg mb-6">
                Most drops sell out under 3 minutes. Enter your email to receive direct private links, size reservations, and early access codes before each public launch.
              </p>

              <div className="flex items-center gap-6 text-xs font-semibold text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>No Spam, Only Drops</span>
                </div>
                <div>✦ Instant One-Click Unsubscribe</div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-zinc-50/80 p-6 sm:p-8 rounded-2xl border border-zinc-200">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Currently Featured Reservation
              </p>
              <h3 className="text-xl font-black text-zinc-950 mb-4">
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
