import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-sd-ink">
      {/* Background sneaker image — large editorial */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=90"
          alt="Hero sneaker"
          fill
          className="object-cover object-center scale-105"
          priority
          sizes="100vw"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-6 lg:px-10 pb-24 pt-32">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="label-sm text-accent mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            New Collection — 2025
          </p>

          {/* Editorial headline */}
          <h1
            className="editorial-heading text-foreground mb-8 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            BUILT
            <br />
            <span className="italic font-light">TO</span>
            <br />
            STAND OUT.
          </h1>

          {/* Sub-copy */}
          <p
            className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-10 animate-fade-up"
            style={{ animationDelay: '0.35s' }}
          >
            Footwear engineered for those who treat every sidewalk like a runway.
            Limited drops. Unlimited statement.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            <Link
              href="/sneakers"
              id="hero-shop-cta"
              className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors duration-300"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/upcoming"
              id="hero-upcoming-cta"
              className="inline-flex items-center gap-3 border border-foreground/30 text-foreground px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:border-foreground transition-colors duration-300"
            >
              Upcoming Drops
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-2 animate-fade-in"
          style={{ animationDelay: '0.8s' }}
          aria-hidden="true"
        >
          <div className="h-10 w-px bg-foreground/20" />
          <p className="label-xs text-muted-foreground [writing-mode:vertical-rl] rotate-180">
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}
