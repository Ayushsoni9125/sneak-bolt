import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Show first 6 sneakers
  const featured = products.slice(0, 6);

  return (
    <section className="py-20 md:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 bg-white">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
            <span>INDEX 01</span>
            <span>{'//'}</span>
            <span>ACTIVE VAULT ALLOCATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
            CURATED SILHOUETTES
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-lg font-sans">
            Serialized editions handcrafted from Italian calfskin, archival Japanese nubuck, and aerodynamic supercritical foams.
          </p>
        </div>

        <Link
          href="/sneakers"
          id="featured-view-all"
          className="group inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-zinc-950 uppercase hover:text-zinc-600 transition-colors pb-1"
        >
          <span>VIEW ALL [{products.length || 12}]</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product Grid */}
      {featured.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 text-xs font-mono uppercase tracking-widest text-zinc-400">
          No silhouettes currently listed in vault.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 lg:gap-x-14 lg:gap-y-20">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i === 0} />
          ))}
        </div>
      )}

      {/* Bottom Explore Trigger */}
      <div className="mt-16 text-center border-t border-zinc-200 pt-10">
        <Link
          href="/sneakers"
          className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono tracking-[0.25em] uppercase transition-colors"
        >
          <span>BROWSE COMPLETE 12-SILHOUETTE VAULT</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
