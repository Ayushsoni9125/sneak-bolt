import { cn } from '@/lib/utils';
import type { Availability } from '@/types';

const labels: Record<Availability, string> = {
  available: 'Available',
  sold_out: 'Sold Out',
  upcoming: 'Upcoming',
};

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: Availability;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border transition-all select-none',
        `availability-${availability}`,
        availability === 'available' &&
          'bg-white/95 text-emerald-800 border-zinc-200 shadow-2xs',
        availability === 'upcoming' &&
          'bg-white/95 text-zinc-900 border-zinc-200 shadow-2xs',
        availability === 'sold_out' &&
          'bg-zinc-100 text-zinc-400 border-zinc-200 line-through',
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full shrink-0',
          availability === 'available' && 'bg-emerald-600',
          availability === 'upcoming' && 'bg-amber-500',
          availability === 'sold_out' && 'bg-zinc-300'
        )}
      />
      {labels[availability]}
    </span>
  );
}
