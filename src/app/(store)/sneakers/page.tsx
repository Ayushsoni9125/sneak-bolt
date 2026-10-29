import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/features/products/actions';
import { ProductCard } from '@/components/products/ProductCard';
import type { Availability, Product } from '@/types';

export const metadata: Metadata = {
  title: 'Collection',
  description: 'Shop all SneakerDrop releases. Available, sold-out, and upcoming sneakers.',
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

  const availabilityFilters: Availability[] = ['available', 'sold_out', 'upcoming'];
  const activeFilter = availabilityFilters.includes(filter as Availability)
    ? (filter as Availability)
    : null;

  const filtered = activeFilter
    ? products.filter((p) => p.availability === activeFilter)
    : products;

  return (
    <div className="min-h-screen pt-16">
      {/* Page header */}
      <div className="border-b border-border py-16 px-6 lg:px-10 mx-auto max-w-7xl">
        <p className="label-xs text-accent mb-4">The Full Edit</p>
        <h1 className="section-heading text-foreground">Collection</h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          {products.length} release{products.length !== 1 ? 's' : ''} · From archive to upcoming drops.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Link
            href="/sneakers"
            className={`label-xs px-4 py-2 rounded-sm border transition-colors ${
              !activeFilter
                ? 'border-foreground/50 text-foreground bg-foreground/5'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            All
          </Link>
          {availabilityFilters.map((f) => (
            <Link
              key={f}
              href={`/sneakers?filter=${f}`}
              className={`label-xs px-4 py-2 rounded-sm border transition-colors ${
                activeFilter === f
                  ? 'border-foreground/50 text-foreground bg-foreground/5'
                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
              }`}
            >
              {f === 'sold_out' ? 'Sold Out' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Link>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-24">
            <p className="text-muted-foreground">
              Unable to load products at the moment. Please try again shortly.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!error && filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground">No products found for this filter.</p>
            <Link href="/sneakers" className="label-xs text-accent mt-4 inline-block">
              Clear filter →
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
