import type { Metadata } from 'next';
import { Mail, Clock, Package } from 'lucide-react';
import { getWaitlistEntries } from '@/features/waitlist/actions';

export const metadata: Metadata = { title: 'Waitlist — Admin' };

export default async function AdminWaitlistPage() {
  const { data: entries, error } = await getWaitlistEntries();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Waitlist Inquiries</h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          {error ? 'Error loading entries' : `${entries?.length ?? 0} registered collector notifications`}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      {!error && entries?.length === 0 && (
        <div className="bg-card border border-border rounded-sm p-8 sm:p-12 text-center">
          <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-foreground font-medium text-sm sm:text-base">No waitlist submissions yet</p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Requests from buyers on upcoming or sold-out drops will appear here.
          </p>
        </div>
      )}

      {!error && entries && entries.length > 0 && (
        <div className="space-y-4">
          {/* Mobile Cards (< md) */}
          <div className="md:hidden space-y-3">
            {entries.map((entry) => {
              const productItem = Array.isArray(entry.product) ? entry.product[0] : entry.product;
              const productName =
                productItem && typeof productItem === 'object' && 'name' in productItem
                  ? String(productItem.name)
                  : 'Platform General Drop';

              return (
                <div
                  key={entry.id}
                  className="bg-card border border-border rounded-sm p-4 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-xs sm:text-sm font-semibold text-foreground truncate">
                      {entry.email}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm bg-sidebar border border-border text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <Package className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{productName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (md+) */}
          <div className="hidden md:block bg-card border border-border rounded-sm overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Waitlist entries table">
                <thead>
                  <tr className="border-b border-border bg-sidebar/50">
                    {['Email', 'Product Requested', 'Submission Timestamp'].map((h) => (
                      <th
                        key={h}
                        className="label-xs text-muted-foreground px-4 py-3 text-left font-medium"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.map((entry) => {
                    const productItem = Array.isArray(entry.product) ? entry.product[0] : entry.product;
                    const productName =
                      productItem && typeof productItem === 'object' && 'name' in productItem
                        ? String(productItem.name)
                        : '—';

                    return (
                      <tr key={entry.id} className="hover:bg-sidebar/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-medium text-foreground">{entry.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{productName}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs tabular-nums">
                          {new Date(entry.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
