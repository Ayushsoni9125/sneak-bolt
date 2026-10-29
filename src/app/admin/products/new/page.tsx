import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProduct } from '@/features/products/actions';

export const metadata: Metadata = { title: 'New Product — Admin' };

export default function NewProductPage() {
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
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">New Product</h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">Add a new limited sneaker silhouette to the vault catalogue.</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-4 sm:p-6 lg:p-8 shadow-xs">
        <ProductForm onSubmit={createProduct} submitLabel="Create Product" />
      </div>
    </div>
  );
}
