'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const formattedPrice = formatPrice(product.price, true);
  const { addItem, requireAuth } = useCart();
  const pathname = usePathname();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Route protection: unsigned users cannot add to cart and are redirected to sign in
    if (!requireAuth(pathname || `/sneakers/${product.slug}`)) {
      return;
    }

    const added = addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image_url: product.image_url,
        size: 'US 9.5',
        colorway: product.colorway,
        quantity: 1,
      },
      false
    );

    if (added) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <div className="group block bg-transparent transition-all duration-300 w-full flex flex-col justify-between">
      {/* Clickable Sneaker Card Details Link */}
      <Link
        href={`/sneakers/${product.slug}`}
        className="block w-full focus:outline-none"
      >
        {/* Clean Floating Sneaker Canvas */}
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

        {/* Sneaker Details */}
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

          <div className="flex items-center justify-between mt-2 text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="truncate">{product.category || 'LUXURY SILHOUETTE'}</span>
            <span className="text-zinc-950 flex items-center gap-1 font-bold shrink-0 ml-2">
              <span>DETAILS</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* Action / Add to Cart Button */}
      <div className="pt-2 px-1">
        {product.availability === 'available' ? (
          <button
            type="button"
            onClick={handleQuickAddToCart}
            className={`w-full py-2.5 px-3 border text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                : 'bg-zinc-950 hover:bg-zinc-800 text-white border-zinc-950 shadow-xs'
            }`}
            aria-label={
              isAdded
                ? `Added to cart: ${product.name}`
                : `Add to cart: ${product.name}`
            }
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>ADDED TO CART</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        ) : product.availability === 'upcoming' ? (
          <Link
            href={`/sneakers/${product.slug}`}
            className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors text-center"
          >
            <span>JOIN WAITLIST</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <div className="w-full py-2.5 px-3 bg-zinc-100 border border-zinc-200 text-zinc-500 text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 text-center select-none">
            <span>ARCHIVED</span>
          </div>
        )}
      </div>
    </div>
  );
}
