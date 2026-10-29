import { redirect } from 'next/navigation';
import { getUserProfile } from '@/features/auth/actions';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();

  if (!profile) redirect('/login?redirectTo=/admin');
  if (profile.role !== 'admin') redirect('/unauthorized');

  return (
    <AdminShell
      profile={{
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name,
      }}
    >
      {children}
    </AdminShell>
  );
}
