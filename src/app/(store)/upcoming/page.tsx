import type { Metadata } from 'next';
import { getProducts } from '@/features/products/actions';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Upcoming Drops',
  description: 'Get first access to SneakerDrop upcoming releases. Join the waitlist before they sell out.',
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
    <div className="min-h-screen pt-16">
      <div className="border-b border-border py-16 px-6 lg:px-10 mx-auto max-w-7xl">
        <p className="label-xs text-accent mb-4">Limited Access</p>
        <h1 className="section-heading text-foreground">
          Upcoming
          <br />
          Drops
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          These releases aren&apos;t out yet. Join the waitlist now to secure your spot before they drop.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        {error && (
          <p className="text-muted-foreground text-center py-20">
            Unable to load upcoming releases. Please try again.
          </p>
        )}

        {!error && upcoming.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No upcoming releases at the moment.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Check back soon for the next drop.
            </p>
          </div>
        )}

        {!error && upcoming.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
