import Image from 'next/image';

export function CampaignBanner() {
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Marquee strip */}
        <div className="overflow-hidden border-t border-b border-border py-4 mb-16">
          <div className="flex animate-marquee whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="mx-8 label-xs text-muted-foreground/50">
                SNEAKERDROP · BUILT TO STAND OUT · LIMITED DROPS ·
              </span>
            ))}
          </div>
        </div>

        {/* Asymmetric editorial layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 min-h-[600px]">
          {/* Large left image */}
          <div className="relative lg:col-span-3 aspect-[3/4] lg:aspect-auto overflow-hidden rounded-sm">
            <Image
              src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&q=85"
              alt="Campaign — Obsidian Low"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="label-xs text-muted-foreground mb-2">Campaign Drop</p>
              <p className="section-heading text-foreground text-3xl">THE OBSIDIAN</p>
              <p className="text-sm text-muted-foreground mt-1">
                Dark materials. Precise construction.
              </p>
            </div>
          </div>

          {/* Right column — two stacked images */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative flex-1 min-h-[280px] overflow-hidden rounded-sm">
              <Image
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=85"
                alt="Velocity campaign shot"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-6 left-6">
                <p className="label-xs text-accent mb-1">Coming Soon</p>
                <p className="font-bold uppercase tracking-wide text-foreground text-lg">Velocity</p>
              </div>
            </div>
            <div className="relative flex-1 min-h-[280px] overflow-hidden rounded-sm bg-card flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=85"
                alt="Meridian Runner campaign"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6">
                <p className="label-xs text-amber-400 mb-1">Reissue</p>
                <p className="font-bold uppercase tracking-wide text-foreground text-lg">Meridian Runner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
