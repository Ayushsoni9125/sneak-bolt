'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';
import { WaitlistForm } from '@/components/forms/WaitlistForm';
import { formatPrice } from '@/lib/utils';

interface Props {
  product: Product;
}

const SIZE_SYSTEMS = ['US', 'EU', 'UK'] as const;
type SizeSystem = (typeof SIZE_SYSTEMS)[number];

const SIZES_DATA: Record<SizeSystem, string[]> = {
  US: ['7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '12.0', '13.0'],
  EU: ['40.0', '40.5', '41.0', '42.0', '42.5', '43.0', '44.0', '44.5', '45.0', '46.0', '47.0'],
  UK: ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '11.0', '12.0'],
};

export function ProductViewInteractive({ product }: Props) {
  const { addItem } = useCart();
  const [selectedAngle, setSelectedAngle] = useState(0);
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>('US');
  const [selectedSize, setSelectedSize] = useState<string>('9.5');
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Gallery angles
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image_url];

  // Observe scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const ctaEl = document.getElementById('main-add-to-cart-container');
      if (ctaEl) {
        const rect = ctaEl.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image_url: product.image_url,
      size: `${sizeSystem} ${selectedSize}`,
      colorway: product.colorway,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Photorealistic Visual Showcase */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Main Visual Stage - Clean Floating Sneaker Canvas (Zero grid border) */}
          <div className="relative aspect-square w-full bg-white flex items-center justify-center group overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center p-8 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2">
              <Image
                src={gallery[selectedAngle] || product.image_url}
                alt={`${product.name} view ${selectedAngle + 1}`}
                fill
                className="object-contain object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {/* Natural Contact Drop Shadow */}
            <div className="absolute bottom-6 inset-x-12 h-6 bg-zinc-900/10 rounded-full blur-xl -z-10 group-hover:scale-95 group-hover:opacity-50 transition-all duration-700" />

            <div className="absolute top-4 left-4 z-10">
              <AvailabilityBadge availability={product.availability} />
            </div>

            <div className="absolute top-4 right-4 z-10 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              {product.sku || 'REF: ARCHIVE'}
            </div>
          </div>

          {/* Multi-angle Thumbnails Filmstrip */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setSelectedAngle(idx)}
                  className={`relative w-20 h-20 bg-white transition-all duration-200 overflow-hidden ${
                    selectedAngle === idx
                      ? 'border-b-2 border-zinc-950 scale-105'
                      : 'border-b border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Switch to angle view ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-contain object-center p-1"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}


          {/* Minimalist Authenticity Bar */}
          <div className="grid grid-cols-3 divide-x divide-zinc-200 border border-zinc-200 py-3 px-2 bg-zinc-50/50 text-[11px] font-mono tracking-wider text-zinc-600 mt-2">
            <div className="flex items-center justify-center gap-2 px-2 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-900 shrink-0" />
              <span>NFC VERIFIED</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 text-center">
              <Truck className="h-3.5 w-3.5 text-zinc-900 shrink-0" />
              <span>DHL EXPRESS</span>
            </div>
            <div className="flex items-center justify-center gap-2 px-2 text-center">
              <RotateCcw className="h-3.5 w-3.5 text-zinc-900 shrink-0" />
              <span>14-DAY VAULT RETURN</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Product Information & Size Atelier */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Header */}
          <div className="border-b border-zinc-200 pb-6 mb-6">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                {product.category || 'VAULT SILHOUETTE'}
              </span>
              {product.stock_count && product.stock_count > 0 && (
                <span className="text-[10px] font-mono tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase">
                  {product.stock_count} PAIRS ALLOCATED
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase leading-none">
              {product.name}
            </h1>

            {product.colorway && (
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-2">
                COLORWAY: {product.colorway}
              </p>
            )}

            {/* Price in Rupees (₹) */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono">
                {formatPrice(product.price, true)}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                INR // INCL. ALL TAXES
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 font-sans">
            {product.description}
          </p>

          {/* Availability Specific Action Block */}
          {product.availability === 'available' ? (
            <div id="main-add-to-cart-container" className="space-y-6">
              {/* Size Selector System Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-950 font-bold">
                    SELECT SIZE
                  </span>

                  {/* System Toggle (US / EU / UK) */}
                  <div className="flex border border-zinc-200 divide-x divide-zinc-200 text-[10px] font-mono">
                    {SIZE_SYSTEMS.map((sys) => (
                      <button
                        key={sys}
                        onClick={() => setSizeSystem(sys)}
                        className={`px-2.5 py-1 transition-colors ${
                          sizeSystem === sys
                            ? 'bg-zinc-950 text-white font-bold'
                            : 'bg-white text-zinc-500 hover:text-zinc-950'
                        }`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Grid Tiles */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {SIZES_DATA[sizeSystem].map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`py-3 text-center border text-xs font-mono transition-all duration-150 ${
                          isSelected
                            ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs'
                            : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {sizeError && (
                  <p className="text-[11px] font-mono text-red-600 mt-2">
                    * Please choose a size to proceed with allocation.
                  </p>
                )}
              </div>

              {/* Add to Cart CTA with Rupees */}
              <button
                onClick={handleAddToCart}
                id="add-to-cart-btn"
                className={`w-full py-4 text-xs font-mono uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all duration-200 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-950 hover:bg-zinc-800 text-white shadow-sm'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>ADDED TO CART</span>
                  </>
                ) : (
                  <>
                    <span>
                      ADD TO CART • {formatPrice(product.price)}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          ) : product.availability === 'upcoming' ? (
            <div className="p-5 border border-zinc-200 bg-zinc-50 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>UPCOMING DROP // REGISTRATION OPEN</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                This silhouette is currently in pre-production transit. Register your email below to receive an encrypted 15-minute priority checkout link before the public allocation.
              </p>
              <WaitlistForm productId={product.id} productName={product.name} />
            </div>
          ) : (
            <div className="p-5 border border-zinc-200 bg-zinc-50 space-y-3">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                ARCHIVED // SOLD OUT
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All serialized pairs for this edition have been allocated to collectors worldwide. You may register for future archival restock reissues.
              </p>
              <WaitlistForm productId={product.id} productName={product.name} />
            </div>
          )}

          {/* Accordion Details */}
          <div className="border-t border-zinc-200 mt-8 divide-y divide-zinc-200">
            {/* Accordion 1: Craftsmanship & Materials */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('materials')}
                className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-[0.18em] text-zinc-950 font-bold py-1"
              >
                <span>01 / CRAFTSMANSHIP & MATERIALS</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    openAccordion === 'materials' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'materials' && (
                <div className="pt-3 pb-2 text-xs text-zinc-600 leading-relaxed space-y-2">
                  <p>
                    <strong className="text-zinc-950 font-medium">Upper Construction:</strong>{' '}
                    {product.materials || 'Full-grain Italian calfskin with hand-buffed wax edges and Strobel flexibility.'}
                  </p>
                  <p>
                    <strong className="text-zinc-950 font-medium">Outsole:</strong> Margom vulcanised rubber cupsole with custom herringbone traction tread for maximum durability.
                  </p>
                  <p>
                    <strong className="text-zinc-950 font-medium">Origin:</strong> Handcrafted by generational master cobblers in Civitanova Marche, Italy.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 2: Sizing & Fit */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('sizing')}
                className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-[0.18em] text-zinc-950 font-bold py-1"
              >
                <span>02 / SIZING & FIT RECOMMENDATIONS</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    openAccordion === 'sizing' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'sizing' && (
                <div className="pt-3 pb-2 text-xs text-zinc-600 leading-relaxed space-y-2">
                  <p>
                    Fits true to European and US sneaker sizing. We recommend taking your standard size in luxury court shoes. If you are between sizes, we recommend sizing up to the nearest whole size.
                  </p>
                </div>
              )}
            </div>

            {/* Accordion 3: Logistics & Collector Packaging */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-[0.18em] text-zinc-950 font-bold py-1"
              >
                <span>03 / COMPLIMENTARY EXPRESS & RETURNS</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-3 pb-2 text-xs text-zinc-600 leading-relaxed space-y-2">
                  <p>
                    Every pair is packaged in a magnetic-closure heavyweight presentation box with dual dust bags, replacement tonal laces, and cryptographic physical NFC authenticity card.
                  </p>
                  <p>
                    Dispatched within 24 hours via DHL Express Worldwide. Complimentary returns and exchanges within 14 days of delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky At-A-Glance Bar (when scrolled past CTA) */}
      {showStickyBar && product.availability === 'available' && (
        <aside
          aria-label="Quick order bar"
          className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-3 px-4 sm:px-8 shadow-lg animate-in slide-in-from-bottom duration-200"
        >
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain object-center"
                  sizes="40px"
                />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-zinc-950 truncate tracking-tight uppercase">
                  {product.name}
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {sizeSystem} {selectedSize} • {formatPrice(product.price, true)} INR
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                id="sticky-add-to-cart-btn"
                className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono uppercase tracking-[0.2em] transition-colors"
              >
                {isAdded ? 'ADDED TO CART' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
