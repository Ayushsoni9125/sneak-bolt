import type { Metadata } from 'next';
import { ShoppingBag, TrendingUp, Truck, CheckCircle2 } from 'lucide-react';
import { getAdminOrders } from '@/features/orders/actions';
import { AdminOrderTable } from '@/components/admin/AdminOrderTable';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'User Orders — Admin' };

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);
  const activeOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing_dispatch').length;
  const inTransitOrders = orders.filter((o) => o.status === 'in_transit').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Customer Orders</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Real-time ledger of orders and acquisitions placed by collectors across the platform.
          </p>
        </div>
      </div>

      {/* Stats summary: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="label-xs text-muted-foreground">Total Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">{orders.length} total orders recorded</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="label-xs text-muted-foreground">To Process</span>
            <ShoppingBag className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono">{activeOrders}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Confirmed & preparing</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="label-xs text-muted-foreground">In Transit</span>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 font-mono">{inTransitOrders}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Dispatched to collectors</p>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="label-xs text-muted-foreground">Delivered</span>
            <CheckCircle2 className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-foreground font-mono">{deliveredOrders}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Successfully fulfilled</p>
        </div>
      </div>

      {/* Orders Table & Detail View */}
      <AdminOrderTable orders={orders} />
    </div>
  );
}
