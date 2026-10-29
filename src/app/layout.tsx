import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SneakerDrop — Built to Stand Out',
    template: '%s | SneakerDrop',
  },
  description:
    'SneakerDrop is a premium sneaker brand where each drop is a statement. Discover limited editions, upcoming releases, and join the waitlist.',
  keywords: ['sneakers', 'limited edition', 'streetwear', 'premium footwear', 'sneaker drops'],
  openGraph: {
    title: 'SneakerDrop — Built to Stand Out',
    description: 'Premium sneaker drops. Every release, a statement.',
    type: 'website',
  },
};

import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white text-zinc-950 min-h-screen selection:bg-zinc-950 selection:text-white">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
