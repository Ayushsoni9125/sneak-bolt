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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Real-time platform ledger and operational intelligence across all vault drops.
        </p>
      </div>

      {/* Top metrics grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">Total Revenue</p>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            {formatPrice(stats.revenue)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">Gross platform merchandise value</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">User Orders</p>
            <ShoppingBag className="h-4 w-4 text-foreground" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground font-mono">{stats.orders}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Acquisitions by collectors</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">Catalogue Size</p>
            <Package className="h-4 w-4 text-foreground" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground font-mono">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground mt-1">{stats.available} currently available</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="label-xs text-muted-foreground">Waitlist Requests</p>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono">{stats.waitlist}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Submissions for upcoming drops</p>
        </div>
      </div>

      {/* Secondary stats row: 2 on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Available', value: stats.available, icon: ShoppingBag, color: 'text-emerald-600' },
          { label: 'Sold Out', value: stats.sold_out, icon: Ban, color: 'text-red-500' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-amber-500' },
          { label: 'Waitlist', value: stats.waitlist, icon: Users, color: 'text-blue-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-sm p-3.5 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
              <p className={`text-lg sm:text-xl font-bold font-mono ${color}`}>{value}</p>
            </div>
            <Icon className={`h-4 w-4 shrink-0 ${color}`} />
          </div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent User Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-foreground text-sm sm:text-base">Recent Customer Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest acquisitions by platform users</p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:underline uppercase tracking-wider"
            >
              <span>View All ({stats.orders})</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No customer orders placed yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {ord.order_number}
                      </span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {ord.shipping_address?.full_name || ord.user_email || 'Collector'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {ord.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:text-right gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <p className="font-mono text-sm font-semibold text-foreground">
                      {formatPrice(ord.total_amount, true)}
                    </p>
                    <span className="inline-block text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm bg-sidebar border border-border text-muted-foreground">
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
          <div className="bg-card border border-border rounded-sm p-4 sm:p-6">
            <h2 className="font-semibold text-foreground text-sm sm:text-base mb-4">Management Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/orders"
                id="admin-manage-orders"
                className="flex items-center gap-3 px-3.5 py-3 border border-border hover:border-foreground/40 hover:bg-sidebar rounded-sm text-xs sm:text-sm text-foreground transition-all duration-150"
              >
                <ShoppingBag className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="truncate">Manage User Orders ({stats.orders})</span>
              </Link>
              <Link
                href="/admin/products/new"
                id="admin-new-product"
                className="flex items-center gap-3 px-3.5 py-3 border border-border hover:border-foreground/40 hover:bg-sidebar rounded-sm text-xs sm:text-sm text-foreground transition-all duration-150"
              >
                <Plus className="h-4 w-4 text-foreground shrink-0" />
                <span className="truncate">Add New Product</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-3.5 py-3 border border-border hover:border-foreground/40 hover:bg-sidebar rounded-sm text-xs sm:text-sm text-foreground transition-all duration-150"
              >
                <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">Manage Catalogue ({stats.total})</span>
              </Link>
              <Link
                href="/admin/waitlist"
                className="flex items-center gap-3 px-3.5 py-3 border border-border hover:border-foreground/40 hover:bg-sidebar rounded-sm text-xs sm:text-sm text-foreground transition-all duration-150"
              >
                <Users className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="truncate">View Waitlist ({stats.waitlist})</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
