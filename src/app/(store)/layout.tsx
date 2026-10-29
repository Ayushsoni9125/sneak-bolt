import { SiteLayout } from '@/components/layout/SiteLayout';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
