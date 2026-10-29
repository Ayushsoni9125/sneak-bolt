import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const formattedPrice = formatPrice(product.price, true);

  return (
    <Link
      href={`/sneakers/${product.slug}`}
      className="group block bg-white border border-zinc-200 transition-all duration-300 hover:border-zinc-950 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      aria-label={`View ${product.name}`}
    >
      {/* Visual Canvas */}
      <div className="relative aspect-square overflow-hidden bg-[#f7f7f8] border-b border-zinc-200/80">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          priority={priority}
        />

        {/* Status Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <AvailabilityBadge availability={product.availability} />
        </div>

        {/* Edition / SKU indicator */}
        <div className="absolute top-3.5 right-3.5 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 border border-zinc-200 text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
          {product.sku || `REF-${product.id.slice(0, 4).toUpperCase()}`}
        </div>
      </div>

      {/* Editorial Content */}
      <div className="p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-bold tracking-tight text-zinc-950 uppercase group-hover:text-zinc-600 transition-colors truncate">
              {product.name}
            </h3>
            <span className="text-sm font-mono font-bold text-zinc-950 shrink-0">
              {formattedPrice}
            </span>
          </div>

          {product.category && (
            <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase mt-1">
              {product.category}
            </p>
          )}

          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mt-2.5 font-sans">
            {product.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono tracking-wider uppercase">
          <span className="text-zinc-400">
            {product.availability === 'available'
              ? 'ALLOCATION OPEN'
              : product.availability === 'upcoming'
              ? 'PRE-REGISTRATION'
              : 'ARCHIVED'}
          </span>
          <span className="text-zinc-950 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
            <span>DISCOVER</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
