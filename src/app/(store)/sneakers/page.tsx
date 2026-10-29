import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/features/products/actions';
import { ProductCard } from '@/components/products/ProductCard';
import type { Availability, Product } from '@/types';

export const metadata: Metadata = {
  title: 'Vault Catalogue — SneakerDrop Archive',
  description: 'Explore all 12 serialized SneakerDrop silhouettes. In-stock drops, sold-out vault grails, and upcoming limited releases.',
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
    { key: 'available', label: 'AVAILABLE NOW' },
    { key: 'upcoming', label: 'PRE-REGISTRATION' },
    { key: 'sold_out', label: 'ARCHIVE / SOLD' },
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
    <div className="min-h-screen pt-24 bg-white">
      {/* Header section */}
      <div className="border-b border-zinc-200 bg-[#fafafa] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-3">
            <span>DIRECTORY</span>
            <span>{'//'}</span>
            <span>VAULT CATALOGUE 2026</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-zinc-950 uppercase tracking-tight leading-none">
            THE ARCHIVAL VAULT
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-3 max-w-xl font-sans">
            {products.length} limited-production silhouettes. Handcrafted with Italian tanneries, vulcanized Margom cupsoles, and serialized NFC authenticity ledger tags.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-10 border-b border-zinc-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none text-xs font-mono tracking-widest">
            <Link
              href="/sneakers"
              className={`px-4 py-2 border transition-all ${
                !activeFilter
                  ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950'
              }`}
            >
              ALL [{products.length}]
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
                  className={`px-4 py-2 border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950 font-bold'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-950 hover:text-zinc-950'
                  }`}
                >
                  {label} [{count}]
                </Link>
              );
            })}
          </div>

          <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            DISPLAYING {filtered.length} OF {products.length} SILHOUETTES
          </div>
        </div>

        {/* Product Grid */}
        {error ? (
          <div className="p-12 text-center border border-zinc-200 text-xs font-mono uppercase tracking-widest text-zinc-400">
            Error accessing vault index. Please reload session.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center border border-zinc-200">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              NO SILHOUETTES MATCHING SELECTED CRITERIA
            </p>
            <Link
              href="/sneakers"
              className="mt-4 inline-block px-6 py-2.5 bg-zinc-950 text-white text-xs font-mono uppercase tracking-widest"
            >
              RESET DIRECTORY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
