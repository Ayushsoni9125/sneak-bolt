import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserProfile, logout } from '@/features/auth/actions';
import { getUserOrders } from '@/features/orders/actions';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { OrderHistory } from '@/components/account/OrderHistory';
import { LogOut, ShieldCheck, User } from 'lucide-react';

export const metadata: Metadata = { title: 'My Account — SneakerDrop Archive' };

export default async function AccountPage() {
  const profile = await getUserProfile();
  if (!profile) redirect('/login?redirectTo=/account');

  const orders = await getUserOrders();

  const formattedDate =
    profile.created_at && !isNaN(new Date(profile.created_at).getTime())
      ? new Date(profile.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

  return (
    <SiteLayout>
      <div className="min-h-screen pt-28 pb-20 bg-[#fafafa]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="border-b border-zinc-200 pb-8 mb-10">
            <p className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase mb-2">
              COLLECTOR LEDGER // VERIFIED PROFILE
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight">
              COLLECTOR SPACE
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Sidebar: Collector Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block">
                      COLLECTOR TIER
                    </span>
                    <span className="text-sm font-bold text-zinc-950 capitalize">
                      {profile.role === 'admin' ? 'Curator Admin' : 'Vault Collector'}
                    </span>
                  </div>
                </div>

                <dl className="space-y-4 text-xs font-mono">
                  {profile.full_name && (
                    <div className="flex justify-between items-baseline border-b border-zinc-50 pb-2">
                      <dt className="text-zinc-400 uppercase">NAME</dt>
                      <dd className="font-bold text-zinc-950">{profile.full_name}</dd>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex justify-between items-baseline border-b border-zinc-50 pb-2">
                      <dt className="text-zinc-400 uppercase">EMAIL</dt>
                      <dd className="font-medium text-zinc-800 truncate max-w-[180px] text-right">
                        {profile.email}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline border-b border-zinc-50 pb-2">
                    <dt className="text-zinc-400 uppercase">MEMBER SINCE</dt>
                    <dd className="font-medium text-zinc-800">{formattedDate}</dd>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <dt className="text-zinc-400 uppercase">ACQUISITIONS</dt>
                    <dd className="font-bold text-zinc-950">{orders.length} Silhouettes</dd>
                  </div>
                </dl>
              </div>

              {/* Admin Console Shortcut */}
              {profile.role === 'admin' && (
                <div className="bg-amber-50/50 border border-amber-200/80 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-mono font-bold tracking-wider uppercase">
                    <ShieldCheck className="h-4 w-4" />
                    <span>ADMINISTRATOR CONSOLE</span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed font-sans">
                    You have verified administrative authority to add silhouettes, edit inventory, and inspect drop waitlists.
                  </p>
                  <Link
                    href="/admin"
                    className="inline-block w-full text-center py-2.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-mono tracking-widest uppercase transition-colors"
                  >
                    ACCESS DASHBOARD →
                  </Link>
                </div>
              )}

              {/* Sign Out Action */}
              <form>
                <button
                  formAction={logout}
                  id="account-logout-btn"
                  className="w-full flex items-center justify-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 py-3 text-xs font-mono tracking-widest uppercase transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>SIGN OUT OF VAULT</span>
                </button>
              </form>
            </div>

            {/* Right Main Area: Acquisition Ledger / Order History */}
            <div className="lg:col-span-8">
              <OrderHistory orders={orders} />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
