import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="text-center">
        <p className="editorial-heading text-border/20 leading-none select-none mb-8">
          404
        </p>
        <h1 className="section-heading text-foreground text-3xl mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-foreground text-background px-8 py-4 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors rounded-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
