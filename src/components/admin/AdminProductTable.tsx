'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, Loader2, ChevronDown } from 'lucide-react';
import { deleteProduct, updateAvailability } from '@/features/products/actions';
import { AvailabilityBadge } from '@/components/products/AvailabilityBadge';
import { formatPrice } from '@/lib/utils';
import type { Product, Availability } from '@/types';

interface AdminProductTableProps {
  products: Product[];
}

export function AdminProductTable({ products }: AdminProductTableProps) {
  const [pending, startTransition] = useTransition();
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  function handleDelete(id: string) {
    setActionId(id);
    startTransition(async () => {
      const result = await deleteProduct(id);
      setActionId(null);
      setDeleteConfirmId(null);
      if (result.error) setMessage({ type: 'error', text: result.error });
      else setMessage({ type: 'success', text: result.success! });
    });
  }

  function handleAvailability(id: string, availability: Availability) {
    setActionId(id);
    startTransition(async () => {
      const result = await updateAvailability(id, availability);
      setActionId(null);
      if (result.error) setMessage({ type: 'error', text: result.error });
      else setMessage({ type: 'success', text: result.success! });
    });
  }

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center">
        <p className="text-muted-foreground text-sm">No products in catalogue yet.</p>
        <Link href="/admin/products/new" className="label-xs text-foreground font-semibold hover:underline mt-3 inline-block">
          Add your first product →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`px-4 py-3 rounded-sm text-xs sm:text-sm border flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}
          role="alert"
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-3 opacity-60 hover:opacity-100 font-bold">
            ×
          </button>
        </div>
      )}

      {/* ── Mobile Card Layout (< md) ─────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-card border border-border rounded-sm p-4 space-y-3 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="relative h-14 w-14 rounded-sm overflow-hidden bg-white shrink-0 border border-border/50">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">/{product.slug}</p>
                <p className="font-mono text-sm font-bold text-foreground mt-1">
                  {formatPrice(product.price, true)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border/60 gap-2">
              <div className="relative inline-block">
                <select
                  value={product.availability}
                  onChange={(e) =>
                    handleAvailability(product.id, e.target.value as Availability)
                  }
                  disabled={pending && actionId === product.id}
                  aria-label={`Change availability for ${product.name}`}
                  className="appearance-none bg-transparent border-0 pr-6 text-xs font-semibold uppercase tracking-widest cursor-pointer focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="upcoming">Upcoming</option>
                </select>
                <AvailabilityBadge
                  availability={product.availability}
                  className="pointer-events-none absolute inset-0"
                />
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                {pending && actionId === product.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      aria-label={`Edit ${product.name}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground bg-sidebar border border-border rounded-sm transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>
                    {deleteConfirmId === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs text-destructive border border-destructive/30 px-2 py-1 rounded-sm hover:bg-destructive/10 transition-colors"
                          aria-label={`Confirm delete ${product.name}`}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-sm hover:bg-sidebar transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        aria-label={`Delete ${product.name}`}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm transition-colors border border-border"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop Table Layout (md+) ───────────────────────────────── */}
      <div className="hidden md:block bg-card border border-border rounded-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Products table">
            <thead>
              <tr className="border-b border-border bg-sidebar/50">
                {['Product', 'Price', 'Availability', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="label-xs text-muted-foreground px-4 py-3 text-left font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-sidebar/40 transition-colors">
                  {/* Product */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-sm overflow-hidden bg-white shrink-0 border border-border/50">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain p-0.5"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">/{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4 text-foreground font-mono font-medium whitespace-nowrap">
                    {formatPrice(product.price, true)}
                  </td>

                  {/* Availability */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="relative inline-block">
                      <select
                        value={product.availability}
                        onChange={(e) =>
                          handleAvailability(product.id, e.target.value as Availability)
                        }
                        disabled={pending && actionId === product.id}
                        aria-label={`Change availability for ${product.name}`}
                        className="appearance-none bg-transparent border-0 pr-6 text-xs font-semibold uppercase tracking-widest cursor-pointer focus:outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="sold_out">Sold Out</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                      <AvailabilityBadge
                        availability={product.availability}
                        className="pointer-events-none absolute inset-0"
                      />
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {pending && actionId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            aria-label={`Edit ${product.name}`}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-border rounded-sm transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          {deleteConfirmId === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-xs text-destructive border border-destructive/30 px-2 py-1 rounded-sm hover:bg-destructive/10 transition-colors"
                                aria-label={`Confirm delete ${product.name}`}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-sm hover:bg-border transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(product.id)}
                              aria-label={`Delete ${product.name}`}
                              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
