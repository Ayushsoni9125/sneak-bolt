import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 p-8 sm:p-12 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 mx-auto flex items-center justify-center">
          <Package className="h-5 w-5" />
        </div>
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400">
          ACQUISITION LEDGER EMPTY
        </p>
        <h3 className="text-lg font-bold text-zinc-950 uppercase tracking-tight">
          No Orders Placed Yet
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-sans">
          Your collector ledger currently has no acquired silhouettes. Limited drop allocations and vault purchases will appear here with serialized NFC certificates.
        </p>
        <div className="pt-2">
          <Link
            href="/sneakers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-xs font-mono tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors"
          >
            <span>EXPLORE VAULT [12]</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
          ACQUISITION LEDGER // ORDER HISTORY
        </span>
        <span className="text-xs font-mono font-bold text-zinc-950">
          [{orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}]
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={order.id || order.order_number}
              className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-6 transition-all hover:border-zinc-300"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-950 tracking-wider">
                      {order.order_number}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono uppercase tracking-wider font-semibold">
                      <CheckCircle2 className="h-3 w-3" />
                      {order.status === 'confirmed' ? 'CONFIRMED // PREPARING DISPATCH' : order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400">
                    ACQUISITION DATE: {orderDate}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[11px] font-mono text-zinc-400 block uppercase">TOTAL AMOUNT</span>
                  <span className="text-sm font-bold text-zinc-950 font-mono">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="divide-y divide-zinc-100">
                {order.items.map((item) => (
                  <div
                    key={`${order.order_number}-${item.id || item.product_id}-${item.size}`}
                    className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Thumbnail */}
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center p-1">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>

                      {/* Product Metadata */}
                      <div>
                        <Link
                          href={`/sneakers/${item.slug}`}
                          className="text-xs sm:text-sm font-bold text-zinc-950 hover:underline tracking-tight uppercase"
                        >
                          {item.name}
                        </Link>
                        <div className="text-[11px] font-mono text-zinc-500 mt-1 flex flex-wrap gap-x-4">
                          <span>SIZE: EU {item.size}</span>
                          <span>QTY: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-xs font-mono font-medium text-zinc-950">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-zinc-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  AUTHENTICATED & SERIALIZED • INCLUDES NFC CRYPTO TAG
                </span>
                <span className="text-zinc-400">DISPATCH VIA DHL EXPRESS</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
