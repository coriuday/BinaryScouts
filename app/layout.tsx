import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/hooks/ThemeProvider';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BinaryScouts — AI-Native Digital Engineering Studio',
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
  openGraph: {
    title: 'BinaryScouts — AI-Native Digital Engineering Studio',
    description:
      'We design, build, and automate intelligent digital systems for modern businesses.',
    url: 'https://binaryscouts.com',
    siteName: 'BinaryScouts',
    images: [
      {
        url: 'https://binaryscouts.com/og-image.png',
        width: 1200,
        height: 630,
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
    images: ['https://binaryscouts.com/og-image.png'],
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
      className={`${jakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      {/*
       * FOUC Prevention: This blocking script runs synchronously before
       * the browser paints anything. It reads the saved theme from
       * localStorage and applies data-theme to <html> immediately,
       * eliminating the flash of unstyled content on dark-mode page loads.
       *
       * Must be render-blocking (no defer/async) and placed before body.
       */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var saved = localStorage.getItem('bs_theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = (saved === 'dark' || saved === 'light') ? saved : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
            `,
          }}
        />
      </head>
      <ThemeProvider>
        <LayoutWrapper bodyClass={jakarta.className}>{children}</LayoutWrapper>
      </ThemeProvider>
    </html>
  );
}
