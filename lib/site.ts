/** Canonical public site URL (SEO, sitemap, Open Graph). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://binary-scouts.vercel.app';
  return url.replace(/\/$/, '');
}
