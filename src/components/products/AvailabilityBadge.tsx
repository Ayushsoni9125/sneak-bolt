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
        'label-xs px-2.5 py-1 rounded-sm',
        `availability-${availability}`,
        className
      )}
    >
      {labels[availability]}
    </span>
  );
}
