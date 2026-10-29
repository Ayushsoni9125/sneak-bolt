import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/features/products/actions';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';
import { WaitlistForm } from '@/components/forms/WaitlistForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found — SneakerDrop' };
  }

  return {
    title: `${product.name} — SneakerDrop`,
    description: product.description.slice(0, 155),
  };
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    if (products.length > 0) {
      return products.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // fallback
  }
  return [
    { slug: 'court-one' },
    { slug: 'shadow-high' },
    { slug: 'velocity' },
    { slug: 'obsidian-low' },
    { slug: 'meridian-runner' },
    { slug: 'element-zero' },
    { slug: 'apex-trail-90' },
    { slug: 'ghost-knit-retro' },
    { slug: 'komorebi-luxe' },
    { slug: 'stratum-low' },
    { slug: 'vortex-prime' },
    { slug: 'hyperion-high-88' },
  ];
}

const SIZES = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      {/* Back navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 border-b border-zinc-100 mb-8">
        <Link
          href="/sneakers"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Releases</span>
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-200/90 shadow-sm">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute top-5 left-5">
                <AvailabilityBadge availability={product.availability} />
              </div>
            </div>

            {/* Feature highlights bar */}
            <div className="grid grid-cols-3 gap-4 mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Verified Grail</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-zinc-900 shrink-0" />
                <span>Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-zinc-900 shrink-0" />
                <span>14-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
                <Sparkles className="h-3 w-3" />
                <span>VAULT ARCHIVE // BATCH 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl sm:text-4xl font-black text-zinc-950">
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  USD Retail
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-zinc-200 py-6">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Overview & Story
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sizing selector if available */}
            {product.availability === 'available' && (
              <div className="border-t border-zinc-200 py-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Select Size (US Men&apos;s)
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 underline cursor-pointer">
                    Size Guide
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((size, idx) => (
                    <button
                      key={size}
                      type="button"
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        idx === 3
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-400 text-zinc-800 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Action area */}
            <div className="pt-4">
              {product.availability === 'available' ? (
                <div>
                  <button
                    type="button"
                    id="add-to-cart-btn"
                    className="w-full bg-zinc-950 hover:bg-amber-600 text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Add to Bag — ${product.price.toFixed(2)}
                  </button>
                  <p className="text-xs text-zinc-500 text-center mt-3 font-medium">
                    Complimentary worldwide shipping on orders over $200
                  </p>
                </div>
              ) : (
                <div className="border border-zinc-200 bg-zinc-50/80 p-6 rounded-2xl shadow-xs">
                  <h3 className="font-extrabold text-base text-zinc-950 uppercase tracking-tight mb-2">
                    {product.availability === 'sold_out'
                      ? 'Sold Out — Join Vault Waitlist'
                      : 'Upcoming Release — Join Priority Waitlist'}
                  </h3>
                  <WaitlistForm productId={product.id} productName={product.name} />
                </div>
              )}
            </div>

            {/* Specs & Meta */}
            <dl className="mt-8 pt-6 border-t border-zinc-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="font-bold text-zinc-400 uppercase tracking-wider mb-1">SKU Number</dt>
                <dd className="text-zinc-900 font-mono font-bold">{product.id.slice(0, 10).toUpperCase()}</dd>
              </div>
              <div>
                <dt className="font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Status</dt>
                <dd>
                  <AvailabilityBadge availability={product.availability} />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
