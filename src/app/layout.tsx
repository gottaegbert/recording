/* eslint-disable no-undef */
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AnimationProvider } from '@/components/providers/animation-provider';
import LenisProvider from '@/components/providers/lenis-provider';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`,
  ),
  title: 'whothree-pace',
  description: 'record my step',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
    title: 'whothree-pace',
    description: 'record my step',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'whothree-pace',
    description: 'record my step',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LenisProvider>
            <AnimationProvider>{children}</AnimationProvider>
          </LenisProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
