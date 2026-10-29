import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserProfile } from '@/features/auth/actions';
import { logout } from '@/features/auth/actions';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { LogOut } from 'lucide-react';

export const metadata: Metadata = { title: 'My Account' };

export default async function AccountPage() {
  const profile = await getUserProfile();
  if (!profile) redirect('/login?redirectTo=/account');

  return (
    <SiteLayout>
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-10 py-16">
          <p className="label-xs text-accent mb-3">Your Space</p>
          <h1 className="section-heading text-foreground text-4xl mb-10">Account</h1>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-sm p-6">
              <p className="label-xs text-muted-foreground mb-4">Profile</p>
              <dl className="space-y-3">
                {profile.full_name && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="text-foreground font-medium">{profile.full_name}</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="text-foreground font-medium capitalize">{profile.role}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Member Since</dt>
                  <dd className="text-foreground font-medium">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </dd>
                </div>
              </dl>
            </div>

            {profile.role === 'admin' && (
              <div className="bg-card border border-accent/30 rounded-sm p-6">
                <p className="label-xs text-accent mb-3">Administrator</p>
                <p className="text-sm text-muted-foreground mb-4">
                  You have admin access to manage products and view the waitlist.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-sm font-semibold uppercase tracking-widest hover:bg-accent transition-colors rounded-sm"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

            <form>
              <button
                formAction={logout}
                id="account-logout-btn"
                className="w-full flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 py-3 text-sm transition-colors rounded-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
