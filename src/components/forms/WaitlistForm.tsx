'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Loader2 } from 'lucide-react';
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
      <div className="flex items-start gap-3 p-4 border border-emerald-800/40 bg-emerald-950/40 rounded-sm">
        <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
        <p className="text-sm text-emerald-300">{result.success ?? result.error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate id={`waitlist-form-${productId}`}>
      <input type="hidden" {...register('product_id')} value={productId} />

      {!compact && (
        <p className="text-sm text-muted-foreground mb-4">
          Be the first to know when <strong className="text-foreground">{productName}</strong> becomes available.
        </p>
      )}

      <div className={compact ? 'flex gap-2' : 'flex flex-col gap-3'}>
        <div className="flex-1">
          <label htmlFor={`waitlist-email-${productId}`} className="sr-only">
            Email address
          </label>
          <input
            id={`waitlist-email-${productId}`}
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            aria-describedby={errors.email ? `waitlist-email-error-${productId}` : undefined}
            {...register('email')}
            className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm px-4 py-3 focus:outline-none focus:border-foreground/50 transition-colors rounded-sm"
          />
          {errors.email && (
            <p
              id={`waitlist-email-error-${productId}`}
              className="text-xs text-destructive mt-1.5"
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
          className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-sm shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining…
            </>
          ) : (
            'Join Waitlist'
          )}
        </button>
      </div>

      {result?.error && !result.alreadyRegistered && (
        <p className="text-xs text-destructive mt-2" role="alert">
          {result.error}
        </p>
      )}
    </form>
  );
}
