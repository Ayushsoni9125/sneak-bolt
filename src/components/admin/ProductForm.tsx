'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { Product, Availability } from '@/types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: string }>;
  submitLabel: string;
}

const availabilities: { value: Availability; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'sold_out', label: 'Sold Out' },
  { value: 'upcoming', label: 'Upcoming' },
];

export function ProductForm({ product, onSubmit, submitLabel }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin/products');
      }
    });
  }

  const inputClass =
    'w-full bg-background border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:border-foreground/50 transition-colors rounded-sm';
  const labelClass = 'label-xs text-muted-foreground block mb-1.5 uppercase font-mono tracking-wider';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6 max-w-2xl">
      {error && (
        <div
          className="px-4 py-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm rounded-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="product-name" className={labelClass}>
            Product Name *
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            required
            defaultValue={product?.name}
            placeholder="Court One"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="product-slug" className={labelClass}>
            Slug *
          </label>
          <input
            id="product-slug"
            name="slug"
            type="text"
            required
            defaultValue={product?.slug}
            placeholder="court-one"
            className={inputClass}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            URL-safe identifier (lowercase, hyphens only)
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="product-description" className={labelClass}>
          Description *
        </label>
        <textarea
          id="product-description"
          name="description"
          required
          defaultValue={product?.description}
          rows={4}
          placeholder="Describe the silhouette, materials, and origin…"
          className={inputClass + ' resize-none'}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="product-price" className={labelClass}>
            Price (₹ / INR) *
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={product?.price}
            placeholder="28999.00"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="product-availability" className={labelClass}>
            Availability *
          </label>
          <select
            id="product-availability"
            name="availability"
            required
            defaultValue={product?.availability ?? 'upcoming'}
            className={inputClass}
          >
            {availabilities.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="product-image" className={labelClass}>
          Image URL *
        </label>
        <input
          id="product-image"
          name="image_url"
          type="url"
          required
          defaultValue={product?.image_url}
          placeholder="https://images.unsplash.com/…"
          className={inputClass}
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Use a publicly accessible image URL (e.g. Unsplash or `/images/...`)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
        <button
          type="submit"
          id="product-form-submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 sm:px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-sm shadow-xs cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            <span>{submitLabel}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 text-xs sm:text-sm text-muted-foreground border border-border hover:border-foreground/40 hover:text-foreground transition-colors rounded-sm text-center cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
