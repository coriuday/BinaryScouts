'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#050505', color: '#fff' }}
    >
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#00d4ff' }}>
        Something went wrong
      </p>
      <h1 className="font-sans font-medium text-3xl md:text-4xl mb-4">Unexpected error</h1>
      <p className="font-sans text-sm mb-8 max-w-md" style={{ color: '#888' }}>
        We hit a snag loading this page. You can try again or head back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="btn-primary px-6 py-3 text-sm"
        >
          Try again
        </button>
        <Link href="/" className="btn-secondary px-6 py-3 text-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}
