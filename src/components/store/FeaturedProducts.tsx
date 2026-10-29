import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Show 6 featured sneakers on homepage
  const featured = products.slice(0, 6);

  return (
    <section className="py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 bg-white">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Curated Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight">
            Featured Releases
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 mt-2 max-w-lg">
            Handpicked icons from our vault. Featuring full-grain leather classics, lightweight runners, and limited collabs.
          </p>
        </div>

        <Link
          href="/sneakers"
          id="featured-view-all"
          className="group inline-flex items-center gap-2.5 text-sm font-bold text-zinc-950 hover:text-amber-600 transition-colors"
        >
          <span>View All {products.length || 12} Drops</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product Grid */}
      {featured.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200">
          <p className="text-zinc-500 font-medium">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i === 0} />
          ))}
        </div>
      )}

      {/* Bottom explore banner */}
      <div className="mt-14 text-center">
        <Link
          href="/sneakers"
          className="inline-flex items-center gap-3 bg-zinc-100 hover:bg-zinc-200/80 text-zinc-950 px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all"
        >
          <span>Browse Complete 12-Pair Catalog</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
