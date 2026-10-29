import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProducts } from '@/features/products/actions';
import { AdminProductTable } from '@/components/admin/AdminProductTable';

export const metadata: Metadata = { title: 'Products — Admin' };

export default async function AdminProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Catalogue Products</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">{products.length} registered drop silhouettes</p>
        </div>
        <Link
          href="/admin/products/new"
          id="admin-products-new"
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-colors rounded-sm shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Product</span>
        </Link>
      </div>

      <AdminProductTable products={products} />
    </div>
  );
}
