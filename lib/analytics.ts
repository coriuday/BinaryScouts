/**
 * Lightweight event tracking for business insights.
 * No-ops until a real analytics provider is configured.
 * Never send PII (names, emails, message bodies).
 */

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: AnalyticsPayload }) => void;
  }
}

export function trackEvent(name: string, props?: AnalyticsPayload): void {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, props ?? {});
      return;
    }
    if (typeof window.plausible === 'function') {
      window.plausible(name, props ? { props } : undefined);
    }
  } catch {
    // Analytics must never break UX
  }
}
