'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { joinWaitlist } from '@/features/waitlist/actions';
import { waitlistSchema, type WaitlistFormData } from '@/lib/validations';

interface WaitlistFormProps {
  productId: string;
  productName: string;
  compact?: boolean;
}

export function WaitlistForm({ productId, productName, compact = false }: WaitlistFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    success?: string;
    error?: string;
    alreadyRegistered?: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: '', product_id: productId },
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.append('email', data.email);
      fd.append('product_id', data.product_id);
      const res = await joinWaitlist(fd);
      setResult(res);
      if (res.success) reset();
    });
  });

  if (result?.success || result?.alreadyRegistered) {
    return (
      <div className="flex items-start gap-3 p-4 border border-emerald-300 bg-emerald-50 rounded-2xl shadow-xs">
        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-900">Registration Confirmed</p>
          <p className="text-xs text-emerald-700 mt-0.5">{result.success ?? result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate id={`waitlist-form-${productId}`}>
      <input type="hidden" {...register('product_id')} value={productId} />

      {!compact && (
        <p className="text-sm text-zinc-600 mb-4 leading-relaxed">
          Be first to access <strong className="text-zinc-950">{productName}</strong>. You will receive an exclusive release link 1 hour prior to general public drop.
        </p>
      )}

      <div className={compact ? 'flex gap-2' : 'flex flex-col sm:flex-row gap-3'}>
        <div className="flex-1">
          <label htmlFor={`waitlist-email-${productId}`} className="sr-only">
            Email address
          </label>
          <input
            id={`waitlist-email-${productId}`}
            type="email"
            placeholder="Enter your VIP email address..."
            autoComplete="email"
            aria-describedby={errors.email ? `waitlist-email-error-${productId}` : undefined}
            {...register('email')}
            className="w-full bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-sm px-4 py-3.5 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all rounded-xl shadow-2xs"
          />
          {errors.email && (
            <p
              id={`waitlist-email-error-${productId}`}
              className="text-xs text-red-600 font-semibold mt-1.5"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          id={`waitlist-submit-${productId}`}
          className="inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-amber-600 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-xl shrink-0 shadow-sm hover:shadow-md"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying…</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Join Drop Waitlist</span>
            </>
          )}
        </button>
      </div>

      {result?.error && !result.alreadyRegistered && (
        <p className="text-xs text-red-600 font-semibold mt-2" role="alert">
          {result.error}
        </p>
      )}
    </form>
  );
}
