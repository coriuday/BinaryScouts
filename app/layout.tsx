import type { Metadata } from 'next';
import { Syne, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/hooks/ThemeProvider';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BinaryScouts — AI-Native Digital Engineering Studio',
    template: '%s — BinaryScouts',
  },
  description:
    'BinaryScouts designs, builds, and automates intelligent digital systems for modern businesses. Full-stack engineering, CRM automation, AI integration, and growth infrastructure.',
  keywords: [
    'AI Engineering',
    'SaaS Development',
    'CRM Automation',
    'Digital Studio',
    'Next.js Agency',
    'Business Automation',
    'AI Integration',
    'Web Platform Development',
    'Growth Engineering',
  ],
  authors: [{ name: 'BinaryScouts Studio' }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'BinaryScouts — AI-Native Digital Engineering Studio',
    description:
      'We design, build, and automate intelligent digital systems for modern businesses.',
    url: siteUrl,
    siteName: 'BinaryScouts',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 1200,
        alt: 'BinaryScouts — AI-Native Digital Engineering Studio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BinaryScouts — AI-Native Digital Engineering Studio',
    description:
      'We design, build, and automate intelligent digital systems for modern businesses.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      {/* Dark theme — always. No light mode. */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-theme','dark');`,
          }}
        />
      </head>
      <ThemeProvider>
        <LayoutWrapper bodyClass={inter.className}>{children}</LayoutWrapper>
      </ThemeProvider>
    </html>
  );
}
