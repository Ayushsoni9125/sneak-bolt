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
      className="group block bg-transparent transition-all duration-300 w-full"
      aria-label={`View ${product.name}`}
    >
      {/* Clean Floating Sneaker Canvas - Scales responsively on all screens */}
      <div className="relative aspect-4/3 w-full flex items-center justify-center p-2 sm:p-4">
        {/* Sneaker Image with Smooth Hover Float */}
        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center"
            priority={priority}
          />
        </div>

        {/* Soft Organic Ground Contact Shadow */}
        <div className="absolute bottom-2 sm:bottom-4 inset-x-6 sm:inset-x-8 h-3 sm:h-4 bg-zinc-900/10 rounded-full blur-md -z-10 transition-all duration-500 group-hover:scale-90 group-hover:opacity-40" />

        {/* Status Pill */}
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
          <AvailabilityBadge availability={product.availability} />
        </div>
      </div>

      {/* Clean Editorial Sneaker Details - Seamlessly integrated */}
      <div className="pt-3 sm:pt-4 pb-2 px-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-2 sm:gap-3">
          <h3 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-950 uppercase group-hover:text-zinc-600 transition-colors truncate">
            {product.name}
          </h3>
          <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 shrink-0">
            {formattedPrice}
          </span>
        </div>

        {product.description && (
          <p className="text-[11px] sm:text-xs text-zinc-500 line-clamp-2 mt-1.5 sm:mt-2 leading-relaxed font-sans">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          <span className="truncate">{product.category || 'LUXURY SILHOUETTE'}</span>
          <span className="text-zinc-950 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 font-bold shrink-0 ml-2">
            <span>VIEW</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
