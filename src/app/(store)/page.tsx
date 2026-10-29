import type { Metadata } from 'next';
import { HeroSection } from '@/components/store/HeroSection';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { CampaignBanner } from '@/components/store/CampaignBanner';
import { UpcomingDrops } from '@/components/store/UpcomingDrops';
import { WaitlistCTA } from '@/components/store/WaitlistCTA';
import { getProducts } from '@/features/products/actions';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'SneakerDrop — Built to Stand Out',
  description:
    'Discover premium sneaker drops. Every release is a statement — limited editions, sold-out icons, and upcoming releases.',
};

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch {
    // Gracefully handle DB errors — show empty states in components
    products = [];
  }

  return (
    <>
      <HeroSection />
      <FeaturedProducts products={products} />
      <CampaignBanner />
      <UpcomingDrops products={products} />
      <WaitlistCTA products={products} />
    </>
  );
}
