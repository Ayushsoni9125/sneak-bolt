'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

import { createOrder } from '@/features/orders/actions';
import type { Order } from '@/types';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalCount, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsCheckingOut(false);
    setOrderComplete(false);
    setConfirmedOrder(null);
    closeCart();
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const res = await createOrder({
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
          price: i.price,
          image_url: i.image_url,
          size: i.size,
          quantity: i.quantity,
        })),
        total_amount: subtotal,
      });

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        setOrderComplete(true);
        clearCart();
      }
    } catch {
      // fallback
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        id="cart-drawer-panel"
        aria-label="Shopping Bag"
        className="relative z-10 w-full max-w-md bg-white border-l border-zinc-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              VAULT SELECTION
            </span>
            <span className="text-sm font-bold text-zinc-950">
              [{totalCount}]
            </span>
          </div>

          <button
            onClick={handleClose}
            id="close-cart-btn"
            className="p-2 text-zinc-400 hover:text-zinc-950 transition-colors rounded-none hover:bg-zinc-100"
            aria-label="Close bag"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Complimentary Shipping Banner */}
        <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-200/80 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-900" />
            COMPLIMENTARY EXPRESS DISPATCH
          </span>
          <span className="text-zinc-900 font-bold">INCLUDED</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderComplete ? (
            <div className="py-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-[11px] font-mono tracking-[0.2em] text-emerald-700 uppercase font-bold">
                ORDER CONFIRMED
              </p>
              {confirmedOrder && (
                <div className="p-3 bg-zinc-50 border border-zinc-200 text-xs font-mono">
                  <span className="text-zinc-500">REFERENCE: </span>
                  <span className="font-bold text-zinc-950">{confirmedOrder.order_number}</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-zinc-950 tracking-tight">
                Vault Allocation Reserved
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Your order receipt and serial certificate have been queued. Authenticity dispatch occurs within 24 hours via DHL Express.
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  href="/account"
                  onClick={handleClose}
                  className="w-full py-3 bg-zinc-950 text-white text-xs font-mono tracking-[0.18em] uppercase hover:bg-zinc-800 transition-colors text-center"
                >
                  VIEW IN ORDER HISTORY →
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 border border-zinc-200 text-zinc-700 text-xs font-mono tracking-[0.18em] uppercase hover:border-zinc-950 hover:text-zinc-950 transition-colors"
                >
                  CONTINUE BROWSING
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                BAG IS EMPTY
              </p>
              <p className="text-sm text-zinc-600 max-w-xs mx-auto">
                No archival silhouettes currently allocated in your session.
              </p>
              <Link
                href="/sneakers"
                onClick={handleClose}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-zinc-950 text-white text-xs font-mono tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors"
              >
                <span>EXPLORE VAULT [12]</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="py-4 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-contain object-center"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        href={`/sneakers/${item.slug}`}
                        onClick={handleClose}
                        className="text-xs font-bold text-zinc-950 hover:underline tracking-tight truncate block"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs font-mono font-bold text-zinc-950 shrink-0">
                        {formatPrice(item.price * item.quantity, true)}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                      SIZE: {item.size}
                    </p>

                    {item.colorway && (
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {item.colorway}
                      </p>
                    )}

                    {/* Quantity & Remove controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                      <div className="flex items-center border border-zinc-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="p-1 hover:bg-zinc-100 text-zinc-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="text-[10px] font-mono tracking-wider text-zinc-400 hover:text-red-600 uppercase transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && !orderComplete && (
          <div className="p-6 border-t border-zinc-200 bg-white space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-500 font-mono">
                <span>SUBTOTAL</span>
                <span className="text-zinc-950 font-bold">{formatPrice(subtotal, true)} INR</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-mono text-[11px]">
                <span>EXPRESS DISPATCH</span>
                <span className="text-emerald-700 font-bold uppercase">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-mono text-[10px]">
                <span>DUTIES & TAXES</span>
                <span>INCLUDED IN PRICE</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              id="proceed-checkout-btn"
              className="w-full flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white py-4 text-xs font-mono uppercase tracking-[0.25em] transition-all duration-200"
            >
              {isCheckingOut ? (
                <span>AUTHORIZING ALLOCATION...</span>
              ) : (
                <>
                  <span>PROCEED TO CHECKOUT • {formatPrice(subtotal)}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                onClick={handleClose}
                className="text-[10px] font-mono tracking-widest text-zinc-400 hover:text-zinc-950 uppercase transition-colors"
              >
                CONTINUE BROWSING
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
