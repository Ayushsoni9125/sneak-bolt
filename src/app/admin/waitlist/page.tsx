import type { Metadata } from 'next';
import { getWaitlistEntries } from '@/features/waitlist/actions';

export const metadata: Metadata = { title: 'Waitlist — Admin' };

export default async function AdminWaitlistPage() {
  const { data: entries, error } = await getWaitlistEntries();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Waitlist</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {error ? 'Error loading entries' : `${entries?.length ?? 0} submissions`}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-sm">
          {error}
        </div>
      )}

      {!error && entries?.length === 0 && (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <p className="text-muted-foreground">No waitlist submissions yet.</p>
        </div>
      )}

      {!error && entries && entries.length > 0 && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Waitlist entries table">
              <thead>
                <tr className="border-b border-border">
                  {['Email', 'Product', 'Submitted'].map((h) => (
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
                    <tr key={entry.id} className="hover:bg-background/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{entry.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{productName}</td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
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
      )}
    </div>
  );
}
