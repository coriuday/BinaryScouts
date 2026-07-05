/** Canonical public site URL (SEO, sitemap, Open Graph). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://binaryscouts.onrender.com';
  return url.replace(/\/$/, '');
}
