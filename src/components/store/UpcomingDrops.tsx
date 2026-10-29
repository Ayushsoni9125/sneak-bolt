import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';
import { formatPrice } from '@/lib/utils';

interface UpcomingDropsProps {
  products: Product[];
}

export function UpcomingDrops({ products }: UpcomingDropsProps) {
  const upcoming = products.filter((p) => p.availability === 'upcoming');
  if (upcoming.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              <span>INDEX 02</span>
              <span>{'//'}</span>
              <span>CALENDAR & PRE-REGISTRATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              UPCOMING RELEASES
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md font-sans">
              Limited to 250 - 500 numbered pairs worldwide. Pre-register for priority private checkout windows.
            </p>
          </div>

          <Link
            href="/upcoming"
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-zinc-950 uppercase hover:text-zinc-600 transition-colors pb-1"
          >
            <span>FULL CALENDAR</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {upcoming.map((product) => (
            <Link
              key={product.id}
              href={`/sneakers/${product.slug}`}
              className="group flex flex-col sm:flex-row items-center gap-6 bg-white transition-all duration-300"
            >
              {/* Floating Image Canvas - Zero box borders */}
              <div className="relative w-full sm:w-56 h-48 shrink-0 flex items-center justify-center p-2">
                <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                </div>
                {/* Soft ground shadow */}
                <div className="absolute bottom-2 inset-x-6 h-3 bg-zinc-900/10 rounded-full blur-sm -z-10 group-hover:scale-95 group-hover:opacity-40 transition-all duration-500" />
              </div>

              {/* Shoe Info */}
              <div className="flex-1 w-full flex flex-col justify-between py-2">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <AvailabilityBadge availability={product.availability} />
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      {product.sku || 'PRE-DROP'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold uppercase tracking-tight text-zinc-950 group-hover:text-zinc-600 transition-colors">
                    {product.name}
                  </h3>

                  {product.colorway && (
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">
                      {product.colorway}
                    </p>
                  )}

                  <p className="text-xs text-zinc-500 line-clamp-2 mt-2 font-sans">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono tracking-wider">
                  <span className="font-bold text-zinc-950">
                    {formatPrice(product.price, true)} INR
                  </span>
                  <span className="text-zinc-950 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                    <span>WAITLIST</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
