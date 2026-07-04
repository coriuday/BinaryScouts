'use client';

import React, { useState } from 'react';

function screenshotUrl(siteUrl: string) {
  const params = new URLSearchParams({
    url: siteUrl,
    screenshot: 'true',
    meta: 'false',
    embed: 'screenshot.url',
  });
  return `https://api.microlink.io/?${params.toString()}`;
}

function initialsFromTitle(title: string) {
  return title.slice(0, 2).toUpperCase();
}

interface SitePreviewProps {
  url?: string;
  title: string;
  accent?: string;
  gradient?: string;
  /** Compact height for toast; default fills card panel */
  compact?: boolean;
  className?: string;
}

/**
 * Vercel-style site thumbnail via Microlink screenshot.
 * Falls back to initials if capture fails or url is missing.
 */
export default function SitePreview({
  url,
  title,
  accent = '#00d4ff',
  gradient = 'linear-gradient(135deg, #00D4FF, #6366f1)',
  compact = false,
  className = '',
}: SitePreviewProps) {
  const [failed, setFailed] = useState(!url);
  const [loaded, setLoaded] = useState(false);

  const showFallback = failed || !url;

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: compact ? 140 : 180,
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0a0f',
        borderRadius: compact ? 12 : 0,
        overflow: 'hidden',
        border: compact ? '0.5px solid rgba(255,255,255,0.08)' : undefined,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: compact ? '8px 10px' : '10px 12px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(0,0,0,0.35)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            color: 'rgba(255,255,255,0.35)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {url?.replace(/^https?:\/\//, '') || title}
        </div>
      </div>

      {/* Viewport */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          minHeight: compact ? 100 : 140,
          background: 'rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
      >
        {!showFallback && (
          <>
            {!loaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 50% 30%, ${accent}18, transparent 65%)`,
                }}
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl(url!)}
              alt={`Preview of ${title}`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                display: 'block',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.35s ease',
              }}
            />
          </>
        )}

        {showFallback && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `radial-gradient(circle at 50% 40%, ${accent}22, transparent 70%)`,
            }}
          >
            <div
              style={{
                width: compact ? 56 : 72,
                height: compact ? 56 : 72,
                borderRadius: 18,
                background: gradient,
                boxShadow: `0 0 32px ${accent}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: compact ? 18 : 22,
                color: '#fff',
              }}
            >
              {initialsFromTitle(title)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
