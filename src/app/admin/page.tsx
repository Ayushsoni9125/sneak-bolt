import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, ShoppingBag, Clock, Ban, Users, Plus, TrendingUp, ArrowRight } from 'lucide-react';
import { getProducts } from '@/features/products/actions';
import { getWaitlistEntries } from '@/features/waitlist/actions';
import { getAdminOrders } from '@/features/orders/actions';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admin Overview' };

export default async function AdminDashboardPage() {
  const [products, waitlistResult, orders] = await Promise.all([
    getProducts().catch(() => []),
    getWaitlistEntries(),
    getAdminOrders().catch(() => []),
  ]);

  const waitlistCount = waitlistResult.data?.length ?? 0;
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);

  const stats = {
    total: products.length,
    available: products.filter((p) => p.availability === 'available').length,
    sold_out: products.filter((p) => p.availability === 'sold_out').length,
    upcoming: products.filter((p) => p.availability === 'upcoming').length,
    waitlist: waitlistCount,
    orders: orders.length,
    revenue: totalRevenue,
  };

  const recentOrders = orders.slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back. Real-time platform overview and operational intelligence.
        </p>
      </div>

      {/* Top metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">Total Revenue</p>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-emerald-400 font-mono">
            {formatPrice(stats.revenue)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Platform gross merchandise volume</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">User Orders</p>
            <ShoppingBag className="h-4 w-4 text-foreground" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-foreground font-mono">{stats.orders}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Acquisitions by collectors</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">Catalogue Size</p>
            <Package className="h-4 w-4 text-foreground" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-foreground font-mono">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground mt-1">{stats.available} currently available</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">Waitlist Requests</p>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-blue-400 font-mono">{stats.waitlist}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Submissions for upcoming drops</p>
        </div>
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Available', value: stats.available, icon: ShoppingBag, color: 'text-emerald-400' },
          { label: 'Sold Out', value: stats.sold_out, icon: Ban, color: 'text-red-400' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-amber-400' },
          { label: 'Waitlist', value: stats.waitlist, icon: Users, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent User Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-foreground">Recent Customer Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest acquisitions by platform users</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:underline uppercase tracking-wider"
            >
              View All ({stats.orders}) <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No customer orders placed yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {ord.order_number}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {ord.shipping_address?.full_name || ord.user_email || 'Collector'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {ord.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {formatPrice(ord.total_amount, true)}
                    </p>
                    <span className="inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-background border border-border text-muted-foreground mt-0.5">
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions & breakdowns */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-sm p-6">
            <h2 className="font-semibold text-foreground mb-4">Management Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/orders"
                id="admin-manage-orders"
                className="flex items-center gap-3 px-4 py-3 border border-border hover:border-foreground/30 rounded-sm text-sm text-foreground transition-colors"
              >
                <ShoppingBag className="h-4 w-4 text-emerald-400" />
                Manage User Orders ({stats.orders})
              </Link>
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
                Manage Catalogue ({stats.total})
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
        </div>
      </div>
    </div>
  );
}
