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
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  preparing_dispatch: {
    label: 'Preparing Dispatch',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  in_transit: {
    label: 'In Transit',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
  },
  delivered: {
    label: 'Delivered',
    badgeClass: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
    dotClass: 'bg-zinc-400',
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
        setFeedback({ message: `Order ${orderId} updated to ${STATUS_CONFIG[newStatus].label}.`, type: 'success' });
        setTimeout(() => setFeedback(null), 3500);
      } else {
        setFeedback({ message: res.error || 'Failed to update order status', type: 'error' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          className={`px-4 py-3 rounded-sm text-sm border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-60 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order #, email, or customer name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2 text-sm text-foreground rounded-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { value: 'all', label: 'All Orders' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'preparing_dispatch', label: 'Preparing' },
            { value: 'in_transit', label: 'In Transit' },
            { value: 'delivered', label: 'Delivered' },
          ].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all shrink-0 ${
                statusFilter === pill.value
                  ? 'bg-foreground text-background font-semibold'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-foreground font-medium">No user orders found</p>
          <p className="text-muted-foreground text-sm mt-1">
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
                className="bg-card border border-border rounded-sm p-6 hover:border-foreground/20 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold text-foreground">
                        {order.order_number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-sm border ${statusMeta.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass}`} />
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">
                        {order.shipping_address?.full_name || 'Collector'}
                      </span>
                      <span>•</span>
                      <span>{order.user_email || 'Guest Checkout'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 tabular-nums">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 tabular-nums">
                        <Clock className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Order Total & Status Manager */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        Total Amount
                      </p>
                      <p className="text-lg font-bold text-foreground font-mono">
                        {formatPrice(order.total_amount, true)}
                      </p>
                    </div>

                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={isRowUpdating}
                        className="appearance-none bg-background border border-border hover:border-foreground/30 pl-3 pr-8 py-2 text-xs font-mono uppercase tracking-wider rounded-sm text-foreground focus:outline-none cursor-pointer disabled:opacity-50"
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
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items */}
                  <div className="md:col-span-2 space-y-3">
                    <p className="label-xs text-muted-foreground uppercase">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${order.order_number}-${item.product_id}-${idx}`}
                          className="flex items-center justify-between p-2.5 bg-background/50 border border-border rounded-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-sm overflow-hidden bg-white shrink-0">
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/sneakers/${item.slug}`}
                                target="_blank"
                                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-muted-foreground font-mono">
                                Size: {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-sm font-semibold text-foreground">
                            {formatPrice(item.price * item.quantity, true)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-border md:pl-6 pt-4 md:pt-0">
                    <p className="label-xs text-muted-foreground uppercase flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Shipping Destination
                    </p>
                    <div className="text-sm text-foreground space-y-0.5">
                      <p className="font-medium">{order.shipping_address?.full_name || 'Collector'}</p>
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
