'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, Package, MapPin, Calendar, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { updateOrderStatus } from '@/features/orders/actions';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

interface AdminOrderTableProps {
  orders: Order[];
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  confirmed: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
  },
  preparing_dispatch: {
    label: 'Preparing Dispatch',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    dotClass: 'bg-amber-500',
  },
  in_transit: {
    label: 'In Transit',
    badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    dotClass: 'bg-blue-500',
  },
  delivered: {
    label: 'Delivered',
    badgeClass: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/30',
    dotClass: 'bg-zinc-500',
  },
};

export function AdminOrderTable({ orders: initialOrders }: AdminOrderTableProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user_email && order.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.shipping_address?.full_name &&
        order.shipping_address.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      setUpdatingId(null);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o))
        );
        setFeedback({ message: `Order ${orderId} status updated to ${STATUS_CONFIG[newStatus].label}.`, type: 'success' });
        setTimeout(() => setFeedback(null), 3500);
      } else {
        setFeedback({ message: res.error || 'Failed to update order status', type: 'error' });
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {feedback && (
        <div
          className={`px-4 py-3 rounded-sm text-xs sm:text-sm border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-60 hover:opacity-100 ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Controls: Full width responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order #, email, or customer…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground rounded-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { value: 'all', label: 'All' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'preparing_dispatch', label: 'Preparing' },
            { value: 'in_transit', label: 'In Transit' },
            { value: 'delivered', label: 'Delivered' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-sm transition-all shrink-0 cursor-pointer ${
                statusFilter === pill.value
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-sidebar'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-foreground font-medium text-sm sm:text-base">No user orders found</p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'Orders placed by collectors will automatically appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusMeta = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
            const isRowUpdating = isPending && (updatingId === order.id || updatingId === order.order_number);

            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-sm p-4 sm:p-6 hover:border-foreground/30 transition-all duration-150 shadow-xs"
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-border">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-sm sm:text-base font-bold text-foreground">
                        {order.order_number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm border ${statusMeta.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="text-foreground font-semibold truncate max-w-[150px] sm:max-w-none">
                        {order.shipping_address?.full_name || 'Collector'}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[150px] sm:max-w-none">
                        {order.user_email || 'Collector'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 tabular-nums whitespace-nowrap">
                        <Calendar className="h-3 w-3 shrink-0" />
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 tabular-nums whitespace-nowrap">
                        <Clock className="h-3 w-3 shrink-0" />
                        {new Date(order.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Order Total & Status Manager */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-border/60">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        Total Amount
                      </p>
                      <p className="text-base sm:text-lg font-bold text-foreground font-mono">
                        {formatPrice(order.total_amount, true)}
                      </p>
                    </div>

                    <div className="relative shrink-0">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={isRowUpdating}
                        className="appearance-none bg-sidebar border border-border hover:border-foreground/40 pl-3 pr-8 py-2 text-xs font-mono uppercase tracking-wider rounded-sm text-foreground focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing_dispatch">Preparing Dispatch</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isRowUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items & Shipping row */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Items list */}
                  <div className="md:col-span-2 space-y-2.5">
                    <p className="label-xs text-muted-foreground uppercase tracking-widest">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${order.order_number}-${item.product_id}-${idx}`}
                          className="flex items-center justify-between gap-3 p-2.5 bg-sidebar/50 border border-border rounded-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative h-12 w-12 rounded-sm overflow-hidden bg-white shrink-0 border border-border/40">
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/sneakers/${item.slug}`}
                                target="_blank"
                                className="text-xs sm:text-sm font-medium text-foreground hover:underline transition-colors truncate block"
                              >
                                {item.name}
                              </Link>
                              <p className="text-[11px] text-muted-foreground font-mono truncate mt-0.5">
                                Size: {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap shrink-0">
                            {formatPrice(item.price * item.quantity, true)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-border md:pl-6 pt-3 md:pt-0">
                    <p className="label-xs text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> Shipping Destination
                    </p>
                    <div className="text-xs sm:text-sm text-foreground space-y-0.5 bg-sidebar/30 p-2.5 rounded-sm border border-border/50">
                      <p className="font-medium text-foreground">{order.shipping_address?.full_name || 'Collector'}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.shipping_address?.city || 'Mumbai'}, {order.shipping_address?.country || 'India'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
