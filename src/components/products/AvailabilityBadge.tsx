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
        'inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-2xs transition-all',
        `availability-${availability}`,
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          availability === 'available' && 'bg-emerald-500 animate-pulse',
          availability === 'sold_out' && 'bg-zinc-400',
          availability === 'upcoming' && 'bg-amber-500'
        )}
      />
      {labels[availability]}
    </span>
  );
}
