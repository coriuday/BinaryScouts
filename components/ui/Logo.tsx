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
}

/**
 * BinaryScouts brand mark.
 * - icon: square crop focused on the BS monogram (navbar, admin)
 * - full: complete lockup with monogram, binary accents, and wordmark
 * - wordmark: metallic "BINARY SCOUTS" text lockup
 */
export default function Logo({
  variant = 'icon',
  size,
  className = '',
  priority = false,
  decorative = false,
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
          src="/logo.png"
          alt={decorative ? '' : 'BinaryScouts'}
          width={s * 2}
          height={s * 2}
          priority={priority}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 32%' }}
        />
      </span>
    );
  }

  if (variant === 'wordmark') {
    const h = size ?? 22;
    // Wide lockup — aspect roughly 6.5:1 for "BINARY SCOUTS"
    const w = Math.round(h * 6.5);
    return (
      <span
        className={`relative inline-block shrink-0 ${className}`}
        style={{ height: h, width: w, maxWidth: '100%' }}
        aria-hidden={decorative || undefined}
      >
        <Image
          src="/wordmark.png"
          alt={decorative ? '' : 'BinaryScouts'}
          width={w * 2}
          height={h * 2}
          priority={priority}
          className="h-full w-full object-contain object-left"
        />
      </span>
    );
  }

  const h = size ?? 64;
  const w = Math.round(h * 1.15);

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ height: h, width: w }}
      aria-hidden={decorative || undefined}
    >
      <Image
        src="/logo.png"
        alt={decorative ? '' : 'BinaryScouts'}
        width={w * 2}
        height={h * 2}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
