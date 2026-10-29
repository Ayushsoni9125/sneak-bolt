import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById, updateProduct } from '@/features/products/actions';
import { ProductForm } from '@/components/admin/ProductForm';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'Edit Product — Admin' };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const action = async (formData: FormData) => {
    'use server';
    return updateProduct(id, formData);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Edit Silhouette</h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">{product.name} ({product.slug})</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-4 sm:p-6 lg:p-8 shadow-xs">
        <ProductForm product={product} onSubmit={action} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
