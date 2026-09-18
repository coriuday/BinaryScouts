import Image from 'next/image';

type LogoVariant = 'icon' | 'full' | 'wordmark';

interface LogoProps {
  variant?: LogoVariant;
  /** Pixel size for icon (square), height for full/wordmark */
  size?: number;
  className?: string;
  priority?: boolean;
  /** Hide from assistive tech when a sibling already names the brand */
  decorative?: boolean;
  /**
   * Bypass Next image recompression for maximum fidelity (preloader).
   * Default false — PNG sources still optimize cleanly for navbar/footer.
   */
  crisp?: boolean;
}

/**
 * BinaryScouts brand mark.
 * - icon: dedicated square monogram PNG (navbar, preloader, admin)
 * - full: complete lockup PNG
 * - wordmark: metallic "BINARY SCOUTS" PNG lockup
 *
 * Masters are true PNG. Misnamed JPEG `/logo.png` and `/wordmark.png`
 * remain for compatibility but are not used by this component.
 */
export default function Logo({
  variant = 'icon',
  size,
  priority = false,
  decorative = false,
  crisp = false,
  className = '',
}: LogoProps) {
  if (variant === 'icon') {
    const s = size ?? 36;
    return (
      <span
        className={`relative inline-block overflow-hidden shrink-0 ${className}`}
        style={{ width: s, height: s, borderRadius: Math.max(8, Math.round(s * 0.28)) }}
        aria-hidden={decorative || undefined}
      >
        <Image
          src="/logo-icon.png"
          alt={decorative ? '' : 'BinaryScouts'}
          width={768}
          height={768}
          priority={priority}
          unoptimized={crisp}
          quality={100}
          sizes={`${Math.ceil(s * 3)}px`}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </span>
    );
  }

  if (variant === 'wordmark') {
    const h = size ?? 22;
    // Master aspect 977×110
    const w = Math.round(h * (977 / 110));
    return (
      <span
        className={`relative inline-block shrink-0 ${className}`}
        style={{ height: h, width: w, maxWidth: '100%' }}
        aria-hidden={decorative || undefined}
      >
        <Image
          src="/wordmark-hq.png"
          alt={decorative ? '' : 'BinaryScouts'}
          width={977}
          height={110}
          priority={priority}
          unoptimized={crisp}
          quality={100}
          sizes={`${Math.ceil(w * 3)}px`}
          className="h-full w-full object-contain object-left"
        />
      </span>
    );
  }

  const h = size ?? 64;
  const w = Math.round(h * (1024 / 886));

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ height: h, width: w }}
      aria-hidden={decorative || undefined}
    >
      <Image
        src="/logo-full.png"
        alt={decorative ? '' : 'BinaryScouts'}
        width={1024}
        height={886}
        priority={priority}
        unoptimized={crisp}
        quality={100}
        sizes={`${Math.ceil(w * 3)}px`}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
