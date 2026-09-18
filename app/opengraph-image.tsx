import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BinaryScouts — AI-Native Digital Engineering Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(145deg, #05070f 0%, #0b1020 55%, #111827 100%)',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#818cf8',
          }}
        >
          BinaryScouts
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            AI-native digital engineering studio
          </div>
          <div style={{ fontSize: 28, color: '#94a3b8', lineHeight: 1.4 }}>
            We design, build, and automate intelligent systems for modern businesses.
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#64748b' }}>binary-scouts.vercel.app</div>
      </div>
    ),
    { ...size }
  );
}
