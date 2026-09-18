import type { Metadata } from 'next';
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/hooks/ThemeProvider';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { getSiteUrl } from '@/lib/site';

const siteUrl = getSiteUrl();

/** Display headings — Space Grotesk (kept as --font-syne for component compatibility) */
const spaceGrotesk = Space_Grotesk({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

/** Body / UI — Manrope (kept as --font-inter for component compatibility) */
const manrope = Manrope({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    default: 'BinaryScouts — Production Software & AI Engineering',
    template: '%s — BinaryScouts',
  },
  description:
    'BinaryScouts is a lean technology startup that designs and ships production software — AI systems, SaaS products, automation, and digital infrastructure.',
  keywords: [
    'BinaryScouts',
    'Software Engineering',
    'SaaS Development',
    'AI Systems',
    'Business Automation',
    'Custom Software',
    'Next.js',
    'Technology Startup',
  ],
  authors: [{ name: 'BinaryScouts' }],
  // Per-route canonicals live on each page — do not set a site-wide "/" here.
  openGraph: {
    title: 'BinaryScouts — Production Software & AI Engineering',
    description:
      'A lean technology startup building production software, AI systems, SaaS products, and business automation.',
    url: siteUrl,
    siteName: 'BinaryScouts',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BinaryScouts — Production Software & AI Engineering',
    description:
      'A lean technology startup building production software, AI systems, SaaS products, and business automation.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'BinaryScouts',
  url: siteUrl,
  description:
    'A lean technology startup building production software, AI systems, SaaS products, and business automation.',
  email: 'thebinaryscouts@gmail.com',
  areaServed: 'Worldwide',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      {/* Dark theme — always. No light mode. */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-theme','dark');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <ThemeProvider>
        <LayoutWrapper bodyClass={manrope.className}>{children}</LayoutWrapper>
      </ThemeProvider>
    </html>
  );
}
