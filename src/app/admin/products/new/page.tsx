import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProduct } from '@/features/products/actions';

export const metadata: Metadata = { title: 'New Product — Admin' };

export default function NewProductPage() {
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
        <h1 className="text-2xl font-bold text-foreground tracking-tight">New Product</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new sneaker to the catalogue.</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-8">
        <ProductForm onSubmit={createProduct} submitLabel="Create Product" />
      </div>
    </div>
  );
}
