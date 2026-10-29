import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Bell } from 'lucide-react';
import type { Product } from '@/types';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';

interface UpcomingDropsProps {
  products: Product[];
}

export function UpcomingDrops({ products }: UpcomingDropsProps) {
  const upcoming = products.filter((p) => p.availability === 'upcoming');
  if (upcoming.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-white border-t border-zinc-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>Priority Drop Schedule</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight">
              Upcoming Drops
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 mt-2 max-w-md">
              Limited to 250 - 500 numbered pairs worldwide. Join the waitlist before registration closes.
            </p>
          </div>

          <Link
            href="/upcoming"
            className="group inline-flex items-center gap-2 text-sm font-bold text-zinc-950 hover:text-amber-600 transition-colors"
          >
            <span>View All Upcoming Releases</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcoming.map((product, i) => (
            <Link
              key={product.id}
              href={`/sneakers/${product.slug}`}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 sm:p-6 bg-zinc-50/70 hover:bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              {/* Image thumbnail */}
              <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-white border border-zinc-100">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="150px"
                />
              </div>

              {/* Shoe Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <AvailabilityBadge availability={product.availability} />
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    BATCH #{i + 1}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 group-hover:text-amber-600 transition-colors truncate">
                  {product.name}
                </h3>

                <p className="text-xs text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-black text-zinc-950">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full group-hover:bg-amber-100 transition-colors">
                    <Bell className="h-3 w-3" />
                    Join Waitlist
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
