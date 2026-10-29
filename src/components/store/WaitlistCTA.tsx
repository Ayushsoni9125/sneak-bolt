import { WaitlistForm } from '@/components/forms/WaitlistForm';
import type { Product } from '@/types';

interface WaitlistCTAProps {
  products: Product[];
}

export function WaitlistCTA({ products }: WaitlistCTAProps) {
  // Pick an upcoming or sold-out product for the homepage CTA
  const target =
    products.find((p) => p.availability === 'upcoming') ??
    products.find((p) => p.availability === 'sold_out') ??
    products[0];

  if (!target) return null;

  return (
    <section className="py-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="label-xs text-accent mb-4">Don&apos;t Miss Out</p>
            <h2 className="section-heading text-foreground mb-6">
              Join The
              <br />
              Waitlist.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Some shoes sell out in minutes. Get early access and exclusive
              updates on upcoming drops before they go public.
            </p>
          </div>
          <div>
            <p className="label-xs text-muted-foreground mb-6">
              Register for <span className="text-foreground">{target.name}</span>
            </p>
            <WaitlistForm productId={target.id} productName={target.name} />
          </div>
        </div>
      </div>
    </section>
  );
}
