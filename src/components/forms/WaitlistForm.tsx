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
      <div className="flex items-start gap-3 p-4 border border-zinc-200 bg-white">
        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-950 font-bold">
            REGISTRATION CONFIRMED
          </p>
          <p className="text-xs text-zinc-600 mt-0.5 font-sans">
            {result.success ?? result.error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate id={`waitlist-form-${productId}`}>
      <input type="hidden" {...register('product_id')} value={productId} />

      {!compact && (
        <p className="text-xs text-zinc-600 mb-4 leading-relaxed font-sans">
          Register to secure priority access to <strong className="text-zinc-950 font-medium">{productName}</strong>. You will receive a direct access link 15 minutes before public release.
        </p>
      )}

      <div className={compact ? 'flex gap-2' : 'flex flex-col sm:flex-row gap-2'}>
        <div className="flex-1">
          <label htmlFor={`waitlist-email-${productId}`} className="sr-only">
            Email address
          </label>
          <input
            id={`waitlist-email-${productId}`}
            type="email"
            placeholder="Enter email address..."
            autoComplete="email"
            aria-describedby={errors.email ? `waitlist-email-error-${productId}` : undefined}
            {...register('email')}
            className="w-full bg-white border border-zinc-300 text-zinc-950 placeholder:text-zinc-400 text-xs font-mono px-4 py-3.5 focus:outline-none focus:border-zinc-950 focus:ring-0 transition-colors"
          />
          {errors.email && (
            <p
              id={`waitlist-email-error-${productId}`}
              role="alert"
              className="mt-1 text-[11px] font-mono text-red-600"
            >
              {errors.email.message}
            </p>
          )}
          {result?.error && (
            <p role="alert" className="mt-1 text-[11px] font-mono text-red-600">
              {result.error}
            </p>
          )}
        </div>

        <button
          type="submit"
          id={`waitlist-submit-${productId}`}
          disabled={isPending}
          className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 disabled:bg-zinc-400 text-white text-xs font-mono uppercase tracking-[0.2em] transition-colors shrink-0 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>TRANSMITTING</span>
            </>
          ) : (
            <span>NOTIFY ME</span>
          )}
        </button>
      </div>
    </form>
  );
}
