import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/features/products/actions';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';
import { WaitlistForm } from '@/components/forms/WaitlistForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
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
    // fallback to seed slugs
  }
  return [
    { slug: 'court-one' },
    { slug: 'shadow-high' },
    { slug: 'velocity' },
    { slug: 'obsidian-low' },
    { slug: 'meridian-runner' },
    { slug: 'element-zero' },
  ];
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="min-h-screen pt-16">
      {/* Back navigation */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8">
        <Link
          href="/sneakers"
          className="inline-flex items-center gap-2 label-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Collection
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product image */}
          <div className="relative aspect-square overflow-hidden rounded-sm bg-card">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <AvailabilityBadge availability={product.availability} className="mb-4" />
              <h1 className="section-heading text-foreground mb-3">{product.name}</h1>
              <p className="text-3xl font-light text-muted-foreground">
                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="border-t border-border pt-6 mb-8">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Action area */}
            {product.availability === 'available' ? (
              <div>
                <button
                  type="button"
                  id="add-to-cart-btn"
                  className="w-full bg-foreground text-background py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors rounded-sm"
                >
                  Add to Cart
                </button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free shipping on orders over $200
                </p>
              </div>
            ) : (
              <div className="border border-border p-6 rounded-sm">
                <h2 className="font-semibold text-foreground uppercase tracking-wide mb-4">
                  {product.availability === 'sold_out'
                    ? 'Sold Out — Join Waitlist'
                    : 'Dropping Soon — Join Waitlist'}
                </h2>
                <WaitlistForm productId={product.id} productName={product.name} />
              </div>
            )}

            {/* Meta */}
            <dl className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="label-xs text-muted-foreground mb-1">SKU</dt>
                <dd className="text-foreground font-mono">{product.id.slice(0, 8).toUpperCase()}</dd>
              </div>
              <div>
                <dt className="label-xs text-muted-foreground mb-1">Status</dt>
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
