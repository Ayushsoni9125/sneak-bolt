import type { Metadata } from 'next';
import { getProducts } from '@/features/products/actions';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';
import { Clock, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Upcoming Drops — SneakerDrop',
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
    <div className="min-h-screen pt-20 bg-white">
      {/* Header section */}
      <div className="border-b border-zinc-200 bg-zinc-50/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>Priority Drop Access</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 uppercase tracking-tight">
            Upcoming Drops
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-lg">
            These silhouettes are entering production. Register on the waitlist now to receive a private checkout link 1 hour prior to the global public drop.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12">
        {error && (
          <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-200">
            <p className="text-red-800 font-semibold text-sm">
              Unable to load upcoming releases. Showing local preview.
            </p>
          </div>
        )}

        {!error && upcoming.length === 0 && (
          <div className="text-center py-24 bg-zinc-50 rounded-2xl border border-zinc-200">
            <Bell className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
            <p className="text-zinc-900 font-bold text-lg">No upcoming releases at the moment.</p>
            <p className="text-sm text-zinc-500 mt-1">
              Check back soon or follow our newsletter for the next batch announcement.
            </p>
          </div>
        )}

        {!error && upcoming.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcoming.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
