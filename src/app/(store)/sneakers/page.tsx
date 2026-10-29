import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/features/products/actions';
import { ProductCard } from '@/components/products/ProductCard';
import type { Availability, Product } from '@/types';
import { Sparkles, SlidersHorizontal, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Full Sneaker Collection — SneakerDrop',
  description: 'Shop all 12 SneakerDrop releases. In-stock drops, sold-out vault grails, and upcoming limited releases.',
};

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  let products: Product[] = [];
  let error = false;

  try {
    products = await getProducts();
  } catch {
    error = true;
  }

  const availabilityFilters: { key: Availability; label: string }[] = [
    { key: 'available', label: 'Available Now' },
    { key: 'sold_out', label: 'Sold Out Vault' },
    { key: 'upcoming', label: 'Upcoming Drops' },
  ];

  const activeFilter = availabilityFilters.some((f) => f.key === filter)
    ? (filter as Availability)
    : null;

  const filtered = activeFilter
    ? products.filter((p) => p.availability === activeFilter)
    : products;

  const countAvailable = products.filter((p) => p.availability === 'available').length;
  const countSoldOut = products.filter((p) => p.availability === 'sold_out').length;
  const countUpcoming = products.filter((p) => p.availability === 'upcoming').length;

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header section */}
      <div className="border-b border-zinc-200 bg-zinc-50/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DROP ARCHIVE // 2026 EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 uppercase tracking-tight">
            The Sneaker Vault
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-xl">
            {products.length} exclusive silhouettes. Every drop is crafted in numbered batches with premium Italian calfskin, supercritical foam, and verified authenticity.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-zinc-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <Link
              href="/sneakers"
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                !activeFilter
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70'
              }`}
            >
              All Drops ({products.length})
            </Link>

            {availabilityFilters.map(({ key, label }) => {
              const count =
                key === 'available'
                  ? countAvailable
                  : key === 'sold_out'
                  ? countSoldOut
                  : countUpcoming;

              const isSelected = activeFilter === key;

              return (
                <Link
                  key={key}
                  href={`/sneakers?filter=${key}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70'
                  }`}
                >
                  {label} ({count})
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 self-end sm:self-auto">
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
            <span>Showing {filtered.length} of {products.length} releases</span>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-24 bg-red-50/50 rounded-3xl border border-red-200 my-8">
            <p className="text-red-800 font-semibold text-sm">
              Unable to reach live database. Showing local showcase catalog.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!error && filtered.length === 0 && (
          <div className="text-center py-28 bg-zinc-50 rounded-3xl border border-zinc-200 my-8">
            <h3 className="text-xl font-black text-zinc-900 mb-2">No Releases Found</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              There are currently no sneakers matching this filter.
            </p>
            <Link
              href="/sneakers"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase rounded-full hover:bg-amber-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Reset All Filters
            </Link>
          </div>
        )}

        {/* Products grid */}
        {!error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
