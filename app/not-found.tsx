import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#050505', color: '#fff' }}
    >
      <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: '#00d4ff' }}>
        404
      </p>
      <h1 className="font-sans font-medium text-3xl md:text-4xl mb-4">Page not found</h1>
      <p className="font-sans text-sm mb-8 max-w-md" style={{ color: '#888' }}>
        That route doesn&apos;t exist. Check the URL or return to the homepage.
      </p>
      <Link href="/" className="btn-primary px-6 py-3 text-sm">
        Back to home
      </Link>
    </div>
  );
}
