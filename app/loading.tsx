export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#050505' }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(0,212,255,0.3)', borderTopColor: '#00d4ff' }}
      />
    </div>
  );
}
