import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';

interface UpcomingDropsProps {
  products: Product[];
}

export function UpcomingDrops({ products }: UpcomingDropsProps) {
  const upcoming = products.filter((p) => p.availability === 'upcoming');
  if (upcoming.length === 0) return null;

  return (
    <section className="py-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14">
          <p className="label-xs text-accent mb-3">Dropping Soon</p>
          <h2 className="section-heading text-foreground">
            Upcoming
            <br />
            Releases
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcoming.map((product, i) => (
            <Link
              key={product.id}
              href={`/sneakers/${product.slug}`}
              className="group relative flex gap-6 p-6 border border-border hover:border-foreground/30 transition-all duration-300 rounded-sm overflow-hidden"
            >
              {/* Number */}
              <span className="label-xs text-muted-foreground/30 absolute top-4 right-6 text-4xl font-black">
                0{i + 1}
              </span>

              {/* Image */}
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-sm bg-background">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="112px"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between py-1">
                <div>
                  <AvailabilityBadge availability={product.availability} className="mb-3" />
                  <h3 className="font-bold uppercase tracking-wide text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <p className="label-xs text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                  Join Waitlist <ArrowUpRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
