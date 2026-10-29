import { Suspense } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { getUserProfile } from '@/features/auth/actions';

async function AuthNavbar() {
  const profile = await getUserProfile();
  const isLoggedIn = !!profile;
  const isAdmin = profile?.role === 'admin';
  return <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />;
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<Navbar isLoggedIn={false} isAdmin={false} />}>
        <AuthNavbar />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </>
  );
}
