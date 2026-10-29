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
      className="group block product-card-hover"
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-card rounded-sm">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        <div className="absolute bottom-3 left-3">
          <AvailabilityBadge availability={product.availability} />
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          <div className="bg-foreground text-background rounded-full p-1.5">
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm tracking-wide uppercase text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <span className="text-sm font-medium text-muted-foreground shrink-0">
            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>
    </Link>
  );
}
