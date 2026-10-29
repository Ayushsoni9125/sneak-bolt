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
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 label-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground text-sm mt-1">{product.name}</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-8">
        <ProductForm product={product} onSubmit={action} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
