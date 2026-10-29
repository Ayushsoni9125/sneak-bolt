import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, ShoppingBag, Clock, Ban, Users, Plus } from 'lucide-react';
import { getProducts } from '@/features/products/actions';
import { getWaitlistEntries } from '@/features/waitlist/actions';

export const metadata: Metadata = { title: 'Admin Overview' };

export default async function AdminDashboardPage() {
  const [products, waitlistResult] = await Promise.all([
    getProducts().catch(() => []),
    getWaitlistEntries(),
  ]);

  const waitlistCount = waitlistResult.data?.length ?? 0;

  const stats = {
    total: products.length,
    available: products.filter((p) => p.availability === 'available').length,
    sold_out: products.filter((p) => p.availability === 'sold_out').length,
    upcoming: products.filter((p) => p.availability === 'upcoming').length,
    waitlist: waitlistCount,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back. Here&apos;s what&apos;s happening at SneakerDrop.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'text-foreground' },
          { label: 'Available', value: stats.available, icon: ShoppingBag, color: 'text-emerald-400' },
          { label: 'Sold Out', value: stats.sold_out, icon: Ban, color: 'text-red-400' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-amber-400' },
          { label: 'Waitlist', value: stats.waitlist, icon: Users, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="label-xs text-muted-foreground">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              id="admin-new-product"
              className="flex items-center gap-3 px-4 py-3 border border-border hover:border-foreground/30 rounded-sm text-sm text-foreground transition-colors"
            >
              <Plus className="h-4 w-4 text-accent" />
              Add New Product
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 border border-border hover:border-foreground/30 rounded-sm text-sm text-foreground transition-colors"
            >
              <Package className="h-4 w-4 text-muted-foreground" />
              Manage Products
            </Link>
            <Link
              href="/admin/waitlist"
              className="flex items-center gap-3 px-4 py-3 border border-border hover:border-foreground/30 rounded-sm text-sm text-foreground transition-colors"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              View Waitlist ({stats.waitlist})
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="font-semibold text-foreground mb-4">Inventory Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Available', value: stats.available, total: stats.total, color: 'bg-emerald-500' },
              { label: 'Sold Out', value: stats.sold_out, total: stats.total, color: 'bg-red-500' },
              { label: 'Upcoming', value: stats.upcoming, total: stats.total, color: 'bg-amber-500' },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all`}
                    style={{ width: total > 0 ? `${(value / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
