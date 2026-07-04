import type { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/projects';
import { getSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/planner`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const workRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...workRoutes];
}
