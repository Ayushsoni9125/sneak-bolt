import type { Metadata } from 'next';
import { getProducts } from '@/features/products/actions';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Release Calendar — SneakerDrop Archive',
  description: 'Priority pre-registration for upcoming SneakerDrop releases. Access private checkout links before public launch.',
};

export default async function UpcomingPage() {
  let products: Product[] = [];
  let error = false;

  try {
    products = await getProducts();
  } catch {
    error = true;
  }

  const upcoming = products.filter((p) => p.availability === 'upcoming');

  return (
    <div className="min-h-screen pt-24 bg-white">
      {/* Header section */}
      <div className="border-b border-zinc-200 bg-[#fafafa] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-3">
            <span>SCHEDULE</span>
            <span>{'//'}</span>
            <span>CALENDAR 2026</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-zinc-950 uppercase tracking-tight leading-none">
            RELEASE CALENDAR
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-3 max-w-lg font-sans">
            These silhouettes are completing final craftsmanship finishing. Register your email on each silhouette to receive an encrypted 15-minute checkout allocation prior to general release.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12">
        {error ? (
          <div className="p-12 text-center border border-zinc-200 text-xs font-mono uppercase tracking-widest text-zinc-400">
            Unable to load release schedule.
          </div>
        ) : upcoming.length === 0 ? (
          <div className="p-16 text-center border border-zinc-200 text-xs font-mono uppercase tracking-widest text-zinc-400">
            NO UPCOMING SILHOUETTES AT THIS TIME
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {upcoming.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
