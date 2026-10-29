import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/features/products/actions';
import { ProductViewInteractive } from '@/components/products/ProductViewInteractive';
import { ProductCard } from '@/components/products/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Silhouette Not Found — SneakerDrop' };
  }

  return {
    title: `${product.name} — SneakerDrop Atelier Archive`,
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

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-white">
      {/* Back Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-5 border-b border-zinc-200 mb-10">
        <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase">
          <Link
            href="/sneakers"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO VAULT</span>
          </Link>

          <span className="text-zinc-400 hidden sm:inline">
            EDITION: 2026 ARCHIVE
          </span>
        </div>
      </div>

      {/* Main Interactive Product Showcase */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <ProductViewInteractive product={product} />

        {/* Related Silhouettes Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-zinc-200">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-1">
                  PARALLEL EDITIONS
                </p>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 uppercase">
                  SIMILAR ARCHIVAL SILHOUETTES
                </h2>
              </div>

              <Link
                href="/sneakers"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                <span>VIEW COMPLETE VAULT</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
