import Link from 'next/link';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShieldX className="h-12 w-12 text-muted-foreground mx-auto mb-6" />
          <h1 className="section-heading text-foreground text-3xl mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You don&apos;t have permission to view this page. This area is restricted to administrators.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="bg-foreground text-background px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors rounded-sm"
            >
              Go Home
            </Link>
            <Link
              href="/login"
              className="border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 px-6 py-3 text-sm transition-colors rounded-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
