import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link
      href={`/sneakers/${product.slug}`}
      className="group block bg-white rounded-2xl border border-zinc-200/80 p-3.5 product-card-hover"
      aria-label={`View ${product.name}`}
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 rounded-xl border border-zinc-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          priority={priority}
        />
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating availability badge */}
        <div className="absolute top-3 left-3 z-10">
          <AvailabilityBadge availability={product.availability} />
        </div>

        {/* Quick action button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <div className="bg-zinc-950 text-white rounded-full p-2 shadow-md hover:bg-amber-600 transition-colors">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-4 px-1 pb-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="text-base font-black text-zinc-950 tracking-tight shrink-0">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mt-1.5">
          {product.description}
        </p>

        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-semibold text-zinc-400">
          <span className="uppercase tracking-widest font-mono">
            REF-{product.id.slice(0, 6).toUpperCase()}
          </span>
          <span className="text-zinc-900 group-hover:text-amber-600 transition-colors flex items-center gap-1">
            View Drop →
          </span>
        </div>
      </div>
    </Link>
  );
}
