import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProducts } from '@/features/products/actions';
import { AdminProductTable } from '@/components/admin/AdminProductTable';

export const metadata: Metadata = { title: 'Products — Admin' };

export default async function AdminProductsPage() {
  const products = await getProducts().catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} total</p>
        </div>
        <Link
          href="/admin/products/new"
          id="admin-products-new"
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors rounded-sm"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      <AdminProductTable products={products} />
    </div>
  );
}
