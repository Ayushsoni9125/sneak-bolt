import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/features/auth/actions';
import { logout } from '@/features/auth/actions';
import { LayoutDashboard, Package, Users, LogOut, Store } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();

  if (!profile) redirect('/login?redirectTo=/admin');
  if (profile.role !== 'admin') redirect('/unauthorized');

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border flex flex-col bg-sidebar">
        <div className="px-6 py-6 border-b border-border">
          <p className="label-sm text-foreground">SNEAKERDROP</p>
          <p className="label-xs text-muted-foreground mt-0.5">Admin Console</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Admin navigation">
          {[
            { href: '/admin', label: 'Overview', icon: LayoutDashboard },
            { href: '/admin/products', label: 'Products', icon: Package },
            { href: '/admin/waitlist', label: 'Waitlist', icon: Users },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-sm transition-colors group"
            >
              <Icon className="h-4 w-4 shrink-0 group-hover:text-accent transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-sm transition-colors"
          >
            <Store className="h-4 w-4" />
            View Store
          </Link>
          <form>
            <button
              formAction={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-destructive rounded-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-8">
          <div />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              {profile.full_name || 'Admin'} · Admin
            </span>
          </div>
        </header>
        <main className="flex-1 px-8 py-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
